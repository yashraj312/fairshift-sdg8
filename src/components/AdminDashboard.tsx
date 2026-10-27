"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldAlert,
  AlertTriangle,
  Building2,
  GraduationCap,
  Scale,
  Clock,
  CheckCircle,
  FileText,
  Search,
  Filter,
  Flame,
  Award,
  ChevronDown,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
  Eye,
  UserCheck,
  IndianRupee,
  Briefcase,
} from "lucide-react";
import {
  IndustryType,
  ShiftLog,
  GrievanceReport,
  FatigueWorkerRecord,
  SkillBadge,
} from "../types/fairshift";
import { formatCurrency, OVERTIME_MULTIPLIER } from "../lib/payslip";

interface AdminDashboardProps {
  industry: IndustryType;
  onIndustryChange: (ind: IndustryType) => void;
  shifts: ShiftLog[];
  grievances: GrievanceReport[];
  fatigueWorkers: FatigueWorkerRecord[];
  skills: SkillBadge[];
  baseHourlyRate: number;
  activeWorkforceCount: number;
  openHazardsCount: number;
  totalOvertimeSpend: number;
  onResolveGrievance: (id: string) => void;
  onApproveShift: (id: string) => void;
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  industry,
  onIndustryChange,
  shifts,
  grievances,
  fatigueWorkers,
  skills,
  baseHourlyRate,
  activeWorkforceCount,
  openHazardsCount,
  totalOvertimeSpend,
  onResolveGrievance,
  onApproveShift,
  isDarkMode,
}) => {
  // Navigation Tabs: "Overview Analytics", "Grievances & Safety Inbox", "Workforce Skill Directory"
  const [activeTab, setActiveTab] = useState<"overview" | "grievances" | "directory">("overview");

  // Local fatigue state for interactive rest enforcement
  const [fatigueRoster, setFatigueRoster] = useState<FatigueWorkerRecord[]>(fatigueWorkers);
  const [approvedShifts, setApprovedShifts] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Sync fatigue workers when industry changes
  React.useEffect(() => {
    setFatigueRoster(fatigueWorkers);
  }, [fatigueWorkers]);

  const handleEnforceRest = (workerId: string, workerName: string) => {
    setFatigueRoster((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? {
              ...w,
              status: "Mandatory Rest Enforced",
              continuousHoursWorked: Math.max(0, w.continuousHoursWorked),
            }
          : w
      )
    );
    setActionSuccessNotice(`Mandatory Rest Break Enforced for ${workerName}. Relief worker dispatched.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleApprove = (shiftId: string) => {
    setApprovedShifts((prev) => ({ ...prev, [shiftId]: true }));
    onApproveShift(shiftId);
  };

  const highFatigueCount = fatigueRoster.filter(
    (w) => w.continuousHoursWorked > 12.0 && w.status !== "Mandatory Rest Enforced"
  ).length;

  const filteredGrievances =
    filterSeverity === "ALL"
      ? grievances
      : grievances.filter((g) => g.severity === filterSeverity);

  const filteredSkills = skills.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.issuingBody.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const panelClass = isDarkMode
    ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
    : "bg-white/90 border-slate-200/90 shadow-sm text-slate-900";
  const secondaryClass = isDarkMode
    ? "bg-white/60 border-zinc-700 text-zinc-100"
    : "bg-slate-100/80 border-slate-200 text-slate-800";
  const inactiveTabClass = isDarkMode
    ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/40"
    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60";

  return (
    <section aria-labelledby="employer-dashboard-heading" className="space-y-6 text-slate-800 dark:text-zinc-100">
      {/* Action Notification */}
      {actionSuccessNotice && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-md animate-bounce"
        >
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* TOP HEADER: Title, Industry Selector Dropdown & Admin Profile */}
      <header className={`${panelClass} backdrop-blur-xl rounded-2xl p-6 hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}>
        <div>
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <Scale className="w-6 h-6" aria-hidden="true" />
            </span>
            <div>
              <h1 id="employer-dashboard-heading" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Employer / Admin Compliance Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                UN SDG 8 Labor Standards Monitoring: 1.5x Overtime Multiplier & Maximum Fatigue Limits
              </p>
            </div>
          </div>
        </div>

        {/* Admin Profile & Industry Selector Dropdown */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Admin Profile Card */}
          <div className={`${secondaryClass} flex items-center gap-3 px-3.5 py-2 rounded-xl`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-xs">
              {industry === "construction" ? "AP" : "MI"}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-zinc-400 block leading-tight">
                {industry === "construction" ? "Site Manager (Chief Eng.)" : "HR & Welfare Lead"}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight block">
                {industry === "construction" ? "Er. Amit Patel" : "Dr. Meena Iyer"}
              </span>
            </div>
          </div>

          {/* Industry Selector */}
          <div className="relative flex-1 sm:w-64">
            <select
              id="industry-selector-dropdown"
              value={industry}
              onChange={(e) => onIndustryChange(e.target.value as IndustryType)}
              className="w-full appearance-none bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors shadow-xs cursor-pointer"
            >
              <option value="construction">🏗️ Bengaluru Metro Project (Civil)</option>
              <option value="campus">🎓 SRM College Campus (Support Staff)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* TOP KPI METRICS CARDS */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Workforce Count — Emerald accent */}
        <div className={`${panelClass} backdrop-blur-xl border-l-4 border-l-emerald-500 rounded-2xl p-5 hover:shadow-md transition-all`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Active Workforce</span>
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
              {activeWorkforceCount}
            </span>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
              ● On Shift
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 truncate">
            {industry === "construction" ? "Bengaluru Metro Phase 2 Gate 3" : "SRM Campus Sector 4"}
          </p>
        </div>

        {/* Card 2: Open Safety Hazards — Amber accent */}
        <div className={`${panelClass} backdrop-blur-xl border-l-4 border-l-amber-500 rounded-2xl p-5 hover:shadow-md transition-all`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Open Safety Hazards</span>
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400 font-mono">
              {openHazardsCount}
            </span>
            <span className="text-xs text-red-700 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200/60 dark:border-red-800/60">
              Unresolved
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
            Whistleblower reports pending audit
          </p>
        </div>

        {/* Card 3: High Fatigue Risk Count (> 12h) — Rose accent */}
        <div
          className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition-all backdrop-blur-xl border-l-4 ${
            highFatigueCount > 0
              ? "bg-red-50/70 dark:bg-red-950/40 border border-red-300 dark:border-red-800 border-l-rose-600"
              : `${panelClass} border-l-rose-400`
          }`}
        >
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider">
            <span className={highFatigueCount > 0 ? "text-red-700 dark:text-red-400" : "text-slate-500 dark:text-zinc-400"}>
              High Fatigue Risk
            </span>
            <Flame
              className={`w-4 h-4 ${highFatigueCount > 0 ? "text-red-600 dark:text-red-400 animate-pulse" : "text-slate-400"}`}
              aria-hidden="true"
            />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-red-700 dark:text-red-400 font-mono">
              {highFatigueCount}
            </span>
            <span className="text-xs font-bold text-red-800 dark:text-red-300 bg-red-100 dark:bg-red-900/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
              Workers &gt; 12h
            </span>
          </div>
          <p className="text-[11px] text-red-700 dark:text-red-400 mt-1 font-medium">
            Requires immediate mandatory rest break
          </p>
        </div>

        {/* Card 4: Total Overtime Spend (1.5x in INR) — Blue accent */}
        <div className={`${panelClass} backdrop-blur-xl border-l-4 border-l-blue-500 rounded-2xl p-5 hover:shadow-md transition-all`}>
          <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-xs font-extrabold uppercase tracking-wider">
            <span>Total Overtime Spend</span>
            <IndianRupee className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {formatCurrency(totalOvertimeSpend)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            ✓ 100% 1.5x Multiplier Audited
          </p>
        </div>
      </section>

      {/* NAVIGATION TABS: Overview Analytics | Grievances & Safety Inbox | Workforce Skill Directory */}
      <div className="flex">
        <nav
          role="tablist"
          aria-label="Admin Dashboard Navigation"
          className="inline-flex items-center p-1.5 bg-slate-200/60 dark:bg-white/60 backdrop-blur-md rounded-2xl border border-slate-300/50 dark:border-zinc-700/50 shadow-inner gap-1 overflow-hidden"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            className={
              activeTab === "overview"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md rounded-xl px-5 py-2.5 font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                : `${inactiveTabClass} px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap`
            }
          >
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>Overview Analytics</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "grievances"}
            onClick={() => setActiveTab("grievances")}
            className={
              activeTab === "grievances"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md rounded-xl px-5 py-2.5 font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                : `${inactiveTabClass} px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap`
            }
          >
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            <span>Grievances &amp; Safety Inbox</span>
            {grievances.filter((g) => g.status !== "Resolved").length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 font-extrabold">
                {grievances.filter((g) => g.status !== "Resolved").length}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "directory"}
            onClick={() => setActiveTab("directory")}
            className={
              activeTab === "directory"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md rounded-xl px-5 py-2.5 font-semibold transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                : `${inactiveTabClass} px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap`
            }
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>Workforce Skill Directory</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: OVERVIEW ANALYTICS (Includes Fatigue Risk Alert Panel & Shift Approval Queue) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* FATIGUE RISK ALERT PANEL (Highlights Workers > 12h Continuous Hours) */}
          <article
            aria-labelledby="fatigue-panel-heading"
            className={`${panelClass} backdrop-blur-xl border-red-200/80 dark:border-red-900/50 rounded-2xl p-6 hover:shadow-md transition-all`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                  <Flame className="w-6 h-6 animate-pulse" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="fatigue-panel-heading" className="text-lg font-black text-slate-900 dark:text-white">
                      Fatigue Risk Alert Panel (&gt; 12h Continuous Working Hours)
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/60">
                      UN SDG 8.8 Safeguard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Real-time monitoring across Indian worksites to prevent occupational exhaustion and structural accidents.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-white border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
                  Threshold: <strong>12.0 Hours</strong>
                </span>
              </div>
            </div>

            {/* Fatigue Warning Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <caption className="sr-only">Worker fatigue tracking roster with continuous hours worked</caption>
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th scope="col" className="p-3.5">Worker Name & Role</th>
                    <th scope="col" className="p-3.5">Assigned Zone</th>
                    <th scope="col" className="p-3.5">Continuous Hours</th>
                    <th scope="col" className="p-3.5">Shift Started</th>
                    <th scope="col" className="p-3.5">Fatigue Risk Level</th>
                    <th scope="col" className="p-3.5 text-right">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
                  {fatigueRoster.map((worker) => {
                    const isCritical = worker.continuousHoursWorked > 12.0;
                    const isModerate = worker.continuousHoursWorked >= 10.0 && worker.continuousHoursWorked <= 12.0;
                    const isRestEnforced = worker.status === "Mandatory Rest Enforced";

                    return (
                      <tr
  key={worker.id}
  className={`transition-colors border-b border-slate-200/80 ${
    isRestEnforced
      ? "bg-slate-100 text-slate-500 opacity-75"
      : isCritical
      ? "bg-rose-100/80 text-rose-950 font-semibold hover:bg-rose-200/80"
      : isModerate
      ? "bg-amber-100/80 text-amber-950 font-semibold hover:bg-amber-200/80"
      : "bg-white text-slate-900 hover:bg-slate-50 font-medium"
  }`}
>
                        <td className="p-3.5">
                          <span className="font-black text-slate-900 dark:text-white block">{worker.name}</span>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 block">{worker.role}</span>
                          <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">{worker.workerId}</span>
                        </td>

                        <td className="p-3.5 text-slate-600 dark:text-zinc-300">
                          {worker.department}
                        </td>

                        <td className="p-3.5 font-mono">
                          <span
                            className={`font-black text-sm ${
                              isCritical
                                ? "text-red-600 dark:text-red-400"
                                : isModerate
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {worker.continuousHoursWorked.toFixed(1)} hrs
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">
                            {worker.consecutiveDays} consecutive days
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-500 dark:text-zinc-400">
                          {worker.currentShiftStart}
                        </td>

                        <td className="p-3.5">
                          {isRestEnforced ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Relief Dispatched
                            </span>
                          ) : isCritical ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              CRITICAL FATIGUE (&gt;12h)
                            </span>
                          ) : isModerate ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Approaching Limit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Standard Shift
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          {isRestEnforced ? (
                            <span className="text-xs text-slate-500 dark:text-zinc-400 italic">
                              Mandatory Rest Logged
                            </span>
                          ) : isCritical ? (
                            <button
                              type="button"
                              onClick={() => handleEnforceRest(worker.id, worker.name)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                            >
                              Enforce Rest & Dispatch Relief
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                              Shift Compliant
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>

          {/* SHIFT APPROVAL & 1.5x OVERTIME AUDIT QUEUE */}
          <div className={`${panelClass} backdrop-blur-xl rounded-2xl p-6 hover:shadow-md transition-all space-y-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 gap-2">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  Recent Shift Verification & Overtime Audit Queue
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Mandatory supervisory review ensuring 1.5x overtime multiplier payout accuracy in INR.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shifts.map((shift) => {
                const isApproved = approvedShifts[shift.id] || shift.supervisorVerified;
                const shiftOvertimePay = shift.overtimeHours * baseHourlyRate * OVERTIME_MULTIPLIER;
                const shiftTotalPay =
                  shift.regularHours * baseHourlyRate +
                  shiftOvertimePay +
                  shift.hazardAllowance;

                return (
                  <div
                    key={shift.id}
                    className={`${panelClass} p-4 rounded-xl flex flex-col justify-between shadow-xs transition-all`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                            {shift.date} • {shift.location}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">{shift.shiftName}</h3>
                        </div>

                        {isApproved ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                            <Check className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApprove(shift.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                      </div>

                      <p className={`${secondaryClass} text-xs mt-2 italic p-2 rounded-lg`}>
                        "{shift.notes}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-600 dark:text-zinc-400 block">
                          Regular: <strong className="text-slate-900 dark:text-zinc-200">{shift.regularHours}h</strong>
                        </span>
                        <span className="text-amber-700 dark:text-amber-400 block font-bold">
                          Overtime: {shift.overtimeHours}h (1.5x = {formatCurrency(shiftOvertimePay)})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 dark:text-zinc-400 uppercase font-bold block">
                          Shift Pay
                        </span>
                        <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(shiftTotalPay)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GRIEVANCES & SAFETY INBOX */}
      {activeTab === "grievances" && (
        <div className={`${panelClass} backdrop-blur-xl rounded-2xl p-6 hover:shadow-md transition-all space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                Confidential Grievance & Whistleblower Safety Inbox
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Encrypted worker hazard reports with Gemini AI legal severity triage under Indian labor covenants.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 dark:text-zinc-400" aria-hidden="true" />
              <select
                aria-label="Filter grievances by severity"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-zinc-300 font-medium"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical Severity</option>
                <option value="HIGH">High Severity</option>
                <option value="MEDIUM">Medium Severity</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredGrievances.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-zinc-400 py-8 text-center">
                No unresolved grievance reports matching selected criteria.
              </p>
            ) : (
              filteredGrievances.map((grievance) => (
                <article
                  key={grievance.id}
                  className={`${panelClass} p-5 rounded-xl text-xs space-y-3 shadow-xs`}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold ${
                          grievance.severity === "CRITICAL" || grievance.severity === "HIGH"
                            ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/60"
                            : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60"
                        }`}
                      >
                        {grievance.severity}
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">{grievance.category}</span>
                      <span className="font-mono text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-white px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                        {grievance.workerAnonymousId}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold ${
                        grievance.status === "Resolved"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60"
                      }`}
                    >
                      {grievance.status}
                    </span>
                  </div>

                  <p className="text-slate-700 dark:text-zinc-300 italic text-sm">"{grievance.description}"</p>

                  <div className={`${secondaryClass} p-3.5 rounded-xl`}>
                    <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-400 font-bold mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>{grievance.sdg8Target}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-zinc-400">
                      {grievance.recommendedActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-slate-500 dark:text-zinc-400">
                    <span>Filed: {grievance.date}</span>
                    {grievance.status !== "Resolved" && (
                      <button
                        type="button"
                        onClick={() => onResolveGrievance(grievance.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Mark Hazard Resolved
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WORKFORCE SKILL DIRECTORY */}
      {activeTab === "directory" && (
        <div className={`${panelClass} backdrop-blur-xl rounded-2xl p-6 hover:shadow-md transition-all space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-4 gap-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                Workforce Verified Skill Directory & Credential Ledger
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Audited credentials aligned with UN SDG 8.5/8.6 and National Skill Development Corporation (NSDC) frameworks.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search certification or body..."
                className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className={`${panelClass} p-4 rounded-xl flex flex-col justify-between shadow-xs transition-all`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{skill.title}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">{skill.issuingBody}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  <span>Expires: {skill.expiryDate}</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{skill.verificationHash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
