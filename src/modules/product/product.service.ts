import * as productRepository from "./product.repository.ts";
import type { ProductInput } from "./product.schema.ts";

export const createProductService = async (data: ProductInput) => {
  // Generate productId if missing
  const productData = {
    ...data,
    productId: data.productId || `PROD-${Date.now().toString().slice(-6)}`,
  };

  return await productRepository.create(productData);
};

export const getProductsService = async () => {
  return await productRepository.findAll();
};

export const updateProductService = async (id: string, data: Partial<ProductInput>) => {
  // We'll add update to repository
  const product = await productRepository.update(id, data);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const deleteProductService = async (id: string) => {
  const product = await productRepository.remove(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

