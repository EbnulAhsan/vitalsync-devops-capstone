import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { WeightService } from "./weight.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const addWeight = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WeightService.addWeight(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Weight record added successfully",
        data: result,
    });
});

const getWeightHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WeightService.getWeightHistory(userId);

    return res.status(200).json({
        success: true,
        message: "Weight history retrieved successfully",
        data: result,
    });
});

const getLatestWeight = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WeightService.getLatestWeight(userId);

    return res.status(200).json({
        success: true,
        message: "Latest weight retrieved successfully",
        data: result,
    });
});

export const WeightController = {
    addWeight,
    getWeightHistory,
    getLatestWeight,
};