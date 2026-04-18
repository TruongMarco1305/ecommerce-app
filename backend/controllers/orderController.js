import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// global variables
const deliveryCharge = 10;

// ── VietQR bank config (mock) ────────────────────────────────────────────────
const BANK_ID   = process.env.VIETQR_BANK_ID   || "970422"; // MB Bank BIN
const ACCOUNT   = process.env.VIETQR_ACCOUNT   || "0123456789";
const ACCT_NAME = process.env.VIETQR_ACCT_NAME || "BAMBOO SHOP";
const USD_TO_VND = 26000; // 1 USD = 26,000 VND

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using VietQR Method
const placeOrderVietQR = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "VietQR",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Build VietQR URL using vietqr.io quick-link API
    const desc = `BAMBOO ${newOrder._id.toString().slice(-8).toUpperCase()}`;
    const amountVND = Math.round(amount * USD_TO_VND);
    const qrUrl =
      `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT}-compact2.png` +
      `?amount=${amountVND}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(ACCT_NAME)}`;

    res.json({
      success: true,
      orderId: newOrder._id,
      qrUrl,
      bankInfo: {
        bankId:   BANK_ID,
        account:  ACCOUNT,
        name:     ACCT_NAME,
        amount,
        amountVND,
        desc,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Confirm VietQR payment (user self-reports after transfer)
const verifyVietQR = async (req, res) => {
  const { orderId, userId } = req.body;
  try {
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Payment confirmed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel a pending (unpaid) VietQR order
const cancelPending = async (req, res) => {
  const { orderId } = req.body;
  try {
    await orderModel.findOneAndDelete({ _id: orderId, payment: false });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderVietQR,
  verifyVietQR,
  cancelPending,
  allOrders,
  userOrders,
  updateStatus,
};
