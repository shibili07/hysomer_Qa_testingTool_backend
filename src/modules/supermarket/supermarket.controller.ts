import type { Request, Response } from "express";
import { SupermarketZodSchema, type SupermarketInput } from "./supermarket.schema.ts";
import {
  createSupermarketService,
  getSupermarketsService,
  updateSupermarketService,
  deleteSupermarketService,
} from "./supermarket.service.ts";

export const createSupermarket = async (req: Request, res: Response) => {
  try {
    const data = SupermarketZodSchema.parse(req.body);
    const supermarket = await createSupermarketService(data);
    res.status(201).json({ message: "Supermarket registered successfully", supermarket });
  } catch (err: any) {
    if (err.name === "ZodError") {
       res.status(400).json({ message: "Validation error", errors: err.errors });
       return;
    }
    res.status(400).json({ message: err.message || "Failed to register supermarket" });
  }
};

export const getSupermarkets = async (req: Request, res: Response) => {
  try {
    const supermarkets = await getSupermarketsService();
    res.status(200).json({ supermarkets });
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Failed to get supermarkets" });
  }
};

export const updateSupermarket = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const data = SupermarketZodSchema.partial().parse(req.body) as Partial<SupermarketInput>;
    const supermarket = await updateSupermarketService(id, data);
    res.status(200).json({ message: "Supermarket updated successfully", supermarket });
  } catch (err: any) {
    if (err.name === "ZodError") {
       res.status(400).json({ message: "Validation error", errors: err.errors });
       return;
    }
    res.status(400).json({ message: err.message || "Failed to update supermarket" });
  }
};

export const deleteSupermarket = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const supermarket = await deleteSupermarketService(id);
    res.status(200).json({ message: "Supermarket deleted successfully", supermarket });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Failed to delete supermarket" });
  }
};
