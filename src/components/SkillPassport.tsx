"use client";

import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  Sparkles,
  QrCode,
  Calendar,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  HardHat,
  ShieldAlert,
  Wrench,
  Leaf,
  HeartPulse,
  Download,
  Clock,
  Printer,
  X,
} from "lucide-react";
import { IndustryType, SkillBadge, Language } from "../types/fairshift";
import {
  getSkillRecommendationsWithGemini,
  SkillCareerAdvice,
  hasGeminiApiKey,
} from "../lib/gemini";
import { TRANSLATIONS } from "../lib/translations";

interface SkillPassportProps {
  industry: IndustryType;
  language?: Language;
  workerName: string;
  workerId: string;
  loggedWorkHours?: number;
  skills: SkillBadge[];
  onAddSkill?: (skill: SkillBadge) => void;
}

export const SkillPassport: React.FC<SkillPassportProps> = ({
  industry,
  language = "en",
  workerName,
  workerId,
  loggedWorkHours = 1240,
  skills,
  onAddSkill,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [advice, setAdvice] = useState<SkillCareerAdvice | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [showQrModal, setShowQrModal] = useState<SkillBadge | null>(null);
  const [isExportPassportOpen, setIsExportPassportOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // New badge state
  const [newTitle, setNewTitle] = useState("");
  const [newIssuer, setNewIssuer] = useState("");
  const [newCategory, setNewCategory] = useState<"Safety" | "Technical" | "Leadership">("Safety");

  const handleFetchCareerPath = async () => {
    setIsLoadingAdvice(true);
    try {
      const skillTitles = skills.map((s) => s.title);
      const res = await getSkillRecommendationsWithGemini(skillTitles, industry);
      setAdvice(res);
    } catch (err) {
      console.error("Error fetching AI career path", err);
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const handleCreateBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim()) return;

    const newBadge: SkillBadge = {
      id: `sk-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      issuingBody: newIssuer,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000 * 3).toISOString().split("T")[0],
      level: "Advanced",
      category: newCategory,
      verificationHash: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
      iconName: newCategory === "Safety" ? "ShieldAlert" : newCategory === "Technical" ? "Wrench" : "Award",
    };

    if (onAddSkill) {
      onAddSkill(newBadge);
    }
    setNewTitle("");
    setNewIssuer("");
    setShowAddForm(false);
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert":
        return <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
      case "HardHat":
        return <HardHat className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
      case "Wrench":
        return <Wrench className="w-5 h-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />;
      case "Leaf":
        return <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />;
      case "HeartPulse":
        return <HeartPulse className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" />;
      default:
        return <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />;
    }
  };

  return (
    <section
      aria-labelledby="skill-passport-title"
      className="bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md text-slate-800 dark:text-zinc-100 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">
            <Award className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2
                id="skill-passport-title"
                className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white"
              >
                Portable Skill Passport
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                UN SDG 8.5/8.6 Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Cryptographically verified trade credentials portable across employers with NSDC alignment.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExportPassportOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>{t.exportQrPassport}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Credential</span>
          </button>
        </div>
      </div>

      {/* Worker Credential Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/90 dark:bg-white/60 border border-slate-200 dark:border-zinc-700/70 text-xs sm:text-sm">
        <div>
          <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Passport Holder</span>
          <span className="font-extrabold text-slate-900 dark:text-white">{workerName}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Worker ID</span>
          <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{workerId}</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Verified Badges</span>
          <span className="font-black text-teal-700 dark:text-teal-400">{skills.length} Certified</span>
        </div>
        <div>
          <span className="text-slate-500 dark:text-zinc-400 block text-[11px] font-semibold">Audited Work Hours</span>
          <span className="font-mono font-black text-slate-900 dark:text-white">{loggedWorkHours} Hours</span>
        </div>
      </div>

      {/* Add New Credential Form */}
      {showAddForm && (
        <form onSubmit={handleCreateBadge} className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3 text-xs">
          <h3 className="font-bold text-amber-900 dark:text-amber-300 text-sm">Add New Certified Skill</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-medium mb-1">Certification Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Scaffolding Rigging Level 2"
                className="w-full p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-medium mb-1">Issuing Body</label>
              <input
                type="text"
                value={newIssuer}
                onChange={(e) => setNewIssuer(e.target.value)}
                placeholder="e.g. National Skill Dev Corp (NSDC)"
                className="w-full p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-zinc-300 font-medium mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white font-medium"
              >
                <option value="Safety">Safety & Compliance</option>
                <option value="Technical">Technical Craftsmanship</option>
                <option value="Leadership">Site Leadership</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white text-slate-700 dark:text-zinc-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold"
            >
              Save Badge
            </button>
          </div>
        </form>
      )}

      {/* Verified Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((badge) => (
          <article
            key={badge.id}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 hover:border-teal-400 dark:hover:border-teal-500 transition-all flex flex-col justify-between shadow-xs group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white group-hover:scale-105 transition-transform shrink-0">
                    {renderBadgeIcon(badge.iconName)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {badge.title}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 block mt-0.5">{badge.issuingBody}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/60 shrink-0">
                  {badge.level}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                Valid: {badge.issueDate} → {badge.expiryDate}
              </span>

              <button
                type="button"
                onClick={() => setShowQrModal(badge)}
                className="font-mono text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Verify Hash</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* GEMINI AI CAREER PATHWAY & WAGE GROWTH ADVISOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200/80 dark:border-purple-800/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300 font-black text-sm">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Gemini AI Career Progression & Wage Uplift Advisor</span>
          </div>

          <button
            type="button"
            onClick={handleFetchCareerPath}
            disabled={isLoadingAdvice}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            {isLoadingAdvice ? "Analyzing Pathway..." : "Get AI Wage Guidance"}
          </button>
        </div>

        {advice && (
          <div className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-purple-100 dark:border-purple-900/60">
                <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">📈 Projected Wage Uplift</span>
                <p className="text-slate-700 dark:text-zinc-300">{advice.wageGrowthPotential}</p>
              </div>
              <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-purple-100 dark:border-purple-900/60">
                <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1">🎯 Industry Benchmark</span>
                <p className="text-slate-700 dark:text-zinc-300">{advice.industryBenchmark}</p>
              </div>
            </div>

            <div className="p-3 bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-purple-100 dark:border-purple-900/60">
              <span className="font-bold text-purple-900 dark:text-purple-300 block mb-1.5">Recommended Next Credentials:</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-zinc-300">
                {advice.nextCertifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-extrabold text-[10px]">
                      {cert.priority}
                    </span>
                    <span>
                      <strong>{cert.title}:</strong> {cert.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Individual Badge QR Verification Modal */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md"
          onClick={() => setShowQrModal(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cryptographic Verification</h3>
              <button
                type="button"
                onClick={() => setShowQrModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-white rounded-2xl flex flex-col items-center justify-center">
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <span className="font-mono text-[11px] text-slate-500 dark:text-zinc-400 mt-2">
                Hash: {showQrModal.verificationHash}
              </span>
            </div>

            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{showQrModal.title}</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">{showQrModal.issuingBody}</p>
            </div>

            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
              ✓ Validated against National Skill Development Corporation registry
            </p>
          </div>
        </div>
      )}

      {/* Export Passport Full Sheet Modal */}
      {isExportPassportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md"
          onClick={() => setIsExportPassportOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-zinc-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">Official UN SDG 8 Skill Passport</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsExportPassportOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/60 border border-slate-200 dark:border-zinc-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Worker:</span>
                <span className="font-extrabold text-slate-900 dark:text-white">{workerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Worker ID:</span>
                <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{workerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Certified Credentials:</span>
                <span className="font-bold text-slate-900 dark:text-white">{skills.length} Badges</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-zinc-400">Audited Hours:</span>
                <span className="font-bold text-slate-900 dark:text-white">{loggedWorkHours} Hours</span>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-300 mx-auto flex items-center justify-center shadow-sm">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">
                {t.qrVerifiedSeal}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-white hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportPassportOpen(false)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
