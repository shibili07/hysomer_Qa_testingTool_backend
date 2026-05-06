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

export const proxyInvoice = async (req: Request, res: Response) => {
  try {
    const { payload, ingestionKey, organizationId } = req.body;
    
    // Server-side fetch to the real ingestion server to bypass browser CORS
    const targetUrl = "https://hysomer-ingestion-server.onrender.com/api/v1/invoices";
    
    const fetchRes = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ingestion-Key": ingestionKey,
        "X-Organization-Id": organizationId,
      },
      body: JSON.stringify(payload),
    });

    const isOk = fetchRes.ok;
    const text = await fetchRes.text();
    
    if (isOk) {
       res.status(200).json({ success: true, status: fetchRes.status, data: text });
    } else {
       res.status(fetchRes.status).json({ success: false, error: text });
    }

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
