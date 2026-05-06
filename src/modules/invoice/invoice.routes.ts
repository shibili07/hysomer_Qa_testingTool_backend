import express from "express";
import * as InvoiceController from "./invoice.controller.ts";

const router = express.Router();

router.post("/", InvoiceController.createInvoice);
router.get("/", InvoiceController.listInvoices);
router.post("/proxy", InvoiceController.proxyInvoice);

export default router;
