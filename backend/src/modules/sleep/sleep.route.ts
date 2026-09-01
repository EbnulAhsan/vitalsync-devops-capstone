import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { SleepController } from "./sleep.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { SleepValidation } from "./sleep.validation";

const router = express.Router();

router.post(
    "/add",
    authMiddleware,
    validateRequest(SleepValidation.addSleepValidation),
    SleepController.addSleep
);

router.get("/history", authMiddleware, SleepController.getSleepHistory);
router.get("/today", authMiddleware, SleepController.getTodaySleep);

export default router;