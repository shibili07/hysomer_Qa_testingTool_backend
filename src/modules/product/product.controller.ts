import type { Request, Response } from "express";
import { ProductZodSchema, type ProductInput } from "./product.schema.ts";
import {
  createProductService,
  getProductsService,
  updateProductService,
  deleteProductService,
} from "./product.service.ts";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = ProductZodSchema.parse(req.body);
    const product = await createProductService(data);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (err: any) {
    if (err.name === "ZodError") {
       res.status(400).json({ message: "Validation error", errors: err.errors });
       return;
    }
    res.status(400).json({ message: err.message || "Failed to create product" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getProductsService();
    res.status(200).json({ products });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get products" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = ProductZodSchema.partial().parse(req.body) as Partial<ProductInput>;
    const product = await updateProductService(id, data);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err: any) {
    if (err.name === "ZodError") {
       res.status(400).json({ message: "Validation error", errors: err.errors });
       return;
    }
    res.status(400).json({ message: err.message || "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await deleteProductService(id);
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete product" });
  }
};
