import { describe, it, expect } from "vitest";
import {
  calculateOvertimePay,
  calculateRegularPay,
  calculatePayslip,
  evaluateFatigueRisk,
  OVERTIME_MULTIPLIER,
  FATIGUE_CRITICAL_THRESHOLD_HOURS,
  FATIGUE_WARNING_THRESHOLD_HOURS,
} from "../lib/payslip";

describe("FairShift Labor Standards & Overtime Math (UN SDG 8)", () => {
  it("strictly enforces the 1.5x multiplier constant", () => {
    expect(OVERTIME_MULTIPLIER).toBe(1.5);
  });

  describe("calculateOvertimePay (1.5x Multiplier Verification)", () => {
    it("calculates overtime pay at exactly 1.5x base hourly rate for Construction Site worker", () => {
      const baseHourlyRate = 75.0; // ₹75.00 / hr (₹600/day standard 8h wage)
      const overtimeHours = 10; // 10 OT hours
      // Overtime rate: 75.00 * 1.5 = ₹112.50/hr
      // Total OT Pay: 10 * 112.50 = ₹1,125.00
      const otPay = calculateOvertimePay(overtimeHours, baseHourlyRate);

      expect(otPay).toBe(1125.0);
      expect(otPay / overtimeHours).toBe(baseHourlyRate * 1.5);
    });

    it("calculates overtime pay at exactly 1.5x base hourly rate for Campus Support Staff", () => {
      const baseHourlyRate = 80.0; // ₹80.00 / hr (₹15,000+ monthly equivalent)
      const overtimeHours = 6; // 6 OT hours
      // Overtime rate: 80.00 * 1.5 = ₹120.00/hr
      // Total OT Pay: 6 * 120.00 = ₹720.00
      const otPay = calculateOvertimePay(overtimeHours, baseHourlyRate);

      expect(otPay).toBe(720.0);
      expect(otPay / overtimeHours).toBe(120.0);
    });

    it("handles fractional overtime hours correctly (e.g. 2.5 hours)", () => {
      const baseHourlyRate = 75.0;
      const overtimeHours = 2.5;
      // 2.5 * (75 * 1.5) = 2.5 * 112.50 = 281.25
      const otPay = calculateOvertimePay(overtimeHours, baseHourlyRate);

      expect(otPay).toBe(281.25);
    });

    it("returns 0 pay when overtime hours are 0", () => {
      const otPay = calculateOvertimePay(0, 75.0);
      expect(otPay).toBe(0);
    });

    it("throws an error when negative hours or rates are passed", () => {
      expect(() => calculateOvertimePay(-5, 75.0)).toThrow();
      expect(() => calculateOvertimePay(5, -75.0)).toThrow();
    });
  });

  describe("calculateRegularPay", () => {
    it("calculates standard regular shift pay accurately", () => {
      const regularHours = 40;
      const hourlyRate = 75.0;
      // 40 * 75 = ₹3,000.00
      expect(calculateRegularPay(regularHours, hourlyRate)).toBe(3000.0);
    });
  });

  describe("calculatePayslip Comprehensive Verification", () => {
    it("generates a fully compliant payslip breakdown with 1.5x overtime and allowances in INR", () => {
      const breakdown = calculatePayslip({
        regularHours: 40,
        overtimeHours: 8,
        hourlyRate: 75.0, // Base: ₹3000 regular pay
        hazardAllowance: 450.0, // Indian Metro construction hazard pay
        shiftDifferential: 150.0, // Weekend shift allowance
        deductions: 160.0, // ESI / PF statutory dues
        taxRate: 0.12, // 12% withholding
      });

      // Regular pay = 40 * 75 = ₹3,000
      expect(breakdown.regularPay).toBe(3000.0);

      // Overtime pay = 8 * (75 * 1.5) = 8 * 112.50 = ₹900.00
      expect(breakdown.overtimeRate).toBe(112.5);
      expect(breakdown.overtimePay).toBe(900.0);
      expect(breakdown.overtimeMultiplier).toBe(1.5);

      // Gross pay = 3000 + 900 + 450 + 150 = ₹4,500.00
      expect(breakdown.grossPay).toBe(4500.0);

      // Tax = 4500 * 0.12 = ₹540.00
      expect(breakdown.taxDeductions).toBe(540.0);
      // Total deductions = 540 + 160 = ₹700.00
      expect(breakdown.totalDeductions).toBe(700.0);

      // Net pay = 4500 - 700 = ₹3,800.00
      expect(breakdown.netPay).toBe(3800.0);

      // Verified compliant under Fair Labor Standards
      expect(breakdown.isCompliant).toBe(true);
    });

    it("verifies compliance flag is true when 0 overtime hours are worked", () => {
      const breakdown = calculatePayslip({
        regularHours: 35,
        overtimeHours: 0,
        hourlyRate: 20.0,
      });

      expect(breakdown.overtimePay).toBe(0);
      expect(breakdown.isCompliant).toBe(true);
    });
  });

  describe("Fatigue Risk Threshold Triggers (> 12 Hours Continuous Work)", () => {
    it("enforces the 12.0-hour critical fatigue limit and 10.0-hour warning threshold", () => {
      expect(FATIGUE_CRITICAL_THRESHOLD_HOURS).toBe(12.0);
      expect(FATIGUE_WARNING_THRESHOLD_HOURS).toBe(10.0);
    });

    it("triggers CRITICAL fatigue alert when continuous hours exceed 12 hours (e.g. 13.8 hours)", () => {
      const evaluation = evaluateFatigueRisk(13.8);
      expect(evaluation.riskLevel).toBe("CRITICAL");
      expect(evaluation.isExceeded).toBe(true);
      expect(evaluation.excessHours).toBe(1.8);
      expect(evaluation.recommendation).toContain("Immediate mandatory rest break required");
    });

    it("triggers CRITICAL alert for 12.5 continuous hours", () => {
      const evaluation = evaluateFatigueRisk(12.5);
      expect(evaluation.riskLevel).toBe("CRITICAL");
      expect(evaluation.isExceeded).toBe(true);
      expect(evaluation.excessHours).toBe(0.5);
    });

    it("triggers HIGH warning state for continuous hours between 10.0 and 12.0 hours (e.g. 11.2 hours)", () => {
      const evaluation = evaluateFatigueRisk(11.2);
      expect(evaluation.riskLevel).toBe("HIGH");
      expect(evaluation.isExceeded).toBe(false);
      expect(evaluation.excessHours).toBe(0);
      expect(evaluation.recommendation).toContain("Schedule 30-minute rest break");
    });

    it("evaluates compliant standard shift (< 10 hours) as NORMAL", () => {
      const evaluation = evaluateFatigueRisk(8.0);
      expect(evaluation.riskLevel).toBe("NORMAL");
      expect(evaluation.isExceeded).toBe(false);
      expect(evaluation.excessHours).toBe(0);
      expect(evaluation.recommendation).toContain("compliant");
    });

    it("throws an error if negative continuous hours are supplied", () => {
      expect(() => evaluateFatigueRisk(-3)).toThrow();
    });
  });
});
