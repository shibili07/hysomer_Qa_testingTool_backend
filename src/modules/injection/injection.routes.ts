import express from "express";
import { authMiddleware } from "../../shared/middleware/auth.middleware.ts";
import {
  getOverview,
  getLogs,
  getDailyStats,
  getDailyInjectionReport,
  startInjection,
  pauseInjection,
  stopInjection,
  resumeInjection,
  clearLogsOnly,
  clearInjectionData,
} from "./injection.controller.ts";

const router = express.Router();
router.use(authMiddleware);

router.get("/overview", getOverview);
router.get("/reports/daily-injections", getDailyInjectionReport);
router.get("/jobs/:supermarketId/logs", getLogs);
router.get("/jobs/:supermarketId/stats/daily", getDailyStats);
router.post("/jobs/:supermarketId/start", startInjection);
router.post("/jobs/:supermarketId/pause", pauseInjection);
router.post("/jobs/:supermarketId/stop", stopInjection);
router.post("/jobs/:supermarketId/resume", resumeInjection);
router.delete("/jobs/:supermarketId/logs", clearLogsOnly);
router.delete("/jobs/:supermarketId", clearInjectionData);

export default router;
