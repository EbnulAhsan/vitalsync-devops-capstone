"use client";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { api } from "@/lib/api";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, Loader2, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileResponse = {
    id: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    profile: {
        id: string;
        userId: string;
        fullName?: string | null;
        avatarUrl?: string | null;
        gender?: "MALE" | "FEMALE" | "OTHER" | null;
        dateOfBirth?: string | null;
        heightCm?: number | null;
        activityLevel?:
        | "SEDENTARY"
        | "LIGHT"
        | "MODERATE"
        | "ACTIVE"
        | "VERY_ACTIVE"
        | null;
        createdAt: string;
        updatedAt: string;
    } | null;
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

const formatDateForInput = (date?: string | null) => {
    if (!date) return "";

    return new Date(date).toISOString().split("T")[0];
};

export default function ProfilePage() {
    const router = useRouter();

    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);

    const [fullName, setFullName] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [heightCm, setHeightCm] = useState("");
    const [activityLevel, setActivityLevel] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const token = localStorage.getItem("vitalsync_token");

                if (!token) {
                    router.push("/auth/login");
                    return;
                }

                const response = await api.get("/profile/me");
                const data = response.data.data as ProfileResponse;

                setProfileData(data);
                setFullName(data.profile?.fullName || "");
                setGender(data.profile?.gender || "");
                setDateOfBirth(formatDateForInput(data.profile?.dateOfBirth));
                setHeightCm(data.profile?.heightCm ? String(data.profile.heightCm) : "");
                setActivityLevel(data.profile?.activityLevel || "");
            } catch (error: unknown) {
                setErrorMessage(getErrorMessage(error, "Failed to load profile"));

                if (getErrorStatus(error) === 401) {
                    localStorage.removeItem("vitalsync_token");
                    router.push("/auth/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setSaving(true);
            setErrorMessage("");
            setSuccessMessage("");

            const payload = {
                fullName: fullName || undefined,
                gender: gender || undefined,
                dateOfBirth: dateOfBirth || undefined,
                heightCm: heightCm ? Number(heightCm) : undefined,
                activityLevel: activityLevel || undefined,
            };

            const response = await api.patch("/profile/me", payload);

            setSuccessMessage("Profile updated successfully");
            setProfileData((previous) => {
                if (!previous) return previous;

                return {
                    ...previous,
                    profile: response.data.data,
                };
            });
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error, "Failed to update profile"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardShell>
                <div className="flex min-h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent" />
                        <p className="text-slate-300">Loading profile...</p>
                    </div>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                            <User size={28} />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-emerald-300">
                                Profile Settings
                            </p>
                            <h1 className="mt-1 text-3xl font-black md:text-5xl">
                                Manage your profile
                            </h1>
                            <p className="mt-2 text-slate-400">{profileData?.email}</p>
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

                <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/15 text-violet-300">
                                <Activity size={24} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-black">Account Overview</h2>
                                <p className="text-sm text-slate-400">Basic account details</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Full Name</p>
                                <p className="mt-2 text-xl font-black">
                                    {profileData?.profile?.fullName || "Not set"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Email</p>
                                <p className="mt-2 break-all text-xl font-black">
                                    {profileData?.email}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Height</p>
                                <p className="mt-2 text-xl font-black">
                                    {profileData?.profile?.heightCm
                                        ? `${profileData.profile.heightCm} cm`
                                        : "Not set"}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white/[0.05] p-4">
                                <p className="text-sm text-slate-400">Activity Level</p>
                                <p className="mt-2 text-xl font-black">
                                    {profileData?.profile?.activityLevel || "Not set"}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        onSubmit={handleUpdateProfile}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl"
                    >
                        <h2 className="text-2xl font-black">Update Profile</h2>
                        <p className="mt-2 text-sm text-slate-400">
                            Keep your health profile accurate for better tracking.
                        </p>

                        <div className="mt-6 grid gap-5">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">
                                    Full name
                                </label>
                                <input
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    placeholder="MD. Ebnul Ahsan"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/50"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-300/50"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Date of birth
                                    </label>
                                    <input
                                        value={dateOfBirth}
                                        onChange={(event) => setDateOfBirth(event.target.value)}
                                        type="date"
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-emerald-300/50"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
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

                                <div>
                                    <label className="mb-2 block text-sm text-slate-300">
                                        Activity level
                                    </label>
                                    <select
                                        value={activityLevel}
                                        onChange={(event) => setActivityLevel(event.target.value)}
                                        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-300/50"
                                    >
                                        <option value="">Select activity</option>
                                        <option value="SEDENTARY">SEDENTARY</option>
                                        <option value="LIGHT">LIGHT</option>
                                        <option value="MODERATE">MODERATE</option>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="VERY_ACTIVE">VERY_ACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 font-black text-slate-950 shadow-[0_18px_50px_rgba(52,211,153,0.28)] transition hover:bg-emerald-300 disabled:opacity-70"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </DashboardShell>
    );
}