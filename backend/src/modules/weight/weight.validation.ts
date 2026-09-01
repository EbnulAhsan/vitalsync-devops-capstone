import { z } from "zod";

const addWeightValidation = {
    body: z.object({
        weightKg: z.coerce.number().positive("weightKg must be positive"),
        note: z.string().optional(),
    }),
};

export const WeightValidation = {
    addWeightValidation,
};