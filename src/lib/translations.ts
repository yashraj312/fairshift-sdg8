import { Language } from "../types/fairshift";

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  workerView: string;
  adminView: string;
  industryConstruction: string;
  industryCampus: string;
  activeIndustryBadge: string;
  
  // Worker Portal / Mobile Interface
  welcomeWorker: string;
  shiftDurationLabel: string;
  dailyEarningsEst: string;
  overtimeIncludedNotice: string;
  quickBreakTimer: string;
  restBreakStart: string;
  restBreakRunning: string;
  restBreakStop: string;
  restMinutes: string;
  hydrationAlert: string;
  
  // Large Touch Target Grid Actions
  actionCheckInOut: string;
  actionCheckInDesc: string;
  actionViewPayslip: string;
  actionViewPayslipDesc: string;
  actionReportHazard: string;
  actionReportHazardDesc: string;
  actionSkillPassport: string;
  actionSkillPassportDesc: string;
  
  // Clock Status
  statusOnShift: string;
  statusClockedOut: string;
  btnClockIn: string;
  btnClockOut: string;

  // Step-by-Step Payslip Breakdown Translations
  payslipModalTitle: string;
  payslipModalSubtitle: string;
  step1BaseEarnings: string;
  step1Explanation: string;
  step2OvertimeBonus: string;
  step2Explanation: string;
  step3Allowances: string;
  step3Explanation: string;
  step4NetPayout: string;
  step4Explanation: string;
  mathFormulaNotice: string;
  interactiveSimulatorHeading: string;
  interactiveSimulatorDesc: string;
  
  // Grievance Status
  statusSubmitted: string;
  statusUnderReview: string;
  statusResolved: string;
  btnDictateVoice: string;
  btnListeningVoice: string;
  btnAnalyzeGemini: string;
  geminiAnalyzing: string;

  // Skill Passport
  exportQrPassport: string;
  qrVerifiedSeal: string;

  // Admin Dashboard
  adminTitle: string;
  adminSubtitle: string;
  metricWorkforce: string;
  metricOpenHazards: string;
  metricFatigueRisk: string;
  metricOvertimeSpend: string;
  
  // Tabs
  tabOverview: string;
  tabGrievances: string;
  tabSkills: string;
  
  // Fatigue Panel
  fatiguePanelTitle: string;
  fatiguePanelDesc: string;
  workerNameCol: string;
  hoursWorkedCol: string;
  riskStatusCol: string;
  actionEnforceRest: string;
  actionDispatched: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: "FairShift",
    appSubtitle: "UN SDG 8 Decent Work & Labor Protection Platform",
    workerView: "Worker Mobile Interface",
    adminView: "Employer / Admin Dashboard",
    industryConstruction: "Construction Project",
    industryCampus: "College Campus Support",
    activeIndustryBadge: "Active Industry",
    
    welcomeWorker: "Welcome back",
    shiftDurationLabel: "Active Shift Duration",
    dailyEarningsEst: "Est. Today's Pay",
    overtimeIncludedNotice: "includes 1.5x Overtime Multiplier",
    quickBreakTimer: "Quick Rest / Hydration Break",
    restBreakStart: "Start 15m Break",
    restBreakRunning: "Resting...",
    restBreakStop: "End Break",
    restMinutes: "15 min fatigue relief rest countdown",
    hydrationAlert: "Mandatory hydration break recommended every 2 hours under heat safety guidelines.",
    
    actionCheckInOut: "Check In / Out",
    actionCheckInDesc: "Punch your shift clock & start verified hours log",
    actionViewPayslip: "View My Payslip",
    actionViewPayslipDesc: "Inspect weekly earnings with verified 1.5x overtime math",
    actionReportHazard: "Report Hazard / Safety Complaint",
    actionReportHazardDesc: "Confidential whistleblower report with Gemini AI protection",
    actionSkillPassport: "My Skill Passport",
    actionSkillPassportDesc: "Verified portable badges, safety certs & QR ledger",
    
    statusOnShift: "ON SHIFT",
    statusClockedOut: "CLOCKED OUT",
    btnClockIn: "Clock In Now",
    btnClockOut: "Clock Out & Save Shift",

    payslipModalTitle: "Transparent Payslip & Overtime Breakdown",
    payslipModalSubtitle: "Audited step-by-step earnings strictly enforcing the 1.5x overtime multiplier.",
    step1BaseEarnings: "Step 1: Standard Hours Base Earnings",
    step1Explanation: "Calculated as Standard Hours worked multiplied by your Base Hourly Rate.",
    step2OvertimeBonus: "Step 2: 1.5x Overtime Multiplier Bonus",
    step2Explanation: "Every hour beyond standard limits earns 1.5x of your base rate by UN SDG 8 fair labor law.",
    step3Allowances: "Step 3: Hazard & Shift Allowances",
    step3Explanation: "Additional certified stipends for high-risk environmental or night facilities operations.",
    step4NetPayout: "Step 4: Net Take-Home Payout",
    step4Explanation: "Total gross pay minus statutory withholding. Fully verified and ready for disbursement.",
    mathFormulaNotice: "Mathematical Formula: Total Pay = (Base Rate × Standard Hours) + (Base Rate × 1.5 × Overtime Hours) + Allowances - Deductions",
    interactiveSimulatorHeading: "Interactive Overtime Math Simulator (1.5x)",
    interactiveSimulatorDesc: "Adjust regular and overtime hours to see immediate real-time math recalculation.",

    statusSubmitted: "Submitted",
    statusUnderReview: "Under Review",
    statusResolved: "Resolved",
    btnDictateVoice: "Dictate Voice Memo",
    btnListeningVoice: "Listening to Audio...",
    btnAnalyzeGemini: "Analyze with Gemini AI",
    geminiAnalyzing: "Gemini Analyzing...",

    exportQrPassport: "Export QR Passport",
    qrVerifiedSeal: "Verifiable Portable Credential • UN SDG 8.5/8.6",
    
    adminTitle: "Labor Standards & Compliance Dashboard",
    adminSubtitle: "Monitoring active workforce, overtime compliance (1.5x), and fatigue safety limits.",
    metricWorkforce: "Active Workforce",
    metricOpenHazards: "Open Safety Hazards",
    metricFatigueRisk: "High Fatigue Risk (>12h)",
    metricOvertimeSpend: "Total Overtime Spend (1.5x)",
    
    tabOverview: "Overview Analytics",
    tabGrievances: "Grievances & Safety Inbox",
    tabSkills: "Workforce Skill Directory",
    
    fatiguePanelTitle: "Fatigue Risk Alert Panel (> 12h Continuous Hours)",
    fatiguePanelDesc: "UN SDG 8.8 Enforcement: Highlights workers exceeding consecutive 12-hour safe thresholds to prevent acute exhaustion and construction/sanitation accidents.",
    workerNameCol: "Worker / Role",
    hoursWorkedCol: "Continuous Shift Time",
    riskStatusCol: "Fatigue Risk Level",
    actionEnforceRest: "Enforce Immediate Rest Break",
    actionDispatched: "Relief Dispatched",
  },
  
  hi: {
    appTitle: "फेयरशिफ्ट (FairShift)",
    appSubtitle: "संयुक्त राष्ट्र SDG 8 उचित कार्य और श्रम सुरक्षा मंच",
    workerView: "श्रमिक मोबाइल इंटरफ़ेस (Worker Mobile)",
    adminView: "नियोक्ता / एडमिन डैशबोर्ड (Admin Hub)",
    industryConstruction: "निर्माण परियोजना (Construction)",
    industryCampus: "कॉलेज परिसर सहायता (Campus Support)",
    activeIndustryBadge: "सक्रिय उद्योग",
    
    welcomeWorker: "स्वागत है",
    shiftDurationLabel: "सक्रिय कार्य अवधि (Shift Time)",
    dailyEarningsEst: "आज की अनुमानित कमाई",
    overtimeIncludedNotice: "1.5x ओवरटाइम गुणक शामिल है",
    quickBreakTimer: "त्वरित विश्राम / जलपान ब्रेक",
    restBreakStart: "15 मिनट का विश्राम शुरू करें",
    restBreakRunning: "विश्राम प्रगति पर...",
    restBreakStop: "विश्राम समाप्त करें",
    restMinutes: "15 मिनट की थकान राहत उलटी गिनती",
    hydrationAlert: "गर्मी से बचाव के दिशानिर्देशों के तहत हर 2 घंटे में अनिवार्य जलपान ब्रेक की सिफारिश की जाती है।",
    
    actionCheckInOut: "चेक-इन / आउट",
    actionCheckInDesc: "अपनी शिफ्ट का समय दर्ज करें और सत्यापित कार्य घंटे शुरू करें",
    actionViewPayslip: "मेरी पे-स्लिप देखें",
    actionViewPayslipDesc: "1.5x ओवरटाइम गणित के साथ विस्तृत साप्ताहिक वेतन पर्ची",
    actionReportHazard: "खतरा या सुरक्षा शिकायत दर्ज करें",
    actionReportHazardDesc: "Gemini AI सुरक्षा के साथ गोपनीय विसलब्लोअर रिपोर्टिंग",
    actionSkillPassport: "मेरा स्किल पासपोर्ट",
    actionSkillPassportDesc: "सत्यापित पोर्टेबल प्रमाण पत्र, सुरक्षा बैज और क्यूआर कोड",
    
    statusOnShift: "ड्यूटी पर (ON SHIFT)",
    statusClockedOut: "ड्यूटी समाप्त (CLOCKED OUT)",
    btnClockIn: "अभी ड्यूटी शुरू करें (Clock In)",
    btnClockOut: "ड्यूटी समाप्त करें और लॉग करें",

    payslipModalTitle: "पारदर्शी पे-स्लिप और ओवरटाइम विवरण",
    payslipModalSubtitle: "1.5x ओवरटाइम गुणक को कड़ाई से लागू करने वाला चरण-दर-चरण कमाई विवरण।",
    step1BaseEarnings: "चरण 1: मानक कार्य घंटों की मूल कमाई",
    step1Explanation: "मानक कार्य घंटे गुणा आपकी मूल प्रति घंटा दर के रूप में गणना की जाती है।",
    step2OvertimeBonus: "चरण 2: 1.5x ओवरटाइम गुणक बोनस",
    step2Explanation: "मानक सीमा से अधिक प्रत्येक घंटा संयुक्त राष्ट्र श्रम कानून द्वारा आपकी मूल दर का 1.5 गुना कमाता है।",
    step3Allowances: "चरण 3: जोखिम और शिफ्ट भत्ते",
    step3Explanation: "उच्च जोखिम वाले वातावरण या रात्रि शिफ्ट संचालन के लिए अतिरिक्त प्रमाणित वजीफा।",
    step4NetPayout: "चरण 4: शुद्ध इन-हैंड भुगतान",
    step4Explanation: "कुल वेतन में से कर कटौती के बाद वास्तविक भुगतान राशि। पूर्णतः सत्यापित।",
    mathFormulaNotice: "गणितीय सूत्र: कुल वेतन = (मूल दर × मानक घंटे) + (मूल दर × 1.5 × ओवरटाइम घंटे) + भत्ते - कटौती",
    interactiveSimulatorHeading: "इंटरएक्टिव ओवरटाइम गणित सिम्युलेटर (1.5x)",
    interactiveSimulatorDesc: "वास्तविक समय में पुनर्गणना देखने के लिए नियमित और ओवरटाइम घंटे समायोजित करें।",

    statusSubmitted: "दर्ज किया गया",
    statusUnderReview: "समीक्षाधीन",
    statusResolved: "सुलझाया गया",
    btnDictateVoice: "आवाज से बोलकर लिखें (Voice Memo)",
    btnListeningVoice: "ऑडियो सुना जा रहा है...",
    btnAnalyzeGemini: "Gemini AI से विश्लेषण करें",
    geminiAnalyzing: "AI विश्लेषण जारी है...",

    exportQrPassport: "क्यूआर पासपोर्ट निर्यात करें",
    qrVerifiedSeal: "सत्यापित पोर्टेबल क्रेडेंशियल • UN SDG 8.5/8.6",
    
    adminTitle: "श्रम मानक और अनुपालन डैशबोर्ड",
    adminSubtitle: "सक्रिय कार्यबल, 1.5x ओवरटाइम अनुपालन और थकान सुरक्षा सीमाओं की निगरानी।",
    metricWorkforce: "सक्रिय कार्यबल",
    metricOpenHazards: "लंबित सुरक्षा खतरे",
    metricFatigueRisk: "उच्च थकान जोखिम (>12 घंटे)",
    metricOvertimeSpend: "कुल ओवरटाइम खर्च (1.5x)",
    
    tabOverview: "अवलोकन एनालिटिक्स (Overview)",
    tabGrievances: "शिकायतें और सुरक्षा इनबॉक्स",
    tabSkills: "कार्यबल कौशल निर्देशिका",
    
    fatiguePanelTitle: "थकान जोखिम चेतावनी पैनल (> 12 घंटे निरंतर कार्य)",
    fatiguePanelDesc: "UN SDG 8.8 प्रवर्तन: तीव्र थकान और दुर्घटनाओं को रोकने के लिए लगातार 12 घंटे से अधिक काम करने वाले श्रमिकों को इंगित करता है।",
    workerNameCol: "श्रमिक / पद",
    hoursWorkedCol: "निरंतर कार्य समय",
    riskStatusCol: "थकान जोखिम स्तर",
    actionEnforceRest: "तत्काल विश्राम अनिवार्य करें",
    actionDispatched: "राहत कर्मी भेजा गया",
  },
  
  ta: {
    appTitle: "ஃபேர்ஷிப்ட் (FairShift)",
    appSubtitle: "ஐநா SDG 8 கண்ணியமான வேலை மற்றும் தொழிலாளர் பாதுகாப்பு தளம்",
    workerView: "தொழிலாளர் மொபைல் இடைமுகம் (Worker Mobile)",
    adminView: "முதலாளி / நிர்வாக டாஷ்போர்டு (Admin Hub)",
    industryConstruction: "கட்டுமான திட்டம் (Construction)",
    industryCampus: "கல்லூரி ஆதரவு ஊழியர்கள் (Campus Support)",
    activeIndustryBadge: "செயலில் உள்ள தொழில்",
    
    welcomeWorker: "வணக்கம்",
    shiftDurationLabel: "தற்போதைய ஷிப்ட் நேரம் (Shift Time)",
    dailyEarningsEst: "இன்றைய மதிப்பீட்டு வருமானம்",
    overtimeIncludedNotice: "1.5x கூடுதல் நேர பெருக்கி அடங்கும்",
    quickBreakTimer: "விரைவு ஓய்வு / நீர் அருந்தும் இடைவேளை",
    restBreakStart: "15 நிமிடம் ஓய்வு தொடங்கு",
    restBreakRunning: "ஓய்வு எடுக்கிறது...",
    restBreakStop: "ஓய்வு முடிந்தது",
    restMinutes: "15 நிமிட சோர்வு நிவாரண ஓய்வு நேரம்",
    hydrationAlert: "வெப்ப பாதுகாப்பு வழிகாட்டுதல்களின்படி ஒவ்வொரு 2 மணி நேரத்திற்கும் கட்டாய நீர் அருந்தும் இடைவேளை.",
    
    actionCheckInOut: "செக்-இன் / அவுட்",
    actionCheckInDesc: "உங்கள் ஷிப்ட் நேரத்தை தொடங்கி சரிபார்க்கப்பட்ட மணிநேரங்களை பதிவு செய்யுங்கள்",
    actionViewPayslip: "எனது சம்பள சீட்டு",
    actionViewPayslipDesc: "1.5x கூடுதல் நேர கணக்கீட்டுடன் வாராந்திர சம்பளத்தை பார்க்கவும்",
    actionReportHazard: "ஆபத்து / பாதுகாப்பு புகார்",
    actionReportHazardDesc: "Gemini AI பாதுகாப்புடன் கூடிய ரகசிய புகார் பதிவு",
    actionSkillPassport: "எனது திறன் பாஸ்போர்ட்",
    actionSkillPassportDesc: "சரிபார்க்கப்பட்ட சான்றிதழ்கள், பாதுகாப்பு பேட்ஜ்கள் மற்றும் QR குறியீடு",
    
    statusOnShift: "வேலையில் உள்ளார் (ON SHIFT)",
    statusClockedOut: "வேலை முடிந்தது (CLOCKED OUT)",
    btnClockIn: "இப்போது தொடங்கவும் (Clock In)",
    btnClockOut: "வேலை முடித்து சேமிக்கவும்",

    payslipModalTitle: "வெளிப்படையான சம்பள சீட்டு & கூடுதல் நேர விவரம்",
    payslipModalSubtitle: "1.5x கூடுதல் நேர பெருக்கியை கண்டிப்பாக செயல்படுத்தும் படி-படி வருமான முறிவு.",
    step1BaseEarnings: "படி 1: நிலையான வேலை நேர வருமானம்",
    step1Explanation: "வேலை செய்த வழக்கமான நேரம் பெருக்கல் உங்களின் அடிப்படை மணிநேர ஊதியம் என கணக்கிடப்படுகிறது.",
    step2OvertimeBonus: "படி 2: 1.5x கூடுதல் நேர போனஸ்",
    step2Explanation: "நிலையான வரம்புகளுக்கு மேல் உள்ள ஒவ்வொரு மணிநேரமும் உங்கள் அடிப்படை விகிதத்தை விட 1.5 மடங்கு பெறுகிறது.",
    step3Allowances: "படி 3: ஆபத்து மற்றும் ஷிப்ட் படிகள்",
    step3Explanation: "அபாயகரமான சுற்றுச்சூழல் அல்லது இரவுப் பணிகளுக்கான கூடுதல் சான்றளிக்கப்பட்ட உதவித்தொகை.",
    step4NetPayout: "படி 4: நிகர சம்பளம்",
    step4Explanation: "சட்டப்பூர்வ பிடித்தங்கள் கழித்த பிறகு உள்ள நிகர ஊதியம். முழுமையாக சரிபார்க்கப்பட்டது.",
    mathFormulaNotice: "கணித சூத்திரம்: மொத்த ஊதியம் = (அடிப்படை விகிதம் × வழக்கமான நேரம்) + (அடிப்படை விகிதம் × 1.5 × கூடுதல் நேரம்) + படிகள் - பிடித்தங்கள்",
    interactiveSimulatorHeading: "ஊடாடும் கூடுதல் நேர கணித சிமுலேட்டர் (1.5x)",
    interactiveSimulatorDesc: "நேரடி மறு கணக்கீட்டைக் காண வழக்கமான மற்றும் கூடுதல் நேரத்தை மாற்றியமைக்கவும்.",

    statusSubmitted: "சமர்ப்பிக்கப்பட்டது",
    statusUnderReview: "பரிசீலனையில் உள்ளது",
    statusResolved: "தீர்வு காணப்பட்டது",
    btnDictateVoice: "குரல் மூலம் உள்ளிடவும் (Voice Memo)",
    btnListeningVoice: "குரல் கேட்கிறது...",
    btnAnalyzeGemini: "Gemini AI மூலம் பகுப்பாய்வு",
    geminiAnalyzing: "AI பகுப்பாய்வு செய்கிறது...",

    exportQrPassport: "QR பாஸ்போர்ட்டை ஏற்றுமதி செய்க",
    qrVerifiedSeal: "சரிபார்க்கப்பட்ட சான்றிதழ் • UN SDG 8.5/8.6",
    
    adminTitle: "தொழிலாளர் தரநிலைகள் மற்றும் இணக்க டாஷ்போர்டு",
    adminSubtitle: "செயலில் உள்ள தொழிலாளர்கள், 1.5x கூடுதல் நேர ஊதியம் மற்றும் சோர்வு பாதுகாப்பு கண்காணிப்பு.",
    metricWorkforce: "செயலில் உள்ள தொழிலாளர்கள்",
    metricOpenHazards: "பாதுகாப்பு ஆபத்துகள்",
    metricFatigueRisk: "அதிக சோர்வு அபாயம் (>12 மணி)",
    metricOvertimeSpend: "மொத்த கூடுதல் நேர செலவு (1.5x)",
    
    tabOverview: "கண்ணோட்ட பகுப்பாய்வு (Overview)",
    tabGrievances: "புகார்கள் மற்றும் பாதுகாப்பு இன்பாக்ஸ்",
    tabSkills: "தொழிலாளர் திறன் அடைவு",
    
    fatiguePanelTitle: "சோர்வு அபாய எச்சரிக்கை பலகை (> 12 மணி நேரம் தொடர் வேலை)",
    fatiguePanelDesc: "UN SDG 8.8 அமலாக்கம்: விபத்துகளைத் தடுக்க 12 மணி நேரத்திற்கும் மேலாக தொடர்ந்து வேலை செய்யும் தொழிலாளர்களை எச்சரிக்கிறது.",
    workerNameCol: "தொழிலாளர் / பதவி",
    hoursWorkedCol: "தொடர் வேலை நேரம்",
    riskStatusCol: "சோர்வு அபாய நிலை",
    actionEnforceRest: "உடனடி ஓய்வு கட்டாயப்படுத்து",
    actionDispatched: "மாற்று தொழிலாளர் அனுப்பப்பட்டார்",
  },
};
