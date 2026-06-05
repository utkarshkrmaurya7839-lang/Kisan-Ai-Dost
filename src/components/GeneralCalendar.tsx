import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  CheckSquare, 
  Square, 
  Notebook, 
  Plus, 
  Trash2, 
  BookOpen, 
  Sparkles, 
  Clock, 
  ArrowRight
} from "lucide-react";

interface GeneralCalendarProps {
  lang?: "en" | "hi";
}

export default function GeneralCalendar({ lang = "en" }: GeneralCalendarProps) {
  const isHi = lang === "hi";
  
  // Real date system
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-based
  const currentDay = today.getDate();

  // Current view states
  const [generalViewMonth, setGeneralViewMonth] = useState(currentMonth);
  const [generalSelectedDay, setGeneralSelectedDay] = useState(currentDay);

  // Notes and Tasks local storage persistence
  const [generalJournalNotes, setGeneralJournalNotes] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_general_journal_notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [generalTasks, setGeneralTasks] = useState<Record<string, { id: string, text: string, completed: boolean }[]>>(() => {
    try {
      const saved = localStorage.getItem("kisan_general_journal_tasks");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  const [generalNewNoteText, setGeneralNewNoteText] = useState("");
  const [generalNewTaskText, setGeneralNewTaskText] = useState("");

  useEffect(() => {
    localStorage.setItem("kisan_general_journal_notes", JSON.stringify(generalJournalNotes));
  }, [generalJournalNotes]);

  useEffect(() => {
    localStorage.setItem("kisan_general_journal_tasks", JSON.stringify(generalTasks));
  }, [generalTasks]);

  // Reset to today helper
  const handleResetToToday = () => {
    const freshToday = new Date();
    setGeneralViewMonth(freshToday.getMonth());
    setGeneralSelectedDay(freshToday.getDate());
  };

  const getGeneralMonthDetails = (monthIndex: number) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    
    const hindiMonths = [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई",
      "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ];
    
    const nameEn = englishMonths[monthIndex];
    const nameHi = hindiMonths[monthIndex];
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
    const startDayOfWeek = new Date(currentYear, monthIndex, 1).getDay();
    
    return {
      monthIndex,
      monthNameEn: nameEn,
      monthNameHi: nameHi,
      displayName: isHi ? `${nameHi} ${currentYear}` : `${nameEn} ${currentYear}`,
      daysInMonth,
      startDayOfWeek
    };
  };

  // Dynamic Date-Wise Tasks generator to avoid static repeating items and make it real-date-wise!
  const getGeneralTasksForDate = (year: number, monthIndex: number, dayNum: number) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    const monthNameEn = englishMonths[monthIndex];
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const custom = generalTasks[key];
    if (custom) return custom;

    // Default dynamic tasks based on month/season and day of week
    const dateObj = new Date(year, monthIndex, dayNum);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

    const defaults: { id: string; text: string; completed: boolean }[] = [];

    // Weekday-specific general tasks
    if (dayOfWeek === 1) { // Monday
      defaults.push({ 
        id: "def-mon-1", 
        text: isHi ? "इस सप्ताह की कृषि कार्ययोजना किसान जर्नल में संक्षेप में दर्ज करें" : "Draft this week's field development checklist in your journal", 
        completed: false 
      });
    } else if (dayOfWeek === 3) { // Wednesday
      defaults.push({ 
        id: "def-wed-1", 
        text: isHi ? "स्थानीय मंडी भाव रुझानों और फसल समर्थन मूल्यों की समीक्षा करें" : "Review current local Mandi price trends for your target crop yield", 
        completed: false 
      });
    } else if (dayOfWeek === 5) { // Friday
      defaults.push({ 
        id: "def-fri-1", 
        text: isHi ? "कम्पोस्ट खाद के ढेर को पलटें और आर्द्रता बनाए रखने के लिए हल्का पानी छिड़कें" : "Turn compost pile organic matter & spray lightly with water to sustain microbial decay", 
        completed: false 
      });
    } else if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
      defaults.push({ 
        id: "def-wknd-1", 
        text: isHi ? "कृषि उपकरणों, औजारों और सिंचाई नोजल की गहरी सफाई व सैनिटाइजेशन करें" : "Perform deep cleaning & lubrication on active agricultural machinery or tools", 
        completed: false 
      });
    }

    // Seasonal dynamic tasks
    if (monthIndex === 5 || monthIndex === 6) { // June / July (Rainy / Kharif sowing season)
      defaults.push({
        id: "def-season-1",
        text: isHi ? "भारी बारिश की संभावना से पहले खेतों में पानी की सुचारू निकासी नालियों की जांच करें" : "Check field drainage passages to prevent stagnation ahead of monsoon downpours",
        completed: false
      });
      defaults.push({
        id: "def-season-2",
        text: isHi ? "बुवाई से पहले बीज उपचार (Seed Treatment) को पूरा करें" : "Conduct seed treatment protocols to prevent early rot pathogens",
        completed: false
      });
    } else if (monthIndex === 10 || monthIndex === 11) { // Nov / Dec (Winter / Rabi season)
      defaults.push({
        id: "def-season-3",
        text: isHi ? "शुरुआती कोहरे या शीत लहर से कोमल पौधों को बचाने के लिए मल्चिंग या पुआल बिछाएं" : "Prepare mulching setups on organic rows to shield active rooting from frost",
        completed: false
      });
      defaults.push({
        id: "def-season-4",
        text: isHi ? "फसल की सिंचाई की आवश्यकताओं को तापमान के अनुसार समायोजित रखें" : "Tweak irrigation spray schedules to match chilly night temperatures",
        completed: false
      });
    } else { // Spring / Autumn/ Summer
      defaults.push({
        id: "def-season-5",
        text: isHi ? "खेत के चारों ओर खरपतवार वृद्धि की जांच करें और सीमाओं को साफ रखें" : "Clear border invasive weed growth to avoid sap infestation nesting",
        completed: false
      });
      defaults.push({
        id: "def-season-6",
        text: isHi ? "मिट्टी के वायुकरण को बढ़ाने के लिए हल्की गुड़ाई करें" : "Engage in loose tilling along active plant crowns for better aerating",
        completed: false
      });
    }

    // Baseline task for checking soil wellness / general updates
    defaults.push({
      id: "def-base-1",
      text: isHi ? "प्रातः काल फसल का निरीक्षण करें और पत्तों के स्वास्थ्य की सामान्य स्थिति जांचें" : "Inspect whole field margins for any localized leaf yellowing or bird damage",
      completed: false
    });

    return defaults;
  };

  const toggleGeneralTask = (year: number, monthIndex: number, dayNum: number, taskId: string) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    const monthNameEn = englishMonths[monthIndex];
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthIndex, dayNum);
    const updated = current.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setGeneralTasks(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const addGeneralTask = (year: number, monthIndex: number, dayNum: number) => {
    const txt = generalNewTaskText.trim();
    if (!txt) return;
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    const monthNameEn = englishMonths[monthIndex];
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthIndex, dayNum);
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

  const deleteGeneralTask = (year: number, monthIndex: number, dayNum: number, taskId: string) => {
    const englishMonths = [
      "January", "February", "March", "April", "May", "June", "July", 
      "August", "September", "October", "November", "December"
    ];
    const monthNameEn = englishMonths[monthIndex];
    const key = `${year}_${monthNameEn}_${dayNum}`;
    const current = getGeneralTasksForDate(year, monthIndex, dayNum);
    const updated = current.filter(t => t.id !== taskId);
    setGeneralTasks(prev => ({
      ...prev,
      [key]: updated
    }));
  };

  const getTraditionalAdvice = (dayNum: number) => {
    const tithiNum = (dayNum % 15) || 15;
    const isWaxing = dayNum <= 15;
    
    const phaseName = isWaxing 
      ? (isHi ? `शुक्ल पक्ष - तिथि ${tithiNum}` : `Shukla Paksha - Tithi ${tithiNum}`)
      : (isHi ? `कृष्ण पक्ष - तिथि ${tithiNum}` : `Krishna Paksha - Tithi ${tithiNum}`);
      
    let moonStatus = "";
    let bioAdvice = "";
    
    if (dayNum === 15) {
      moonStatus = isHi ? "🌕 पूर्णिमा (Full Moon Peak)" : "🌕 Purnima (Full Moon Peak)";
      bioAdvice = isHi 
        ? "पूर्णिमा के दिन पत्तेदार और ऊपरी भाग वाली फसलों में नमी और पोषण का प्रवाह उच्चतम रहता है। कटाई और जैविक छिड़काव के लिए सर्वश्रेष्ठ काल।" 
        : "Full moon period. Upward sap flow is peak in leafy crops and above-ground stems. Highly favorable for organic foliar sprays.";
    } else if (dayNum === 30 || dayNum === 29) {
      moonStatus = isHi ? "🌑 अमावस्या (New Moon Peak)" : "🌑 Amavasya (New Moon Peak)";
      bioAdvice = isHi 
        ? "अमावस्या के दिन जड़ प्रणाली अधिक सक्रिय होती है। जमीन की गहरी गोड़ाई, जड़ खाद और कीट नियंत्रण के लिए यह समय सर्वोत्तम माना जाता है।" 
        : "New moon period. Below-ground root systems are highly active. Recommended for tilling, weeding, and root nutrition fertilizer infusion.";
    } else if (tithiNum <= 5) {
      moonStatus = isHi ? "🌙 बालचंद्र (Slight Crescent Moon)" : "🌙 Balchandra (Slight Crescent)";
      bioAdvice = isHi 
        ? "बीजों के स्वस्थ अंकुरण के लिए मिट्टी में उचित नमी बनाए रखें। बुवाई पूर्व की तैयारियों के लिए यह उत्कृष्ट समय है।" 
        : "Promotes early seed moisture stabilization. Great for general farm ground pre-treatments and soil tilling.";
    } else if (tithiNum <= 10) {
      moonStatus = isHi ? "🌓 अर्धचंद्र (Quarter Moon Transition)" : "🌓 Quarter Moon Phase";
      bioAdvice = isHi 
        ? "फसलों की वानस्पतिक सघनता और नई कोंपलें विकसित होने का उत्कृष्ट समय। पूरक पोषण छिड़काव करें।" 
        : "Excellent for vegetative growth spikes and sprouting new branches. Ideal for supplementary bio-nutrients.";
    } else {
      moonStatus = isHi ? "🌖 गिब्बस चंद्र (Gibbous Rising)" : "🌖 Gibbous Moon Phase";
      bioAdvice = isHi 
        ? "फल लगने और दाने भरने व परिपक्व होने की अवस्था। सिंचाई का संतुलन बनाए रखें ताकि सड़न रोग न लगे।" 
        : "Grain filling and fruit stabilization phase. Manage water runoffs closely to prevent mold growth.";
    }
    
    return { phaseName, moonStatus, bioAdvice };
  };

  const monthDetails = getGeneralMonthDetails(generalViewMonth);
  const noteKey = `${currentYear}_${monthDetails.monthNameEn}_${generalSelectedDay}`;
  const currentTasks = getGeneralTasksForDate(currentYear, generalViewMonth, generalSelectedDay);
  const dayNotes = generalJournalNotes[noteKey] || [];

  return (
    <div id="general-calendar-mod" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      
      {/* Title & Today Panel */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-855 dark:text-white flex items-center gap-2">
            <Calendar className="text-emerald-700 dark:text-emerald-400 w-6 h-6 animate-pulse" />
            {isHi ? "सामान्य कृषि कैलेंडर और किसान डायरी" : "General Farm Calendar & Journal"}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {isHi 
              ? "साल भर का पंचांग चक्र, दैनिक कृषि उद्देश्य, और किसान डायरी। वास्तविक तिथि के अनुसार काम प्रबंधित करें।" 
              : "Year-round panchang bio-cycle, daily farming duties, and interactive diary. Plan and track using real date parameters."}
          </p>
        </div>

        {/* Real Date Status & Today Button */}
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2.5 rounded-2xl self-start md:self-center">
          <Clock className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400" />
          <div className="text-left font-semibold">
            <span className="text-[9px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block leading-none mb-0.5">
              {isHi ? "आज की वास्तविक तारीख" : "Current Real Date"}
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-white font-mono">
              {today.toLocaleDateString(isHi ? "hi-IN" : "en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <button
            type="button"
            onClick={handleResetToToday}
            className="ml-2 px-2.5 py-1 text-[10px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition"
            title={isHi ? "आज की तिथि पर जाएं" : "Go to Today"}
          >
            {isHi ? "आज" : "Today"}
          </button>
        </div>
      </div>

      {/* Horizontal Months selection */}
      <div className="flex border-b border-slate-100 dark:border-slate-805 pb-3 overflow-x-auto gap-2 no-scrollbar">
        {Array.from({ length: 12 }).map((_, mIdx) => {
          const mDetails = getGeneralMonthDetails(mIdx);
          const isSelected = generalViewMonth === mIdx;
          const isCurrentMonth = currentMonth === mIdx;
          return (
            <button
              key={mIdx}
              type="button"
              onClick={() => {
                setGeneralViewMonth(mIdx);
                setGeneralSelectedDay(currentMonth === mIdx ? currentDay : 1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition shrink-0 cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-emerald-700 border-emerald-700 text-white shadow-xs"
                  : isCurrentMonth && !isSelected
                  ? "bg-emerald-50/50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/50 dark:text-emerald-400"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 border-slate-200/40 dark:border-slate-800 text-slate-600 dark:text-slate-350"
              }`}
            >
              {isHi ? mDetails.monthNameHi : mDetails.monthNameEn}
              {isCurrentMonth && (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-white animate-ping" : "bg-emerald-600 animate-pulse"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Calendar Grid & Panchang Advice */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          <div className="bg-slate-50/40 dark:bg-slate-900/10 p-4 rounded-2.5xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/40 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase font-sans tracking-tight">
                🗓️ {monthDetails.displayName}
              </span>
              
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{isHi ? "कार्य" : "Tasks"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{isHi ? "जर्नल" : "Diary"}</span>
                </div>
              </div>
            </div>

            {/* Weekday titles */}
            <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono mb-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
                 <span key={dayName}>
                   {isHi 
                     ? (dayName === "Sun" ? "रवि" : dayName === "Mon" ? "सोम" : dayName === "Tue" ? "मंगल" : dayName === "Wed" ? "बुध" : dayName === "Thu" ? "गुरु" : dayName === "Fri" ? "शुक्र" : "शनि") 
                     : dayName}
                 </span>
              ))}
            </div>

            {/* Days Grid Rendering */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty days padding */}
              {Array.from({ length: monthDetails.startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square opacity-0 bg-transparent rounded-lg" />
              ))}

              {/* Real month days */}
              {Array.from({ length: monthDetails.daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dKey = `${currentYear}_${monthDetails.monthNameEn}_${dayNum}`;
                const dailyTasksList = getGeneralTasksForDate(currentYear, generalViewMonth, dayNum);
                const hasNotes = (generalJournalNotes[dKey] || []).length > 0;
                
                // Show green dot only if there are outstanding, uncompleted tasks on this date
                const hasUncompletedTasks = dailyTasksList.some(item => !item.completed);
                const isSelected = generalSelectedDay === dayNum;
                const isTodayDay = currentYear === today.getFullYear() && currentMonth === generalViewMonth && currentDay === dayNum;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    onClick={() => setGeneralSelectedDay(dayNum)}
                    className={`aspect-square flex flex-col items-center justify-between p-1.5 text-xs font-black rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm scale-102"
                        : isTodayDay
                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400"
                        : "bg-white border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/10 text-slate-755 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <span className={isTodayDay && !isSelected ? "underline decoration-emerald-500 font-bold decoration-2" : ""}>{dayNum}</span>

                    {/* Indicator dots */}
                    <div className="flex gap-0.5 mt-auto">
                      {hasUncompletedTasks && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-emerald-500"}`} />
                      )}
                      {hasNotes && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-amber-400"}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lunar / Panchang Bio-Cycle panels */}
          {(() => {
            const adv = getTraditionalAdvice(generalSelectedDay);
            return (
              <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2.5xl flex flex-col gap-2">
                <div className="flex items-center justify-between gap-1 border-b border-emerald-250/20 dark:border-emerald-900/20 pb-1.5">
                  <span className="text-[10px] font-mono text-emerald-705 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    🌘 {isHi ? "कृषि पंचांग और जैविक चंद्र चक्र" : "Krishi Panchang & Bio Lunar Cycle"}
                  </span>
                  <span className="text-[9.5px] font-mono font-extrabold text-slate-500 dark:text-slate-400 uppercase">
                    {adv.phaseName}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 block mb-1">
                    {adv.moonStatus}
                  </span>
                  <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                    {adv.bioAdvice}
                  </p>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Right Side: Farm Chores Checklist and Farm Diary Log */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="flex flex-col gap-4 bg-slate-50/45 dark:bg-slate-900/10 p-5 rounded-2.5xl border border-slate-200/50 dark:border-slate-800/80 shadow-3xs w-full">
            
            {/* Header */}
            <div className="border-b pb-2.5 flex items-center justify-between border-slate-200/40 dark:border-slate-800/60 font-semibold">
              <div className="flex items-center gap-2">
                <Notebook className="w-4.5 h-4.5 text-emerald-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-855 dark:text-white leading-tight font-sans">
                    {monthDetails.displayName}, {isHi ? `तारीख ${generalSelectedDay}` : `Day ${generalSelectedDay}`}
                  </h4>
                  <p className="text-[10px] text-emerald-705 dark:text-emerald-400 font-semibold font-mono tracking-wide mt-0.5 uppercase">
                    {isHi ? "दैनिक कृषि डायरी और कर्तव्य" : "Daily Farm Diary & Tasks"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-slate-105 dark:bg-slate-950/80 text-slate-605 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-250/30 font-mono">
                {isHi ? "गृहकार्य और डायरी" : "Tasks & Notes"}
              </span>
            </div>

            {/* Chores Checklist */}
            <div className="flex flex-col gap-2">
              <h5 className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                📝 {isHi ? "दैनिक कृषि कार्य सूची:" : "Daily Farm Checklist:"}
              </h5>

              {currentTasks.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-medium py-1 italic">
                  {isHi ? "कोई कार्य निर्धारित नहीं।" : "No chores scheduled."}
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {currentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 group transition hover:border-slate-250"
                    >
                      <button
                        type="button"
                        onClick={() => toggleGeneralTask(currentYear, generalViewMonth, generalSelectedDay, task.id)}
                        className="flex items-start gap-2.5 text-left flex-1 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className={`text-[11px] font-semibold leading-relaxed ${task.completed ? "line-through text-slate-400 dark:text-slate-550" : "text-slate-755 dark:text-slate-205"}`}>
                          {task.text}
                        </span>
                      </button>

                      {/* Delete custom task */}
                      {task.id.startsWith("usr-") && (
                        <button
                          type="button"
                          onClick={() => deleteGeneralTask(currentYear, generalViewMonth, generalSelectedDay, task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition shrink-0 cursor-pointer"
                          title={isHi ? "कार्य मिटाएं" : "Delete chore"}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Task Form row */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  placeholder={isHi ? "अपना अतिरिक्त कार्य दर्ज करें..." : "Type custom task or chore to complete..."}
                  value={generalNewTaskText}
                  onChange={(e) => setGeneralNewTaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGeneralTask(currentYear, generalViewMonth, generalSelectedDay);
                    }
                  }}
                  className="flex-1 text-[11px] font-semibold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs"
                />
                <button
                  type="button"
                  onClick={() => addGeneralTask(currentYear, generalViewMonth, generalSelectedDay)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-3xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHi ? "जोड़ें" : "Add Task"}</span>
                </button>
              </div>
            </div>

            {/* Notes Diary Journal */}
            <div className="flex flex-col gap-2 mt-3">
              <h5 className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                📖 {isHi ? "किसान दैनिक डायरी / रिकॉर्ड प्रविष्टियां:" : "Farmer's Daily Diary Journal Entries:"}
              </h5>

              {dayNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-950/80 rounded-2xl border border-slate-200/40 text-center">
                  <BookOpen className="w-6 h-6 text-slate-350 dark:text-slate-650 mb-1" />
                  <p className="text-[10.5px] leading-relaxed text-slate-455 dark:text-slate-500 max-w-sm font-semibold">
                    {isHi
                      ? "आज की डायरी खाली है। सिंचाई समय, वर्षा, तापमान या कृषि टिप्पणियां सहेजें।"
                      : "No records yet. Tap below to log organic compost feed, rain level, temperature details, custom notes or agronomy checklists."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {dayNotes.map((noteText, nIdx) => (
                    <div
                      key={nIdx}
                      className="p-3 bg-amber-500/5 dark:bg-amber-950/10 border border-amber-250/20 dark:border-amber-900/15 rounded-2xl flex items-start justify-between gap-3"
                    >
                      <p className="text-[11px] text-amber-950 dark:text-amber-200 font-semibold leading-relaxed flex-1 whitespace-pre-wrap">
                        📌 {noteText}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = dayNotes.filter((_, idx2) => idx2 !== nIdx);
                          setGeneralJournalNotes((prev) => ({
                            ...prev,
                            [noteKey]: updated,
                          }));
                        }}
                        className="text-amber-700/60 hover:text-rose-600 p-0.5 rounded cursor-pointer shrink-0"
                        title={isHi ? "नोट हटाएं" : "Remove note"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Note Diary Form */}
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="text"
                  placeholder={isHi ? "कीटनाशक छिड़काव, मौसम के विवरण आदि दर्ज करें..." : "Log seed treatment, compost weight, soil dampness..."}
                  value={generalNewNoteText}
                  onChange={(e) => setGeneralNewNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const txt = generalNewNoteText.trim();
                      if (!txt) return;
                      const current = generalJournalNotes[noteKey] || [];
                      setGeneralJournalNotes((prev) => ({
                        ...prev,
                        [noteKey]: [...current, txt],
                      }));
                      setGeneralNewNoteText("");
                    }
                  }}
                  className="flex-1 text-[11px] font-semibold px-3 py-2 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-600 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-3xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const txt = generalNewNoteText.trim();
                    if (!txt) return;
                    const current = generalJournalNotes[noteKey] || [];
                    setGeneralJournalNotes((prev) => ({
                      ...prev,
                      [noteKey]: [...current, txt],
                    }));
                    setGeneralNewNoteText("");
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-3xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHi ? "दर्ज करें" : "Save Log"}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
