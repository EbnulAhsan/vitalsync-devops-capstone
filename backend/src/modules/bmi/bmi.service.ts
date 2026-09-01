import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type BMICategory = "UNDERWEIGHT" | "NORMAL" | "OVERWEIGHT" | "OBESE";

type CalculateBMIPayload = {
    weightKg: number;
    heightCm?: number;
};

const getBMICategory = (bmiValue: number): BMICategory => {
    if (bmiValue < 18.5) return "UNDERWEIGHT";
    if (bmiValue < 25) return "NORMAL";
    if (bmiValue < 30) return "OVERWEIGHT";
    return "OBESE";
};

const calculateBMI = async (userId: string, payload: CalculateBMIPayload) => {
    const weightKg = Number(payload.weightKg);

    if (!weightKg || weightKg <= 0) {
        throw new AppError(400, "Valid weightKg is required");
    }

    let finalHeightCm: number;

    if (payload.heightCm && Number(payload.heightCm) > 0) {
        finalHeightCm = Number(payload.heightCm);
    } else {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: {
                heightCm: true,
            },
        });

        if (!profile || !profile.heightCm || profile.heightCm <= 0) {
            throw new AppError(
                400,
                "heightCm is required. Please update profile height first."
            );
        }

        finalHeightCm = profile.heightCm;
    }

    if (finalHeightCm <= 0) {
        throw new AppError(400, "Valid heightCm is required");
    }

    const heightMeter = finalHeightCm / 100;
    const bmiValue = Number((weightKg / (heightMeter * heightMeter)).toFixed(2));
    const category = getBMICategory(bmiValue);

    const bmiRecord = await prisma.bMIRecord.create({
        data: {
            userId,
            weightKg,
            heightCm: finalHeightCm,
            bmiValue,
            category,
        },
    });

    await prisma.weightHistory.create({
        data: {
            userId,
            weightKg,
            note: "BMI calculation entry",
        },
    });

    return bmiRecord;
};

const getBMIHistory = async (userId: string) => {
    const records = await prisma.bMIRecord.findMany({
        where: { userId },
        orderBy: {
            recordedAt: "desc",
        },
    });

    return records;
};

export const BMIService = {
    calculateBMI,
    getBMIHistory,
};