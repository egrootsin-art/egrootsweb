import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface Product {
  id: string;
  name: string;
  price?: number | null;
  originalPrice?: number;
  image: string;
  images?: string[];  // Multiple images for gallery
  category: string;
  rating?: number;       // now optional
  reviewCount?: number;  // now optional
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });

    toast({
      title: "Added to cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card
      className="group relative tech-hover gradient-card border-border/50 overflow-hidden cursor-pointer h-full flex flex-col"
      onClick={handleQuickView}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isNew && (
          <Badge className="bg-accent text-accent-foreground animate-pulse-neon">
            New
          </Badge>
        )}
        {product.isFeatured && (
          <Badge className="bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
        {discountPercent > 0 && (
          <Badge variant="destructive">-{discountPercent}%</Badge>
        )}
      </div>

      {/* Stock Status */}
      {!product.inStock && (
        <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            Coming Soon
          </Badge>
        </div>
      )}

      <CardHeader className="p-0 relative">
  {/* fixed height, image fully covered */}
  <div className="relative w-full h-64 bg-muted/20 overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />

    {/* Hover Overlay with Quick View */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <Button
        size="sm"
        variant="secondary"
        className="tech-hover"
        onClick={handleQuickView}
      >
        <Eye className="w-4 h-4 mr-2" />
        Quick View
      </Button>
    </div>
  </div>
</CardHeader>


      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>

        <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Rating removed from card */}

        {/* Price - Always at bottom of content */}
        <div className="flex items-center gap-2 mt-auto">
          {product.price != null ? (
            <span className="text-2xl font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          ) : (
            <span className="text-lg font-semibold text-muted-foreground">
              Contact for Price
            </span>
          )}
          {product.originalPrice && product.price != null && (
            <span className="text-lg text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
  {product.category === "Events" ? (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/events/register/${product.id}`);
      }}
      className="w-full tech-hover bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      Register for Event
    </Button>
  ) : product.category === "PCB Design Services" || product.price == null ? (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        navigate("/contact");
      }}
      className="w-full tech-hover bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      Contact Us
    </Button>
  ) : (
    <Button
      onClick={handleAddToCart}
      disabled={!product.inStock}
      className="w-full tech-hover bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      {product.inStock ? "Add to Cart" : "Coming Soon"}
    </Button>
  )}
</CardFooter>

    </Card>
    
  );
};

export default ProductCard;
