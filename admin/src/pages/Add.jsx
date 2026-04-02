import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

// ── Bamboo-specific data ─────────────────────────────────────────────────────
const BAMBOO_CATEGORIES = [
  "Kitchen & Dining",
  "Home Decor",
  "Furniture",
  "Personal Care",
  "Garden & Outdoor",
  "Stationery",
];

const BAMBOO_SUBCATEGORIES = {
  "Kitchen & Dining": ["Cutting Boards", "Utensils", "Bowls & Plates", "Chopsticks", "Straws & Cups"],
  "Home Decor":       ["Wall Art", "Vases", "Candle Holders", "Photo Frames", "Rugs & Mats"],
  "Furniture":        ["Chairs", "Tables", "Shelves", "Bed Frames", "Storage"],
  "Personal Care":    ["Toothbrushes", "Combs & Brushes", "Soap Dishes", "Bath Accessories"],
  "Garden & Outdoor": ["Plant Pots", "Garden Stakes", "Wind Chimes", "Outdoor Furniture"],
  "Stationery":       ["Pens & Pencils", "Notebooks", "Desk Organizers", "Bookmarks"],
};

const BAMBOO_DIMENSIONS = ["Small", "Medium", "Large", "Extra Large", "Custom"];

const BAMBOO_TYPES = ["Handcrafted", "Organic", "Eco-certified", "Premium"];

// ── Helper: toggle an item in an array ───────────────────────────────────────
const toggle = (arr, item) =>
  arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice]             = useState("");
  const [stock, setStock]             = useState("");
  const [weight, setWeight]           = useState("");
  const [category, setCategory]       = useState(BAMBOO_CATEGORIES[0]);
  const [subCategory, setSubCategory] = useState(BAMBOO_SUBCATEGORIES[BAMBOO_CATEGORIES[0]][0]);
  const [type, setType]               = useState(BAMBOO_TYPES[0]);
  const [bestseller, setBestseller]   = useState(false);
  const [ecoTag, setEcoTag]           = useState(false);
  const [sizes, setSizes]             = useState([]);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    setSubCategory(BAMBOO_SUBCATEGORIES[cat][0]);
  };

  const resetForm = () => {
    setName(""); setDescription(""); setPrice(""); setStock(""); setWeight("");
    setCategory(BAMBOO_CATEGORIES[0]);
    setSubCategory(BAMBOO_SUBCATEGORIES[BAMBOO_CATEGORIES[0]][0]);
    setType(BAMBOO_TYPES[0]);
    setBestseller(false); setEcoTag(false); setSizes([]);
    setImage1(false); setImage2(false); setImage3(false); setImage4(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name",        name);
      formData.append("description", description);
      formData.append("price",       price);
      formData.append("category",    category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller",  bestseller);
      formData.append("sizes",       JSON.stringify(sizes));
      formData.append("type",  type);
      formData.append("stock",   stock);
      formData.append("weight",  weight);
      formData.append("ecoTag",  ecoTag);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const inputCls = "w-full px-3 py-2 border border-bamboo-200 rounded-sm outline-none focus:border-bamboo-500 bg-white text-bamboo-700 text-sm";
  const labelCls = "block mb-1.5 text-sm font-semibold text-bamboo-700";

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold text-bamboo-700 mb-6">
        Add New Bamboo Product
      </h2>

      <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-6">

        <div>
          <p className={labelCls}>Product Images <span className="text-bamboo-400 font-normal">(up to 4)</span></p>
          <div className="flex gap-3">
            {[{id:"image1",state:image1,set:setImage1},
              {id:"image2",state:image2,set:setImage2},
              {id:"image3",state:image3,set:setImage3},
              {id:"image4",state:image4,set:setImage4}].map(({id,state,set}) => (
              <label
                key={id}
                htmlFor={id}
                className="w-20 h-20 border-2 border-dashed border-bamboo-300 rounded-sm cursor-pointer overflow-hidden flex items-center justify-center hover:border-bamboo-500 transition-colors bg-bamboo-50"
              >
                <img
                  className="w-full h-full object-cover"
                  src={!state ? assets.upload_area : URL.createObjectURL(state)}
                  alt="upload"
                />
                <input onChange={(e) => set(e.target.files[0])} type="file" id={id} hidden accept="image/*" />
              </label>
            ))}
          </div>
        </div>

        <div className="w-full max-w-xl">
          <label className={labelCls}>Product Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className={inputCls}
            type="text"
            placeholder="e.g. Handcrafted Bamboo Cutting Board"
            required
          />
        </div>

        <div className="w-full max-w-xl">
          <label className={labelCls}>Product Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className={inputCls + " resize-none"}
            rows={4}
            placeholder="Describe the bamboo product..."
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <label className={labelCls}>Category</label>
            <select onChange={handleCategoryChange} value={category} className={inputCls}>
              {BAMBOO_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className={labelCls}>Sub Category</label>
            <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className={inputCls}>
              {(BAMBOO_SUBCATEGORIES[category] || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="w-36">
            <label className={labelCls}>Price (USD)</label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className={inputCls}
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1">
            <label className={labelCls}>Type</label>
            <select onChange={(e) => setType(e.target.value)} value={type} className={inputCls}>
              {BAMBOO_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="w-36">
            <label className={labelCls}>Stock Qty</label>
            <input
              onChange={(e) => setStock(e.target.value)}
              value={stock}
              className={inputCls}
              type="number"
              min="0"
              placeholder="e.g. 50"
            />
          </div>

          <div className="w-40">
            <label className={labelCls}>Weight (grams)</label>
            <input
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              className={inputCls}
              type="number"
              min="0"
              placeholder="e.g. 350"
            />
          </div>
        </div>

        <div>
          <p className={labelCls}>Available Sizes / Dimensions</p>
          <div className="flex flex-wrap gap-2">
            {BAMBOO_DIMENSIONS.map((dim) => (
              <div
                key={dim}
                onClick={() => setSizes((prev) => toggle(prev, dim))}
                className={
                  "px-4 py-1.5 rounded-sm cursor-pointer text-sm font-medium border transition-colors " +
                  (sizes.includes(dim)
                    ? "bg-bamboo-500 text-cream border-bamboo-500"
                    : "bg-bamboo-50 text-bamboo-700 border-bamboo-300 hover:border-bamboo-500")
                }
              >
                {dim}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
              className="w-4 h-4 accent-bamboo-500"
            />
            <span className="text-sm text-bamboo-700">Mark as Bestseller</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              onChange={() => setEcoTag((prev) => !prev)}
              checked={ecoTag}
              type="checkbox"
              id="ecoTag"
              className="w-4 h-4 accent-bamboo-500"
            />
            <span className="text-sm text-bamboo-700">Eco-Certified Product</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            className="px-8 py-2.5 bg-bamboo-500 hover:bg-bamboo-600 text-cream text-sm font-semibold rounded-sm transition-colors"
            type="submit"
          >
            ADD PRODUCT
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-8 py-2.5 border border-bamboo-300 text-bamboo-600 text-sm font-semibold rounded-sm hover:bg-bamboo-50 transition-colors"
          >
            RESET
          </button>
        </div>

      </form>
    </div>
  );
};

export default Add;
