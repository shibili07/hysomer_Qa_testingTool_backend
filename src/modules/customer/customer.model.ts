import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    customerId: { type: String, unique: true },
    externalCustomerId: { type: String },
    phone: { type: String },
    email: { type: String },
    name: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model("Customer", CustomerSchema);
