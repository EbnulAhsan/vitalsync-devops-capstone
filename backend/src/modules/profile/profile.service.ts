import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type UpdateProfilePayload = {
    fullName?: string;
    avatarUrl?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth?: string;
    heightCm?: number;
    activityLevel?: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE";
};

const getMyProfile = async (userId: string) => {
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

    return user;
};

const updateMyProfile = async (
    userId: string,
    payload: UpdateProfilePayload
) => {
    const updatedProfile = await prisma.profile.upsert({
        where: {
            userId,
        },
        update: {
            fullName: payload.fullName,
            avatarUrl: payload.avatarUrl,
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth
                ? new Date(payload.dateOfBirth)
                : undefined,
            heightCm: payload.heightCm,
            activityLevel: payload.activityLevel,
        },
        create: {
            userId,
            fullName: payload.fullName,
            avatarUrl: payload.avatarUrl,
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth
                ? new Date(payload.dateOfBirth)
                : undefined,
            heightCm: payload.heightCm,
            activityLevel: payload.activityLevel,
        },
    });

    return updatedProfile;
};

export const ProfileService = {
    getMyProfile,
    updateMyProfile,
};