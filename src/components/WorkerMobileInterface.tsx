"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Square,
  Coffee,
  ShieldAlert,
  FileCheck2,
  Award,
  Globe2,
  HardHat,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Flame,
  Droplets,
  Check,
} from "lucide-react";
import { IndustryType, WorkerProfile, ShiftLog, Language } from "../types/fairshift";
import { TRANSLATIONS } from "../lib/translations";
import { formatCurrency, OVERTIME_MULTIPLIER } from "../lib/payslip";

interface WorkerMobileInterfaceProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  industry: IndustryType;
  onIndustryChange: (ind: IndustryType) => void;
  worker: WorkerProfile;
  onOpenPayslip: () => void;
  onOpenGrievance: () => void;
  onOpenSkillPassport: () => void;
  onClockOutNewShift: (shift: ShiftLog) => void;
}

export const WorkerMobileInterface: React.FC<WorkerMobileInterfaceProps> = ({
  language,
  onLanguageChange,
  industry,
  onIndustryChange,
  worker,
  onOpenPayslip,
  onOpenGrievance,
  onOpenSkillPassport,
  onClockOutNewShift,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Shift Punch Timer State
  const [isOnShift, setIsOnShift] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(8 * 3600 + 42 * 60 + 15); // Default to active 8h 42m shift for immediate 1.5x demo

  // Rest Break Timer (15 min hydration/fatigue break)
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(15 * 60); // 15 mins
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shift Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (isOnShift && !isBreakActive) {
      interval = setInterval(() => {
        setShiftSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnShift, isBreakActive]);

  // Break Countdown Interval
  useEffect(() => {
    let interval: any = null;
    if (isBreakActive && breakSecondsLeft > 0) {
      interval = setInterval(() => {
        setBreakSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (breakSecondsLeft === 0 && isBreakActive) {
      setIsBreakActive(false);
      triggerToast("Break Completed! Remember to hydrate and re-check safety gear.");
    }
    return () => clearInterval(interval);
  }, [isBreakActive, breakSecondsLeft]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatHMS = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  const formatMS = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Convert shift seconds to hours
  const totalShiftHours = shiftSeconds / 3600;
  const standardShiftHours = Math.min(8.0, totalShiftHours);
  const overtimeShiftHours = Math.max(0, totalShiftHours - 8.0);

  // Today's estimated pay calculation (Regular + 1.5x Overtime) in INR
  const estimatedDailyPay =
    standardShiftHours * worker.baseHourlyRate +
    overtimeShiftHours * worker.baseHourlyRate * OVERTIME_MULTIPLIER;

  const handleToggleShift = () => {
    if (isOnShift) {
      setIsOnShift(false);
      const newShift: ShiftLog = {
        id: `sh-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split("T")[0],
        shiftName:
          industry === "construction"
            ? "Bengaluru Metro Pier 14 - Column Pour & Viaduct Girder Alignment"
            : "SRM Campus STEM Complex - Lab Safety & Exhaust Sweep",
        location: industry === "construction" ? "Bengaluru Metro Pier 14" : "Sector 4 STEM Laboratories",
        regularHours: Math.round(standardShiftHours * 10) / 10,
        overtimeHours: Math.round(overtimeShiftHours * 10) / 10,
        hazardAllowance: industry === "construction" ? 350 : 200,
        status: "Completed",
        supervisorVerified: true,
        notes: "Shift completed via Mobile Worker Portal with 1.5x overtime multiplier applied.",
      };
      onClockOutNewShift(newShift);
      triggerToast("Shift Clocked Out Successfully! 1.5x Overtime Pay Recorded in INR.");
    } else {
      setIsOnShift(true);
      setShiftSeconds(0);
      triggerToast("Shift Clocked In! Safety checklist verified under UN SDG 8.");
    }
  };

  const handleToggleBreak = () => {
    if (isBreakActive) {
      setIsBreakActive(false);
      triggerToast("Break ended. Resuming active shift duty.");
    } else {
      setIsBreakActive(true);
      triggerToast("15-Minute Rest & Hydration Break Started.");
    }
  };

  const handleResetBreak = () => {
    setBreakSecondsLeft(15 * 60);
    setIsBreakActive(false);
  };

  return (
    <section
      aria-labelledby="worker-portal-title"
      className="space-y-4 max-w-lg mx-auto w-full text-slate-800 dark:text-zinc-100"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold shadow-xl border border-slate-700 dark:border-slate-200 flex items-center gap-2 animate-fade-in backdrop-blur-md"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR: Language Selector & Industry Badge */}
      <header className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-4 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span className="sr-only">Select Language</span>
            </span>
            <div
              role="group"
              aria-label="Language selection"
              className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-white/80 border border-slate-200 dark:border-zinc-700/80 text-xs gap-0.5"
            >
              {(
                [
                  { code: "en", label: "EN" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "ta", label: "தமிழ்" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onLanguageChange(lang.code)}
                  aria-pressed={language === lang.code}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    language === lang.code
                      ? "bg-amber-500 text-white shadow-xs font-black"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Current Industry Badge with Quick Toggle */}
          <button
            type="button"
            onClick={() =>
              onIndustryChange(industry === "construction" ? "campus" : "construction")
            }
            aria-label={`Current Industry: ${
              industry === "construction" ? t.industryConstruction : t.industryCampus
            }. Tap to switch.`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold border transition-all shadow-xs cursor-pointer ${
              industry === "construction"
                ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                : "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 hover:bg-teal-100"
            }`}
          >
            {industry === "construction" ? (
              <HardHat className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            ) : (
              <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
            )}
            <span className="truncate max-w-[110px] font-extrabold">
              {industry === "construction" ? "Construction" : "Campus Staff"}
            </span>
          </button>
        </div>

        {/* Worker Info Row */}
        <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={worker.avatarUrl}
                alt={`Photo of ${worker.name}`}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                  isOnShift ? "bg-emerald-500" : "bg-slate-400 dark:bg-zinc-600"
                }`}
                title={isOnShift ? "Currently Clocked In" : "Clocked Out"}
              />
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">{t.welcomeWorker},</span>
              <h1 className="text-sm font-black text-slate-900 dark:text-white leading-tight">{worker.name}</h1>
              <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">{worker.workerId}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 block">Base Rate</span>
            <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
              {formatCurrency(worker.baseHourlyRate)}
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">/h</span>
            </span>
          </div>
        </div>
      </header>

      {/* CURRENT SHIFT WIDGET (Glassmorphic) */}
      <article
        aria-label="Current Shift Tracking Widget"
        className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Status Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isOnShift ? "bg-emerald-500 animate-ping" : "bg-slate-400 dark:bg-zinc-600"
              }`}
            />
            <span
              className={`text-xs font-black tracking-wider uppercase ${
                isOnShift ? "text-emerald-700 dark:text-emerald-400" : "text-slate-500 dark:text-zinc-400"
              }`}
            >
              {isOnShift ? t.statusOnShift : t.statusClockedOut}
            </span>
          </div>

          {overtimeShiftHours > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              <Flame className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              1.5x OT Active (+{overtimeShiftHours.toFixed(1)}h)
            </span>
          )}
        </div>

        {/* Live Digital Timer */}
        <div className="text-center py-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-zinc-400 block mb-1">
            {t.shiftDurationLabel}
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-wider">
            {formatHMS(shiftSeconds)}
          </div>
        </div>

        {/* Estimated Daily Earnings with 1.5x Breakdown in Indian Rupees */}
        <div className="mt-4 p-3.5 bg-slate-50/90 dark:bg-white/60 rounded-2xl border border-slate-200 dark:border-zinc-700/70 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block">
              {t.dailyEarningsEst}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
              {t.overtimeIncludedNotice}
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(estimatedDailyPay)}
            </span>
          </div>
        </div>

        {/* Quick Rest Break Timer Widget */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300">
              <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <span>{t.quickBreakTimer}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
              <Droplets className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
              <span>{formatMS(breakSecondsLeft)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleBreak}
              aria-label={isBreakActive ? t.restBreakStop : t.restBreakStart}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
                isBreakActive
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md hover:shadow-lg"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              }`}
            >
              <Coffee className="w-4 h-4" aria-hidden="true" />
              <span>{isBreakActive ? t.restBreakStop : t.restBreakStart}</span>
            </button>

            {breakSecondsLeft < 15 * 60 && (
              <button
                type="button"
                onClick={handleResetBreak}
                aria-label="Reset Break Timer"
                className="p-2.5 bg-slate-200/50 dark:bg-white/50 backdrop-blur-sm border border-slate-300/40 dark:border-zinc-700/40 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 rounded-xl cursor-pointer transition-all"
                title="Reset Break Timer to 15 min"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 text-center">
            {t.hydrationAlert}
          </p>
        </div>
      </article>

      {/* LARGE TOUCH TARGETS: Action Grid */}
      <section aria-label="Worker Quick Actions" className="grid grid-cols-2 gap-3.5">
        {/* Action 1: Check In / Out with Refined Gradient Button */}
        <button
          type="button"
          onClick={handleToggleShift}
          aria-label={isOnShift ? t.btnClockOut : t.btnClockIn}
          className={`col-span-2 p-5 rounded-2xl flex items-center justify-between text-left transition-all shadow-md hover:shadow-lg cursor-pointer ${
            isOnShift
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              {isOnShift ? (
                <Square className="w-6 h-6 fill-current" aria-hidden="true" />
              ) : (
                <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              )}
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-white/90 block">
                {isOnShift ? "Shift In Progress" : "Shift Ready"}
              </span>
              <h2 className="text-base font-black text-white leading-tight">
                {isOnShift ? t.btnClockOut : t.btnClockIn}
              </h2>
              <span className="text-[11px] text-white/90 font-medium block mt-0.5">
                {t.actionCheckInDesc}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/80 shrink-0" aria-hidden="true" />
        </button>

        {/* Action 2: View My Payslip (Large Touch Target) */}
        <button
          type="button"
          onClick={onOpenPayslip}
          aria-label={t.actionViewPayslip}
          className="p-5 min-h-[140px] bg-white/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-white/80 active:scale-95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-amber-400 dark:hover:border-amber-500 rounded-2xl flex flex-col justify-between text-left transition-all shadow-sm hover:shadow-md group cursor-pointer backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
            <FileCheck2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="mt-2.5">
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {t.actionViewPayslip}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {t.actionViewPayslipDesc}
            </p>
          </div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
            1.5x OT Multiplier (₹) <ChevronRight className="w-3 h-3" />
          </span>
        </button>

        {/* Action 3: Report Hazard / Safety Complaint */}
        <button
          type="button"
          onClick={onOpenGrievance}
          aria-label={t.actionReportHazard}
          className="p-5 min-h-[140px] bg-white/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-white/80 active:scale-95 border border-slate-200/80 dark:border-zinc-800/80 hover:border-red-300 dark:hover:border-red-500 rounded-2xl flex flex-col justify-between text-left transition-all shadow-sm hover:shadow-md group cursor-pointer backdrop-blur-xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="mt-2.5">
            <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
              {t.actionReportHazard}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {t.actionReportHazardDesc}
            </p>
          </div>
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1 mt-2">
            Zero Retaliation <ChevronRight className="w-3 h-3" />
          </span>
        </button>

        {/* Action 4: My Skill Passport */}
        <button
          type="button"
          onClick={onOpenSkillPassport}
          aria-label={t.actionSkillPassport}
          className="col-span-2 p-5 bg-white/70 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-white/80 hover:border-emerald-300 dark:hover:border-emerald-600 active:scale-95 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl flex items-center justify-between text-left transition-all shadow-sm hover:shadow-md group cursor-pointer backdrop-blur-xl"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <Award className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {t.actionSkillPassport}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                {t.actionSkillPassportDesc}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              {worker.verifiedBadgesCount} Verified
            </span>
          </div>
        </button>
      </section>
    </section>
  );
};
