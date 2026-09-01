import { z } from "zod";

const goalIdParamsValidation = {
    params: z.object({
        id: z.string().min(1, "Goal id is required"),
    }),
};

const createGoalValidation = {
    body: z.object({
        type: z.enum(["WEIGHT", "WATER", "SLEEP", "CALORIES"]),
        targetValue: z.coerce.number().positive("targetValue must be positive"),
        currentValue: z.coerce.number().min(0, "currentValue cannot be negative").optional(),
        deadline: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: "Invalid deadline",
            })
            .optional(),
    }),
};

const updateGoalValidation = {
    params: z.object({
        id: z.string().min(1, "Goal id is required"),
    }),
    body: z.object({
        targetValue: z.coerce.number().positive("targetValue must be positive").optional(),
        currentValue: z.coerce.number().min(0, "currentValue cannot be negative").optional(),
        deadline: z
            .string()
            .refine((value) => !Number.isNaN(Date.parse(value)), {
                message: "Invalid deadline",
            })
            .optional(),
        status: z.enum(["ACTIVE", "COMPLETED", "FAILED"]).optional(),
    }),
};

export const GoalValidation = {
    goalIdParamsValidation,
    createGoalValidation,
    updateGoalValidation,
};