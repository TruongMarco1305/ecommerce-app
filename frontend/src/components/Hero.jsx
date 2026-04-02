import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="mt-10 flex flex-col sm:flex-row overflow-hidden">
      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-14 sm:py-0">
        <div className="text-bamboo-700 px-8">
          <div className="flex items-center gap-2 mb-3">
            <p className="w-8 md:w-11 h-[2px] bg-bamboo-500"></p>
            <p className="font-semibold text-sm md:text-base tracking-widest text-bamboo-500 uppercase">
              Our Bestsellers
            </p>
          </div>
          <h1 className="font-heading text-3xl sm:py-3 lg:text-5xl leading-snug text-bamboo-700">
            Crafted from<br />Nature&apos;s Finest
          </h1>
          <div className="flex items-center gap-2 mt-3">
            <p className="font-semibold text-sm md:text-base tracking-widest text-bamboo-500 uppercase">
              Shop Now
            </p>
            <p className="w-8 md:w-11 h-[2px] bg-bamboo-500"></p>
          </div>
        </div>
      </div>

      {/* Hero Right Side */}
      <img className="w-full sm:w-1/2 object-cover rounded-lg" src={assets.hero_img} alt="hero_img" />
    </div>
  );
};

export default Hero;
