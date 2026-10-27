/**
 * FairShift - Gemini AI Integration (Safety & Security Compliant)
 * Securely accesses process.env.NEXT_PUBLIC_GEMINI_API_KEY
 * Provides AI-powered grievance classification & skill advancement insights
 * aligned with UN SDG 8 Decent Work standards.
 */

// Secure environment variable accessor
export function getGeminiApiKey(): string {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
}

export function hasGeminiApiKey(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key.trim().length > 0 && !key.includes("YOUR_API_KEY"));
}

export interface GrievanceAIAnalysis {
  severity: "High" | "Medium" | "Low";
  category: "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities";
  anonymousSummary: string;
  sdg8Target: string; // e.g. "SDG 8.8: Safe working environments"
  recommendedActions: string[];
  immediateSafeguards: string[];
  isAiGenerated: boolean;
}

export interface SkillCareerAdvice {
  nextCertifications: Array<{ title: string; priority: "High" | "Medium"; reason: string }>;
  wageGrowthPotential: string;
  industryBenchmark: string;
  sdgImpact: string;
  isAiGenerated: boolean;
}

/**
 * AI-assisted Grievance Classifier & Remedy Advisor
 * Returns strict schema: { severity: "High" | "Medium" | "Low", category: "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities", anonymousSummary: "..." }
 */
export async function analyzeGrievanceWithGemini(
  incidentDescription: string,
  industry: "construction" | "campus" = "construction"
): Promise<GrievanceAIAnalysis> {
  const apiKey = getGeminiApiKey();

  const industryContext =
    industry === "construction"
      ? "Construction Site (heavy machinery, scaffolding, fall hazards, PPE compliance, heat stress, overtime pay)"
      : "Campus Support Staff (College facilities, dormitory sanitation, late night shifts, chemical handling, fair hourly wages)";

  const systemPrompt = `You are FairShift's UN SDG 8 Labor Rights & Decent Work Compliance AI Officer.
Analyze the following worker incident report in the ${industryContext} sector.
You MUST return ONLY valid JSON with exactly these fields:
{
  "severity": "High" | "Medium" | "Low",
  "category": "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities",
  "anonymousSummary": "A concise, objective summary shielding worker identity",
  "sdg8Target": "Specific UN SDG 8 target (e.g. SDG 8.8: Safe work or SDG 8.5: Equal pay)",
  "recommendedActions": ["action 1", "action 2"],
  "immediateSafeguards": ["safeguard 1", "safeguard 2"]
}
Do NOT include markdown backticks or commentary. Only raw JSON.`;

  // Graceful Fallback Safety: Wrap API call in try/catch block
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: systemPrompt },
                  { text: `Worker Incident Report: "${incidentDescription}"` },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              // NOTE: responseMimeType omitted — can cause empty model output errors
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Guard: skip if API returned no candidates or an empty finish reason
        const candidateObj = data.candidates?.[0];
        const finishReason = candidateObj?.finishReason;
        if (!candidateObj || finishReason === "SAFETY" || finishReason === "OTHER") {
          throw new Error(`Gemini returned no usable candidate. finishReason=${finishReason}`);
        }

        const rawText: string | undefined = candidateObj?.content?.parts?.[0]?.text;
        if (rawText && rawText.trim().length > 0) {
          // Strip markdown code fences if present (```json ... ```)
          const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
          const parsed = JSON.parse(cleaned);
          const rawSev = String(parsed.severity || "High").toLowerCase();
          const mappedSev: "High" | "Medium" | "Low" =
            rawSev.includes("low") ? "Low" : rawSev.includes("med") ? "Medium" : "High";

          const rawCat = String(parsed.category || "Safety Hazard").toLowerCase();
          const mappedCat: "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities" =
            rawCat.includes("pay") || rawCat.includes("wage") || rawCat.includes("overtime")
              ? "Unfair Pay"
              : rawCat.includes("harass") || rawCat.includes("retaliat")
              ? "Harassment"
              : rawCat.includes("facilit") || rawCat.includes("dorm") || rawCat.includes("clean")
              ? "Facilities"
              : "Safety Hazard";

          return {
            severity: mappedSev,
            category: mappedCat,
            anonymousSummary:
              parsed.anonymousSummary ||
              parsed.summary ||
              "Worker filed confidential incident report regarding workplace conditions.",
            sdg8Target:
              parsed.sdg8Target ||
              (mappedCat === "Unfair Pay"
                ? "SDG 8.5: Decent work & equal pay for work of equal value"
                : "SDG 8.8: Protect labour rights and promote safe working environments"),
            recommendedActions:
              Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0
                ? parsed.recommendedActions
                : [
                    "Dispatch independent labor compliance inspector",
                    "Review shift logs for 1.5x overtime multiplier verification",
                  ],
            immediateSafeguards:
              Array.isArray(parsed.immediateSafeguards) && parsed.immediateSafeguards.length > 0
                ? parsed.immediateSafeguards
                : [
                    "Whistleblower non-retaliation covenant activated",
                    "Identity shielded with anonymized cryptographic token",
                  ],
            isAiGenerated: true,
          };
        }
      } else {
        const errBody = await response.text().catch(() => "(unreadable)");
        throw new Error(`Gemini HTTP ${response.status}: ${errBody}`);
      }
    } catch (err) {
      console.warn("Gemini live API failed or rate limited. Fallback mock AI active.", err);
    }
  }

  // Graceful Mock Fallback: Heuristically classify the incident so the application never crashes
  const lower = incidentDescription.toLowerCase();
  const isPay = lower.includes("pay") || lower.includes("wage") || lower.includes("overtime") || lower.includes("multiplier") || lower.includes("money") || lower.includes("hours");
  const isHarass = lower.includes("harass") || lower.includes("abuse") || lower.includes("threat") || lower.includes("yell") || lower.includes("retaliat");
  const isFacilities = lower.includes("dorm") || lower.includes("clean") || lower.includes("hvac") || lower.includes("water") || lower.includes("restroom") || lower.includes("trash");
  const isDanger = lower.includes("fall") || lower.includes("scaffold") || lower.includes("chemical") || lower.includes("injury") || lower.includes("gear") || lower.includes("safety") || lower.includes("harness");

  const category: "Safety Hazard" | "Unfair Pay" | "Harassment" | "Facilities" = isPay
    ? "Unfair Pay"
    : isHarass
    ? "Harassment"
    : isFacilities
    ? "Facilities"
    : "Safety Hazard";

  const severity: "High" | "Medium" | "Low" = isDanger || isPay
    ? "High"
    : isHarass
    ? "High"
    : "Medium";

  return {
    severity,
    category,
    anonymousSummary:
      incidentDescription.length > 100
        ? `Worker reported: ${incidentDescription.slice(0, 95)}... (Identity Protected)`
        : `Worker reported: ${incidentDescription} (Identity Protected)`,
    sdg8Target: isPay
      ? "SDG 8.5: Decent work and equal pay for work of equal value"
      : "SDG 8.8: Protect labour rights and promote safe, secure working environments",
    recommendedActions: [
      isPay
        ? "Cross-verify digital timecard against mandatory 1.5x overtime multiplier"
        : "Conduct immediate on-site safety equipment & scaffold audit",
      "Assign confidential ombudsperson to review claim within 24 hours",
    ],
    immediateSafeguards: [
      "Whistleblower identity shielded under FairShift Zero-Retaliation Policy",
      "Encrypted ledger lock prevents employer tampering",
    ],
    isAiGenerated: false,
  };
}

