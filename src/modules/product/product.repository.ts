import { ProductModel } from "./product.model.ts";
import type { ProductInput } from "./product.schema.ts";

export const create = async (data: ProductInput) => {
  return await ProductModel.create(data as any);
};


export const findById = async (id: string) => {
  return await ProductModel.findById(id);
};

export const findByProductId = async (productId: string) => {
  return await ProductModel.findOne({ productId });
};

export const findAll = async () => {
  return await ProductModel.find().sort({ productName: 1 });
};

export const update = async (id: string, data: Partial<ProductInput>) => {
  return await ProductModel.findByIdAndUpdate(id, data as any, { new: true });
};


export const remove = async (id: string) => {
  return await ProductModel.findByIdAndDelete(id);
};

