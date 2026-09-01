"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Flag,
    History,
    Loader2,
    Plus,
    RefreshCw,
    Target,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type GoalType = "WEIGHT" | "WATER" | "SLEEP" | "CALORIES";
type GoalStatus = "ACTIVE" | "COMPLETED" | "FAILED";

type Goal = {
    id: string;
    userId: string;
    type: GoalType;
    targetValue: number;
    currentValue: number;
    deadline?: string | null;
    status: GoalStatus;
    createdAt: string;
    updatedAt: string;
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

const getStatusStyle = (status: GoalStatus) => {
    if (status === "ACTIVE") return "bg-emerald-400/10 text-emerald-300";
    if (status === "COMPLETED") return "bg-sky-400/10 text-sky-300";
    return "bg-red-400/10 text-red-300";
};

const getGoalUnit = (type: GoalType) => {
    if (type === "WATER") return "ml";
    if (type === "SLEEP") return "min";
    if (type === "WEIGHT") return "kg";
    return "cal";
};

export default function GoalsPage() {
    const router = useRouter();

    const [goals, setGoals] = useState<Goal[]>([]);

    const [type, setType] = useState<GoalType>("WATER");
    const [targetValue, setTargetValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [deadline, setDeadline] = useState("");

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [updatingId, setUpdatingId] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchGoals = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("vitalsync_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const response = await api.get("/goals");
            const records = response.data.data as Goal[];

            setGoals(records);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load goals"));

            if (getErrorStatus(error) === 401) {
                localStorage.removeItem("vitalsync_token");
                router.push("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleCreateGoal = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setCreating(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/goals", {
                type,
                targetValue: Number(targetValue),
                currentValue: currentValue ? Number(currentValue) : 0,
                deadline: deadline || undefined,
            });

            const newGoal = response.data.data as Goal;

            setGoals((previous) => [newGoal, ...previous]);

            setTargetValue("");
            setCurrentValue("");
            setDeadline("");
            setSuccessMessage("Goal created successfully");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to create goal"));
        } finally {
            setCreating(false);
        }
    };

    const handleCompleteGoal = async (goalId: string) => {
        try {
            setUpdatingId(goalId);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.patch(`/goals/${goalId}`, {
                status: "COMPLETED",
            });

            const updatedGoal = response.data.data as Goal;

            setGoals((previous) =>
                previous.map((goal) => (goal.id === goalId ? updatedGoal : goal))
            );

            setSuccessMessage("Goal marked as completed");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to update goal"));
        } finally {
            setUpdatingId("");
        }
    };

    const handleDeleteGoal = async (goalId: string) => {
        try {
            setUpdatingId(goalId);
            setErrorMessage("");
            setSuccessMessage("");

            await api.delete(`/goals/${goalId}`);

            setGoals((previous) => previous.filter((goal) => goal.id !== goalId));

            setSuccessMessage("Goal deleted successfully");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to delete goal"));
        } finally {
            setUpdatingId("");
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-violet-400 border-t-transparent" />
                        <p className="text-slate-300">Loading goals...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    const activeGoals = goals.filter((goal) => goal.status === "ACTIVE");
    const completedGoals = goals.filter((goal) => goal.status === "COMPLETED");

    return (
        <DashboardShell>
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
                >
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <Target size={30} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-violet-300">
                                    Goals Tracker
                                </p>
                                <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                    Build healthier targets
                                </h1>
                                <p className="mt-2 text-slate-400">
                                    Create, monitor, complete, and delete your health goals.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchGoals}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.07] px-5 py-3 font-bold text-slate-200 transition hover:bg-white/[0.12]"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>
                </motion.div>

                {errorMessage && (
                    <div className="mb-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {successMessage}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <motion.form
                        onSubmit={handleCreateGoal}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-violet-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <Plus size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">Create Goal</h2>
                                <p className="text-sm text-slate-400">
                                    Set a target for water, sleep, weight, or calories.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Goal type
                                </label>
                                <select
                                    value={type}
                                    onChange={(event) => setType(event.target.value as GoalType)}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-300/50"
                                >
                                    <option value="WATER">WATER</option>
                                    <option value="SLEEP">SLEEP</option>
                                    <option value="WEIGHT">WEIGHT</option>
                                    <option value="CALORIES">CALORIES</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Target value
                                </label>
                                <input
                                    value={targetValue}
                                    onChange={(event) => setTargetValue(event.target.value)}
                                    type="number"
                                    placeholder="2500"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Current value
                                </label>
                                <input
                                    value={currentValue}
                                    onChange={(event) => setCurrentValue(event.target.value)}
                                    type="number"
                                    placeholder="0"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Deadline
                                </label>
                                <input
                                    value={deadline}
                                    onChange={(event) => setDeadline(event.target.value)}
                                    type="date"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-violet-300/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={creating}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(167,139,250,0.25)] transition hover:bg-violet-300 disabled:opacity-70"
                            >
                                {creating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Create Goal
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-violet-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6">
                            <p className="text-sm text-violet-300">Overview</p>
                            <h2 className="mt-2 text-6xl font-black">{goals.length}</h2>
                            <p className="mt-2 text-slate-400">Total goals created</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Active</p>
                                <p className="mt-2 text-2xl font-black">
                                    {activeGoals.length}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Completed</p>
                                <p className="mt-2 text-2xl font-black">
                                    {completedGoals.length}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Failed</p>
                                <p className="mt-2 text-2xl font-black">
                                    {goals.filter((goal) => goal.status === "FAILED").length}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                >
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-400/15 text-purple-300">
                            <History size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black">Goals History</h2>
                            <p className="text-sm text-slate-400">
                                Manage your latest goals.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {goals.length > 0 ? (
                            goals.map((goal) => {
                                const unit = getGoalUnit(goal.type);
                                const progress = Math.min(
                                    Math.round((goal.currentValue / goal.targetValue) * 100),
                                    100
                                );

                                return (
                                    <div
                                        key={goal.id}
                                        className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                                    >
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-xl font-black">{goal.type}</p>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-black ${getStatusStyle(
                                                            goal.status
                                                        )}`}
                                                    >
                                                        {goal.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-sm text-slate-400">
                                                    {goal.currentValue} / {goal.targetValue} {unit}
                                                </p>

                                                {goal.deadline && (
                                                    <p className="mt-1 text-sm text-slate-500">
                                                        Deadline:{" "}
                                                        {new Date(goal.deadline).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                {goal.status !== "COMPLETED" && (
                                                    <button
                                                        type="button"
                                                        disabled={updatingId === goal.id}
                                                        onClick={() => handleCompleteGoal(goal.id)}
                                                        className="flex items-center gap-2 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20 disabled:opacity-60"
                                                    >
                                                        <CheckCircle2 size={17} />
                                                        Complete
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    disabled={updatingId === goal.id}
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="flex items-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/20 disabled:opacity-60"
                                                >
                                                    <Trash2 size={17} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-full bg-white/[0.08] p-1">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                                className="h-3 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
                                            />
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                                            <span>Progress</span>
                                            <span>{progress}%</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="rounded-2xl bg-white/[0.05] p-4 text-slate-400">
                                No goals created yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardShell>
    );
}