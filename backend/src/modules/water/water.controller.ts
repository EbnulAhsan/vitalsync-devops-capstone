import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { WaterService } from "./water.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const addWater = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WaterService.addWater(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Water intake added successfully",
        data: result,
    });
});

const getWaterHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WaterService.getWaterHistory(userId);

    return res.status(200).json({
        success: true,
        message: "Water history retrieved successfully",
        data: result,
    });
});

const getTodayWater = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await WaterService.getTodayWater(userId);

    return res.status(200).json({
        success: true,
        message: "Today water intake retrieved successfully",
        data: result,
    });
});

export const WaterController = {
    addWater,
    getWaterHistory,
    getTodayWater,
};