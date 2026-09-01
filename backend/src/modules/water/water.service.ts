import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type AddWaterPayload = {
    amountMl: number;
};

type WaterRecordItem = {
    amountMl: number;
};

const addWater = async (userId: string, payload: AddWaterPayload) => {
    const amountMl = Number(payload.amountMl);

    if (!amountMl || amountMl <= 0) {
        throw new AppError(400, "Valid amountMl is required");
    }

    const waterRecord = await prisma.waterHistory.create({
        data: {
            userId,
            amountMl,
        },
    });

    return waterRecord;
};

const getWaterHistory = async (userId: string) => {
    const records = await prisma.waterHistory.findMany({
        where: {
            userId,
        },
        orderBy: {
            recordedAt: "desc",
        },
    });

    return records;
};

const getTodayWater = async (userId: string) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const records = await prisma.waterHistory.findMany({
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

    const totalAmountMl = records.reduce(
        (total: number, item: WaterRecordItem) => {
            return total + item.amountMl;
        },
        0
    );

    return {
        totalAmountMl,
        totalAmountLiter: Number((totalAmountMl / 1000).toFixed(2)),
        records,
    };
};

export const WaterService = {
    addWater,
    getWaterHistory,
    getTodayWater,
};