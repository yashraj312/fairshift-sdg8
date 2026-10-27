'use client';

import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { WorkerMobileInterface } from "../components/WorkerMobileInterface";
import { AdminDashboard } from "../components/AdminDashboard";
import { PayslipModal } from "../components/PayslipModal";
import { GrievanceForm } from "../components/GrievanceForm";
import { SkillPassport } from "../components/SkillPassport";
import { INDUSTRY_DATA } from "../lib/mockData";
import {
  IndustryType,
  ShiftLog,
  GrievanceReport,
  SkillBadge,
  Language,
} from "../types/fairshift";
import { Globe2, X, BatteryCharging, Wifi, Signal } from "lucide-react";

export default function Home() {
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType>("construction");
  const [activeView, setActiveView] = useState<"worker" | "admin">("worker");
  const [language, setLanguage] = useState<Language>("en");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [activeModal, setActiveModal] = useState<"none" | "payslip" | "grievance" | "skills">("none");

  const [shiftsData, setShiftsData] = useState<Record<IndustryType, ShiftLog[]>>({
    construction: INDUSTRY_DATA.construction.shifts,
    campus: INDUSTRY_DATA.campus.shifts,
  });
  const [grievancesData, setGrievancesData] = useState<Record<IndustryType, GrievanceReport[]>>({
    construction: INDUSTRY_DATA.construction.grievances,
    campus: INDUSTRY_DATA.campus.grievances,
  });
  const [skillsData, setSkillsData] = useState<Record<IndustryType, SkillBadge[]>>({
    construction: INDUSTRY_DATA.construction.skills,
    campus: INDUSTRY_DATA.campus.skills,
  });

  const industryConfig = INDUSTRY_DATA[currentIndustry];
  const activeShifts = shiftsData[currentIndustry];
  const activeGrievances = grievancesData[currentIndustry];
  const activeSkills = skillsData[currentIndustry];

  const handleClockOutNewShift = (newShift: ShiftLog) => {
    setShiftsData((prev) => ({ ...prev, [currentIndustry]: [newShift, ...prev[currentIndustry]] }));
  };
  const handleAddGrievance = (report: GrievanceReport) => {
    setGrievancesData((prev) => ({ ...prev, [currentIndustry]: [report, ...prev[currentIndustry]] }));
    setActiveModal("none");
  };
  const handleResolveGrievance = (id: string) => {
    setGrievancesData((prev) => ({
      ...prev,
      [currentIndustry]: prev[currentIndustry].map((g) => g.id === id ? { ...g, status: "Resolved" } : g),
    }));
  };
  const handleApproveShift = (id: string) => {
    setShiftsData((prev) => ({
      ...prev,
      [currentIndustry]: prev[currentIndustry].map((s) => s.id === id ? { ...s, supervisorVerified: true } : s),
    }));
  };
  const handleAddSkill = (skill: SkillBadge) => {
    setSkillsData((prev) => ({ ...prev, [currentIndustry]: [skill, ...prev[currentIndustry]] }));
  };

  // â”€â”€â”€ Shorthand theme helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const dm = isDarkMode;
  // Modal backdrop
  const modalBackdrop = dm
    ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md overflow-y-auto";
  // Modal inner card
  const modalCard = (maxW: string) => dm
    ? `w-full ${maxW} bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 shadow-2xl relative my-8 text-zinc-100`
    : `w-full ${maxW} bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl relative my-8 text-slate-900`;
  // Modal header border
  const modalHeaderBorder = dm ? "border-b border-zinc-800 pb-3 mb-4 flex items-center justify-between" : "border-b border-slate-100 pb-3 mb-4 flex items-center justify-between";
  // Modal close button
  const modalCloseBtn = dm
    ? "p-2 rounded-xl bg-white hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
    : "p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors";
  // Footer
  const footerCls = dm
    ? "mt-16 border-t border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md py-6 text-xs text-slate-600 transition-colors duration-300"
    : "mt-16 border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-6 text-xs text-slate-500 transition-colors duration-300";

  return (
    <div className={isDarkMode ? "min-h-screen bg-zinc-950 text-zinc-100 transition-colors duration-300" : "min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-amber-50/30 text-slate-900 transition-colors duration-300"}>

      {/* â”€â”€ Ambient glow blobs â”€â”€ */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {dm ? (
          <>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
            <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-emerald-300/8 blur-3xl" />
          </>
        )}
      </div>

      {/* PERSISTENT TOP HEADER SWITCHER */}
      <Navbar
        currentIndustry={currentIndustry}
        onIndustryChange={setCurrentIndustry}
        activeView={activeView}
        onViewChange={setActiveView}
        language={language}
        onLanguageChange={setLanguage}
        theme={dm ? "dark" : "light"}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* MAIN VIEWPORT */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* VIEW MODE 1: WORKER MOBILE INTERFACE */}
        {activeView === "worker" && (
          <div className="flex flex-col items-center">
            {isMobileFrame ? (
              <div className={`w-full max-w-[420px] border-4 rounded-[48px] p-3 shadow-2xl relative overflow-hidden ${dm ? "bg-white border-zinc-700/80" : "bg-slate-900 border-slate-700/80"}`}>
                <div className={`rounded-[38px] p-3 pb-6 border shadow-inner ${dm ? "bg-zinc-900 border-zinc-700" : "bg-slate-50 border-slate-200"}`}>
                  <div className={`flex items-center justify-between px-3 pt-1 pb-3 text-[11px] font-mono ${dm ? "text-zinc-400" : "text-slate-500"}`}>
                    <span className={`font-bold ${dm ? "text-white" : "text-slate-800"}`}>09:41</span>
                    <div className={`w-16 h-4 rounded-full mx-auto ${dm ? "bg-zinc-600/80" : "bg-slate-300/80"}`} />
                    <div className="flex items-center gap-1.5">
                      <Signal className={`w-3.5 h-3.5 ${dm ? "text-zinc-400" : "text-slate-600"}`} />
                      <Wifi className={`w-3.5 h-3.5 ${dm ? "text-zinc-400" : "text-slate-600"}`} />
                      <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <WorkerMobileInterface
                    language={language} onLanguageChange={setLanguage}
                    industry={currentIndustry} onIndustryChange={setCurrentIndustry}
                    worker={industryConfig.worker}
                    onOpenPayslip={() => setActiveModal("payslip")}
                    onOpenGrievance={() => setActiveModal("grievance")}
                    onOpenSkillPassport={() => setActiveModal("skills")}
                    onClockOutNewShift={handleClockOutNewShift}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md">
                <WorkerMobileInterface
                  language={language} onLanguageChange={setLanguage}
                  industry={currentIndustry} onIndustryChange={setCurrentIndustry}
                  worker={industryConfig.worker}
                  onOpenPayslip={() => setActiveModal("payslip")}
                  onOpenGrievance={() => setActiveModal("grievance")}
                  onOpenSkillPassport={() => setActiveModal("skills")}
                  onClockOutNewShift={handleClockOutNewShift}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW MODE 2: EMPLOYER / ADMIN DASHBOARD */}
        {activeView === "admin" && (
          <AdminDashboard
            industry={currentIndustry} onIndustryChange={setCurrentIndustry}
            shifts={activeShifts} grievances={activeGrievances}
            fatigueWorkers={industryConfig.fatigueWorkers} skills={activeSkills}
            baseHourlyRate={industryConfig.defaultHourlyRate}
            activeWorkforceCount={industryConfig.activeWorkforceCount}
            openHazardsCount={industryConfig.openHazardsCount}
            totalOvertimeSpend={industryConfig.totalOvertimeSpend}
            onResolveGrievance={handleResolveGrievance}
            onApproveShift={handleApproveShift}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* â”€â”€ MODALS â”€â”€ */}
      <PayslipModal
        isOpen={activeModal === "payslip"} onClose={() => setActiveModal("none")}
        language={language} workerName={industryConfig.worker.name}
        workerId={industryConfig.worker.workerId} role={industryConfig.worker.role}
        industry={currentIndustry} baseHourlyRate={industryConfig.worker.baseHourlyRate}
        initialRegularHours={industryConfig.worker.hoursWorkedThisWeek}
        initialOvertimeHours={industryConfig.worker.overtimeHoursThisWeek}
        initialHazardAllowance={currentIndustry === "construction" ? 150 : 80}
        recentShifts={activeShifts}
      />

      {activeModal === "grievance" && (
        <div role="dialog" aria-modal="true" aria-labelledby="grievance-modal-title"
          className={modalBackdrop} onClick={() => setActiveModal("none")}>
          <div className={modalCard("max-w-2xl")} onClick={(e) => e.stopPropagation()}>
            <div className={modalHeaderBorder}>
              <h2 id="grievance-modal-title" className={`text-lg font-black ${dm ? "text-white" : "text-slate-900"}`}>
                Confidential Incident &amp; Grievance
              </h2>
              <button type="button" onClick={() => setActiveModal("none")}
                className={modalCloseBtn} aria-label="Close grievance modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <GrievanceForm industry={currentIndustry} language={language}
              existingGrievances={activeGrievances} onSubmitGrievance={handleAddGrievance}
              onCancel={() => setActiveModal("none")} />
          </div>
        </div>
      )}

      {activeModal === "skills" && (
        <div role="dialog" aria-modal="true" aria-labelledby="skills-modal-title"
          className={modalBackdrop} onClick={() => setActiveModal("none")}>
          <div className={modalCard("max-w-3xl")} onClick={(e) => e.stopPropagation()}>
            <div className={modalHeaderBorder}>
              <h2 id="skills-modal-title" className={`text-lg font-black ${dm ? "text-white" : "text-slate-900"}`}>
                Verified Skill Passport
              </h2>
              <button type="button" onClick={() => setActiveModal("none")}
                className={modalCloseBtn} aria-label="Close skill passport modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SkillPassport industry={currentIndustry} language={language}
              workerName={industryConfig.worker.name} workerId={industryConfig.worker.workerId}
              loggedWorkHours={1420} skills={activeSkills} onAddSkill={handleAddSkill} />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={footerCls}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className={`flex items-center gap-2 ${dm ? "text-zinc-300" : "text-slate-700"}`}>
            <Globe2 className={`w-4 h-4 ${dm ? "text-emerald-400" : "text-emerald-600"}`} aria-hidden="true" />
            <span className="font-medium">FairShift UI Shell • UN SDG 8 (Decent Work &amp; Economic Growth)</span>
          </div>
          <div className={`flex items-center gap-4 font-medium ${dm ? "text-zinc-400" : "text-slate-600"}`}>
            <span>Mandatory 1.5x Overtime Multiplier</span>
            <span>•</span>
            <span>&lt; 12h Continuous Fatigue Guard</span>
            <span>•</span>
            <span>Multilingual (EN / हिन्दी / தமிழ்)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
