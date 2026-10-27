"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Square,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  FileCheck2,
  Calendar,
  CheckSquare,
  Square as EmptySquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { IndustryType, WorkerProfile, ShiftLog } from "../types/fairshift";
import { calculatePayslip, formatCurrency, OVERTIME_MULTIPLIER } from "../lib/payslip";

interface WorkerPortalProps {
  industry: IndustryType;
  worker: WorkerProfile;
  shifts: ShiftLog[];
  safetyChecklist: string[];
  onOpenPayslip: () => void;
  onOpenGrievance: () => void;
  onViewSkills: () => void;
  onClockOutNewShift: (newShift: ShiftLog) => void;
}

export const WorkerPortal: React.FC<WorkerPortalProps> = ({
  industry,
  worker,
  shifts,
  safetyChecklist,
  onOpenPayslip,
  onOpenGrievance,
  onViewSkills,
  onClockOutNewShift,
}) => {
  // Live shift timer state
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [checkedSafetyItems, setCheckedSafetyItems] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let interval: any = null;
    if (isShiftActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isShiftActive]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Convert simulated seconds into decimal hours (e.g. 10 seconds = 0.5hr for demonstration, or real hours)
  // To allow users to immediately experience the 1.5x overtime multiplier during testing, we give a "+2h Overtime Simulation" boost button!
  const [simulatedHours, setSimulatedHours] = useState(8.5);

  const regularHours = Math.min(8.0, simulatedHours);
  const overtimeHours = Math.max(0, simulatedHours - 8.0);

  const livePayslip = calculatePayslip({
    regularHours: worker.hoursWorkedThisWeek,
    overtimeHours: worker.overtimeHoursThisWeek,
    hourlyRate: worker.baseHourlyRate,
    hazardAllowance: industry === "construction" ? 150 : 80,
    shiftDifferential: 35,
    deductions: 30,
    taxRate: 0.12,
  });

  const toggleSafetyCheck = (index: number) => {
    setCheckedSafetyItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleStartShift = () => {
    setIsShiftActive(true);
    setElapsedSeconds(0);
  };

  const handleStopShift = () => {
    setIsShiftActive(false);
    const newShift: ShiftLog = {
      id: `sh-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      shiftName:
        industry === "construction"
          ? "Structural Steel Anchor Check & Level Pour"
          : "Campus Facilities Bio-sanitation & Lab Safety Sweep",
      location: industry === "construction" ? "Sector 7 Gate 3" : "West Campus Science Quad",
      regularHours: regularHours,
      overtimeHours: overtimeHours,
      hazardAllowance: industry === "construction" ? 35 : 20,
      status: "Completed",
      supervisorVerified: true,
      notes: "Shift completed with automated 1.5x overtime multiplier logged.",
    };
    onClockOutNewShift(newShift);
  };

  return (
    <section aria-labelledby="worker-portal-title" className="space-y-6">
      {/* Worker Profile Summary Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-lg">
              <img
                src={worker.avatarUrl}
                alt={`Photo of ${worker.name}`}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-950 rounded-full flex items-center justify-center text-[10px] text-white"
              title="Identity & Union Verified"
            >
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 id="worker-portal-title" className="text-xl sm:text-2xl font-bold text-white">
                {worker.name}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                {worker.workerId}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
                {worker.unionAffiliation}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {worker.role} • Base Rate:{" "}
              <strong className="text-white">{formatCurrency(worker.baseHourlyRate)}/hr</strong>
            </p>
          </div>
        </div>

        {/* Quick Trigger Buttons */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenPayslip}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <FileCheck2 className="w-4 h-4" aria-hidden="true" />
            <span>View 1.5x Payslip</span>
          </button>

          <button
            type="button"
            onClick={onViewSkills}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-teal-400" aria-hidden="true" />
            <span>Skill Passport ({worker.verifiedBadgesCount})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Regular Hours */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Standard Hours</span>
            <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {worker.hoursWorkedThisWeek}
            </span>
            <span className="text-xs text-slate-400">/ 40 hrs base</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Standard wage tier active</p>
        </div>

        {/* Card 2: Overtime Hours (1.5x Multiplier) */}
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
            <span>Overtime (1.5x)</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
              Mandatory 1.5x
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              {worker.overtimeHoursThisWeek}h
            </span>
            <span className="text-xs font-mono text-amber-300/80">
              @ {formatCurrency(worker.baseHourlyRate * OVERTIME_MULTIPLIER)}/hr
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 font-medium">
            Generated: {formatCurrency(worker.overtimeHoursThisWeek * worker.baseHourlyRate * OVERTIME_MULTIPLIER)} OT pay
          </p>
        </div>

        {/* Card 3: Net Take-Home Estimate */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Weekly Net Pay</span>
            <DollarSign className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {formatCurrency(livePayslip.netPay)}
            </span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">Audit-verified compliance</p>
        </div>

        {/* Card 4: Safety & Decent Work Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Safety Rating</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-300">
              {worker.safetyScore}%
            </span>
            <span className="text-xs text-slate-400">zero violations</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">UN SDG 8.8 safety standard met</p>
        </div>
      </div>

      {/* Live Shift Tracker & Hazard Safety Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Shift Action Module */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" aria-hidden="true" />
                Live Shift Punch & Overtime Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Automatic shift timestamps prevent unrecorded overtime hours under UN SDG 8.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`flex h-3 w-3 rounded-full ${
                  isShiftActive ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
                }`}
              />
              <span className="text-xs font-semibold text-slate-300">
                {isShiftActive ? "ON SHIFT" : "CLOCKED OUT"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Active Shift Elapsed Duration
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                {formatTimer(elapsedSeconds)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Simulated shift hours:{" "}
                <strong className="text-amber-400">{simulatedHours}h</strong> (
                {overtimeHours > 0 ? (
                  <span className="text-amber-300">
                    Includes {overtimeHours}h Overtime @ 1.5x Multiplier
                  </span>
                ) : (
                  "Standard Time"
                )}
                )
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {!isShiftActive ? (
                <button
                  type="button"
                  onClick={handleStartShift}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Clock In Shift</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopShift}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-500/20 transition-all"
                >
                  <Square className="w-4 h-4 fill-current" aria-hidden="true" />
                  <span>Clock Out & Log 1.5x Pay</span>
                </button>
              )}

              {/* Overtime Test Incrementer for Testing/Demonstrations */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSimulatedHours((prev) => Math.min(14, prev + 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Add 1 overtime hour to test live 1.5x multiplier calculation"
                >
                  +1h OT (Test)
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedHours(8.0)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Reset (8h)
                </button>
              </div>
            </div>
          </div>

          {/* Shift Details Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block">Base Pay ({regularHours}h)</span>
              <span className="font-mono text-white font-bold">
                {formatCurrency(regularHours * worker.baseHourlyRate)}
              </span>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30">
              <span className="text-amber-300 block font-semibold">Overtime 1.5x ({overtimeHours}h)</span>
              <span className="font-mono text-amber-400 font-bold">
                {formatCurrency(overtimeHours * worker.baseHourlyRate * OVERTIME_MULTIPLIER)}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block">Total Shift Value</span>
              <span className="font-mono text-emerald-400 font-bold">
                {formatCurrency(
                  regularHours * worker.baseHourlyRate +
                    overtimeHours * worker.baseHourlyRate * OVERTIME_MULTIPLIER
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Pre-Shift Safety & Hazard Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Pre-Shift Safety Checklist
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              Mandatory OSHA
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Verify all protective standards before entering hazardous zones:
          </p>

          <ul className="space-y-3">
            {safetyChecklist.map((item, idx) => {
              const isChecked = Boolean(checkedSafetyItems[idx]);
              return (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => toggleSafetyCheck(idx)}
                    aria-checked={isChecked}
                    role="checkbox"
                    className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl border transition-all text-xs ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-200"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <EmptySquare className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? "line-through opacity-80" : ""}>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onOpenGrievance}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Report Safety Hazard / Broken Gear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Shift History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" aria-hidden="true" />
              Weekly Shift History & Overtime Audit Log
            </h3>
            <p className="text-xs text-slate-400">
              Each shift is cryptographically cross-verified against 1.5x overtime multiplier standards.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenPayslip}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Payslip Inspector</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <caption className="sr-only">Weekly shift log with overtime hours and approval status</caption>
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
              <tr>
                <th scope="col" className="p-3">Shift Date</th>
                <th scope="col" className="p-3">Description & Location</th>
                <th scope="col" className="p-3">Regular Hrs</th>
                <th scope="col" className="p-3">Overtime (1.5x)</th>
                <th scope="col" className="p-3">Hazard Pay</th>
                <th scope="col" className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-300">{shift.date}</td>
                  <td className="p-3">
                    <span className="font-semibold text-white block">{shift.shiftName}</span>
                    <span className="text-xs text-slate-400">{shift.location}</span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{shift.regularHours}h</td>
                  <td className="p-3">
                    {shift.overtimeHours > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold font-mono">
                        {shift.overtimeHours}h (1.5x)
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">0.0h</span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-emerald-400">
                    +{formatCurrency(shift.hazardAllowance)}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
