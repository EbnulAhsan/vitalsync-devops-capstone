import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    return res.status(statusCode).json({
        success: false,
        message,
        error:
            process.env.NODE_ENV === "development"
                ? {
                    name: error.name,
                    stack: error.stack,
                }
                : undefined,
    });
};