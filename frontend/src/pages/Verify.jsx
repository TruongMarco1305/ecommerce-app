import React, { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";

// This page is kept for legacy URL compatibility.
// VietQR payment confirmation is now handled inline on the PlaceOrder page.
const Verify = () => {
  const { navigate } = useContext(ShopContext);

  useEffect(() => {
    navigate("/orders", { replace: true });
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-bamboo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Verify;
