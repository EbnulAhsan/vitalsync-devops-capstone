"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import {
    BedDouble,
    History,
    Loader2,
    Moon,
    Plus,
    RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type SleepRecord = {
    id: string;
    userId: string;
    durationMins: number;
    quality?: string | null;
    recordedAt: string;
};

type TodaySleepResponse = {
    totalDurationMins: number;
    totalDurationHours: number;
    records: SleepRecord[];
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

const sleepGoalMins = 480;

const quickDurations = [
    { label: "6h", value: 360 },
    { label: "7h", value: 420 },
    { label: "8h", value: 480 },
    { label: "9h", value: 540 },
];

export default function SleepPage() {
    const router = useRouter();

    const [durationMins, setDurationMins] = useState("");
    const [quality, setQuality] = useState("");

    const [todaySleep, setTodaySleep] = useState<TodaySleepResponse | null>(null);
    const [history, setHistory] = useState<SleepRecord[]>([]);

    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchSleepData = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("vitalsync_token");

            if (!token) {
                router.push("/auth/login");
                return;
            }

            const [todayResponse, historyResponse] = await Promise.all([
                api.get("/sleep/today"),
                api.get("/sleep/history"),
            ]);

            setTodaySleep(todayResponse.data.data as TodaySleepResponse);
            setHistory(historyResponse.data.data as SleepRecord[]);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to load sleep data"));

            if (getErrorStatus(error) === 401) {
                localStorage.removeItem("vitalsync_token");
                router.push("/auth/login");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchSleepData();
    }, [fetchSleepData]);

    const addSleepRecordToState = (newRecord: SleepRecord) => {
        setHistory((previous) => [newRecord, ...previous]);

        setTodaySleep((previous) => {
            const previousTotal = previous?.totalDurationMins || 0;
            const updatedTotal = previousTotal + newRecord.durationMins;

            return {
                totalDurationMins: updatedTotal,
                totalDurationHours: Number((updatedTotal / 60).toFixed(2)),
                records: [newRecord, ...(previous?.records || [])],
            };
        });
    };

    const handleAddSleep = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setAdding(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/sleep/add", {
                durationMins: Number(durationMins),
                quality: quality || undefined,
            });

            const newRecord = response.data.data as SleepRecord;

            addSleepRecordToState(newRecord);

            setDurationMins("");
            setQuality("");
            setSuccessMessage("Sleep record added successfully");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to add sleep record"));
        } finally {
            setAdding(false);
        }
    };

    const handleQuickAdd = async (value: number) => {
        try {
            setAdding(true);
            setErrorMessage("");
            setSuccessMessage("");

            const response = await api.post("/sleep/add", {
                durationMins: value,
                quality: "GOOD",
            });

            const newRecord = response.data.data as SleepRecord;

            addSleepRecordToState(newRecord);

            setSuccessMessage(`${value / 60}h sleep added successfully`);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to add sleep record"));
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-violet-400 border-t-transparent" />
                        <p className="text-slate-300">Loading sleep data...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    const totalDurationMins = todaySleep?.totalDurationMins || 0;
    const totalDurationHours = todaySleep?.totalDurationHours || 0;
    const progressPercent = Math.min(
        Math.round((totalDurationMins / sleepGoalMins) * 100),
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
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <Moon size={30} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-violet-300">
                                    Sleep Tracker
                                </p>
                                <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                    Track your sleep
                                </h1>
                                <p className="mt-2 text-slate-400">
                                    Log sleep duration and monitor your daily rest pattern.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={fetchSleepData}
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
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-violet-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <BedDouble size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">Add Sleep</h2>
                                <p className="text-sm text-slate-400">
                                    Add sleep duration in minutes.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAddSleep} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Duration in minutes
                                </label>
                                <input
                                    value={durationMins}
                                    onChange={(event) => setDurationMins(event.target.value)}
                                    type="number"
                                    placeholder="420"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-300/50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Quality
                                </label>
                                <select
                                    value={quality}
                                    onChange={(event) => setQuality(event.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-violet-300/50"
                                >
                                    <option value="">Select quality</option>
                                    <option value="POOR">POOR</option>
                                    <option value="AVERAGE">AVERAGE</option>
                                    <option value="GOOD">GOOD</option>
                                    <option value="EXCELLENT">EXCELLENT</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={adding}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(167,139,250,0.25)] transition hover:bg-violet-300 disabled:opacity-70"
                            >
                                {adding ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />
                                        Add Sleep
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <p className="mb-3 text-sm font-bold text-slate-300">
                                Quick add
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {quickDurations.map((item) => (
                                    <button
                                        key={item.value}
                                        type="button"
                                        disabled={adding}
                                        onClick={() => handleQuickAdd(item.value)}
                                        className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 font-black text-violet-200 transition hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-400/10 disabled:opacity-60"
                                    >
                                        +{item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl transition duration-300 hover:border-violet-300/20 hover:bg-white/[0.075]"
                    >
                        <div className="mb-6">
                            <p className="text-sm text-violet-300">Today&apos;s Sleep</p>
                            <h2 className="mt-2 text-6xl font-black">
                                {totalDurationHours}h
                            </h2>
                            <p className="mt-2 text-slate-400">
                                {totalDurationMins} mins of 480 mins goal
                            </p>
                        </div>

                        <div className="rounded-full bg-white/[0.08] p-1">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                                className="h-4 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
                            />
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm">
                            <p className="text-slate-400">Progress</p>
                            <p className="font-black text-violet-300">{progressPercent}%</p>
                        </div>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Records</p>
                                <p className="mt-2 text-2xl font-black">
                                    {todaySleep?.records.length || 0}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Goal</p>
                                <p className="mt-2 text-2xl font-black">8h</p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Remaining</p>
                                <p className="mt-2 text-2xl font-black">
                                    {Math.max(sleepGoalMins - totalDurationMins, 0)} min
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
                            <h2 className="text-2xl font-black">Sleep History</h2>
                            <p className="text-sm text-slate-400">
                                Latest sleep records.
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
                                        <p className="text-sm text-slate-400">Duration</p>
                                        <p className="text-xl font-black">
                                            {(record.durationMins / 60).toFixed(2)}h
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Minutes</p>
                                        <p className="font-bold">{record.durationMins} min</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">Quality</p>
                                        <p className="font-bold">{record.quality || "N/A"}</p>
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
                                No sleep history yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardShell>
    );
}