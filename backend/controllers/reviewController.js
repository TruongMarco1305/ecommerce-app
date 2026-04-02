import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Add or update a review (one per user per product)
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;

    if (!productId || !rating || !comment) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Fetch user name
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Check product exists
    const product = await productModel.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    // Upsert: one review per user per product
    await reviewModel.findOneAndUpdate(
      { productId, userId },
      { productId, userId, userName: user.name, rating: Number(rating), comment },
      { upsert: true, new: true }
    );

    // Recalculate average rating on product
    const stats = await reviewModel.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await productModel.findByIdAndUpdate(productId, {
        averageRating: parseFloat(stats[0].avg.toFixed(1)),
        reviewCount: stats[0].count,
      });
    }

    res.json({ success: true, message: "Review submitted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel
      .find({ productId })
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete a review (user can only delete their own)
const deleteReview = async (req, res) => {
  try {
    const { reviewId, userId } = req.body;

    const review = await reviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: "Review not found" });
    if (review.userId.toString() !== userId)
      return res.json({ success: false, message: "Not authorized" });

    const productId = review.productId;
    await reviewModel.findByIdAndDelete(reviewId);

    // Recalculate
    const stats = await reviewModel.aggregate([
      { $match: { productId } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    await productModel.findByIdAndUpdate(productId, {
      averageRating: stats.length > 0 ? parseFloat(stats[0].avg.toFixed(1)) : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0,
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addReview, getProductReviews, deleteReview };
