import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

// ── Star mini display for filter ─────────────────────────────────────────────
const StarFilter = ({ value, selected, onClick }) => {
  const isSelected = selected === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 text-sm px-3 py-1.5 border rounded transition-colors ${
        isSelected
          ? "border-bamboo-500 bg-bamboo-500 text-cream"
          : "border-bamboo-200 text-bamboo-700 hover:border-bamboo-400"
      }`}
    >
      <span className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={i < value ? (isSelected ? "text-cream" : "text-bamboo-500") : (isSelected ? "text-bamboo-200" : "text-bamboo-200")}
          >
            {i < value ? "★" : "☆"}
          </span>
        ))}
      </span>
    </button>
  );
};

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);

  // Derive price bounds from products
  const maxProductPrice = products.length
    ? Math.ceil(Math.max(...products.map((p) => p.price)))
    : 500;

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Price range filter
    productsCopy = productsCopy.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Min rating filter
    if (minRating > 0) {
      productsCopy = productsCopy.filter(
        (item) => (item.averageRating || 0) >= minRating
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      case "top-rated":
        setFilterProducts(
          fpCopy.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        );
        break;
      default:
        applyFilter();
        break;
    }
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([0, maxProductPrice]);
    setMinRating(0);
    setSortType("relavent");
  };

  useEffect(() => {
    setPriceRange([0, maxProductPrice]);
  }, [maxProductPrice]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange, minRating]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* ── Filter Panel ─────────────────────────────────────────── */}
      <div className="min-w-60">
        <div className="flex items-center justify-between my-2">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="text-xl flex items-center cursor-pointer gap-2"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
              src={assets.dropdown_icon}
              alt="dropdown_icon"
            />
          </p>
          <button
            onClick={clearFilters}
            className="text-xs text-gray-400 hover:text-black underline hidden sm:block"
          >
            Clear all
          </button>
        </div>

        {/* ── Category Filter ──────────────────────────────── */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {[
              "Kitchen & Dining",
              "Home Decor",
              "Furniture",
              "Personal Care",
              "Garden & Outdoor",
              "Stationery",
            ].map((cat) => (
              <p key={cat} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={toggleCategory}
                />
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* ── Sub-Category Filter ──────────────────────────── */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {[
              "Handcrafted",
              "Organic",
              "Eco-certified",
              "Premium",
            ].map((sub) => (
              <p key={sub} className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  value={sub}
                  checked={subCategory.includes(sub)}
                  onChange={toggleSubCategory}
                />
                {sub}
              </p>
            ))}
          </div>
        </div>

        {/* ── Price Range Filter ───────────────────────────── */}
        <div
          className={`border border-gray-300 pl-5 pr-4 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">PRICE RANGE</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxProductPrice}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], Number(e.target.value)])
              }
              className="w-full accent-black"
            />
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                min={0}
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="border text-xs px-2 py-1 w-20 outline-none"
                placeholder="Min"
              />
              <span className="text-gray-400 self-center">–</span>
              <input
                type="number"
                min={priceRange[0]}
                max={maxProductPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="border text-xs px-2 py-1 w-20 outline-none"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* ── Min Rating Filter ────────────────────────────── */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">MIN RATING</p>
          <div className="flex flex-col gap-2">
            {[4, 3, 2, 1].map((star) => (
              <StarFilter
                key={star}
                value={star}
                selected={minRating}
                onClick={(v) => setMinRating(minRating === v ? 0 : v)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side ───────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
            <option value="top-rated">Sort by: Top Rated</option>
          </select>
        </div>

        {/* Active filter chips */}
        {(category.length > 0 || subCategory.length > 0 || minRating > 0 ||
          priceRange[0] > 0 || priceRange[1] < maxProductPrice) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {category.map((c) => (
              <span
                key={c}
                className="bg-gray-100 text-xs px-3 py-1 rounded-full flex items-center gap-1"
              >
                {c}
                <button
                  onClick={() => setCategory((prev) => prev.filter((x) => x !== c))}
                  className="ml-1 text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </span>
            ))}
            {subCategory.map((s) => (
              <span
                key={s}
                className="bg-gray-100 text-xs px-3 py-1 rounded-full flex items-center gap-1"
              >
                {s}
                <button
                  onClick={() => setSubCategory((prev) => prev.filter((x) => x !== s))}
                  className="ml-1 text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </span>
            ))}
            {minRating > 0 && (
              <span className="bg-gray-100 text-xs px-3 py-1 rounded-full flex items-center gap-1">
                {"★".repeat(minRating)} & up
                <button
                  onClick={() => setMinRating(0)}
                  className="ml-1 text-gray-400 hover:text-black"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 mb-3">{filterProducts.length} products found</p>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
              rating={item.averageRating}
              reviewCount={item.reviewCount}
            />
          ))}
        </div>
        {filterProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No products match your filters.</p>
            <button onClick={clearFilters} className="mt-3 underline text-sm">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
