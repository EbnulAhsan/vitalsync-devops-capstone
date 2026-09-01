import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type AddSleepPayload = {
    durationMins: number;
    quality?: string;
};

type SleepRecordItem = {
    durationMins: number;
};

const addSleep = async (userId: string, payload: AddSleepPayload) => {
    const durationMins = Number(payload.durationMins);

    if (!durationMins || durationMins <= 0) {
        throw new AppError(400, "Valid durationMins is required");
    }

    const sleepRecord = await prisma.sleepHistory.create({
        data: {
            userId,
            durationMins,
            quality: payload.quality,
        },
    });

    return sleepRecord;
};

const getSleepHistory = async (userId: string) => {
    const records = await prisma.sleepHistory.findMany({
        where: {
            userId,
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    return records;
};

const getTodaySleep = async (userId: string) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const records = await prisma.sleepHistory.findMany({
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

    const totalDurationMins = records.reduce(
        (total: number, item: SleepRecordItem) => {
            return total + item.durationMins;
        },
        0
    );

    return {
        totalDurationMins,
        totalDurationHours: Number((totalDurationMins / 60).toFixed(2)),
        records,
    };
};

export const SleepService = {
    addSleep,
    getSleepHistory,
    getTodaySleep,
};