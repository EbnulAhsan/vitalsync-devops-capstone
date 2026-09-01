import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route";
import profileRoutes from "./modules/profile/profile.route";
import bmiRoutes from "./modules/bmi/bmi.route";
import waterRoutes from "./modules/water/water.route";
import sleepRoutes from "./modules/sleep/sleep.route";
import weightRoutes from "./modules/weight/weight.route";
import goalRoutes from "./modules/goals/goal.route";
import dashboardRoutes from "./modules/dashboard/dashboard.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";



const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "VitalSync Backend API is running 🚀",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

// All API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/bmi", bmiRoutes);
app.use("/api/v1/water", waterRoutes);
app.use("/api/v1/sleep", sleepRoutes);
app.use("/api/v1/weight", weightRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;