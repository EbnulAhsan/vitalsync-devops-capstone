import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { WeightController } from "./weight.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { WeightValidation } from "./weight.validation";

const router = express.Router();

router.post(
    "/add",
    authMiddleware,
    validateRequest(WeightValidation.addWeightValidation),
    WeightController.addWeight
);

router.get("/history", authMiddleware, WeightController.getWeightHistory);
router.get("/latest", authMiddleware, WeightController.getLatestWeight);

export default router;