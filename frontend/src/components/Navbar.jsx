import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logOut = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <div className="bg-cream border-b border-bamboo-100">
    <div className="flex items-center justify-between py-5 font-medium max-w-screen-xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="logo" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-bamboo-600">
        <NavLink to={"/"} className="flex flex-col items-center gap-1 hover:text-bamboo-500 transition-colors">
          <p className="tracking-wide">HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-bamboo-500 hidden" />
        </NavLink>
        <NavLink
          to={"/collection"}
          className="flex flex-col items-center gap-1 hover:text-bamboo-500 transition-colors"
        >
          <p className="tracking-wide">COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-bamboo-500 hidden" />
        </NavLink>
        <NavLink to={"/about"} className="flex flex-col items-center gap-1 hover:text-bamboo-500 transition-colors">
          <p className="tracking-wide">ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-bamboo-500 hidden" />
        </NavLink>
        <NavLink to={"/contact"} className="flex flex-col items-center gap-1 hover:text-bamboo-500 transition-colors">
          <p className="tracking-wide">CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-bamboo-500 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="search_icon"
        />

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt="profile_icon"
          />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-1 w-40 py-3 px-4 bg-white border border-bamboo-100 shadow-md rounded-sm text-sm">
                <p
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer text-bamboo-700 hover:text-bamboo-500 py-1 transition-colors"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer text-bamboo-700 hover:text-bamboo-500 py-1 transition-colors"
                >
                  Orders
                </p>
                <hr className="border-bamboo-100 my-1" />
                <p onClick={logOut} className="cursor-pointer text-red-400 hover:text-red-600 py-1 transition-colors">
                  Logout
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cart_icon" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu_icon"
        />
      </div>

      {/* Sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              src={assets.dropdown_icon}
              className="h-4 rotate-180"
              alt="dropdown_icon"
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Navbar;
