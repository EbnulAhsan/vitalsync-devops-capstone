import { z } from "zod";

const calculateBMIValidation = {
    body: z.object({
        weightKg: z.coerce.number().positive("weightKg must be positive"),
        heightCm: z.coerce.number().positive("heightCm must be positive").optional(),
    }),
};

export const BMIValidation = {
    calculateBMIValidation,
};