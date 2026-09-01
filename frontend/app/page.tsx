"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Droplets,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

const features = [
  {
    title: "BMI Tracking",
    description: "Calculate BMI and monitor your health trend with clean history.",
    icon: Activity,
    color: "from-emerald-400 to-teal-400",
  },
  {
    title: "Water Intake",
    description: "Track daily water intake and stay consistent with healthy habits.",
    icon: Droplets,
    color: "from-cyan-400 to-blue-400",
  },
  {
    title: "Sleep Insights",
    description: "Log sleep duration and understand your daily rest pattern.",
    icon: Moon,
    color: "from-violet-400 to-purple-400",
  },
  {
    title: "Smart Goals",
    description: "Create health goals and follow your progress from one dashboard.",
    icon: Target,
    color: "from-pink-400 to-rose-400",
  },
];

const stats = [
  {
    label: "Today's Water",
    value: "2.5L",
  },
  {
    label: "Sleep",
    value: "7.2h",
  },
  {
    label: "BMI",
    value: "24.2",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.25),transparent_34%),radial-gradient(circle_at_50%_85%,rgba(168,85,247,0.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 ring-1 ring-emerald-300/25">
              <Activity className="text-emerald-300" size={24} />
            </div>

            <p className="text-2xl font-black tracking-tight">
              Vital<span className="gradient-text">Sync</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="hidden items-center gap-3 sm:flex"
          >
            <Link
              href="/auth/login"
              className="rounded-full px-5 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-xl shadow-white/10 transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              Get Started
            </Link>
          </motion.div>
        </nav>

        {/* Hero */}
        <section className="mx-auto grid min-h-[calc(100vh-100px)] max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200"
            >
              <Sparkles size={16} />
              Modern health tracking companion
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white md:text-7xl"
            >
              Track your health with{" "}
              <span className="gradient-text">beautiful simplicity.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl"
            >
              Monitor BMI, water, sleep, weight, and goals from one smooth,
              animated, modern dashboard built for daily consistency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/auth/register"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-400 px-7 py-4 text-base font-black text-slate-950 shadow-2xl shadow-emerald-500/25 transition hover:-translate-y-1 hover:bg-emerald-300"
              >
                Start Tracking
                <ArrowRight
                  size={20}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/auth/login"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
              >
                I already have an account
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mt-10 flex flex-wrap gap-4 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-300" />
                Secure JWT Auth
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-sky-300" />
                Real-time Dashboard
              </div>
            </motion.div>
          </div>

          {/* Right Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="glass-card relative rounded-[2.2rem] p-5 md:p-7"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Dashboard Preview</p>
                  <h2 className="mt-1 text-2xl font-black text-white">
                    Health Overview
                  </h2>
                </div>

                <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300 ring-1 ring-emerald-300/20">
                  <Activity size={24} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.08 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-3xl font-black text-white">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 + index * 0.08 }}
                      className="group rounded-3xl border border-white/10 bg-white/[0.055] p-5 transition hover:-translate-y-1 hover:bg-white/[0.09]"
                    >
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-slate-950 shadow-lg`}
                      >
                        <Icon size={24} />
                      </div>

                      <h3 className="text-lg font-black text-white">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}