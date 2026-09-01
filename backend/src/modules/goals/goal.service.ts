import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type GoalType = "WEIGHT" | "WATER" | "SLEEP" | "CALORIES";
type GoalStatus = "ACTIVE" | "COMPLETED" | "FAILED";

type CreateGoalPayload = {
    type: GoalType;
    targetValue: number;
    currentValue?: number;
    deadline?: string;
};

type UpdateGoalPayload = {
    targetValue?: number;
    currentValue?: number;
    deadline?: string;
    status?: GoalStatus;
};

const createGoal = async (userId: string, payload: CreateGoalPayload) => {
    const targetValue = Number(payload.targetValue);

    if (!payload.type) {
        throw new AppError(400, "Goal type is required");
    }

    if (!targetValue || targetValue <= 0) {
        throw new AppError(400, "Valid targetValue is required");
    }

    const goal = await prisma.goal.create({
        data: {
            userId,
            type: payload.type,
            targetValue,
            currentValue:
                payload.currentValue !== undefined ? Number(payload.currentValue) : 0,
            deadline: payload.deadline ? new Date(payload.deadline) : undefined,
        },
    });

    return goal;
};

const getMyGoals = async (userId: string) => {
    const goals = await prisma.goal.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return goals;
};

const getGoalById = async (userId: string, goalId: string) => {
    const goal = await prisma.goal.findFirst({
        where: {
            id: goalId,
            userId,
        },
    });

    if (!goal) {
        throw new AppError(404, "Goal not found");
    }

    return goal;
};

const updateGoal = async (
    userId: string,
    goalId: string,
    payload: UpdateGoalPayload
) => {
    const existingGoal = await prisma.goal.findFirst({
        where: {
            id: goalId,
            userId,
        },
    });

    if (!existingGoal) {
        throw new AppError(404, "Goal not found");
    }

    const updatedGoal = await prisma.goal.update({
        where: {
            id: goalId,
        },
        data: {
            targetValue:
                payload.targetValue !== undefined
                    ? Number(payload.targetValue)
                    : undefined,
            currentValue:
                payload.currentValue !== undefined
                    ? Number(payload.currentValue)
                    : undefined,
            deadline: payload.deadline ? new Date(payload.deadline) : undefined,
            status: payload.status,
        },
    });

    return updatedGoal;
};

const deleteGoal = async (userId: string, goalId: string) => {
    const existingGoal = await prisma.goal.findFirst({
        where: {
            id: goalId,
            userId,
        },
    });

    if (!existingGoal) {
        throw new AppError(404, "Goal not found");
    }

    await prisma.goal.delete({
        where: {
            id: goalId,
        },
    });

    return null;
};

export const GoalService = {
    createGoal,
    getMyGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
};