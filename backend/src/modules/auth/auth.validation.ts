import { z } from "zod";

const registerValidation = {
    body: z.object({
        fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    }),
};

const loginValidation = {
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(1, "Password is required"),
    }),
};

export const AuthValidation = {
    registerValidation,
    loginValidation,
};