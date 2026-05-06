import type { Request, Response } from "express";
import { InvoiceModel } from "./invoice.model.ts";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = new InvoiceModel(req.body);
    await invoice.save();
    res.status(201).json({ success: true, invoice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await InvoiceModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, invoices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
