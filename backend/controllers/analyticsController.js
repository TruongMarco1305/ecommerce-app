import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const getAnalytics = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    // ── Summary stats ──────────────────────────────────────────────
    const totalRevenue = orders
      .filter((o) => o.payment)
      .reduce((sum, o) => sum + o.amount, 0);

    const totalOrders = orders.length;
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productModel.countDocuments();

    // ── Revenue by day (last 7 days) ───────────────────────────────
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const revenueByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      revenueByDay[key] = 0;
    }

    orders
      .filter((o) => o.payment && o.date >= sevenDaysAgo)
      .forEach((o) => {
        const key = new Date(o.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        if (revenueByDay[key] !== undefined) {
          revenueByDay[key] += o.amount;
        }
      });

    const dailyRevenue = Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));

    // ── Orders by status ───────────────────────────────────────────
    const statusCount = {};
    orders.forEach((o) => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });
    const ordersByStatus = Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));

    // ── Top 5 selling products ─────────────────────────────────────
    const productSales = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        if (!productSales[item._id]) {
          productSales[item._id] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item._id].quantity += item.quantity;
        productSales[item._id].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      success: true,
      stats: { totalRevenue, totalOrders, totalUsers, totalProducts },
      dailyRevenue,
      ordersByStatus,
      topProducts,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getAnalytics };
