import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { DashboardService } from "./dashboard.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const getDashboardSummary = catchAsync(
    async (req: AuthRequest, res: Response) => {
        const userId = req.user?.userId;

        if (!userId) {
            throw new AppError(401, "Unauthorized user");
        }

        const result = await DashboardService.getDashboardSummary(userId);

        return res.status(200).json({
            success: true,
            message: "Dashboard summary retrieved successfully",
            data: result,
        });
    }
);

export const DashboardController = {
    getDashboardSummary,
};