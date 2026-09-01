import { z } from "zod";

const addSleepValidation = {
    body: z.object({
        durationMins: z.coerce.number().int().positive("durationMins must be positive"),
        quality: z.string().optional(),
    }),
};

export const SleepValidation = {
    addSleepValidation,
};