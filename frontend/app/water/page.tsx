"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import {
    Droplets,
    GlassWater,
    History,
    Loader2,
    Plus,
    RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type WaterRecord = {
    id: string;
    userId: string;
    amountMl: number;
    recordedAt: string;
};

type TodayWaterResponse = {
    totalAmountMl: number;
    totalAmountLiter: number;
    records: WaterRecord[];
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

const waterGoalMl = 2500;

const quickAmounts = [250, 500, 750, 1000];

export default function WaterPage() {
    const router = useRouter();

    const [amountMl, setAmountMl] = useState("");
    const [todayWater, setTodayWater] = useState<TodayWaterResponse | null>(null);
    const [history, setHistory] = useState<WaterRecord[]>([]);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchWaterData = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("vitalsync_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const [todayResponse, historyResponse] = await Promise.all([
                api.get("/water/today"),
                api.get("/water/history"),
            ]);

            setTodayWater(todayResponse.data.data as TodayWaterResponse);
            setHistory(historyResponse.data.data as WaterRecord[]);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load water data"));

            if (getErrorStatus(error) === 401) {
                localStorage.removeItem("vitalsync_token");
                router.push("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWaterData();
    }, []);

    const handleAddWater = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setAdding(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/water/add", {
                amountMl: Number(amountMl),
            });

            const newRecord = response.data.data as WaterRecord;

            setHistory((previous) => [newRecord, ...previous]);

            setTodayWater((previous) => {
                const previousTotal = previous?.totalAmountMl || 0;
                const updatedTotal = previousTotal + newRecord.amountMl;

                return {
                    totalAmountMl: updatedTotal,
                    totalAmountLiter: Number((updatedTotal / 1000).toFixed(2)),
                    records: [newRecord, ...(previous?.records || [])],
                };
            });

            setAmountMl("");
            setSuccessMessage("Water intake added successfully");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to add water intake"));
        } finally {
            setAdding(false);
        }
    };

    const handleQuickAdd = async (value: number) => {
        try {
            setAdding(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/water/add", {
                amountMl: value,
            });

            const newRecord = response.data.data as WaterRecord;

            setHistory((previous) => [newRecord, ...previous]);

            setTodayWater((previous) => {
                const previousTotal = previous?.totalAmountMl || 0;
                const updatedTotal = previousTotal + newRecord.amountMl;

                return {
                    totalAmountMl: updatedTotal,
                    totalAmountLiter: Number((updatedTotal / 1000).toFixed(2)),
                    records: [newRecord, ...(previous?.records || [])],
                };
            });

            setSuccessMessage(`${value} ml water added successfully`);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to add water intake"));
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                        <p className="text-slate-300">Loading water data...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    const totalAmountMl = todayWater?.totalAmountMl || 0;
    const totalAmountLiter = todayWater?.totalAmountLiter || 0;
    const progressPercent = Math.min(
        Math.round((totalAmountMl / waterGoalMl) * 100),
        100
    );

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
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                                <Droplets size={30} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-cyan-300">
                                    Water Tracker
                                </p>
                                <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                    Stay hydrated
                                </h1>
                                <p className="mt-2 text-slate-400">
                                    Track todays water intake and build a healthy habit.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchWaterData}
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
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300">
                                <GlassWater size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">Add Water</h2>
                                <p className="text-sm text-slate-400">
                                    Add your water intake in milliliters.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAddWater} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Amount in ml
                                </label>
                                <input
                                    value={amountMl}
                                    onChange={(event) => setAmountMl(event.target.value)}
                                    type="number"
                                    placeholder="250"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(34,211,238,0.23)] transition hover:bg-cyan-300 disabled:opacity-70"
                            >
                                {adding ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Add Water
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-bold text-slate-300">
                                Quick add
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {quickAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        disabled={adding}
                                        onClick={() => handleQuickAdd(amount)}
                                        className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 font-black text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-cyan-400/10 disabled:opacity-60"
                                    >
                                        +{amount} ml
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6">
                            <p className="text-sm text-cyan-300">Today's Progress</p>
                            <h2 className="mt-2 text-6xl font-black">{totalAmountLiter}L</h2>
                            <p className="mt-2 text-slate-400">
                                {totalAmountMl} ml of {waterGoalMl} ml goal
                            </p>
                        </div>

                        <div className="rounded-full bg-white/[0.08] p-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="h-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <p className="text-slate-400">Progress</p>
                            <p className="font-black text-cyan-300">{progressPercent}%</p>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Records</p>
                                <p className="mt-2 text-2xl font-black">
                                    {todayWater?.records.length || 0}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Goal</p>
                                <p className="mt-2 text-2xl font-black">2.5L</p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Remaining</p>
                                <p className="mt-2 text-2xl font-black">
                                    {Math.max(waterGoalMl - totalAmountMl, 0)} ml
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
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-300">
                            <History size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black">Water History</h2>
                            <p className="text-sm text-slate-400">
                                Latest water intake records.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.map((record) => (
                                <div
                                    key={record.id}
                                    className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-3 md:items-center"
                                >
                                    <div>
                                        <p className="text-sm text-slate-400">Amount</p>
                                        <p className="text-xl font-black">{record.amountMl} ml</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Liter</p>
                                        <p className="font-bold">
                                            {(record.amountMl / 1000).toFixed(2)}L
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Date</p>
                                        <p className="font-bold">
                                            {new Date(record.recordedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white/[0.05] p-4 text-slate-400">
                                No water history yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardShell>
    );
}