import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-bamboo-100 bg-bamboo-50">
      <div className="flex flex-col gap-3 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-bamboo-200 border-r-0 px-3 py-2 rounded-l transition-colors ${
              isActive ? "bg-bamboo-500 text-cream border-bamboo-500" : "text-bamboo-700 hover:bg-bamboo-100"
            }`
          }
          to="/dashboard"
        >
          <img className="w-5 h-5 opacity-70" src={assets.order_icon} alt="dashboard_icon" />
          <p className="hidden md:block font-medium">Dashboard</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-bamboo-200 border-r-0 px-3 py-2 rounded-l transition-colors ${
              isActive ? "bg-bamboo-500 text-cream border-bamboo-500" : "text-bamboo-700 hover:bg-bamboo-100"
            }`
          }
          to="/add"
        >
          <img className="w-5 h-5 opacity-70" src={assets.add_icon} alt="add_icon" />
          <p className="hidden md:block font-medium">Add Items</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-bamboo-200 border-r-0 px-3 py-2 rounded-l transition-colors ${
              isActive ? "bg-bamboo-500 text-cream border-bamboo-500" : "text-bamboo-700 hover:bg-bamboo-100"
            }`
          }
          to="/list"
        >
          <img className="w-5 h-5 opacity-70" src={assets.order_icon} alt="list_icon" />
          <p className="hidden md:block font-medium">List Items</p>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-bamboo-200 border-r-0 px-3 py-2 rounded-l transition-colors ${
              isActive ? "bg-bamboo-500 text-cream border-bamboo-500" : "text-bamboo-700 hover:bg-bamboo-100"
            }`
          }
          to="/orders"
        >
          <img className="w-5 h-5 opacity-70" src={assets.order_icon} alt="order_icon" />
          <p className="hidden md:block font-medium">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
