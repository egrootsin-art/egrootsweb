const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authenticate = require("../middleware/auth");

// ✅ GET REVIEWS
router.get("/:id/reviews", async (req, res) => {
  try {
    console.log(`📊 Fetching reviews for product: ${req.params.id}`);

    const reviews = await Review.find({ productId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      productId: review.productId,
      user: review.user,  // frontend expects 'user'
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString('en-IN'),
      verified: review.verified || false
    }));

    console.log(`✅ Found ${reviews.length} reviews`);
    res.json({ reviews: formattedReviews });
  } catch (err) {
    console.error("❌ Fetch reviews error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST REVIEW – name from registered user
router.post("/:id/reviews", authenticate, async (req, res) => {
  try {
    console.log(`📝 POST /${req.params.id}/reviews`);
    console.log("Body:", req.body);

    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required" });
    }

    const review = new Review({
      productId: req.params.id,
      user: req.user.username || "Anonymous User",   // name from DB
      username: req.user.username || "Anonymous User",
      rating: Number(rating),
      comment: comment?.trim()
    });

    await review.save();

    const reviewObj = {
      _id: review._id,
      productId: review.productId,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString("en-IN"),
      verified: review.verified
    };

    console.log(`✅ Review saved! ID: ${review._id}`);
    res.status(201).json({ review: reviewObj });
  } catch (err) {
    console.error("❌ POST review error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE REVIEW COMMENT/RATING
router.put("/reviews/:reviewId", authenticate, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // If later you store userId on review, check ownership here

    if (typeof comment === "string") {
      review.comment = comment.trim();
    }
    if (rating) {
      review.rating = Number(rating);
    }

    await review.save();

    const reviewObj = {
      _id: review._id,
      productId: review.productId,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.createdAt).toLocaleDateString("en-IN"),
      verified: review.verified || false
    };

    res.json({ review: reviewObj });
  } catch (err) {
    console.error("❌ Update review error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
