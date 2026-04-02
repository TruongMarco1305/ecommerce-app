import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <h2 className="text-xl font-heading font-semibold text-bamboo-700 mb-4">🎋 All Products</h2>
      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-2 px-3 bg-bamboo-700 text-cream text-xs font-semibold rounded-sm">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Sub Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

        {/* Product Rows */}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-2 px-3 border border-bamboo-100 bg-white hover:bg-bamboo-50 text-sm text-bamboo-700 rounded-sm transition-colors"
            key={index}
          >
            <img className="w-12 h-12 object-cover rounded-sm" src={item.image[0]} alt={item.name} />
            <p className="font-medium">{item.name}</p>
            <p className="text-bamboo-500">{item.category}</p>
            <p className="text-bamboo-400 text-xs">{item.subCategory}</p>
            <p className="font-semibold text-bamboo-500">
              {currency}{item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-red-400 hover:text-red-600 font-bold text-lg transition-colors"
              title="Remove product"
            >
              ✕
            </p>
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-center py-16 text-bamboo-400">
            <p className="text-4xl mb-3">🎋</p>
            <p>No products yet. Add your first bamboo product!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
