
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

type ValidationSchema = {
    body?: z.ZodTypeAny;
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
};

export const validateRequest = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationSchema = z.object({
            body: schema.body || z.any(),
            params: schema.params || z.any(),
            query: schema.query || z.any(),
        });

        const result = validationSchema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors,
            });
        }

        req.body = result.data.body;

        next();
    };
};