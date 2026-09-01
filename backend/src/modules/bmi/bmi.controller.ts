import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { BMIService } from "./bmi.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const calculateBMI = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await BMIService.calculateBMI(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "BMI calculated successfully",
        data: result,
    });
});

const getBMIHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await BMIService.getBMIHistory(userId);

    return res.status(200).json({
        success: true,
        message: "BMI history retrieved successfully",
        data: result,
    });
});

export const BMIController = {
    calculateBMI,
    getBMIHistory,
};