import express from "express";
import { login, logout, getMe } from "./auth.controller.ts";
import { authMiddleware } from "../../shared/middleware/auth.middleware.ts";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;
