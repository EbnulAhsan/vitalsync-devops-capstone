import { z } from "zod";

const addWaterValidation = {
    body: z.object({
        amountMl: z.coerce.number().int().positive("amountMl must be positive"),
    }),
};

export const WaterValidation = {
    addWaterValidation,
};