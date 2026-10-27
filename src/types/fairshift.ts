export type IndustryType = "construction" | "campus";
export type Language = "en" | "hi" | "ta";

export interface FatigueWorkerRecord {
  id: string;
  name: string;
  workerId: string;
  role: string;
  department: string;
  industry: IndustryType;
  continuousHoursWorked: number; // e.g. 13.5
  currentShiftStart: string;
  consecutiveDays: number;
  fatigueRiskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "NORMAL";
  status: "Mandatory Rest Enforced" | "Active Shift" | "Relief Dispatched";
  baseRate: number;
}

export interface WorkerProfile {
  id: string;
  name: string;
  workerId: string;
  role: string;
  industry: IndustryType;
  baseHourlyRate: number;
  avatarUrl: string;
  hoursWorkedThisWeek: number;
  overtimeHoursThisWeek: number;
  safetyScore: number;
  unionAffiliation: string;
  verifiedBadgesCount: number;
}

export interface ShiftLog {
  id: string;
  date: string;
  shiftName: string;
  location: string;
  regularHours: number;
  overtimeHours: number;
  hazardAllowance: number;
  status: "Completed" | "In Progress" | "Pending Approval";
  supervisorVerified: boolean;
  notes: string;
}

export interface GrievanceReport {
  id: string;
  date: string;
  industry: IndustryType;
  workerAnonymousId: string;
  category: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  sdg8Target: string;
  description: string;
  status: "Submitted" | "Under Review" | "Investigating" | "Resolved";
  recommendedActions: string[];
  immediateSafeguards: string[];
}

export interface SkillBadge {
  id: string;
  title: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  level: "Foundation" | "Advanced" | "Mastery";
  category: "Safety" | "Technical" | "Leadership";
  verificationHash: string;
  iconName: string;
}
