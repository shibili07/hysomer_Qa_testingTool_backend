import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "./product.controller.ts";
import { authMiddleware } from "../../shared/middleware/auth.middleware.ts";

const router = express.Router();

// Apply authMiddleware to all product routes for security
router.use(authMiddleware);

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
