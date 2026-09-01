import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { WaterController } from "./water.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { WaterValidation } from "./water.validation";

const router = express.Router();

router.post(
    "/add",
    authMiddleware,
    validateRequest(WaterValidation.addWaterValidation),
    WaterController.addWater
);

router.get("/history", authMiddleware, WaterController.getWaterHistory);
router.get("/today", authMiddleware, WaterController.getTodayWater);

export default router;