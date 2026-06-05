import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Sprout, 
  ArrowRight, 
  RefreshCw,
  Plus,
  Trash2,
  Share2,
  Check,
  Printer,
  Notebook,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  CheckSquare,
  Square,
  BookOpen,
  Download
} from "lucide-react";
import { CropCalendar as CalendarType } from "../types";

interface CropCalendarProps {
  lang?: "en" | "hi";
}

export default function CropCalendar({ lang = "en" }: CropCalendarProps) {
  const [crop, setCrop] = useState("Wheat");
  const [region, setRegion] = useState("Uttar Pradesh");
  const [sowingMonth, setSowingMonth] = useState("November");
  const [duration, setDuration] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [calendar, setCalendar] = useState<CalendarType | null>(null);

  // Real date-wise states & diaries
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedGridMonthIdx, setSelectedGridMonthIdx] = useState(0);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(1);
  
  // General Journal Calendar State Variables
  const [generalViewMonth, setGeneralViewMonth] = useState(5); // Default to June (index 5) for 2026!
  const [generalSelectedDay, setGeneralSelectedDay] = useState(1);
  const [generalJournalNotes, setGeneralJournalNotes] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_general_journal_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [generalNewNoteText, setGeneralNewNoteText] = useState("");

  const [generalTasks, setGeneralTasks] = useState<Record<string, { id: string, text: string, completed: boolean }[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_general_journal_tasks");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });
  const [generalNewTaskText, setGeneralNewTaskText] = useState("");

  useEffect(() => {
    localStorage.setItem("kisan_general_journal_notes", JSON.stringify(generalJournalNotes));
  }, [generalJournalNotes]);

  useEffect(() => {
    localStorage.setItem("kisan_general_journal_tasks", JSON.stringify(generalTasks));
  }, [generalTasks]);

  const getGeneralMonthDetails = (monthIndex: number) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    
    const hindiMonths = [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई",
      "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];
    
    const year = 2026;
    const nameEn = englishMonths[monthIndex];
    const nameHi = hindiMonths[monthIndex];
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startDayOfWeek = new Date(year, monthIndex, 1).getDay();
    
    return {
      monthIndex,
      monthNameEn: nameEn,
      monthNameHi: nameHi,
      displayName: lang === "hi" ? `${nameHi} ${year}` : `${nameEn} ${year}`,
      daysInMonth,
      startDayOfWeek
    };
  };

  const getGeneralTasksForDate = (year: number, monthNameEn: string, dayNum: number) => {
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const custom = generalTasks[key];
    if (custom) return custom;

    const defaults = [
      { id: "def-1", text: lang === "hi" ? "नहरों और जल निकासी नालियों की सफाई व निरीक्षण करें" : "Inspect and clean irrigation canals and water passages", completed: false },
      { id: "def-2", text: lang === "hi" ? "मिट्टी की सामान्य नमी दर्ज करें" : "Check general soil moisture level", completed: false },
      { id: "def-3", text: lang === "hi" ? "जैविक खाद/केंचुआ खाद के स्टॉक की जांच करें" : "Inventory organic manure and vermicompost stock", completed: false }
    ];
    return defaults;
  };

  const toggleGeneralTask = (year: number, monthNameEn: string, dayNum: number, taskId: string) => {
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthNameEn, dayNum);
    const updated = current.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setGeneralTasks(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const addGeneralTask = (year: number, monthNameEn: string, dayNum: number) => {
    const txt = generalNewTaskText.trim();
    if (!txt) return;
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthNameEn, dayNum);
    const newTask = {
      id: "usr-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4),
      text: txt,
      completed: false
    };
    setGeneralTasks(prev => ({
      ...prev,
      [key]: [...current, newTask]
    }));
    setGeneralNewTaskText("");
  };

  const deleteGeneralTask = (year: number, monthNameEn: string, dayNum: number, taskId: string) => {
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthNameEn, dayNum);
    const updated = current.filter(t => t.id !== taskId);
    setGeneralTasks(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const getTraditionalAdvice = (dayNum: number) => {
    const isHindi = lang === "hi";
    const tithiNum = (dayNum % 15) || 15;
    const isWaxing = dayNum <= 15;
    
    const phaseName = isWaxing 
      ? (isHindi ? `शुक्ल पक्ष - तिथि ${tithiNum}` : `Shukla Paksha - Tithi ${tithiNum}`)
      : (isHindi ? `कृष्ण पक्ष - तिथि ${tithiNum}` : `Krishna Paksha - Tithi ${tithiNum}`);
      
    let moonStatus = "";
    let bioAdvice = "";
    
    if (dayNum === 15) {
      moonStatus = isHindi ? "🌕 पूर्णिमा (Full Moon Peak)" : "🌕 Purnima (Full Moon Peak)";
      bioAdvice = isHindi 
        ? "पूर्णिमा के दिन पत्तीदार और ऊपरी तने वाली फसलों में नमी और पोषण का प्रवाह उच्चतम रहता है। कटाई और जैविक स्प्रे के लिए सबसे अनुकूल काल।" 
        : "Full moon period. Upward sap flow is peak in leafy crops and above-ground stems. Highly favorable for organic foliar sprays.";
    } else if (dayNum === 30 || dayNum === 29) {
      moonStatus = isHindi ? "🌑 अमावस्या (New Moon Peak)" : "🌑 Amavasya (New Moon Peak)";
      bioAdvice = isHindi 
        ? "अमावस्या के दिन जड़ प्रणाली अधिक सक्रिय होती है। जमीन की निराई-गुड़ाई, गहरी जुताई और जड़ों की सिंचाई क्रियाएं परम अनुशंसित हैं।" 
        : "New moon period. Below-ground root systems are highly active. Recommended for tilling, weeding, and root nutrition fertilizer infusion.";
    } else if (tithiNum <= 5) {
      moonStatus = isHindi ? "🌙 बालचंद्र (Slight Crescent Moon)" : "🌙 Balchandra (Slight Crescent)";
      bioAdvice = isHindi 
        ? "बीजों के स्वस्थ अंकुरण के लिए शुरुआती नमी बनाए रखें। जुताई और रोपण के पूर्व की तैयारियों के लिए श्रेष्ठ काल।" 
        : "Promotes early seed moisture stabilization. Great for general farm ground pre-treatments and soil tilling.";
    } else if (tithiNum <= 10) {
      moonStatus = isHindi ? "🌓 अर्धचंद्र (Quarter Moon Transition)" : "🌓 Quarter Moon Phase";
      bioAdvice = isHindi 
        ? "फसलों की वानस्पतिक वृद्धि और नई टहनियों के फूटने का उत्कृष्ट समय। पूरक सूक्ष्म पोषक तत्व छिड़काव करें।" 
        : "Excellent for vegetative growth spikes and sprouting new branches. Ideal for supplementary bio-nutrients.";
    } else {
      moonStatus = isHindi ? "🌖 गिब्बस चंद्र (Gibbous Rising)" : "🌖 Gibbous Moon Phase";
      bioAdvice = isHindi 
        ? "फलों के भरने और दानों के परिपक्व होने का समय। सिंचाई का प्रबंधन ध्यानपूर्वक करें।" 
        : "Grain filling and fruit stabilization phase. Manage water runoffs closely to prevent mold growth.";
    }
    
    return { phaseName, moonStatus, bioAdvice };
  };
  const [dateWiseNotes, setDateWiseNotes] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_real_date_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [newDateNoteText, setNewDateNoteText] = useState("");

  useEffect(() => {
    localStorage.setItem("kisan_real_date_notes", JSON.stringify(dateWiseNotes));
  }, [dateWiseNotes]);

  // Notes structure: key is string "crop_region_monthIndex", value is array of strings
  const [phaseNotes, setPhaseNotes] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_crop_phase_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeNoteTexts, setActiveNoteTexts] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("kisan_crop_phase_notes", JSON.stringify(phaseNotes));
  }, [phaseNotes]);

  const addPhaseNote = (monthIndex: number) => {
    const noteKey = `${crop}_${region}_${monthIndex}`;
    const txt = activeNoteTexts[noteKey]?.trim();
    if (!txt) return;

    setPhaseNotes(prev => {
      const current = prev[noteKey] || [];
      return {
        ...prev,
        [noteKey]: [...current, txt]
      };
    });

    setActiveNoteTexts(prev => ({
      ...prev,
      [noteKey]: ""
    }));
  };

  const removePhaseNote = (monthIndex: number, noteIdx: number) => {
    const noteKey = `${crop}_${region}_${monthIndex}`;
    setPhaseNotes(prev => {
      const current = prev[noteKey] || [];
      const updated = current.filter((_, idx) => idx !== noteIdx);
      const copy = { ...prev };
      if (updated.length === 0) {
        delete copy[noteKey];
      } else {
        copy[noteKey] = updated;
      }
      return copy;
    });
  };

  const copyCalendarToClipboard = () => {
    if (!calendar) return;

    let text = `🌾 KRISHI CONNECT CROP CALENDAR 🌾\n`;
    text += `===================================\n`;
    text += `Crop: ${calendar.cropName}\n`;
    text += `Region: ${calendar.region}\n`;
    text += `Sowing Month: ${calendar.sowingMonth}\n`;
    text += `Est. Duration: ${calendar.durationMonths} Months\n\n`;

    calendar.timeline.forEach((item, idx) => {
      text += `📅 ${idx + 1}. ${item.monthName} - [${item.phase}]\n`;
      text += `⏱️ Tasks:\n`;
      item.activities.forEach(act => {
        text += `   - ${act}\n`;
      });
      text += `🧪 Nutrition: ${item.fertilizerRequirement}\n`;
      text += `⚠️ Precaution: ${item.precautions?.[0] || ""}\n`;
      
      const noteKey = `${crop}_${region}_${idx}`;
      const notes = phaseNotes[noteKey] || [];
      if (notes.length > 0) {
        text += `📝 Personal Notes:\n`;
        notes.forEach((nt, nIdx) => {
          text += `   [Note ${nIdx + 1}] ${nt}\n`;
        });
      }
      text += `-----------------------------------\n`;
    });

    text += `Generated with Love by Krishi Connect AI Assistant`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCalendarAsFile = () => {
    if (!calendar) return;

    let text = `🌾 KRISHI CONNECT CROP CALENDAR 🌾\n`;
    text += `===================================\n`;
    text += `Crop: ${calendar.cropName}\n`;
    text += `Region: ${calendar.region}\n`;
    text += `Sowing Month: ${calendar.sowingMonth}\n`;
    text += `Est. Duration: ${calendar.durationMonths} Months\n\n`;

    calendar.timeline.forEach((item, idx) => {
      text += `📅 ${idx + 1}. ${item.monthName} - [${item.phase}]\n`;
      text += `⏱️ Tasks:\n`;
      item.activities.forEach(act => {
        text += `   - ${act}\n`;
      });
      text += `🧪 Nutrition: ${item.fertilizerRequirement}\n`;
      text += `⚠️ Precaution: ${item.precautions?.[0] || ""}\n`;
      
      const noteKey = `${crop}_${region}_${idx}`;
      const notes = phaseNotes[noteKey] || [];
      if (notes.length > 0) {
        text += `📝 Personal Notes:\n`;
        notes.forEach((nt, nIdx) => {
          text += `   [Note ${nIdx + 1}] ${nt}\n`;
        });
      }
      text += `-----------------------------------\n`;
    });

    text += `Generated with Love by Krishi Connect AI Assistant\n`;
    text += `Download Date: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${crop.replace(/\s+/g, "_")}_crop_calendar.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTimelineMonthAttributes = (offsetIndex: number) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    
    const hindiMonths = [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई",
      "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];

    let startIdx = englishMonths.indexOf(sowingMonth);
    if (startIdx === -1) {
      const idx = englishMonths.findIndex(m => m.toLowerCase().includes(sowingMonth.toLowerCase()));
      startIdx = idx !== -1 ? idx : 10;
    }

    const currentIdx = (startIdx + offsetIndex) % 12;
    
    // Base year is 2026 based on May 2026 metadata.
    let year = 2026;
    if (currentIdx < startIdx) {
      year = 2027;
    } else if (startIdx < 4) { // Jan-Apr is already past in 2026 relative to May 31
      year = 2027;
    }

    const nameEn = englishMonths[currentIdx];
    const nameHi = hindiMonths[currentIdx];

    const daysInMonth = new Date(year, currentIdx + 1, 0).getDate();
    const startDayOfWeek = new Date(year, currentIdx, 1).getDay();

    return {
      monthIndex: currentIdx,
      monthNameEn: nameEn,
      monthNameHi: nameHi,
      displayName: lang === "hi" ? `${nameHi} ${year}` : `${nameEn} ${year}`,
      year,
      daysInMonth,
      startDayOfWeek
    };
  };

  const getDayTasks = (phaseIndex: number, dayNum: number) => {
    const isHindi = lang === "hi";
    if (phaseIndex === 0) {
      if (dayNum === 1) return isHindi ? ["मिट्टी की पोषण क्षमता बढ़ाने के लिए गहरी जुताई करें"] : ["Deep soil tillage using organic vermicompost to enrich nutrients"];
      if (dayNum === 3) return isHindi ? ["स्वस्थ बीजों की पहचान हेतु जल तैरने का परीक्षण करें"] : ["Conduct seed water buoyancy testing to remove hollow seeds"];
      if (dayNum === 5) return isHindi ? ["निर्धारित पंक्ति दूरी के साथ बीजों की बुवाई (4-5 सेमी)"] : ["Sow viable seed lots at 4-5cm depth with optimal row spacing"];
      if (dayNum === 8) return isHindi ? ["खेत की बाड़ लगाना और जंगली जीवों से बीजों की सुरक्षा"] : ["Check wild bird nets/boundary barriers around planted beds"];
      if (dayNum === 15) return isHindi ? ["अंकुरण दर की जांच करें और पहला पानी छिड़कें (हल्की सिंचाई)"] : ["Observe shoot germination rates and execute initial light misting"];
      if (dayNum === 22) return isHindi ? ["नमी के स्तर का आकलन और जड़ विकास का मुआयना"] : ["Verify active moisture absorption around newly sprouted roots"];
    } else if (phaseIndex === 1) {
      if (dayNum === 5) return isHindi ? ["पहली निराई और खरपतवार प्रबंधन कार्य"] : ["Begin first cycle of manual/precision weeding for weeds"];
      if (dayNum === 12) return isHindi ? ["सिंचाई: क्यारियों में जल स्तर लगभग 3 सेमी रखें"] : ["Irrigate carefully: maintain standing water cap around 3cm"];
      if (dayNum === 15) return isHindi ? ["नीम लेपित यूरिया का उपयोग कर उर्वरक का अनुप्रयोग"] : ["Execute basal top-dressing using Neem-coated urea"];
      if (dayNum === 24) return isHindi ? ["फंगल संक्रमण या पीली पत्ती कीटों की सूक्ष्म जांच"] : ["Examine leaf margins for early rust signs or aphid colonies"];
    } else if (phaseIndex === 2) {
      if (dayNum === 6) return isHindi ? ["फूल आने की बाली अवस्था में पूरक पोषण सिंचाई"] : ["Administer crucial vegetative irrigation to facilitate ear head emergence"];
      if (dayNum === 12) return isHindi ? ["घुलनशील सूक्ष्म पोषक तत्व जिंक और बोरॉन स्प्रे"] : ["Foliar spray of water-soluble micronutrients (Zinc, Boron)"];
      if (dayNum === 18) return isHindi ? ["जैविक कीटनाशकों का निवारक छिड़काव"] : ["Apply preventative bio-insecticides/mustard plant oil spray"];
      if (dayNum === 26) return isHindi ? ["फसल सुरक्षा सहारा व्यवस्था (अगर तेज आंधी की उम्मीद हो)"] : ["Inspect stalk strength and construct wind break bounds if lodging risk looms"];
    } else if (phaseIndex === 3) {
      if (dayNum === 1) return isHindi ? ["पानी देना बंद करें और धूप में कटाई के लिए खेत सूखने दें"] : ["Stop irrigation loops entirely and allow the active field to dry"];
      if (dayNum === 10) return isHindi ? ["कटाई के उपकरण, बोरियों और तिरपाल का सैनिटाइजेशन"] : ["Wash down sickles, sanitise sorting scales, and wash storage tarps"];
      if (dayNum === 17) return isHindi ? ["दाना कड़ापन (Maturity) स्तर का परीक्षण"] : ["Perform physical hand testing of grains to confirm maximum maturity"];
      if (dayNum === 21) return isHindi ? ["फसलों की कटाई (Harvesting) प्रक्रिया का आरंभ"] : ["Commence physical harvest and bundle stalks in warm daylight"];
      if (dayNum === 26) return isHindi ? ["भंडारण गृह का मुआयना और अनाज की नमी जांच (14% से कम)"] : ["Confirm warehouse ventilation dry state and check grain moisture is <14%"];
    } else {
      if (dayNum === 7) return isHindi ? ["सामान्य फसल स्वास्थ्य निरिक्षण और वेंटिलेशन रखरखाव"] : ["Routine crop health diagnostic and field ventilation validation"];
      if (dayNum === 18) return isHindi ? ["सिंचाई नालियों की सफाई और खरपतवार नियंत्रण"] : ["Clean water drains and verify zero stagnant puddling exists"];
    }
    return [];
  };

  const getDateNoteKey = (year: number, monthEn: string, dayNum: number) => {
    return `${crop}_${region}_${year}_${monthEn}_${dayNum}`;
  };

  const addDateNote = (year: number, monthEn: string, dayNum: number) => {
    const textStr = newDateNoteText.trim();
    if (!textStr) return;
    const noteKey = getDateNoteKey(year, monthEn, dayNum);
    setDateWiseNotes(prev => {
      const current = prev[noteKey] || [];
      return {
        ...prev,
        [noteKey]: [...current, textStr]
      };
    });
    setNewDateNoteText("");
  };

  const removeDateNote = (year: number, monthEn: string, dayNum: number, noteIdx: number) => {
    const noteKey = getDateNoteKey(year, monthEn, dayNum);
    setDateWiseNotes(prev => {
      const current = prev[noteKey] || [];
      const updated = current.filter((_, idx) => idx !== noteIdx);
      const copy = { ...prev };
      if (updated.length === 0) {
        delete copy[noteKey];
      } else {
        copy[noteKey] = updated;
      }
      return copy;
    });
  };

  const isHi = lang === "hi";

  const CROPS = isHi 
    ? [
        { en: "Wheat", label: "गेहूं (Wheat)" },
        { en: "Paddy / Rice", label: "धान / चावल (Paddy / Rice)" },
        { en: "Cotton", label: "कपास (Cotton)" },
        { en: "Sugarcane", label: "गन्ना (Sugarcane)" },
        { en: "Tomato", label: "टमाटर (Tomato)" },
        { en: "Potato", label: "आलू (Potato)" },
        { en: "Mustard", label: "सरसों (Mustard)" },
      ]
    : [
        { en: "Wheat", label: "Wheat" },
        { en: "Paddy / Rice", label: "Paddy / Rice" },
        { en: "Cotton", label: "Cotton" },
        { en: "Sugarcane", label: "Sugarcane" },
        { en: "Tomato", label: "Tomato" },
        { en: "Potato", label: "Potato" },
        { en: "Mustard", label: "Mustard" },
      ];

  const MONTHS = isHi
    ? [
        { en: "January", label: "जनवरी" },
        { en: "May", label: "मई" },
        { en: "June", label: "जून" },
        { en: "July", label: "जुलाई" },
        { en: "October", label: "अक्टूबर" },
        { en: "November", label: "नवंबर" },
        { en: "December", label: "दिसंबर" }
      ]
    : [
        { en: "January", label: "January" },
        { en: "May", label: "May" },
        { en: "June", label: "June" },
        { en: "July", label: "July" },
        { en: "October", label: "October" },
        { en: "November", label: "November" },
        { en: "December", label: "December" }
      ];

  const REGIONS = isHi
    ? [
        { en: "Uttar Pradesh", label: "उत्तर प्रदेश" },
        { en: "Punjab", label: "पंजाब" },
        { en: "Maharashtra", label: "महाराष्ट्र" },
        { en: "Bihar", label: "बिहार" },
        { en: "Gujarat", label: "गुजरात" }
      ]
    : [
        { en: "Uttar Pradesh", label: "Uttar Pradesh" },
        { en: "Punjab", label: "Punjab" },
        { en: "Maharashtra", label: "Maharashtra" },
        { en: "Bihar", label: "Bihar" },
        { en: "Gujarat", label: "Gujarat" }
      ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const response = await fetch("/api/crop-calendar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: crop,
          region,
          sowingMonth,
          durationMonths: duration
        })
      });

      if (!response.ok) {
        throw new Error("Calendar service failed.");
      }

      const data = await response.json();
      setCalendar(data);
    } catch (err) {
      console.error(err);
      
      const transCrop = isHi 
        ? (crop === "Wheat" ? "गेहूं" : crop === "Paddy / Rice" ? "धान" : crop === "Sugarcane" ? "गन्ना" : crop === "Mustard" ? "सरसों" : crop)
        : crop;
      
      const transRegion = isHi
        ? (region === "Uttar Pradesh" ? "उत्तर प्रदेश" : region === "Punjab" ? "पंजाब" : region)
        : region;

      // Produce robust simulation fallback data
      setCalendar({
        cropName: isHi ? `${transCrop} (${transRegion} स्वरूप)` : `${crop} (${region} Style)`,
        region: transRegion,
        sowingMonth: isHi ? (MONTHS.find(m => m.en === sowingMonth)?.label || sowingMonth) : sowingMonth,
        durationMonths: duration,
        timeline: isHi 
          ? [
              {
                monthName: "महीना 1 (बुवाई का समय)",
                phase: "खेत की तैयारी और अंकुरण",
                activities: [
                  "मिट्टी की पोषण क्षमता बढ़ाने के लिए जैविक केंचुआ खाद (Vermicompost) के साथ गहरी जुताई करें",
                  "पानी में बीज तैराकर स्वस्थ और फलदायी बीजों की पहचान करें",
                  "उचित पंक्ति दूरी के साथ बीजों को 4-5 सेमी गहराई में बोएं"
                ],
                precautions: [
                  "बोए गए खेतों को जंगली पक्षियों और गिलहरियों से बचाएं",
                  "जड़ों के जमने तक केवल आवश्यक नमी बनाए रखें; पानी का भराव न करें"
                ],
                fertilizerRequirement: "एनपीके (NPK) बुनियादी अनुप्रयोग (120:60:40 किलोग्राम/हेक्टेयर)"
              },
              {
                monthName: "महीना 2 (प्रारंभिक वानस्पतिक वृद्धि)",
                phase: "सक्रिय टिलरिंग और शाखाएं",
                activities: [
                  "पहला सटीक निराई-गुड़ाई कार्य (हाथ से या चयनात्मक निराई) पूरा करें",
                  "हल्की सिंचाई करें: जड़ों को जमाने के लिए पानी का स्तर लगभग 3 सेमी रखें",
                  "पीले गेरूआ रोग के वाहकों की निगरानी के लिए पत्ती के किनारों का निरीक्षण करें"
                ],
                precautions: [
                  "चेपा (Aphids) कीटों की निगरानी करें और शुरुआती जैविक नीम अर्क का छिड़काव करें",
                  "जलभराव से बचने के लिए क्यारियों में जल निकासी मार्गों को सुचारू रखें"
                ],
                fertilizerRequirement: "नमी वाले दिनों में नीम-लेपित यूरिया के साथ टॉप-ड्रेसिंग करें"
              },
              {
                monthName: "महीना 3 (फूल आने की अवस्था)",
                phase: "बाली आना और अनाज भरना",
                activities: [
                  "बीज के सिरों को खाली होने से रोकने के लिए इस अवधि में महत्वपूर्ण हल्की सिंचाई करें",
                  "नमी की पुष्टि के लिए नियमित रूप से मिट्टी की आर्द्रता मापें",
                  "घुलनशील जस्ता (Zinc) और बोरान (Boron) सहित अनुशंसित सूक्ष्म पोषक तत्वों का छिड़काव करें"
                ],
                precautions: [
                  "प्राकृतिक बायो-स्प्रे के छिड़काव द्वारा कीटों के आक्रमण को रोकें",
                  "तेज हवाओं से फसल गिरने से बचाने के लिए सहारा देने की व्यवस्था करें"
                ],
                fertilizerRequirement: "पोटेशियम सुपर-फॉस्फेट या घुलनशील समुद्री शैवाल (Seaweed) जैविक स्प्रे करें"
              },
              {
                monthName: "महीना 4 (परिपक्वता और कटाई की तैयारी)",
                phase: "सुनहरी फसल पकना और कटाई योजना",
                activities: [
                  "कटाई से पहले धीरे-धीरे खेत को पूरी तरह सूखने दें",
                  "भंडारण के लिए अनाज की नमी का परीक्षण करें (नमी का स्तर 14% से कम होना चाहिए)",
                  "भंडारण के लिए साफ बोरी पैकेट और तिरपाल कवर की व्यवस्था करें"
                ],
                precautions: [
                  "अचानक कटाई से बचें जब तक कि कोहरा या शीत ऋतु की अचानक बूंदाबांदी शांत न हो जाए",
                  "पैकिंग करने से पहले भंडारण गृहों में कीड़ों और नमी का पूर्ण अभाव सुनिश्चित करें"
                ],
                fertilizerRequirement: "कोई आवश्यकता नहीं। कटाई से एक सप्ताह पहले सभी रासायनिक रसायनों के प्रयोग पर रोक लगाएं।"
              }
            ]
          : [
              {
                monthName: `Month 1 (${sowingMonth} - Sowing)`,
                phase: "Field Preparation & Germination",
                activities: [
                  "Deep soil tilling with vermicompost to enrich nutrition",
                  "Checking seed viability using water buoyancy testing",
                  "Sowing seeds at 4-5cm depth with optimal row spacing"
                ],
                precautions: [
                  "Protect freshly sowed beds from wild birds and squirrels",
                  "Maintain critical soil moisture; do not flood initially"
                ],
                fertilizerRequirement: "NPK (Nitrogen-Phosphorus-Potassium) basal application (120:60:40 kg/ha)"
              },
              {
                monthName: "Month 2 (Early Vegetative Growth)",
                phase: "Active Tillering / Branching",
                activities: [
                  "Executing first precision weeding (manual or selective)",
                  "Irrigate closely: keep water levels around 3cm for root anchoring",
                  "Inspecting young leaf edges for yellow rust vectors"
                ],
                precautions: [
                  "Watch for aphid colonies and apply systemic organic Neem solutions early",
                  "Ensure clear water passages to thwart early waterlogging in soil beds"
                ],
                fertilizerRequirement: "Top-dressing with neem-coated urea during moisture-active days"
              },
              {
                monthName: "Month 3 (Earing / Flowering Transition)",
                phase: "Panicle Sowing & Grain Filling",
                activities: [
                  "Executing crucial irrigation to prevent seed head abortion",
                  "Testing soil moisture values to confirm moisture retention",
                  "Spraying recommended micro-nutrients including soluble Zinc and Boron"
                ],
                precautions: [
                  "Thwart insect vector colonization with natural bio-sprays",
                  "Provide wind support using adjacent boundaries to prevent lodging"
                ],
                fertilizerRequirement: "Potassium super-phosphate or trace seaweed organic foliar sprays"
              },
              {
                monthName: `Month 4 (Maturity & Harvesting Prep)`,
                phase: "Golden Crop Ripening & Storage Plan",
                activities: [
                  "Gradually allowing the field to dry completely ahead of sickles",
                  "Assessing grain moisture content (ideally below 14% for storage)",
                  "Arranging clean gunny bags and sorting tarpaulin covers"
                ],
                precautions: [
                  "Avoid sudden harvesting decisions when unexpected dew or fog persists",
                  "Ensure zero insect infestation exists in standard storage rooms before packing"
                ],
                fertilizerRequirement: "None. Restrict all agrochemical usage during the pre-harvest week."
              }
            ]
      });
    } finally {
      setGenerating(false);
    }
  };

  // Pre-load default wheat calendar
  useEffect(() => {
    if (!calendar) {
      const mockEvent = { preventDefault: () => {} } as React.FormEvent;
      handleGenerate(mockEvent);
    }
  }, []);

  const t = {
    title: isHi ? "व्यक्तिगत फसल चक्र कैलेंडर" : "Personalized Crop Calendar",
    desc: isHi ? "फसल की स्थिति निर्दिष्ट करें और महीने-दर-महीने कृषि प्रक्रियाओं, सिंचाई समय और कटाई चक्र की रूपरेखा प्राप्त करें।" : "Specify your crop conditions and immediately generate month-by-month agricultural steps highlighting irrigation, fertilization schedules, and harvest windows.",
    paramTitle: isHi ? "कैलेंडर पैरामीटर" : "Calendar Parameters",
    targetCropLabel: isHi ? "लक्षित बुवाई फसल" : "Target Crop",
    sowingMonthLabel: isHi ? "बुवाई का महीना" : "Sowing Month",
    cycleDuration: isHi ? "फसल चक्र अवधि (महीने)" : "Cycle Duration (Months)",
    regionLabel: isHi ? "आपका क्षेत्र / मृदा क्षेत्र" : "Your Region / Soil Zone",
    buildBtn: isHi ? "कैलेंडर तैयार करें" : "Build Calendar",
    generating: isHi ? "कैलेंडर तैयार हो रहा है..." : "Generating Cycle...",
    successBanner: isHi ? "फसल चक्र सफलतापूर्वक तैयार किया गया" : "Cycle Generated Successfully",
    timelineTitle: isHi ? "समय-सीमा प्रवाह" : "Timeline Flow",
    estDuration: isHi ? "अनुमानित अवधि" : "Estimated Duration",
    monthsSuffix: isHi ? " महीने" : " Months",
    taskHeader: isHi ? "👨‍🌾 इस चरण के महत्वपूर्ण कार्य:" : "👨‍🌾 Tasks in this phase:",
    fertilizerHeader: isHi ? "🧪 अनुशंसित खाद/उर्वरक शेड्यूल:" : "🧪 Fertilizer Schedule:",
    precautionHeader: isHi ? "⚠️ सावधानी और चेतावनी:" : "⚠️ Precautionary Warning:",
    generatingFallback: isHi ? "कस्टम फसल कैलेंडर तैयार हो रहा है..." : "Formulating Custom Cycle...",
    notesTitle: isHi ? "कैलेंडर अनुस्मारक नोट्स" : "Agronomic Notes & Reminders",
    notesPlaceholder: isHi ? "इस चरण के लिए एक नई टिप्पणी या अनुस्मारक लिखें..." : "Write a custom note or reminder for this biological phase...",
    addNoteBtn: isHi ? "टिप्पणी जोड़ें" : "Add Note",
    noNotes: isHi ? "इस फसल चरण के लिए कोई व्यक्तिगत टिप्पणी नहीं है।" : "No custom notes recorded for this phase.",
    shareBtn: isHi ? "कैलेंडर सूची कॉपी करें" : "Share/Copy Checklist",
    shareSuccess: isHi ? "चेकलिस्ट कॉपी हो गया!" : "Copied Checklist!",
    printBtn: isHi ? "प्रिंट / PDF सहेजें" : "Print Checklist",
    downloadBtn: isHi ? "कैलेंडर डाउनलोड करें" : "Download Calendar"
  };

  return (
    <div id="crop-calendar-mod" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="text-emerald-700 dark:text-emerald-400 w-6 h-6 animate-pulse" /> {t.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
          {t.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Settings form on the left */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-slate-50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-3xs">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-805 dark:text-slate-350 uppercase tracking-wide border-b pb-2">{t.paramTitle}</h3>
            
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.targetCropLabel}</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-emerald-600 shadow-3xs text-slate-800 dark:text-white cursor-pointer"
              >
                {CROPS.map((cr) => (
                  <option key={cr.en} value={cr.en} className="text-slate-930 text-xs font-semibold">{cr.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.sowingMonthLabel}</label>
              <select
                value={sowingMonth}
                onChange={(e) => setSowingMonth(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-emerald-600 shadow-3xs text-slate-800 dark:text-white cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.en} value={m.en} className="text-slate-930 text-xs font-semibold">{m.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.regionLabel}</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-emerald-600 shadow-3xs text-slate-800 dark:text-white cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.en} value={r.en} className="text-slate-930 text-xs font-semibold">{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.cycleDuration}: <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{duration}</span>
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1 font-mono">
                <span>3 M</span>
                <span>8 M</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800/60 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm relative overflow-hidden"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.generating}</span>
                </>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>{t.buildBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Calendar display on the right */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {calendar ? (
            <div className="flex flex-col gap-4">
              
              {/* Header block with interactive mode selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded tracking-wider font-mono">
                    {t.successBanner}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-1 leading-tight">
                    {calendar.cropName} ({calendar.region})
                  </h3>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {t.estDuration}: <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">{calendar.durationMonths} {t.monthsSuffix}</span>, {isHi ? "प्रारंभ" : "Starting"} {calendar.sowingMonth}
                  </p>
                </div>

                <div className="flex flex-wrap items-center bg-slate-100/80 dark:bg-slate-900/40 p-1 rounded-xl self-start sm:self-center border border-slate-200/40 gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-950 shadow-xs text-emerald-850 dark:text-emerald-400 border border-slate-200/20"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    📝 {isHi ? "विवरण सूची" : "Cycle Checklist"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      viewMode === "calendar"
                        ? "bg-white dark:bg-slate-950 shadow-xs text-emerald-855 dark:text-emerald-400 border border-slate-200/20"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    📅 {isHi ? "फसल चक्र कैलेंडर" : "Crop Calendar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("general_journal")}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      viewMode === "general_journal"
                        ? "bg-white dark:bg-slate-950 shadow-xs text-emerald-855 dark:text-emerald-400 border border-slate-200/20"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    📔 {isHi ? "सामान्य जर्नल" : "General Journal"}
                  </button>
                </div>
              </div>

              {viewMode === "list" && (
                /* Vertical timeline representation */
                <div className="flex flex-col gap-5 border-l-2 border-emerald-100 dark:border-emerald-900/40 pl-4 ml-2">
                  {calendar.timeline.map((item, idx) => {
                    const pNoteKey = `${crop}_${region}_${idx}`;
                    const notesList = phaseNotes[pNoteKey] || [];
                    return (
                      <div key={idx} className="relative group">
                        {/* Circle marker */}
                        <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-4 border-white dark:border-slate-950 group-hover:scale-110 transition shadow-xs z-10"></div>
                        
                        <div className="bg-slate-50 hover:bg-slate-50/45 dark:bg-slate-900/30 dark:hover:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 p-4 rounded-2.5xl transition shadow-3xs flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/40 dark:border-slate-850 pb-2">
                            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-450 uppercase tracking-wider">{item.monthName}</span>
                            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-450 px-2.5 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/30">{item.phase}</span>
                          </div>

                          {/* Activities list */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1.5">{t.taskHeader}</span>
                            <ul className="flex flex-col gap-1 text-[11px] text-slate-650 dark:text-slate-350 font-semibold leading-relaxed">
                              {item.activities.map((act, idx2) => (
                                <li key={idx2} className="flex items-start gap-1.5">
                                  <span className="text-emerald-700 dark:text-emerald-400 shrink-0">▸</span>
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3 border-slate-200/50 dark:border-slate-800/50">
                            {/* Nutrition */}
                            <div className="bg-slate-100/50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-semibold">
                              <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-400 block uppercase tracking-wider mb-1 font-mono">{t.fertilizerHeader}</span>
                              <span className="text-[11px] text-slate-700 dark:text-slate-350 font-semibold leading-relaxed">{item.fertilizerRequirement}</span>
                            </div>

                            {/* Precautions */}
                            <div className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20 font-semibold">
                              <span className="text-[9px] font-bold text-amber-808 dark:text-amber-400 block uppercase tracking-wider mb-1 font-mono">{t.precautionHeader}</span>
                              <span className="text-[11px] text-amber-950 dark:text-amber-200 font-semibold leading-relaxed">{item.precautions?.[0]}</span>
                            </div>
                          </div>

                          {/* Interactive Notes Section inside biological phase card */}
                          <div className="border-t pt-3.5 border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-2 bg-emerald-500/5 dark:bg-emerald-500/5 p-3 rounded-2xl font-semibold">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-650 dark:text-slate-350 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                <Notebook className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-455" /> {t.notesTitle}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                                {notesList.length} {isHi ? "नोट्स" : "notes"}
                              </span>
                            </div>

                            {/* Notes rendering lists */}
                            {notesList.length > 0 && (
                              <div className="flex flex-col gap-1.5 mt-1 pr-1 max-h-52 overflow-y-auto">
                                {notesList.map((note, nIdx) => (
                                  <div key={nIdx} className="flex items-start justify-between gap-3 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-800 shadow-4xs group/note relative">
                                    <span className="text-[11px] text-slate-755 dark:text-slate-305 font-semibold leading-relaxed select-all">
                                      📌 {note}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => removePhaseNote(idx, nIdx)}
                                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition shrink-0 cursor-pointer"
                                      title={isHi ? "टिप्पणी हटाएं" : "Delete note"}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* New Note Form widgets inside phases */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <input
                                type="text"
                                placeholder={t.notesPlaceholder}
                                value={activeNoteTexts[pNoteKey] || ""}
                                onChange={(e) => setActiveNoteTexts(prev => ({
                                  ...prev,
                                  [pNoteKey]: e.target.value
                                }))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addPhaseNote(idx);
                                  }
                                }}
                                className="flex-1 text-[11px] font-semibold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs"
                              />
                              <button
                                type="button"
                                onClick={() => addPhaseNote(idx)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-3xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.addNoteBtn}</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {viewMode === "calendar" && (
                /* Date wise real calendar view */
                <div className="flex flex-col gap-4 animate-fade-in">
                  
                  {/* Calendar months selectors row */}
                  <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {Array.from({ length: duration }).map((_, offsetIdx) => {
                      const info = getTimelineMonthAttributes(offsetIdx);
                      const isSelected = selectedGridMonthIdx === offsetIdx;
                      return (
                        <button
                          key={offsetIdx}
                          type="button"
                          onClick={() => {
                            setSelectedGridMonthIdx(offsetIdx);
                            setSelectedCalendarDay(1);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl text-[10.5px] font-mono font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-emerald-700 border-emerald-700 text-white shadow-xs"
                              : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border-slate-150 dark:border-slate-850 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {isHi ? `माह ${offsetIdx + 1}: ${info.displayName}` : `Month ${offsetIdx + 1}: ${info.displayName}`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dual Grid Layout: Left is Real Date Matrix, Right is Daily Activities Checklist Planner */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start mt-1">
                    
                    {/* Left Calendar Grid */}
                    <div className="md:col-span-12 lg:col-span-5 flex flex-col gap-3">
                      {(() => {
                        const monthDetails = getTimelineMonthAttributes(selectedGridMonthIdx);
                        const days = Array.from({ length: monthDetails.daysInMonth }, (_, idx) => idx + 1);
                        const WEEKDAYS = isHi
                          ? ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
                          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

                        return (
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1 font-sans">
                                📅 {monthDetails.displayName}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                {isHi ? "वास्तविक तारीख पैटर्न" : "Real Dates Block"}
                              </span>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5 border border-slate-200/50 dark:border-slate-800/80 p-3 rounded-2.5xl bg-slate-50/50 dark:bg-slate-900/10 shadow-4xs w-full">
                              {WEEKDAYS.map((wk, idx) => (
                                <div key={idx} className="text-center text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 py-1 uppercase tracking-wider">
                                  {wk}
                                </div>
                              ))}

                              {/* Day Week Offset */}
                              {Array.from({ length: monthDetails.startDayOfWeek }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="aspect-square bg-slate-50/40 dark:bg-slate-950/20 rounded-xl" />
                              ))}

                              {/* Days loop */}
                              {days.map((dayNum) => {
                                const hasTasks = getDayTasks(selectedGridMonthIdx, dayNum).length > 0;
                                const noteKey = getDateNoteKey(monthDetails.year, monthDetails.monthNameEn, dayNum);
                                const dayNotesList = dateWiseNotes[noteKey] || [];
                                const hasNotes = dayNotesList.length > 0;
                                const isSelected = selectedCalendarDay === dayNum;

                                return (
                                  <button
                                    key={dayNum}
                                    type="button"
                                    onClick={() => setSelectedCalendarDay(dayNum)}
                                    className={`aspect-square flex flex-col items-center justify-between p-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer relative ${
                                      isSelected
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                                        : "bg-white border-slate-100 hover:border-emerald-450 hover:bg-emerald-50/10 text-slate-750 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                                    }`}
                                  >
                                    <span>{dayNum}</span>
                                    
                                    {/* Small dynamic status indicator dots */}
                                    <div className="flex gap-0.5 mt-auto">
                                      {hasTasks && (
                                        <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                                      )}
                                      {hasNotes && (
                                        <span className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-amber-400"}`} />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Right Dynamic Day Planner panel */}
                    <div className="md:col-span-12 lg:col-span-7">
                      {(() => {
                        const monthDetails = getTimelineMonthAttributes(selectedGridMonthIdx);
                        const noteKey = getDateNoteKey(monthDetails.year, monthDetails.monthNameEn, selectedCalendarDay);
                        const dayNotesList = dateWiseNotes[noteKey] || [];
                        const dayTasks = getDayTasks(selectedGridMonthIdx, selectedCalendarDay);

                        return (
                          <div className="flex flex-col gap-4 bg-slate-50/45 dark:bg-slate-900/10 p-4 rounded-2.5xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs w-full">
                            <div className="border-b pb-2.5 flex items-center justify-between border-slate-200/40 dark:border-slate-800/60 font-semibold">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4.5 h-4.5 text-emerald-600" />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-855 dark:text-white leading-tight font-sans">
                                    {monthDetails.displayName}, {isHi ? `दिन ${selectedCalendarDay}` : `Day ${selectedCalendarDay}`}
                                  </h4>
                                  <span className="text-[10px] text-emerald-705 dark:text-emerald-400 font-bold block uppercase tracking-wider mt-0.5 font-mono">
                                    {calendar.timeline[selectedGridMonthIdx]?.phase || ""}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] sm:inline font-bold bg-slate-105 dark:bg-slate-950/80 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-250/30 font-mono">
                                {isHi ? "दैनिक कार्यसूची" : "Daily Planner"}
                              </span>
                            </div>

                            {/* Scheduled biological crops task for this date */}
                            <div>
                              <h5 className="text-[10.5px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                                👨‍🌾 {isHi ? "निर्धारित फसल चक्र कार्य:" : "Scheduled Crop Chores:"}
                              </h5>
                              {dayTasks.length === 0 ? (
                                <p className="text-[11px] text-slate-400 font-medium py-1 italic">
                                  {isHi ? "इस दिन के लिए कोई विशिष्ट कार्य निर्धारित नहीं।" : "No specific biological milestones scheduled for today."}
                                </p>
                              ) : (
                                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                                  {dayTasks.map((taskText, tIdx) => (
                                    <div
                                      key={tIdx}
                                      className="flex items-center gap-2.5 p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span className="text-[11px] font-semibold text-slate-750 dark:text-slate-205 leading-relaxed">
                                        {taskText}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Farmer's daily diary journal entries for Crop Calendar date */}
                            <div className="flex flex-col gap-2 mt-2">
                              <h5 className="text-[10.5px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-widest font-mono">
                                📖 {isHi ? "दैनिक कृषि टिप्पणियाँ और रिकॉर्ड्स:" : "Agronomy Notes & Record Entry:"}
                              </h5>

                              {dayNotesList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950/80 rounded-2xl border border-slate-200/40 text-center">
                                  <BookOpen className="w-6 h-6 text-slate-350 dark:text-slate-650 mb-1" />
                                  <p className="text-[10.5px] leading-relaxed text-slate-455 dark:text-slate-500 max-w-sm">
                                    {isHi
                                      ? "इस तिथि के लिए कोई अतिरिक्त रिकॉर्ड उपलब्ध नहीं है। नीचे त्वरित टिप्पणी या अवलोकन सहेजें।"
                                      : "No custom notes written for this cycle date. Type below to log specific observations, rain depth or soil stats."}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                                  {dayNotesList.map((noteText, nIdx) => (
                                    <div
                                      key={nIdx}
                                      className="p-3 bg-amber-50/20 dark:bg-amber-950/5 border border-amber-200/20 dark:border-amber-900/10 rounded-2xl flex items-start justify-between gap-3"
                                    >
                                      <p className="text-[11px] text-amber-900 dark:text-amber-200/90 font-semibold leading-relaxed flex-1 whitespace-pre-wrap">
                                        {noteText}
                                      </p>
                                      <button
                                        type="button"
                                        onClick={() => removeDateNote(monthDetails.year, monthDetails.monthNameEn, selectedCalendarDay, nIdx)}
                                        className="text-amber-700/60 hover:text-rose-600 p-0.5 rounded cursor-pointer shrink-0"
                                        title={isHi ? "हटाएं" : "Remove note"}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Input to save new note for specific CropCalendar date */}
                              <div className="flex items-center gap-1.5 mt-1">
                                <input
                                  type="text"
                                  placeholder={isHi ? "त्वरित कृषि टिप्पणी या गतिविधि दर्ज करें..." : "Log seed depth, insect sights, local rainfall, etc..."}
                                  value={newDateNoteText}
                                  onChange={(e) => setNewDateNoteText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      addDateNote(monthDetails.year, monthDetails.monthNameEn, selectedCalendarDay);
                                    }
                                  }}
                                  className="flex-1 text-[11px] font-semibold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => addDateNote(monthDetails.year, monthDetails.monthNameEn, selectedCalendarDay)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-3xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>{isHi ? "नोट जोड़ें" : "Save Note"}</span>
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })()}
                    </div>

                  </div>

                </div>
              )}

              {/* Utility actions footer: Printer, Downloader and Copier */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={copyCalendarToClipboard}
                  className="px-4 py-2 bg-slate-150 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-305 text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-4xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-450" />
                      <span>{t.shareSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t.shareBtn}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadCalendarAsFile}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 dark:text-emerald-305 text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-emerald-250/20 shadow-4xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-4xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.printBtn}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-900/10 border border-slate-150 rounded-3xl border-dashed text-center">
              <Calendar className="w-12 h-12 text-slate-300 animate-spin mb-3" />
              <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300">{t.generatingFallback}</h4>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
