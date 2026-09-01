import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router.post(
    "/register",
    validateRequest(AuthValidation.registerValidation),
    AuthController.registerUser
);

router.post(
    "/login",
    validateRequest(AuthValidation.loginValidation),
    AuthController.loginUser
);

export default router;