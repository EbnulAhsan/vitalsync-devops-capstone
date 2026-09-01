import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ProfileController } from "./profile.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ProfileValidation } from "./profile.validation";

const router = express.Router();

router.get("/me", authMiddleware, ProfileController.getMyProfile);

router.patch(
    "/me",
    authMiddleware,
    validateRequest(ProfileValidation.updateProfileValidation),
    ProfileController.updateMyProfile
);

export default router;