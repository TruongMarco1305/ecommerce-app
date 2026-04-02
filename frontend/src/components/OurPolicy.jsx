import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base bg-bamboo-50 rounded-lg">
      <div>
        <img
          className="w-12 m-auto mb-5 opacity-75"
          src={assets.exchange_icon}
          alt="exchange_icon"
        />
        <p className="font-semibold text-bamboo-700">Easy Exchange Policy</p>
        <p className="text-bamboo-400 mt-1">Hassle-free exchange on all orders</p>
      </div>
      <div>
        <img
          className="w-12 m-auto mb-5 opacity-75"
          src={assets.quality_icon}
          alt="quality_icon"
        />
        <p className="font-semibold text-bamboo-700">7 Days Return Policy</p>
        <p className="text-bamboo-400 mt-1">Free returns within 7 days</p>
      </div>
      <div>
        <img
          className="w-12 m-auto mb-5 opacity-75"
          src={assets.support_img}
          alt="support_img"
        />
        <p className="font-semibold text-bamboo-700">Best Customer Support</p>
        <p className="text-bamboo-400 mt-1">24/7 dedicated support for you</p>
      </div>
    </div>
  );
};

export default OurPolicy;
