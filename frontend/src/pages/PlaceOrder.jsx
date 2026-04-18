import React, { useContext, useState, useEffect, useRef } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const QR_TIMEOUT = 30; // seconds

// ── VietQR modal ──────────────────────────────────────────────────────────────
const VietQRModal = ({ qrUrl, bankInfo, onConfirm, onCancel, loading }) => {
  const [secondsLeft, setSecondsLeft] = useState(QR_TIMEOUT);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearInterval(timerRef.current);
      onConfirm();
    }
  }, [secondsLeft]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-sm p-6 flex flex-col items-center gap-4">
        <h2 className="font-heading text-xl font-semibold text-bamboo-700">Scan to Pay</h2>

        <img
          src={qrUrl}
          alt="VietQR code"
          className="w-56 h-56 border border-bamboo-200 rounded-sm object-contain"
        />

        <div className="w-full text-sm text-bamboo-700 bg-bamboo-50 border border-bamboo-100 rounded-sm px-4 py-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-bamboo-400">Bank</span>
            <span className="font-medium">{bankInfo.bankId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bamboo-400">Account</span>
            <span className="font-medium">{bankInfo.account}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bamboo-400">Name</span>
            <span className="font-medium">{bankInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bamboo-400">Amount (USD)</span>
            <span className="font-semibold text-bamboo-600">${bankInfo.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bamboo-400">Amount (VND)</span>
            <span className="font-semibold text-bamboo-600">{Number(bankInfo.amountVND).toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bamboo-400">Ref</span>
            <span className="font-medium tracking-wide">{bankInfo.desc}</span>
          </div>
        </div>

        <div className="w-full bg-amber-50 border border-amber-200 rounded-sm px-3 py-2">
          <p className="text-xs text-amber-700 text-center">
            💱 Exchange rate: <strong>1 USD = 26,000 VND</strong>. The QR code amount is shown in VND.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 border border-bamboo-300 text-bamboo-600 text-sm font-semibold rounded-sm hover:bg-bamboo-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const [qrData, setQrData]     = useState(null); // { qrUrl, bankInfo, orderId }
  const [confirming, setConfirming] = useState(false);

  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      if (method === "cod") {
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { token } }
        );
        if (response.data.success) {
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(response.data.message);
        }
      } else if (method === "vietqr") {
        const response = await axios.post(
          backendUrl + "/api/order/vietqr",
          orderData,
          { headers: { token } }
        );
        if (response.data.success) {
          setQrData({
            qrUrl:    response.data.qrUrl,
            bankInfo: response.data.bankInfo,
            orderId:  response.data.orderId,
          });
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/order/verifyVietQR",
        { orderId: qrData.orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
        toast.success("Payment confirmed! Your order is placed.");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setConfirming(false);
  };

  const handleCancelQR = async () => {
    // Delete the pending order
    try {
      await axios.post(
        backendUrl + "/api/order/cancelPending",
        { orderId: qrData.orderId },
        { headers: { token } }
      );
    } catch (_) {}
    setQrData(null);
  };

  const inputCls =
    "border border-bamboo-200 rounded-sm py-1.5 px-3.5 w-full text-sm text-bamboo-700 outline-none focus:border-bamboo-500 transition-colors";

  return (
    <>
      {qrData && (
        <VietQRModal
          qrUrl={qrData.qrUrl}
          bankInfo={qrData.bankInfo}
          onConfirm={handleConfirmPayment}
          onCancel={handleCancelQR}
          loading={confirming}
        />
      )}

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* ── Delivery Information ───────────────────────────── */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} className={inputCls} type="text" placeholder="First name" />
            <input required onChange={onChangeHandler} name="lastName"  value={formData.lastName}  className={inputCls} type="text" placeholder="Last name" />
          </div>
          <input required onChange={onChangeHandler} name="email"   value={formData.email}   className={inputCls} type="email"  placeholder="Email address" />
          <input required onChange={onChangeHandler} name="street"  value={formData.street}  className={inputCls} type="text"   placeholder="Street" />
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="city"  value={formData.city}  className={inputCls} type="text" placeholder="City" />
            <input required onChange={onChangeHandler} name="state" value={formData.state} className={inputCls} type="text" placeholder="State" />
          </div>
          <div className="flex gap-3">
            <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} className={inputCls} type="text" placeholder="Zipcode" />
            <input required onChange={onChangeHandler} name="country" value={formData.country} className={inputCls} type="text" placeholder="Country" />
          </div>
          <input required onChange={onChangeHandler} name="phone" value={formData.phone} className={inputCls} type="tel" placeholder="Phone" />
        </div>

        {/* ── Right Side ─────────────────────────────────────── */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="flex gap-3 flex-col lg:flex-row">
              {/* VietQR */}
              <div
                onClick={() => setMethod("vietqr")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-colors ${
                  method === "vietqr" ? "border-bamboo-500 bg-bamboo-50" : "border-bamboo-200"
                }`}
              >
                <span
                  className={`min-w-3.5 h-3.5 border rounded-full transition-colors ${
                    method === "vietqr" ? "bg-bamboo-500 border-bamboo-500" : "border-bamboo-300"
                  }`}
                />
                <div className="flex items-center gap-2 mx-2">
                  <span className="text-lg">🏦</span>
                  <span className="text-sm font-semibold text-bamboo-700">VietQR</span>
                  <span className="text-xs text-bamboo-400">(Bank Transfer)</span>
                </div>
              </div>

              {/* COD */}
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer transition-colors ${
                  method === "cod" ? "border-bamboo-500 bg-bamboo-50" : "border-bamboo-200"
                }`}
              >
                <span
                  className={`min-w-3.5 h-3.5 border rounded-full transition-colors ${
                    method === "cod" ? "bg-bamboo-500 border-bamboo-500" : "border-bamboo-300"
                  }`}
                />
                <span className="text-sm font-medium text-bamboo-700 mx-4">CASH ON DELIVERY</span>
              </div>
            </div>

            <div className="w-full text-end mt-8">
              <button
                type="submit"
                className="bg-bamboo-500 hover:bg-bamboo-600 text-cream px-16 py-3 text-sm font-semibold rounded-sm transition-colors"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PlaceOrder;
