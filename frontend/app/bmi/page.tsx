"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, Calculator, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type BMIRecord = {
    id: string;
    userId: string;
    weightKg: number;
    heightCm: number;
    bmiValue: number;
    category: "UNDERWEIGHT" | "NORMAL" | "OVERWEIGHT" | "OBESE";
    recordedAt: string;
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

const getCategoryStyle = (category: string) => {
    if (category === "NORMAL") return "bg-emerald-400/10 text-emerald-300";
    if (category === "UNDERWEIGHT") return "bg-sky-400/10 text-sky-300";
    if (category === "OVERWEIGHT") return "bg-yellow-400/10 text-yellow-300";
    return "bg-red-400/10 text-red-300";
};

export default function BMIPage() {
    const router = useRouter();

    const [weightKg, setWeightKg] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [history, setHistory] = useState<BMIRecord[]>([]);
    const [latestResult, setLatestResult] = useState<BMIRecord | null>(null);

    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchBMIHistory = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("vitalsync_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const response = await api.get("/bmi/history");
            const records = response.data.data as BMIRecord[];

            setHistory(records);
            setLatestResult(records[0] || null);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load BMI history"));

            if (getErrorStatus(error) === 401) {
                localStorage.removeItem("vitalsync_token");
                router.push("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchBMIHistory();
    }, [fetchBMIHistory]);

    const handleCalculateBMI = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setCalculating(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/bmi/calculate", {
                weightKg: Number(weightKg),
                heightCm: heightCm ? Number(heightCm) : undefined,
            });

            const result = response.data.data as BMIRecord;

            setLatestResult(result);
            setHistory((previous) => [result, ...previous]);
            setSuccessMessage("BMI calculated successfully");
            setWeightKg("");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to calculate BMI"));
        } finally {
            setCalculating(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                        <p className="text-slate-300">Loading BMI data...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                            <Activity size={28} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-emerald-300">
                                BMI Tracker
                            </p>
                            <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                Calculate your BMI
                            </h1>
                            <p className="mt-2 text-slate-400">
                                Track BMI history and monitor your health trend.
                            </p>
                        </div>
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
                        onSubmit={handleCalculateBMI}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                                <Calculator size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">BMI Calculator</h2>
                                <p className="text-sm text-slate-400">
                                    Height optional if profile height is set.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Weight in kg
                                </label>
                                <input
                                    value={weightKg}
                                    onChange={(event) => setWeightKg(event.target.value)}
                                    type="number"
                                    placeholder="70"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Height in cm
                                </label>
                                <input
                                    value={heightCm}
                                    onChange={(event) => setHeightCm(event.target.value)}
                                    type="number"
                                    placeholder="170"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={calculating}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.28)] transition hover:bg-emerald-300 disabled:opacity-70"
                            >
                                {calculating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Calculator size={18} />
                                        Calculate BMI
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-emerald-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-black">Latest Result</h2>
                                <p className="text-sm text-slate-400">
                                    Your most recent BMI record
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={fetchBMIHistory}
                                className="rounded-2xl bg-white/[0.07] p-3 text-slate-300 transition hover:bg-white/[0.12] hover:text-white"
                            >
                                <RefreshCw size={20} />
                            </button>
                        </div>

                        {latestResult ? (
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6">
                                <p className="text-sm text-slate-400">BMI Value</p>
                                <h3 className="mt-2 text-6xl font-black">
                                    {latestResult.bmiValue}
                                </h3>

                                <span
                                    className={`mt-5 inline-flex rounded-full px-4 py-2 text-sm font-black ${getCategoryStyle(
                                        latestResult.category
                                    )}`}
                                >
                                    {latestResult.category}
                                </span>

                                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-white/[0.05] p-4">
                                        <p className="text-sm text-slate-400">Weight</p>
                                        <p className="mt-2 text-2xl font-black">
                                            {latestResult.weightKg} kg
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-white/[0.05] p-4">
                                        <p className="text-sm text-slate-400">Height</p>
                                        <p className="mt-2 text-2xl font-black">
                                            {latestResult.heightCm} cm
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 text-slate-400">
                                No BMI record found. Calculate your first BMI.
                            </div>
                        )}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 }}
                    className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                >
                    <h2 className="text-2xl font-black">BMI History</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Your latest BMI records.
                    </p>

                    <div className="mt-6 space-y-3">
                        {history.length > 0 ? (
                            history.map((record) => (
                                <div
                                    key={record.id}
                                    className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-5 md:items-center"
                                >
                                    <div>
                                        <p className="text-sm text-slate-400">BMI</p>
                                        <p className="text-xl font-black">{record.bmiValue}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Category</p>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-black ${getCategoryStyle(
                                                record.category
                                            )}`}
                                        >
                                            {record.category}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Weight</p>
                                        <p className="font-bold">{record.weightKg} kg</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Height</p>
                                        <p className="font-bold">{record.heightCm} cm</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Date</p>
                                        <p className="font-bold">
                                            {new Date(record.recordedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white/[0.05] p-4 text-slate-400">
                                No BMI history yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardShell>
    );
}