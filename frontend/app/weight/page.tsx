"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import {
    History,
    Loader2,
    Plus,
    RefreshCw,
    Scale,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type WeightRecord = {
    id: string;
    userId: string;
    weightKg: number;
    note?: string | null;
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

export default function WeightPage() {
    const router = useRouter();

    const [weightKg, setWeightKg] = useState("");
    const [note, setNote] = useState("");

    const [latestWeight, setLatestWeight] = useState<WeightRecord | null>(null);
    const [history, setHistory] = useState<WeightRecord[]>([]);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchWeightData = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("vitalsync_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const historyResponse = await api.get("/weight/history");
            const records = historyResponse.data.data as WeightRecord[];

            setHistory(records);
            setLatestWeight(records[0] || null);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load weight data"));

            if (getErrorStatus(error) === 401) {
                localStorage.removeItem("vitalsync_token");
                router.push("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchWeightData();
    }, [fetchWeightData]);

    const handleAddWeight = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setAdding(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/weight/add", {
                weightKg: Number(weightKg),
                note: note || undefined,
            });

            const newRecord = response.data.data as WeightRecord;

            setLatestWeight(newRecord);
            setHistory((previous) => [newRecord, ...previous]);

            setWeightKg("");
            setNote("");
            setSuccessMessage("Weight record added successfully");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to add weight record"));
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-pink-400 border-t-transparent" />
                        <p className="text-slate-300">Loading weight data...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    const firstRecord = history[history.length - 1];
    const weightChange =
        latestWeight && firstRecord
            ? Number((latestWeight.weightKg - firstRecord.weightKg).toFixed(1))
            : 0;

    const isLoss = weightChange < 0;
    const isGain = weightChange > 0;

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
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-400/15 text-pink-300">
                                <Scale size={30} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-pink-300">
                                    Weight Tracker
                                </p>
                                <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                    Track your weight
                                </h1>
                                <p className="mt-2 text-slate-400">
                                    Add weight records and monitor your progress over time.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchWeightData}
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
                        onSubmit={handleAddWeight}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-pink-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-400/15 text-pink-300">
                                <Plus size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">Add Weight</h2>
                                <p className="text-sm text-slate-400">
                                    Save your latest weight record.
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
                                    placeholder="69.5"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-pink-300/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Note
                                </label>
                                <input
                                    value={note}
                                    onChange={(event) => setNote(event.target.value)}
                                    type="text"
                                    placeholder="Morning weight"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-pink-300/50"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(244,114,182,0.24)] transition hover:bg-pink-300 disabled:opacity-70"
                            >
                                {adding ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Add Weight
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-pink-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6">
                            <p className="text-sm text-pink-300">Latest Weight</p>

                            <h2 className="mt-2 text-6xl font-black">
                                {latestWeight ? `${latestWeight.weightKg}kg` : "No data"}
                            </h2>

                            <p className="mt-2 text-slate-400">
                                {latestWeight
                                    ? new Date(latestWeight.recordedAt).toLocaleString()
                                    : "Add your first weight record"}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Total Records</p>
                                <p className="mt-2 text-2xl font-black">{history.length}</p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Change</p>
                                <p
                                    className={`mt-2 flex items-center gap-2 text-2xl font-black ${isLoss
                                        ? "text-emerald-300"
                                        : isGain
                                            ? "text-yellow-300"
                                            : "text-slate-200"
                                        }`}
                                >
                                    {isLoss && <TrendingDown size={22} />}
                                    {isGain && <TrendingUp size={22} />}
                                    {weightChange}kg
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">First Record</p>
                                <p className="mt-2 text-2xl font-black">
                                    {firstRecord ? `${firstRecord.weightKg}kg` : "N/A"}
                                </p>
                            </div>
                        </div>

                        {latestWeight?.note && (
                            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Latest Note</p>
                                <p className="mt-2 font-bold">{latestWeight.note}</p>
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
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/15 text-rose-300">
                            <History size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black">Weight History</h2>
                            <p className="text-sm text-slate-400">
                                Latest weight records.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.map((record) => (
                                <div
                                    key={record.id}
                                    className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:grid-cols-4 md:items-center"
                                >
                                    <div>
                                        <p className="text-sm text-slate-400">Weight</p>
                                        <p className="text-xl font-black">{record.weightKg} kg</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Note</p>
                                        <p className="font-bold">{record.note || "N/A"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Date</p>
                                        <p className="font-bold">
                                            {new Date(record.recordedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Time</p>
                                        <p className="font-bold">
                                            {new Date(record.recordedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white/[0.05] p-4 text-slate-400">
                                No weight history yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardShell>
    );
}