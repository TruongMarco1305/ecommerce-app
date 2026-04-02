import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const inputCls =
  "w-full border border-bamboo-200 rounded-sm px-3 py-2 text-sm text-bamboo-700 outline-none focus:border-bamboo-500 bg-white transition-colors";
const labelCls = "block mb-1 text-xs font-semibold text-bamboo-600 uppercase tracking-wide";

const Profile = () => {
  const { token, userProfile, setUserProfile, fetchUserProfile, saveUserProfile, navigate, backendUrl } =
    useContext(ShopContext);

  // ── Form state ────────────────────────────────────────────────
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    line1: "", line2: "", city: "", zip: "", country: "",
  });

  // ── Password change state ─────────────────────────────────────
  const [pwSection, setPwSection] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // ── Editing toggle ────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);

  // ── Order stats ───────────────────────────────────────────────
  const [orderCount, setOrderCount] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  // Load profile into form
  useEffect(() => {
    if (token) fetchUserProfile(token);
  }, [token]);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPhone(userProfile.phone || "");
      setAddress({
        line1:   userProfile.address?.line1   || "",
        line2:   userProfile.address?.line2   || "",
        city:    userProfile.address?.city    || "",
        zip:     userProfile.address?.zip     || "",
        country: userProfile.address?.country || "",
      });
    }
  }, [userProfile]);

  // Fetch order count for stat card
  useEffect(() => {
    if (!token) return;
    axios
      .post(backendUrl + "/api/order/userorders", {}, { headers: { token } })
      .then((r) => {
        if (r.data.success) setOrderCount(r.data.orders.length);
      })
      .catch(() => {});
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await saveUserProfile({ name, phone, address });
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    if (userProfile) {
      setName(userProfile.name || "");
      setPhone(userProfile.phone || "");
      setAddress({
        line1:   userProfile.address?.line1   || "",
        line2:   userProfile.address?.line2   || "",
        city:    userProfile.address?.city    || "",
        zip:     userProfile.address?.zip     || "",
        country: userProfile.address?.country || "",
      });
    }
    setEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPw.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setPwLoading(true);
    try {
      const res = await axios.post(
        backendUrl + "/api/user/change-password",
        { currentPassword: currentPw, newPassword: newPw },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Password changed successfully!");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setPwSection(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setPwLoading(false);
  };

  const avatarLetter = (name || userProfile?.name || "U")[0].toUpperCase();

  if (!userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bamboo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-10 max-w-3xl mx-auto">

      {/* ── Header card ──────────────────────────────────────── */}
      <div className="flex items-center gap-5 mb-8 p-6 bg-bamboo-50 border border-bamboo-100 rounded-sm">
        <div className="w-16 h-16 rounded-full bg-bamboo-500 text-cream flex items-center justify-center text-2xl font-heading font-bold flex-shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-heading font-semibold text-bamboo-700 truncate">
            {userProfile.name}
          </h1>
          <p className="text-sm text-bamboo-400 truncate">{userProfile.email}</p>
        </div>
        {/* Stat pill */}
        <div className="text-center px-4 py-2 bg-white border border-bamboo-200 rounded-sm hidden sm:block">
          <p className="text-xl font-semibold text-bamboo-600">{orderCount}</p>
          <p className="text-xs text-bamboo-400">Orders</p>
        </div>
      </div>

      {/* ── Profile form ─────────────────────────────────────── */}
      <div className="border border-bamboo-100 rounded-sm p-6 mb-6 bg-white">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-semibold text-bamboo-700 text-lg">Personal Information</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-bamboo-500 hover:text-bamboo-700 border border-bamboo-300 px-3 py-1 rounded-sm transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
                readOnly={!editing}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
                readOnly={!editing}
                placeholder="e.g. +1 555 000 0000"
              />
            </div>
          </div>

          {/* Email (read-only always) */}
          <div>
            <label className={labelCls}>Email Address</label>
            <input
              value={userProfile.email}
              className={inputCls + " bg-bamboo-50 cursor-default"}
              readOnly
            />
          </div>

          {/* Address */}
          <div>
            <label className={labelCls}>Address Line 1</label>
            <input
              value={address.line1}
              onChange={(e) => setAddress((p) => ({ ...p, line1: e.target.value }))}
              className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
              readOnly={!editing}
              placeholder="Street address"
            />
          </div>
          <div>
            <label className={labelCls}>Address Line 2</label>
            <input
              value={address.line2}
              onChange={(e) => setAddress((p) => ({ ...p, line2: e.target.value }))}
              className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
              readOnly={!editing}
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>City</label>
              <input
                value={address.city}
                onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))}
                className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
                readOnly={!editing}
                placeholder="City"
              />
            </div>
            <div>
              <label className={labelCls}>ZIP / Postal Code</label>
              <input
                value={address.zip}
                onChange={(e) => setAddress((p) => ({ ...p, zip: e.target.value }))}
                className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
                readOnly={!editing}
                placeholder="ZIP"
              />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input
                value={address.country}
                onChange={(e) => setAddress((p) => ({ ...p, country: e.target.value }))}
                className={inputCls + (!editing ? " bg-bamboo-50 cursor-default" : "")}
                readOnly={!editing}
                placeholder="Country"
              />
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-bamboo-500 hover:bg-bamboo-600 text-cream text-sm font-semibold rounded-sm transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-bamboo-300 text-bamboo-600 text-sm font-semibold rounded-sm hover:bg-bamboo-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* ── Change Password ───────────────────────────────────── */}
      <div className="border border-bamboo-100 rounded-sm p-6 bg-white">
        <button
          onClick={() => setPwSection((v) => !v)}
          className="flex items-center justify-between w-full"
        >
          <h2 className="font-heading font-semibold text-bamboo-700 text-lg">Change Password</h2>
          <span className={`text-bamboo-400 text-lg transition-transform ${pwSection ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>

        {pwSection && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 mt-5">
            <div>
              <label className={labelCls}>Current Password</label>
              <input
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className={inputCls}
                required
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={labelCls}>New Password</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className={inputCls}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={labelCls}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className={inputCls}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={pwLoading}
                className="px-6 py-2 bg-bamboo-500 hover:bg-bamboo-600 text-cream text-sm font-semibold rounded-sm transition-colors disabled:opacity-60"
              >
                {pwLoading ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default Profile;
