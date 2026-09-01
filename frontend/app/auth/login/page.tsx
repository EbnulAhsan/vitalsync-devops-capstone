"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { api } from "@/lib/api";

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

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const token = response.data.data.accessToken;

            localStorage.setItem("vitalsync_token", token);

            router.push("/dashboard");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.16),transparent_34%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="glass-card relative z-10 w-full max-w-md rounded-[2rem] p-8"
            >
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="mb-7 flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back home
                </button>

                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25">
                        <Activity size={24} />
                    </div>

                    <div>
                        <h1 className="text-3xl font-black">Welcome back</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Login to your VitalSync dashboard.
                        </p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-slate-300">Email</label>
                        <input
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            type="password"
                            placeholder="Your password"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.28)] transition hover:bg-emerald-300 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    New to VitalSync?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/auth/register")}
                        className="font-bold text-emerald-300 transition hover:text-emerald-200"
                    >
                        Create account
                    </button>
                </p>
            </motion.div>
        </main>
    );
}