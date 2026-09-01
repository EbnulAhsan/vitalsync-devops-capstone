import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/summary", authMiddleware, DashboardController.getDashboardSummary);

export default router;