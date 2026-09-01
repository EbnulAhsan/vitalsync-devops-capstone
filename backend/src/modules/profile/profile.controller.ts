import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { ProfileService } from "./profile.service";

const getMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }

        const result = await ProfileService.getMyProfile(userId);

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: result,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Failed to get profile";

        res.status(400).json({
            success: false,
            message,
        });
    }
};

const updateMyProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }

        const result = await ProfileService.updateMyProfile(userId, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: result,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to update profile";

        res.status(400).json({
            success: false,
            message,
        });
    }
};

export const ProfileController = {
    getMyProfile,
    updateMyProfile,
};
