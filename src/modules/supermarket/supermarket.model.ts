import mongoose from "mongoose";

const SupermarketSchema = new mongoose.Schema(
  {
    organization_id: { type: String, required: true },
    supermarket_name: { type: String, required: true },
    api_key: { type: String, required: true },
  },
  { timestamps: true }
);

export const SupermarketModel = mongoose.model("Supermarket", SupermarketSchema);
