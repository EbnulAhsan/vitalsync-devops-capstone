import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { GoalController } from "./goal.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { GoalValidation } from "./goal.validation";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validateRequest(GoalValidation.createGoalValidation),
    GoalController.createGoal
);

router.get("/", authMiddleware, GoalController.getMyGoals);

router.get(
    "/:id",
    authMiddleware,
    validateRequest(GoalValidation.goalIdParamsValidation),
    GoalController.getGoalById
);

router.patch(
    "/:id",
    authMiddleware,
    validateRequest(GoalValidation.updateGoalValidation),
    GoalController.updateGoal
);

router.delete(
    "/:id",
    authMiddleware,
    validateRequest(GoalValidation.goalIdParamsValidation),
    GoalController.deleteGoal
);

export default router;