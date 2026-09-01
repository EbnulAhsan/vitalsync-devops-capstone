import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { GoalService } from "./goal.service";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../error/AppError";

const createGoal = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await GoalService.createGoal(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Goal created successfully",
        data: result,
    });
});

const getMyGoals = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    const result = await GoalService.getMyGoals(userId);

    return res.status(200).json({
        success: true,
        message: "Goals retrieved successfully",
        data: result,
    });
});

const getGoalById = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const goalId = req.params.id as string;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    if (!goalId) {
        throw new AppError(400, "Goal id is required");
    }

    const result = await GoalService.getGoalById(userId, goalId);

    return res.status(200).json({
        success: true,
        message: "Goal retrieved successfully",
        data: result,
    });
});

const updateGoal = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const goalId = req.params.id as string;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    if (!goalId) {
        throw new AppError(400, "Goal id is required");
    }

    const result = await GoalService.updateGoal(userId, goalId, req.body);

    return res.status(200).json({
        success: true,
        message: "Goal updated successfully",
        data: result,
    });
});

const deleteGoal = catchAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const goalId = req.params.id as string;

    if (!userId) {
        throw new AppError(401, "Unauthorized user");
    }

    if (!goalId) {
        throw new AppError(400, "Goal id is required");
    }

    await GoalService.deleteGoal(userId, goalId);

    return res.status(200).json({
        success: true,
        message: "Goal deleted successfully",
        data: null,
    });
});

export const GoalController = {
    createGoal,
    getMyGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
};