import { SupermarketModel } from "./supermarket.model.ts";
import type { SupermarketInput } from "./supermarket.schema.ts";

export const create = async (data: SupermarketInput) => {
  return await SupermarketModel.create(data as any);
};

export const findById = async (id: string) => {
  return await SupermarketModel.findById(id);
};

export const findAll = async () => {
  return await SupermarketModel.find().sort({ createdAt: -1 });
};

export const update = async (id: string, data: Partial<SupermarketInput>) => {
  return await SupermarketModel.findByIdAndUpdate(id, data as any, { new: true });
};

export const remove = async (id: string) => {
  return await SupermarketModel.findByIdAndDelete(id);
};
