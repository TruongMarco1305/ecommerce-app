import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="bg-bamboo-700 text-cream mt-20">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-14 px-6 text-sm">
        <div>
          <img className="mb-5 w-32 brightness-0 invert" src={assets.logo} alt="logo" />
          <p className="w-full md:w-2/3 text-bamboo-100 leading-relaxed">
            Handcrafted bamboo products made sustainably for a greener tomorrow.
            Every purchase supports eco-conscious artisans and helps preserve forests.
          </p>
        </div>

        <div>
          <p className="text-xl font-heading font-semibold mb-5 text-cream">COMPANY</p>
          <ul className="flex flex-col gap-2 text-bamboo-100">
            <li className="hover:text-cream cursor-pointer transition-colors">Home</li>
            <li className="hover:text-cream cursor-pointer transition-colors">About us</li>
            <li className="hover:text-cream cursor-pointer transition-colors">Delivery</li>
            <li className="hover:text-cream cursor-pointer transition-colors">Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-heading font-semibold mb-5 text-cream">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-bamboo-100">
            <li>+250-784-652-570</li>
            <li>contact@bambooshop.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bamboo-600">
        <hr className="hidden" />
        <p className="py-5 text-sm text-center text-bamboo-200">
          Copyright 2024 © BambooShop — All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
