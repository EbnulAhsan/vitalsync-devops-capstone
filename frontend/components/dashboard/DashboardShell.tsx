"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Activity,
    Droplets,
    Home,
    LogOut,
    Moon,
    Scale,
    Target,
    User,
} from "lucide-react";

type DashboardShellProps = {
    children: ReactNode;
};

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: Home,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: User,
    },
    {
        label: "BMI",
        path: "/bmi",
        icon: Activity,
    },
    {
        label: "Water",
        path: "/water",
        icon: Droplets,
    },
    {
        label: "Sleep",
        path: "/sleep",
        icon: Moon,
    },
    {
        label: "Weight",
        path: "/weight",
        icon: Scale,
    },
    {
        label: "Goals",
        path: "/goals",
        icon: Target,
    },
];

export default function DashboardShell({ children }: DashboardShellProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem("vitalsync_token");
        router.push("/auth/login");
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.12),transparent_34%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />

            <div className="relative z-10 flex min-h-screen">
                {/* Desktop Sidebar */}
                <aside className="hidden w-72 border-r border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl lg:block">
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="mb-8 flex items-center gap-3"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/25">
                            <Activity size={24} />
                        </div>

                        <p className="text-2xl font-black tracking-tight">
                            Vital<span className="gradient-text">Sync</span>
                        </p>
                    </button>

                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <button
                                    key={item.path}
                                    type="button"
                                    onClick={() => router.push(item.path)}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${isActive
                                        ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                                        : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
                                        }`}
                                >
                                    <Icon size={19} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-8 flex w-full items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>
                </aside>

                {/* Main Content */}
                <section className="flex-1">
                    {/* Mobile Header */}
                    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur-xl lg:hidden">
                        <div className="mb-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => router.push("/dashboard")}
                                className="flex items-center gap-3"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                                    <Activity size={21} />
                                </div>

                                <p className="text-xl font-black">
                                    Vital<span className="gradient-text">Sync</span>
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200"
                            >
                                Logout
                            </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;

                                return (
                                    <button
                                        key={item.path}
                                        type="button"
                                        onClick={() => router.push(item.path)}
                                        className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${isActive
                                            ? "bg-emerald-400 text-slate-950"
                                            : "bg-white/[0.07] text-slate-300"
                                            }`}
                                    >
                                        <Icon size={15} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </header>

                    <div className="px-5 py-6 lg:px-8 lg:py-8">{children}</div>
                </section>
            </div>
        </main>
    );
}