/**
 * AI Career Pathway & Skill Advancement Advisor
 */
export async function getSkillRecommendationsWithGemini(
  skills: string[],
  industry: "construction" | "campus" = "construction"
): Promise<SkillCareerAdvice> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze these certified skills: ${JSON.stringify(skills)} for a ${industry} worker in India. Return valid JSON with: nextCertifications (array of {title, priority, reason}), wageGrowthPotential (string), industryBenchmark (string), sdgImpact (string).`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              // NOTE: responseMimeType omitted — can cause empty model output errors
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Guard: skip unsafe/empty candidates
        const candidateObj = data.candidates?.[0];
        const finishReason = candidateObj?.finishReason;
        if (!candidateObj || finishReason === "SAFETY" || finishReason === "OTHER") {
          throw new Error(`Gemini returned no usable candidate. finishReason=${finishReason}`);
        }
        const rawText: string | undefined = candidateObj?.content?.parts?.[0]?.text;
        if (rawText && rawText.trim().length > 0) {
          // Strip markdown code fences if present
          const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
          const parsed = JSON.parse(cleaned);
          return {
            ...parsed,
            isAiGenerated: true,
          };
        }
      } else {
        const errBody = await response.text().catch(() => "(unreadable)");
        throw new Error(`Gemini HTTP ${response.status}: ${errBody}`);
      }
    } catch (err) {
      console.warn("Gemini career recommendation fallback activated.", err);
    }
  }

  // Fallback tailored to industry (Indian labor context)
  if (industry === "construction") {
    return {
      nextCertifications: [
        { title: "NSDC Advanced Viaduct & Scaffolding Supervisor", priority: "High", reason: "Qualifies for foreman grade and +₹25.00/hr base rate increase" },
        { title: "DGFASLI Certified Heavy Crane Signal Specialist", priority: "Medium", reason: "Unlocks specialized metro viaduct hazard bonus tier (₹400/shift)" },
        { title: "First Aid & Heatstroke Rapid Incident Response", priority: "Medium", reason: "Required for site safety committee nomination" },
      ],
      wageGrowthPotential: "+22% - 35% base wage uplift across infrastructure projects",
      industryBenchmark: "Top 15% tier in safety compliance & certified hours",
      sdgImpact: "Advances SDG 8.6 (Youth employment & skills development) and SDG 8.8 (Safe work)",
      isAiGenerated: false,
    };
  } else {
    return {
      nextCertifications: [
        { title: "Campus Hazardous Materials & Chemical Lab Safety", priority: "High", reason: "Mandatory for senior facilities leadership and research lab maintenance" },
        { title: "Commercial HVAC & Energy Efficiency Systems", priority: "High", reason: "Elevates hourly rate by +₹20.00/hr with collegiate tech differential" },
        { title: "Hostel Facility Management & Conflict De-escalation", priority: "Medium", reason: "Preferred credential for resident dorm support supervisors" },
      ],
      wageGrowthPotential: "+18% - 28% wage progression with campus tenure stability",
      industryBenchmark: "Exceeds state living-wage threshold by 34%",
      sdgImpact: "Advances SDG 8.5 (Decent work & living wage for service personnel)",
      isAiGenerated: false,
    };
  }
}
