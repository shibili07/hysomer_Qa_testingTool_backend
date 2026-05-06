import * as supermarketRepository from "./supermarket.repository.ts";
import type { SupermarketInput } from "./supermarket.schema.ts";

export const createSupermarketService = async (data: SupermarketInput) => {
  return await supermarketRepository.create(data);
};

export const getSupermarketsService = async () => {
  return await supermarketRepository.findAll();
};

export const updateSupermarketService = async (id: string, data: Partial<SupermarketInput>) => {
  const supermarket = await supermarketRepository.update(id, data);
  if (!supermarket) {
    throw new Error("Supermarket not found");
  }
  return supermarket;
};

export const deleteSupermarketService = async (id: string) => {
  const supermarket = await supermarketRepository.remove(id);
  if (!supermarket) {
    throw new Error("Supermarket not found");
  }
  return supermarket;
};
