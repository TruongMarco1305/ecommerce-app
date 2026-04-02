import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-3 px-[4%] justify-between bg-bamboo-700">
      <img className="w-[max(10%,80px)] brightness-0 invert" src={assets.logo} alt="logo" />
      <button
        onClick={() => setToken("")}
        className="bg-bamboo-500 hover:bg-bamboo-400 text-cream px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
