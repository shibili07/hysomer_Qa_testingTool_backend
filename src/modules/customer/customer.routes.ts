import express from "express";
import * as CustomerController from "./customer.controller.ts";

const router = express.Router();

router.post("/", CustomerController.createCustomer);
router.get("/", CustomerController.listCustomers);

export default router;
