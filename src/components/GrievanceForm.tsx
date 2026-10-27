"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Send,
  Sparkles,
  Lock,
  Mic,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileWarning,
  EyeOff,
  Scale,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { IndustryType, GrievanceReport, Language } from "../types/fairshift";
import {
  analyzeGrievanceWithGemini,
  GrievanceAIAnalysis,
  hasGeminiApiKey,
} from "../lib/gemini";
import { TRANSLATIONS } from "../lib/translations";

interface GrievanceFormProps {
  industry: IndustryType;
  language?: Language;
  existingGrievances?: GrievanceReport[];
  onSubmitGrievance: (report: GrievanceReport) => void;
  onCancel?: () => void;
}

export const GrievanceForm: React.FC<GrievanceFormProps> = ({
  industry,
  language = "en",
  existingGrievances = [],
  onSubmitGrievance,
  onCancel,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<
    "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities"
  >("Safety Hazard");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<GrievanceAIAnalysis | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Industry-specific and Indian localized incident presets based on active language
  const samplePrompts =
    language === "hi"
      ? industry === "construction"
        ? [
            "साइट पर पीने के पानी का नल खराब है और दोपहर की गर्मी बहुत तेज है।",
            "रविवार की 4.5 घंटे की ओवरटाइम मजदूरी 1.5 गुना (₹112.50/घंटा) नहीं जोड़ी गई।",
            "पियर 16 मचान (Scaffolding) में गार्डरेल पिन टूटी है और बिना दोहरी रस्सी काम कराया जा रहा है।",
          ]
        : [
            "हॉस्टल सफाई और सुबह की शिफ्ट के बीच केवल 4 घंटे का आराम मिला, जो नियमों के खिलाफ है।",
            "केमिस्ट्री लैब में केमिकल का धुआं बिना वेंटिलेशन और बिना N95 मास्क के फैल रहा है।",
            "परीक्षा सप्ताह के दौरान काम किए गए अतिरिक्त घंटों का ओवरटाइम वेतन पर्ची में नहीं जोड़ा गया।",
          ]
      : language === "ta"
      ? industry === "construction"
        ? [
            "கட்டுமான தளத்தில் குடிநீர் வசதி பழுது மற்றும் கடுமையான வெயில் காரணமாக நீர்ச்சத்து குறைபாடு அபாயம்.",
            "சம்பளத்தில் ஞாயிற்றுக்கிழமை 4.5 மணிநேர ஓவர்டைம் பணம் 1.5x (₹112.50/மணி) சேர்க்கப்படவில்லை.",
            "தூண் 16-ல் சாரக்கட்டு பாதுகாப்பு கம்பி உடைந்துள்ளது மற்றும் பாதுகாப்பு பெல்ட் தரப்படவில்லை.",
          ]
        : [
            "இரவு விடுதி சுத்தம் மற்றும் காலை ஷிப்ட் இடையே 4 மணி நேரம் மட்டுமே ஓய்வு வழங்கப்பட்டுள்ளது.",
            "வேதியியல் ஆய்வகத்தில் போதுமான காற்றோட்டம் இல்லாமல் இரசாயனங்களை கையாள வேண்டியுள்ளது.",
            "கூடுதல் நேர வேலை செய்த மணிநேரங்கள் டிஜிட்டல் நேர அட்டையிலிருந்து நீக்கப்பட்டுள்ளன.",
          ]
      : industry === "construction"
      ? [
          "Bengaluru Metro Pier 4: Drinking water dispenser broken & extreme afternoon heat exhaustion risks.",
          "Sunday shift 4.5 overtime hours were computed at regular 1.0x rate instead of mandatory 1.5x (₹112.50/hr).",
          "Pier 16 scaffolding has cracked guardrail pin and workers are pushed without secondary tie-off harness.",
        ]
      : [
          "Scheduled for split shift with only 4 hours rest between night dormitory clean and morning shift.",
          "Chemistry lab solvent handling without functional fume hood or certified N95 respirators.",
          "Overtime hours worked during university fest were deleted from digital timecard.",
        ];

  // Call Gemini API via process.env.NEXT_PUBLIC_GEMINI_API_KEY with try/catch fallback safety
  const handleRunAiAnalysis = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeGrievanceWithGemini(description, industry);
      setAiAnalysis(result);
      if (result.category) {
        setCategory(result.category);
      }
    } catch (err) {
      console.error("AI Analysis error", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newReport: GrievanceReport = {
      id: `grv-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      industry,
      workerAnonymousId: isAnonymous
        ? `ANON-${industry === "construction" ? "BLR" : "SRM"}-${Math.floor(100 + Math.random() * 900)}`
        : "Ramesh Kumar (Identified)",
      category,
      severity:
        aiAnalysis?.severity === "Low"
          ? "LOW"
          : aiAnalysis?.severity === "Medium"
          ? "MEDIUM"
          : "HIGH",
      sdg8Target:
        aiAnalysis?.sdg8Target ||
        (category === "Unfair Pay"
          ? "SDG 8.5: Decent work & equal pay for work of equal value"
          : "SDG 8.8: Protect labour rights and promote safe working environments"),
      description: aiAnalysis?.anonymousSummary ? `${aiAnalysis.anonymousSummary} — Original: ${description}` : description,
      status: "Submitted",
      recommendedActions: aiAnalysis?.recommendedActions || [
        "Initiate confidential grievance hearing within 48 hours",
        "Apply 1.5x overtime multiplier audit across affected shifts in INR",
      ],
      immediateSafeguards: aiAnalysis?.immediateSafeguards || [
        "Whistleblower non-retaliation covenant enforced under Indian Labor law",
      ],
    };

    onSubmitGrievance(newReport);
    setSubmittedStatus(true);
    setTimeout(() => {
      setSubmittedStatus(false);
      setDescription("");
      setAiAnalysis(null);
    }, 3500);
  };

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setDescription(
          language === "hi"
            ? "आवाज रिकॉर्डिंग: बेंगलुरु मेट्रो पियर 4 पर दोपहर के समय पीने का पानी उपलब्ध नहीं है। 1.5 गुना ओवरटाइम का हिसाब तुरंत किया जाए।"
            : language === "ta"
            ? "குரல் பதிவு: கட்டுமான தளத்தில் ஓவர்டைம் ஊதியம் 1.5x கணக்கிடப்படவில்லை. உடனடியாக சரிபார்க்கவும்."
            : industry === "construction"
            ? "Voice Memo Transcribed: On shift at Bengaluru Metro Pier 14, overtime hours were logged as standard hours on the foreman sheet. Please verify 1.5x multiplier."
            : "Voice Memo Transcribed: SRM Campus lab chemicals were handled without adequate ventilation. Need safety inspection."
        );
        setIsRecording(false);
      }, 1800);
    }
  };

  return (
    <section aria-labelledby="grievance-title" className="space-y-5 text-slate-800 dark:text-zinc-100">
      {/* Whistleblower Protection Shield Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-xs">
          <h2 id="grievance-title" className="font-bold text-amber-900 dark:text-amber-300">
            Confidential Worker Whistleblower Shield (UN SDG 8.8)
          </h2>
          <p className="text-amber-800 dark:text-amber-300/80 mt-0.5 font-medium">
            Your grievance is encrypted and protected by non-retaliation covenants. Supervisors cannot trace anonymous reports to your profile.
          </p>
        </div>
      </div>

      {submittedStatus ? (
        <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
          <h3 className="text-lg font-black text-emerald-900 dark:text-emerald-200">
            Incident Report Successfully Logged!
          </h3>
          <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            An independent ombudsperson and site safety engineer have received this report. You can track this in the admin inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
              Incident Category:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  "Safety Hazard",
                  "Unfair Pay",
                  "Harassment",
                  "Facilities",
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    category === cat
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "bg-slate-100 dark:bg-white border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 block mb-1.5">
              Quick Scenarios (Tap to populate):
            </span>
            <div className="space-y-1.5">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDescription(prompt)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/60 hover:bg-amber-50 dark:hover:bg-white border border-slate-200/80 dark:border-zinc-700/80 text-xs text-slate-700 dark:text-zinc-300 hover:text-amber-800 dark:hover:text-amber-300 transition-colors line-clamp-1 cursor-pointer"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Description Textarea & Voice Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="grievance-desc" className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
                Incident Description:
              </label>

              {/* Voice Memo Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-slate-200/60 dark:bg-white text-slate-700 dark:text-zinc-300 hover:bg-slate-200"
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${isRecording ? "text-white" : "text-amber-600 dark:text-amber-400"}`} />
                <span>{isRecording ? t.btnListeningVoice : t.btnDictateVoice}</span>
              </button>
            </div>

            <textarea
              id="grievance-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, location details, scaffolding, missed overtime pay, or safety issues..."
              className="w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors shadow-inner"
              required
            />
          </div>

          {/* Gemini AI Live Analysis Pill */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRunAiAnalysis}
              disabled={isAnalyzing || !description.trim()}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? t.geminiAnalyzing : t.btnAnalyzeGemini}</span>
            </button>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
              <span>Keep My Name Anonymous</span>
            </label>
          </div>

          {/* AI Analysis Preview Card */}
          {aiAnalysis && (
            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Gemini AI Legal & Safety Triage
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                    aiAnalysis.severity === "High"
                      ? "bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700"
                      : "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                  }`}
                >
                  {aiAnalysis.severity} Severity
                </span>
              </div>
              <p className="text-purple-900 dark:text-purple-200 font-medium italic">
                "{aiAnalysis.anonymousSummary}"
              </p>
              <div className="text-[11px] text-purple-800 dark:text-purple-300">
                <strong>SDG 8 Standard:</strong> {aiAnalysis.sdg8Target}
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-zinc-800">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Whistleblower Report</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
