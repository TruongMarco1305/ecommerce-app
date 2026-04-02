import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, rating = 0, reviewCount = 0 }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div>
      <Link className="text-bamboo-700 cursor-pointer group" to={`/product/${id}`}>
        <div className="overflow-hidden rounded-sm bg-bamboo-50">
          <img
            className="hover:scale-105 transition-transform duration-300 ease-in-out w-full object-cover"
            src={image[0]}
            alt={name}
          />
        </div>
        <p className="pt-3 pb-0.5 text-sm text-bamboo-700 group-hover:text-bamboo-500 transition-colors">{name}</p>
        <p className="text-sm font-semibold text-bamboo-500">
          {currency}{price}
        </p>
        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(rating) ? "text-bamboo-500" : "text-bamboo-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-bamboo-400">({reviewCount})</span>
          </div>
        )}
      </Link>
    </div>
  );
};

export default ProductItem;
