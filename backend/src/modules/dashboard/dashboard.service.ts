import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

const getDashboardSummary = async (userId: string) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            profile: true,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const latestBMI = await prisma.bMIRecord.findFirst({
        where: {
            userId,
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    const latestWeight = await prisma.weightHistory.findFirst({
        where: {
            userId,
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    const todayWaterRecords = await prisma.waterHistory.findMany({
        where: {
            userId,
            recordedAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    const todaySleepRecords = await prisma.sleepHistory.findMany({
        where: {
            userId,
            recordedAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    const activeGoals = await prisma.goal.findMany({
        where: {
            userId,
            status: "ACTIVE",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const totalWaterMl = todayWaterRecords.reduce(
        (total: number, item: { amountMl: number }) => {
            return total + item.amountMl;
        },
        0
    );

    const totalSleepMins = todaySleepRecords.reduce(
        (total: number, item: { durationMins: number }) => {
            return total + item.durationMins;
        },
        0
    );

    return {
        user,
        health: {
            latestBMI,
            latestWeight,
        },
        today: {
            water: {
                totalAmountMl: totalWaterMl,
                totalAmountLiter: Number((totalWaterMl / 1000).toFixed(2)),
                recordsCount: todayWaterRecords.length,
            },
            sleep: {
                totalDurationMins: totalSleepMins,
                totalDurationHours: Number((totalSleepMins / 60).toFixed(2)),
                recordsCount: todaySleepRecords.length,
            },
        },
        goals: {
            activeGoalsCount: activeGoals.length,
            activeGoals,
        },
    };
};

export const DashboardService = {
    getDashboardSummary,
};