import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    phone: { type: String, default: "" },
    address: {
      line1:   { type: String, default: "" },
      line2:   { type: String, default: "" },
      city:    { type: String, default: "" },
      zip:     { type: String, default: "" },
      country: { type: String, default: "" },
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
