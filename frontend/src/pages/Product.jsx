import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { toast } from "react-toastify";

// ── Star display helper ───────────────────────────────────────────────────────
const StarRating = ({ rating, size = "w-4", interactive = false, onSelect }) => {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? hovered || rating : rating;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => interactive && onSelect(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${size} ${interactive ? "cursor-pointer" : ""} ${
            star <= display ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      if (res.data.success) setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Please login to leave a review");
    if (reviewRating === 0) return toast.error("Please select a star rating");
    if (!reviewComment.trim()) return toast.error("Please write a comment");

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, rating: reviewRating, comment: reviewComment },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review submitted!");
        setReviewRating(0);
        setReviewComment("");
        fetchReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setSubmitting(false);
  };

  const deleteReview = async (reviewId) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/review/delete`,
        { reviewId },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Review deleted");
        fetchReviews();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ------------- Product Data ------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ------------- Product Images ------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/* ------------ Product Info ------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          {/* Live star rating from reviews */}
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={Math.round(productData.averageRating || 0)} />
            <p className="text-gray-500 text-sm">
              {productData.averageRating > 0
                ? `${productData.averageRating} (${productData.reviewCount} review${productData.reviewCount !== 1 ? "s" : ""})`
                : "No reviews yet"}
            </p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy with 7 days.</p>
          </div>
        </div>
      </div>

      {/* ------------- Description & Review Section ------------- */}
      <div className="mt-20">
        <div className="flex">
          <button
            onClick={() => setActiveTab("description")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "description" ? "font-semibold bg-gray-50" : ""
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border px-5 py-3 text-sm ${
              activeTab === "reviews" ? "font-semibold bg-gray-50" : ""
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === "description" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.description}</p>
            <p>
              All our bamboo products are sustainably sourced and
              eco-friendly certified. Each piece is handcrafted to ensure
              quality and durability.
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="border px-6 py-6">
            {/* Review list */}
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400 mb-6">
                No reviews yet. Be the first to review this product!
              </p>
            ) : (
              <div className="flex flex-col gap-4 mb-8">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{r.userName}</p>
                        <StarRating rating={r.rating} size="w-3" />
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </p>
                        {token && (
                          <button
                            onClick={() => deleteReview(r._id)}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Write a review */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-sm mb-4">Write a Review</h3>
              {!token ? (
                <p className="text-sm text-gray-400">
                  Please{" "}
                  <a href="/login" className="text-black underline">
                    login
                  </a>{" "}
                  to write a review.
                </p>
              ) : (
                <form onSubmit={submitReview} className="flex flex-col gap-4 max-w-xl">
                  <div>
                    <p className="text-sm mb-1">Your Rating</p>
                    <StarRating
                      rating={reviewRating}
                      size="w-7"
                      interactive
                      onSelect={setReviewRating}
                    />
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="border px-4 py-2 text-sm outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-black text-white px-6 py-2 text-sm w-fit active:bg-gray-700 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ------------- display related products ------------- */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
