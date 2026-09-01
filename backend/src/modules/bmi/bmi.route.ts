import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { BMIController } from "./bmi.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { BMIValidation } from "./bmi.validation";

const router = express.Router();

router.post(
    "/calculate",
    authMiddleware,
    validateRequest(BMIValidation.calculateBMIValidation),
    BMIController.calculateBMI
);

router.get("/history", authMiddleware, BMIController.getBMIHistory);

export default router;