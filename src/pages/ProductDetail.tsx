import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
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
  Eye,
  User,
} from "lucide-react";

interface Review {
  id: string;
  _id?: string;
  productId: string;
  user: string;
  rating: number;
  comment?: string;
  date: string;
  verified: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [itemAdded, setItemAdded] = useState(false);

  // ✅ MONGODB REVIEWS STATES
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const product = featuredProducts.find((p: any) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const isInCart = items.some((item) => item.id === product.id);

  // ✅ HYBRID: MongoDB + LocalStorage Fallback
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setLoadingReviews(true);
        console.log(`📊 Fetching reviews for: ${id}`);

        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("✅ MongoDB Reviews loaded:", response.data.reviews);
        setReviews(response.data.reviews || []);

        localStorage.setItem(
          `reviews_${id}`,
          JSON.stringify(response.data.reviews || [])
        );
      } catch (error: any) {
        console.error("❌ MongoDB failed:", error.response?.status);

        const cachedReviews = localStorage.getItem(`reviews_${id}`);
        if (cachedReviews) {
          console.log("✅ Using cached reviews:", JSON.parse(cachedReviews));
          setReviews(JSON.parse(cachedReviews));
        } else {
          setReviews([]);
        }

        toast({
          title: "Reviews unavailable",
          description:
            error.response?.status === 404
              ? "No reviews endpoint yet, using local cache"
              : "Showing cached reviews",
        });
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id, toast]);

  // Rating handlers
  const handleRatingHover = (rating: number) => setHoverRating(rating);
  const handleRatingLeave = () => currentRating === 0 && setHoverRating(0);
  const handleRatingClick = (rating: number) => setCurrentRating(rating);

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
      description: `${quantity}x ${product.name} added`,
    });
  };

  // ✅ SAVE REVIEW TO MONGODB
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRating || !reviewText.trim()) {
      toast({
        title: "Please select rating and write a review",
        variant: "destructive",
      });
      return;
    }

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Please login to submit a review",
          variant: "destructive",
        });
        return;
      }

      const reviewData = {
        rating: currentRating,
        comment: reviewText,
      };

      console.log("📝 Submitting review:", reviewData);

      const response = await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newReview: Review = {
        id: response.data.review._id || Date.now().toString(),
        _id: response.data.review._id,
        productId: id!,
        user:
          response.data.review.username ||
          response.data.review.user ||
          "Anonymous",
        rating: currentRating,
        comment: reviewText,
        date:
          response.data.review.date ||
          new Date().toLocaleDateString("en-IN"),
        verified: false,
      };

      setReviews([newReview, ...reviews]);

      setReviewText("");
      setCurrentRating(0);

      toast({
        title: "Review Submitted! 🎉",
        description: "Thank you for your feedback!",
      });
    } catch (error: any) {
      console.error("❌ Review submission failed:", error);
      toast({
        title: "Failed to submit review",
        description:
          error.response?.data?.error || "Please login and try again",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
            10
        ) / 10
      : product.rating || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <Button onClick={() => navigate(-1)} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>

        {/* Product Details Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-600">
                  New
                </Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 left-20 bg-blue-600">
                  Featured
                </Badge>
              )}
              {discountPercent > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-600">
                  -{discountPercent}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* ✅ COMPLETE Product Info */}
          <div className="space-y-6">
            <Badge variant="outline">{product.category}</Badge>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < averageRating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating}/5 ({reviews.length} reviews)
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
                    Save ₹
                    {(product.originalPrice - product.price).toLocaleString()}
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

            {/* Action Buttons */}
            {/* Action Buttons */}
<div className="space-y-3">
  {product.category === "Events" ? (
    <Button
      size="lg"
      className="w-full"
      onClick={() => navigate(`/events/register/${product.id}`)}
    >
      Register for Event
    </Button>
  ) : !itemAdded && !isInCart ? (
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
                    <span>
                      {product.inStock
                        ? "In Stock - Ready to Ship"
                        : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Free Shipping on Orders Above ₹15000</span>
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

        {/* ✅ REVIEWS SECTION */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Write Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Write Review
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating *
                  </label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`p-2 rounded-lg transition-all ${
                            ratingValue <= (hoverRating || currentRating)
                              ? "bg-yellow-100 text-yellow-600 shadow-md"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => handleRatingClick(ratingValue)}
                          onMouseEnter={() => handleRatingHover(ratingValue)}
                          onMouseLeave={handleRatingLeave}
                        >
                          <Star className="w-6 h-6" />
                        </button>
                      );
                    })}
                  </div>
                  {currentRating > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected: {currentRating} star
                      {currentRating > 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Review *
                  </label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submittingReview || currentRating === 0}
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loadingReviews ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((review) => {
                    const reviewKey = review.id || review._id!;

                    return (
                      <div
                        key={reviewKey}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {review.user}
                              </h4>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{review.date}</span>
                          </div>
                        </div>

                        {review.comment && (
                          <p className="text-sm text-gray-700">
                            "{review.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
