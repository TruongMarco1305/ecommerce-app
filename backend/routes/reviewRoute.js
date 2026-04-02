import express from "express";
import { addReview, getProductReviews, deleteReview } from "../controllers/reviewController.js";
import auth from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", auth, addReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.post("/delete", auth, deleteReview);

export default reviewRouter;
