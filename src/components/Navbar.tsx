"use client";

import React from "react";
import {
  Smartphone,
  LayoutDashboard,
  ShieldCheck,
  Sun,
  Moon,
  Globe2,
  Cpu,
  Monitor,
} from "lucide-react";
import { IndustryType, Language } from "../types/fairshift";
import { hasGeminiApiKey } from "../lib/gemini";

interface NavbarProps {
  currentIndustry: IndustryType;
  onIndustryChange: (industry: IndustryType) => void;
  activeView: "worker" | "admin";
  onViewChange: (view: "worker" | "admin") => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentIndustry,
  onIndustryChange,
  activeView,
  onViewChange,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const geminiActive = hasGeminiApiKey();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${theme === "dark" ? "bg-zinc-900/90 border-zinc-800 text-white" : "bg-white/80 border-slate-200/80 shadow-sm text-slate-900"}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content (Press Enter)
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          role="navigation"
          aria-label="FairShift Persistent Header Switcher"
          className="flex flex-col lg:flex-row items-center justify-between py-2.5 gap-3"
        >
          {/* Brand Logo & UN SDG 8 Indicator */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/25 font-black text-xl shrink-0">
                FS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                    Fair<span className="text-amber-500">Shift</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                    title="United Nations SDG 8: Decent Work & Economic Growth"
                    aria-label="UN SDG 8 Decent Work Platform"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    UN SDG 8
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                  Decent Work • ₹ INR • 1.5x Overtime • Fatigue Guard
                </p>
              </div>
            </div>

            {/* Quick Mobile Controls (Language & Theme Toggle) */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className={`px-3 py-1.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                  theme === "light"
                    ? "bg-white/70 border-slate-300 text-slate-700"
                    : "bg-zinc-900/70 border-zinc-700 text-zinc-200"
                }`}
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                    <span className="text-xs font-semibold">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <span className="text-xs font-semibold">Light</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PRIMARY PERSISTENT VIEW MODE SWITCHER (FIXED ALIGNMENT CONTAINER - ZERO CLIPPING) */}
          <div className="flex justify-center w-full lg:w-auto">
            <div
              role="radiogroup"
              aria-label="Primary Platform View Mode"
              className="inline-flex items-center p-1.5 bg-slate-200/60 dark:bg-white/60 backdrop-blur-md rounded-2xl border border-slate-300/50 dark:border-zinc-700/50 shadow-inner gap-1 overflow-hidden"
            >
              <button
                type="button"
                id="view-mode-worker"
                onClick={() => onViewChange("worker")}
                aria-checked={activeView === "worker"}
                role="radio"
                className={
                  activeView === "worker"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md rounded-xl px-5 py-2.5 font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/40"
                }
              >
                <Smartphone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Worker Mobile Interface</span>
              </button>

              <button
                type="button"
                id="view-mode-admin"
                onClick={() => onViewChange("admin")}
                aria-checked={activeView === "admin"}
                role="radio"
                className={
                  activeView === "admin"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md rounded-xl px-5 py-2.5 font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap cursor-pointer dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/40"
                }
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Employer / Admin Dashboard</span>
              </button>
            </div>
          </div>

          {/* RIGHT UTILITIES: Device Shell Toggle, Language, Dual Theme Toggle, Gemini Live */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* If in Worker view, allow toggling simulated phone frame */}
            {activeView === "worker" && (
              <button
                type="button"
                onClick={onToggleMobileFrame}
                aria-pressed={isMobileFrame}
                aria-label={isMobileFrame ? "Switch to Full Width View" : "Simulate Budget Smartphone Shell"}
                title={isMobileFrame ? "Expand to Full Browser Width" : "Simulate Low-End Smartphone Screen"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                  isMobileFrame
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-bold"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-white dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
                }`}
              >
                {isMobileFrame ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Phone Shell</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                    <span>Full Width</span>
                  </>
                )}
              </button>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-zinc-900/90 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 ml-1.5 mr-0.5 shrink-0" aria-hidden="true" />
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
                  className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    language === lang.code
                      ? "bg-amber-500 text-white shadow-xs font-black"
                      : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* DUAL THEME TOGGLE (DARK vs LIGHT GLASSMORPHIC PILL) */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              title={theme === "light" ? "Current: Light Mode. Click to switch to Dark Mode" : "Current: Dark Mode. Click to switch to Light Mode"}
              className={`px-3 py-1.5 rounded-full backdrop-blur-md border transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                theme === "light"
                  ? "bg-white/70 hover:bg-white border-slate-300/80 text-slate-700 hover:text-slate-900"
                  : "bg-zinc-900/60 hover:bg-white border-zinc-700/80 text-zinc-200 hover:text-white"
              }`}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                  <span className="text-xs font-semibold">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  <span className="text-xs font-semibold">Light</span>
                </>
              )}
            </button>

            {/* Gemini Live AI Status */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/70"
              title={
                geminiActive
                  ? "Gemini AI active: Live grievance hazard analysis & career pathing enabled via NEXT_PUBLIC_GEMINI_API_KEY"
                  : "Gemini API key ready: using SDG 8 heuristics fallback"
              }
            >
              <Cpu className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    geminiActive ? "bg-emerald-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    geminiActive ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="font-mono text-[10px] font-bold">
                {geminiActive ? "Gemini Live" : "AI Safe"}
              </span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
