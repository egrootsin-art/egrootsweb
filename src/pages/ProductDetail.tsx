import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { featuredProducts } from "@/data/products";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Package,
  Truck,
  Shield,
  Plus,
  Minus,
  Check,
  Info,
  Eye,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [itemAdded, setItemAdded] = useState(false);

  // Find product by ID
  const product = featuredProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Check if product is already in cart
  const isInCart = items.some(item => item.id === product.id);

  // Handle Add to Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
    }
    setItemAdded(true);
    toast({
      title: "Added to Cart! 🛒",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-primary transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>

        {/* Product Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* ✅ Compact Product Image */}
          <div className="space-y-4">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Show "New" badge if isNew exists */}
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-600">
                  New
                </Badge>
              )}
              {/* Show "Featured" badge if isFeatured exists */}
              {product.isFeatured && (
                <Badge className="absolute top-4 left-20 bg-blue-600">
                  Featured
                </Badge>
              )}
              {/* Show discount badge if originalPrice exists */}
              {discountPercent > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-600">
                  -{discountPercent}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>

            {/* Product Name */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < product.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating}/5 Rating
                  {product.reviewCount && ` (${product.reviewCount} reviews)`}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-red-600">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <Badge className="bg-green-600">
                  <Check className="w-4 h-4 mr-1" />
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="font-semibold text-lg">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-20 h-10 flex items-center justify-center border rounded-md font-bold text-lg">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground ml-2">
                  Total: ₹{(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* ✅ Action Buttons - Add to Cart + View Cart */}
            <div className="space-y-3">
              {!itemAdded && !isInCart ? (
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    variant="outline"
                    className="w-full"
                    disabled={!product.inStock}
                  >
                    <Plus className="mr-2 w-5 h-5" />
                    Add More
                  </Button>
                  <Button
                    onClick={() => navigate("/cart")}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="mr-2 w-5 h-5" />
                    View Cart
                  </Button>
                </div>
              )}
            </div>

            {/* Product Features */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>{product.inStock ? 'In Stock - Ready to Ship' : 'Out of Stock'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Free Shipping on Orders Above ₹500</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span>1 Year Manufacturer Warranty</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="w-5 h-5 text-orange-600" />
                    <span>7 Days Return Policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Specifications */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6" />
                Specifications
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Product Code</span>
                  <span className="font-medium">{product.id.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium">1 Year</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Buy This */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Why Buy This?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    High-quality components and reliable performance
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Perfect for learning and educational projects
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Comprehensive documentation and tutorials included
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-sm">
                    Trusted by educators and innovators worldwide
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
