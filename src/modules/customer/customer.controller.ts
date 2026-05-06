import type { Request, Response } from "express";
import { CustomerModel } from "./customer.model.ts";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const customer = new CustomerModel(req.body);
    await customer.save();
    res.status(201).json({ success: true, customer });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await CustomerModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, customers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
