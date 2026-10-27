/**
 * FairShift - Payslip & Labor Standard Calculation Utilities
 * Aligned with UN SDG 8 (Decent Work & Economic Growth)
 * Enforces Fair Labor Standards (1.5x overtime multiplier)
 */

export const OVERTIME_MULTIPLIER = 1.5;
export const STANDARD_DAILY_HOURS = 8;
export const STANDARD_WEEKLY_HOURS = 40;

export interface PayslipInput {
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  hazardAllowance?: number;
  shiftDifferential?: number;
  deductions?: number;
  taxRate?: number; // e.g. 0.12 for 12%
}

export interface PayslipBreakdown {
  regularHours: number;
  regularRate: number;
  regularPay: number;
  overtimeHours: number;
  overtimeRate: number; // 1.5x regularRate
  overtimeMultiplier: number;
  overtimePay: number;
  hazardAllowance: number;
  shiftDifferential: number;
  grossPay: number;
  taxDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  isCompliant: boolean;
}

/**
 * Calculates overtime pay strictly enforcing the 1.5x multiplier standard.
 * @param overtimeHours Number of overtime hours worked
 * @param hourlyRate Base regular hourly pay rate
 * @param multiplier Legal overtime multiplier (default: 1.5)
 */
export function calculateOvertimePay(
  overtimeHours: number,
  hourlyRate: number,
  multiplier: number = OVERTIME_MULTIPLIER
): number {
  if (overtimeHours < 0 || hourlyRate < 0) {
    throw new Error("Hours and rates must be non-negative numbers");
  }
  const overtimeRate = hourlyRate * multiplier;
  const pay = overtimeHours * overtimeRate;
  return Math.round(pay * 100) / 100;
}

/**
 * Calculates regular pay for base standard hours.
 */
export function calculateRegularPay(regularHours: number, hourlyRate: number): number {
  if (regularHours < 0 || hourlyRate < 0) {
    throw new Error("Hours and rates must be non-negative numbers");
  }
  const pay = regularHours * hourlyRate;
  return Math.round(pay * 100) / 100;
}

/**
 * Calculates full payslip breakdown with transparent overtime, allowances, and deductions.
 */
export function calculatePayslip(input: PayslipInput): PayslipBreakdown {
  const {
    regularHours = 0,
    overtimeHours = 0,
    hourlyRate = 0,
    hazardAllowance = 0,
    shiftDifferential = 0,
    deductions = 0,
    taxRate = 0.12,
  } = input;

  if (regularHours < 0 || overtimeHours < 0 || hourlyRate < 0) {
    throw new Error("Invalid hours or wage rate provided");
  }

  const regularPay = calculateRegularPay(regularHours, hourlyRate);
  const overtimeRate = Math.round(hourlyRate * OVERTIME_MULTIPLIER * 100) / 100;
  const overtimePay = calculateOvertimePay(overtimeHours, hourlyRate, OVERTIME_MULTIPLIER);

  const grossPay = Math.round((regularPay + overtimePay + hazardAllowance + shiftDifferential) * 100) / 100;
  const taxDeductions = Math.round(grossPay * taxRate * 100) / 100;
  const totalDeductions = Math.round((taxDeductions + deductions) * 100) / 100;
  const netPay = Math.max(0, Math.round((grossPay - totalDeductions) * 100) / 100);

  // Compliance check: Overtime must be at least 1.5x base rate
  const isCompliant = overtimeHours === 0 || overtimePay >= overtimeHours * hourlyRate * 1.5 - 0.01;

  return {
    regularHours,
    regularRate: hourlyRate,
    regularPay,
    overtimeHours,
    overtimeRate,
    overtimeMultiplier: OVERTIME_MULTIPLIER,
    overtimePay,
    hazardAllowance,
    shiftDifferential,
    grossPay,
    taxDeductions,
    otherDeductions: deductions,
    totalDeductions,
    netPay,
    isCompliant,
  };
}

export const FATIGUE_CRITICAL_THRESHOLD_HOURS = 12.0;
export const FATIGUE_WARNING_THRESHOLD_HOURS = 10.0;

export interface FatigueEvaluation {
  riskLevel: "CRITICAL" | "HIGH" | "NORMAL";
  isExceeded: boolean;
  excessHours: number;
  recommendation: string;
}

/**
 * Evaluates worker fatigue level against UN SDG 8.8 and fair labor thresholds.
 * Continuous hours > 12.0h triggers CRITICAL fatigue alert requiring mandatory rest.
 * Continuous hours >= 10.0h triggers HIGH fatigue warning.
 */
export function evaluateFatigueRisk(continuousHours: number): FatigueEvaluation {
  if (continuousHours < 0) {
    throw new Error("Continuous hours must be non-negative");
  }

  if (continuousHours > FATIGUE_CRITICAL_THRESHOLD_HOURS) {
    const excess = Math.round((continuousHours - FATIGUE_CRITICAL_THRESHOLD_HOURS) * 10) / 10;
    return {
      riskLevel: "CRITICAL",
      isExceeded: true,
      excessHours: excess,
      recommendation: "Immediate mandatory rest break required. Dispatch relief worker.",
    };
  }

  if (continuousHours >= FATIGUE_WARNING_THRESHOLD_HOURS) {
    return {
      riskLevel: "HIGH",
      isExceeded: false,
      excessHours: 0,
      recommendation: "Approaching fatigue threshold. Schedule 30-minute rest break.",
    };
  }

  return {
    riskLevel: "NORMAL",
    isExceeded: false,
    excessHours: 0,
    recommendation: "Shift within compliant fatigue limits.",
  };
}

/**
 * Formats a numeric value into Indian Rupees (INR - ₹) representation.
 * Uses the Indian numbering system (e.g. ₹12,500.00).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

