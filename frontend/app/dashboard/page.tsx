"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, Droplets, Moon, Scale, Target, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DashboardSummary = {
    user: {
        id: string;
        email: string;
        role: string;
        isEmailVerified: boolean;
        profile: {
            fullName?: string | null;
            heightCm?: number | null;
            activityLevel?: string | null;
        } | null;
    };
    health: {
        latestBMI: {
            bmiValue: number;
            category: string;
        } | null;
        latestWeight: {
            weightKg: number;
        } | null;
    };
    today: {
        water: {
            totalAmountMl: number;
            totalAmountLiter: number;
            recordsCount: number;
        };
        sleep: {
            totalDurationMins: number;
            totalDurationHours: number;
            recordsCount: number;
        };
    };
    goals: {
        activeGoalsCount: number;
        activeGoals: {
            id: string;
            type: string;
            targetValue: number;
            currentValue: number;
            status: string;
        }[];
    };
};

const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as { message?: string } | undefined;
        return responseData?.message || fallback;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
};

const getErrorStatus = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.status;
    }

    return undefined;
};

export default function DashboardPage() {
    const router = useRouter();

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const token = localStorage.getItem("vitalsync_token");

                if (!token) {
                    router.push("/auth/login");
                    return;
                }

                const response = await api.get("/dashboard/summary");
                setSummary(response.data.data);
            } catch (error: unknown) {
                setErrorMessage(getErrorMessage(error, "Failed to load dashboard"));

                if (getErrorStatus(error) === 401) {
                    localStorage.removeItem("vitalsync_token");
                    router.push("/auth/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [router]);

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                        <p className="text-slate-300">Loading dashboard...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    const fullName = summary?.user.profile?.fullName || "VitalSync User";
    const email = summary?.user.email || "No email";
    const bmiValue = summary?.health.latestBMI?.bmiValue || "No data";
    const bmiCategory = summary?.health.latestBMI?.category || "Calculate BMI";
    const waterLiter = summary?.today.water.totalAmountLiter || 0;
    const waterMl = summary?.today.water.totalAmountMl || 0;
    const sleepHours = summary?.today.sleep.totalDurationHours || 0;
    const sleepMins = summary?.today.sleep.totalDurationMins || 0;
    const weight = summary?.health.latestWeight?.weightKg || "No data";
    const activeGoals = summary?.goals.activeGoals || [];

    return (
        <DashboardShell>
            <div className="mx-auto max-w-7xl">
                <motion.header
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
                >
                    <p className="text-sm font-semibold text-emerald-300">
                        Welcome back
                    </p>

                    <h1 className="mt-2 text-3xl font-black md:text-5xl">{fullName}</h1>

                    <p className="mt-2 text-slate-400">{email}</p>
                </motion.header>

                {errorMessage && (
                    <div className="mb-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {errorMessage}
                    </div>
                )}

                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-400 text-slate-950">
                            <Activity size={26} />
                        </div>
                        <p className="text-sm text-slate-400">Latest BMI</p>
                        <h2 className="mt-2 text-4xl font-black">{bmiValue}</h2>
                        <p className="mt-2 text-sm text-slate-400">{bmiCategory}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-400 text-slate-950">
                            <Droplets size={26} />
                        </div>
                        <p className="text-sm text-slate-400">Today Water</p>
                        <h2 className="mt-2 text-4xl font-black">{waterLiter}L</h2>
                        <p className="mt-2 text-sm text-slate-400">{waterMl} ml total</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-purple-400 text-slate-950">
                            <Moon size={26} />
                        </div>
                        <p className="text-sm text-slate-400">Today Sleep</p>
                        <h2 className="mt-2 text-4xl font-black">{sleepHours}h</h2>
                        <p className="mt-2 text-sm text-slate-400">{sleepMins} mins total</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-400 text-slate-950">
                            <Scale size={26} />
                        </div>
                        <p className="text-sm text-slate-400">Latest Weight</p>
                        <h2 className="mt-2 text-4xl font-black">
                            {typeof weight === "number" ? `${weight}kg` : weight}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">Latest saved weight</p>
                    </motion.div>
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                                <User size={24} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black">Profile Overview</h3>
                                <p className="text-sm text-slate-400">
                                    Your basic health profile
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Height</p>
                                <p className="mt-2 text-2xl font-black">
                                    {summary?.user.profile?.heightCm
                                        ? `${summary.user.profile.heightCm} cm`
                                        : "Not set"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Activity</p>
                                <p className="mt-2 text-2xl font-black">
                                    {summary?.user.profile?.activityLevel || "Not set"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Role</p>
                                <p className="mt-2 text-2xl font-black">
                                    {summary?.user.role || "USER"}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <Target size={24} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-black">Active Goals</h3>
                                <p className="text-sm text-slate-400">
                                    {activeGoals.length} active goals
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {activeGoals.length > 0 ? (
                                activeGoals.slice(0, 4).map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold">{goal.type}</p>
                                            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                                {goal.status}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-slate-400">
                                            {goal.currentValue} / {goal.targetValue}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="rounded-2xl bg-white/[0.05] p-4 text-slate-400">
                                    No active goals yet.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </section>
            </div>
        </DashboardShell>
    );
}