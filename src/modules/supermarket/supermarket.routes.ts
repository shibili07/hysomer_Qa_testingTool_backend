import express from "express";
import {
  createSupermarket,
  getSupermarkets,
  updateSupermarket,
  deleteSupermarket,
} from "./supermarket.controller.ts";
import { authMiddleware } from "../../shared/middleware/auth.middleware.ts";

const router = express.Router();

// Apply authMiddleware to all supermarket routes for security
router.use(authMiddleware);

router.post("/", createSupermarket);
router.get("/", getSupermarkets);
router.put("/:id", updateSupermarket);
router.delete("/:id", deleteSupermarket);

export default router;
