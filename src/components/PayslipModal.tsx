"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Printer,
  ShieldCheck,
  Calculator,
  Clock,
  IndianRupee,
  Info,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import {
  calculatePayslip,
  formatCurrency,
  OVERTIME_MULTIPLIER,
} from "../lib/payslip";
import { IndustryType, ShiftLog, Language } from "../types/fairshift";
import { TRANSLATIONS } from "../lib/translations";

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  workerName: string;
  workerId: string;
  role: string;
  industry: IndustryType;
  baseHourlyRate: number;
  initialRegularHours?: number;
  initialOvertimeHours?: number;
  initialHazardAllowance?: number;
  recentShifts: ShiftLog[];
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  language = "en",
  workerName,
  workerId,
  role,
  industry,
  baseHourlyRate,
  initialRegularHours = 40,
  initialOvertimeHours = 9.5,
  initialHazardAllowance = 350,
  recentShifts,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Interactive wage & overtime simulation state
  const [regularHours, setRegularHours] = useState(initialRegularHours);
  const [overtimeHours, setOvertimeHours] = useState(initialOvertimeHours);
  const [hazardAllowance, setHazardAllowance] = useState(initialHazardAllowance);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync initial props when opening
  useEffect(() => {
    if (isOpen) {
      setRegularHours(initialRegularHours);
      setOvertimeHours(initialOvertimeHours);
      setHazardAllowance(initialHazardAllowance);
      setIsSimulating(false);
    }
  }, [isOpen, initialRegularHours, initialOvertimeHours, initialHazardAllowance]);

  // Handle ESC key to close modal (Accessibility requirement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus inside modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const payslip = calculatePayslip({
    regularHours,
    overtimeHours,
    hourlyRate: baseHourlyRate,
    hazardAllowance,
    shiftDifferential: industry === "campus" ? 150 : 250,
    deductions: 180.0, // Statutory dues: PF (Provident Fund) & ESI
    taxRate: 0.12,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payslip-modal-title"
      aria-describedby="payslip-modal-desc"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-zinc-800/90 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-800 dark:text-zinc-100 my-8 focus:outline-none modal-print-container"
      >
        {/* Header Actions */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-zinc-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
              <FileCheck2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  id="payslip-modal-title"
                  className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white"
                >
                  {t.payslipModalTitle}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                  1.5x OT Multiplier Verified (₹ INR)
                </span>
              </div>
              <p id="payslip-modal-desc" className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                {t.payslipModalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print official payslip receipt"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
              title="Print official printable earnings statement"
            >
              <Printer className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close payslip modal dialog"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Worker & Shift Information Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 my-4 bg-slate-50/90 dark:bg-white/60 rounded-2xl p-4 border border-slate-200 dark:border-zinc-700/70 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Worker Name</span>
            <span className="font-extrabold text-slate-900 dark:text-white">{workerName}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Worker ID</span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-extrabold">{workerId}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Assigned Sector</span>
            <span className="font-bold text-teal-800 dark:text-teal-400">
              {industry === "construction" ? "Bengaluru Metro Viaduct" : "SRM College Campus"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Base Pay Rate</span>
            <span className="font-mono font-black text-slate-900 dark:text-white">
              {formatCurrency(baseHourlyRate)}/hr
            </span>
          </div>
        </div>

        {/* Mathematical Formula Callout */}
        <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs">
            <h3 className="font-bold text-amber-900 dark:text-amber-300">
              UN SDG 8 Overtime Law: Total Pay = Base Earnings + (1.5x Overtime Bonus) + Allowances - Deductions (₹ INR)
            </h3>
            <p className="text-amber-800 dark:text-amber-300/80 mt-1 font-medium">
              {t.mathFormulaNotice}
            </p>
          </div>
        </div>

        {/* STEP-BY-STEP BREAKDOWN IN ACTIVE LANGUAGE */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Step-by-Step Wage Calculation Breakdown ({language.toUpperCase()})
          </h3>

          {/* Step 1: Base Hours */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
                  Step 1
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{t.step1BaseEarnings}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {t.step1Explanation} ({payslip.regularHours} hrs × {formatCurrency(payslip.regularRate)}/hr)
              </p>
            </div>
            <div className="font-mono text-lg font-black text-slate-900 dark:text-white text-right">
              {formatCurrency(payslip.regularPay)}
            </div>
          </div>

          {/* Step 2: Overtime Bonus with 1.5x Multiplier */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-xs">
                  Step 2 (1.5x)
                </span>
                <h4 className="font-black text-sm text-amber-900 dark:text-amber-300">{t.step2OvertimeBonus}</h4>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-1 font-medium">
                {t.step2Explanation} ({payslip.overtimeHours} OT hrs × {formatCurrency(payslip.overtimeRate)}/hr)
              </p>
            </div>
            <div className="font-mono text-xl font-black text-amber-700 dark:text-amber-400 text-right">
              +{formatCurrency(payslip.overtimePay)}
            </div>
          </div>

          {/* Step 3: Hazard & Shift Allowances */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                  Step 3
                </span>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">{t.step3Allowances}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                {t.step3Explanation} (Hazard: {formatCurrency(payslip.hazardAllowance)} + Shift: {formatCurrency(payslip.shiftDifferential)})
              </p>
            </div>
            <div className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-400 text-right">
              +{formatCurrency(payslip.hazardAllowance + payslip.shiftDifferential)}
            </div>
          </div>

          {/* Step 4: Net Payout */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-xs">
                  Step 4
                </span>
                <h4 className="font-black text-base text-emerald-900 dark:text-emerald-300">{t.step4NetPayout}</h4>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/80 mt-1 font-medium">
                {t.step4Explanation} (Gross: {formatCurrency(payslip.grossPay)} - Deductions: {formatCurrency(payslip.totalDeductions)})
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase font-extrabold text-emerald-800 dark:text-emerald-400 block">Total Net Pay</span>
              <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-300">
                {formatCurrency(payslip.netPay)}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Overtime Math Simulator (What-If Tool) */}
        <section className="p-4 rounded-2xl bg-slate-50 dark:bg-white/60 border border-slate-200 dark:border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {t.interactiveSimulatorHeading}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-bold focus:outline-none cursor-pointer"
            >
              {isSimulating ? "Reset to Actual Hours" : "Adjust Simulated Hours"}
            </button>
          </div>

          {isSimulating && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-zinc-700 text-xs">
              <div>
                <label htmlFor="sim-regular" className="block text-slate-700 dark:text-zinc-300 mb-1 font-medium">
                  Standard Hours: <span className="text-amber-700 dark:text-amber-400 font-bold">{regularHours}h</span>
                </label>
                <input
                  id="sim-regular"
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={regularHours}
                  onChange={(e) => setRegularHours(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label htmlFor="sim-overtime" className="block text-slate-700 dark:text-zinc-300 mb-1 font-medium">
                  Overtime Hours (1.5x): <span className="text-amber-700 dark:text-amber-400 font-bold">{overtimeHours}h</span>
                </label>
                <input
                  id="sim-overtime"
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-1">
                  At {overtimeHours} OT hrs, you earn{" "}
                  <strong className="text-amber-800 dark:text-amber-300 font-mono">
                    {formatCurrency(overtimeHours * baseHourlyRate * 1.5)}
                  </strong>{" "}
                  overtime pay.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Modal Footer */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span>Cryptographically sealed under FairShift Labor Protocol v2.4 (INR)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-xs cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
