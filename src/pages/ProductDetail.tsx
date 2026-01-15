import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/api/axiosConfig";
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
  ChevronLeft,
  ChevronRight,
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
  
  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [mouseStart, setMouseStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

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

  // Get images array - use images if available, otherwise use single image
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

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
        const response = await axios.get(`/api/products/${id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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
        `/api/products/${id}/reviews`,
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

  // Image gallery handlers - move one image at a time
  const handlePreviousImage = () => {
    if (isSwiping || productImages.length <= 1) return;
    setIsSwiping(true);
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
    setTimeout(() => setIsSwiping(false), 300); // Prevent rapid swipes
  };

  const handleNextImage = () => {
    if (isSwiping || productImages.length <= 1) return;
    setIsSwiping(true);
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsSwiping(false), 300); // Prevent rapid swipes
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (productImages.length <= 1) return; // No swipe if only one image
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (productImages.length <= 1) return; // No swipe if only one image
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || productImages.length <= 1) {
      setTouchStart(0);
      setTouchEnd(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    // Only trigger if swipe distance is sufficient and not already swiping
    if (Math.abs(distance) > minSwipeDistance && !isSwiping) {
      if (distance > 0) {
        // Swipe left - next image (one at a time)
        handleNextImage();
      } else {
        // Swipe right - previous image (one at a time)
        handlePreviousImage();
      }
    }
    
    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse drag support for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (productImages.length <= 1) return; // No drag if only one image
    setIsDragging(true);
    setMouseStart(e.clientX);
    setTouchEnd(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || productImages.length <= 1) return;
    setTouchEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging || productImages.length <= 1) {
      setIsDragging(false);
      setMouseStart(0);
      setTouchEnd(0);
      return;
    }
    
    const distance = mouseStart - touchEnd;
    const minSwipeDistance = 50;

    // Only trigger if drag distance is sufficient and not already swiping
    if (Math.abs(distance) > minSwipeDistance && !isSwiping) {
      if (distance > 0) {
        // Drag left - next image (one at a time)
        handleNextImage();
      } else {
        // Drag right - previous image (one at a time)
        handlePreviousImage();
      }
    }
    
    setIsDragging(false);
    setMouseStart(0);
    setTouchEnd(0);
  };

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
          {/* Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Swipe Support - Works for all products */}
            <div 
              className={`relative w-full h-96 rounded-lg overflow-hidden bg-muted ${
                productImages.length > 1 
                  ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') 
                  : 'cursor-default'
              }`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                src={productImages[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Navigation Arrows - Only show if multiple images */}
              {productImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={handlePreviousImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
              
              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              )}
              
              {/* Badges */}
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
            
            {/* Thumbnail Gallery - Only show if multiple images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-primary ring-2 ring-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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
             {product.price != null ? (
  <span className="text-4xl font-bold text-primary">
    ₹{product.price.toLocaleString()}
  </span>
) : (
  <span className="text-xl font-semibold text-muted-foreground">
    Contact for Price
  </span>
)}

              {product.originalPrice != null && product.price != null && (
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
                <Badge variant="destructive">Coming Soon</Badge>
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
                {product.price != null && (
  <span className="text-sm text-muted-foreground ml-2">
    Total: ₹{(product.price * quantity).toLocaleString()}
  </span>
)}

              </div>
            </div>

            {/* Action Buttons */}
            {/* Action Buttons */}
<div className="space-y-3">
  {product.category === "PCB Design Services" || product.price == null ? (
  <Button
    size="lg"
    className="w-full"
    onClick={() => navigate("/contact")}
  >
    Contact Us
  </Button>
) : product.category === "Events" ? (
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
      {product.inStock ? "Add to Cart" : "Coming Soon"}
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
                        : "Coming Soon "}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Free Shipping on Orders Above ₹15000</span>
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
