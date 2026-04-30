import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    productId: String,
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);


export type Product = mongoose.InferSchemaType<typeof ProductSchema>;

export const ProductModel = mongoose.model<Product>(
  "Product",
  ProductSchema
);