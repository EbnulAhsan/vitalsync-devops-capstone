import { z } from "zod";

const updateProfileValidation = {
    body: z.object({
        fullName: z.string().min(2).optional(),
        avatarUrl: z.string().url("Invalid avatar URL").optional(),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
        dateOfBirth: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: "Invalid dateOfBirth",
            })
            .optional(),
        heightCm: z.coerce.number().positive("heightCm must be positive").optional(),
        activityLevel: z
            .enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"])
            .optional(),
    }),
};

export const ProfileValidation = {
    updateProfileValidation,
};