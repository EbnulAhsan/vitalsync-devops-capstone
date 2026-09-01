import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { SleepService } from "./sleep.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const addSleep = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await SleepService.addSleep(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Sleep record added successfully",
        data: result,
    });
});

const getSleepHistory = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await SleepService.getSleepHistory(userId);

    return res.status(200).json({
        success: true,
        message: "Sleep history retrieved successfully",
        data: result,
    });
});

const getTodaySleep = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await SleepService.getTodaySleep(userId);

    return res.status(200).json({
        success: true,
        message: "Today sleep retrieved successfully",
        data: result,
    });
});

export const SleepController = {
    addSleep,
    getSleepHistory,
    getTodaySleep,
};