import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const STATUS_COLORS = {
  "Order Placed": "#f59e0b",
  Packing: "#3b82f6",
  Shipped: "#8b5cf6",
  "Out for delivery": "#f97316",
  Delivered: "#22c55e",
};

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#8b5cf6", "#ec4899"];

// ── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    if (!token) return;
    try {
      const res = await axios.get(backendUrl + "/api/analytics", {
        headers: { token },
      });
      if (res.data.success) {
        setStats(res.data.stats);
        setDailyRevenue(res.data.dailyRevenue);
        setOrdersByStatus(res.data.ordersByStatus);
        setTopProducts(res.data.topProducts);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">📊 Analytics Dashboard</h2>

      {/* ── Stat Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`${currency}${stats?.totalRevenue?.toLocaleString() ?? 0}`}
          icon="💰"
          color="#22c55e"
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon="📦"
          color="#3b82f6"
        />
        <StatCard
          label="Total Customers"
          value={stats?.totalUsers ?? 0}
          icon="👥"
          color="#f59e0b"
        />
        <StatCard
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          icon="🎋"
          color="#8b5cf6"
        />
      </div>

      {/* ── Revenue Chart + Pie Chart ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue last 7 days */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Revenue – Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyRevenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22c55e"
                fill="url(#revGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Orders by Status</h3>
          {ordersByStatus.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">No orders yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  outerRadius={75}
                  label={false}
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Top Products ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">🏆 Top 5 Selling Products</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400">No sales data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={150}
              />
              <Tooltip
                formatter={(v, name) => [
                  name === "quantity" ? `${v} units` : `$${v}`,
                  name === "quantity" ? "Sold" : "Revenue",
                ]}
              />
              <Bar dataKey="quantity" fill="#22c55e" radius={[0, 4, 4, 0]} name="quantity" />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} name="revenue" />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
