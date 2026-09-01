import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import AppError from "../../error/AppError";

type RegisterPayload = {
    fullName?: string;
    email: string;
    password: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

const registerUser = async (payload: RegisterPayload) => {
    const { fullName, email, password } = payload;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new AppError(400, "User already exists with this email");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            profile: fullName
                ? {
                    create: {
                        fullName,
                    },
                }
                : undefined,
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

    return user;
};

const loginUser = async (payload: LoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            profile: true,
        },
    });

    if (!user) {
        throw new AppError(401, "Invalid email or password");
    }

    const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatched) {
        throw new AppError(401, "Invalid email or password");
    }

    if (!process.env.JWT_ACCESS_SECRET) {
        throw new AppError(500, "JWT access secret is not configured");
    }

    const accessToken = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "7d",
        }
    );

    return {
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            profile: user.profile,
            createdAt: user.createdAt,
        },
    };
};

export const AuthService = {
    registerUser,
    loginUser,
};