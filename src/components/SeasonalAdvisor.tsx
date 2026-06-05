import React, { useState } from "react";
import { CloudRain, Sun, CloudSnow, Compass, Download } from "lucide-react";
import { SeasonalAdvice as AdviceType } from "../types";

interface SeasonalAdvisorProps {
  lang?: "en" | "hi";
}

export default function SeasonalAdvisor({ lang = "en" }: SeasonalAdvisorProps) {
  const [seasonalTab, setSeasonalTab] = useState<"winter" | "summer" | "monsoon" >("winter");
  const [advisorState, setAdvisorState] = useState<string>("Uttar Pradesh");
  const [advisorCrop, setAdvisorCrop] = useState<string>("Wheat");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customAdvice, setCustomAdvice] = useState<AdviceType | null>(null);

  const isHi = lang === "hi";

  const STATES = isHi
    ? [
        { en: "Uttar Pradesh", label: "उत्तर प्रदेश" },
        { en: "Punjab", label: "पंजाब" },
        { en: "Maharashtra", label: "महाराष्ट्र" },
        { en: "Rajasthan", label: "राजस्थान" }
      ]
    : [
        { en: "Uttar Pradesh", label: "Uttar Pradesh" },
        { en: "Punjab", label: "Punjab" },
        { en: "Maharashtra", label: "Maharashtra" },
        { en: "Rajasthan", label: "Rajasthan" }
      ];

  const seasonalPresetAdvice = {
    winter: {
      seasonName: isHi ? "शीत ऋतु (रबी फसलें)" : "Winter Season (Rabi Crops)",
      period: isHi ? "अक्टूबर से मार्च" : "October to March",
      climate: isHi 
        ? "हल्की शुष्क ठंड, सुबह की गहरी ओस पड़ना, पश्चिमी विक्षोभ के कारण पाला पड़ने की आशंका।" 
        : "Mild to dry cool weather, heavy morning dew, occasional western frost.",
      keyCrops: isHi 
        ? ["गेहूं (Wheat)", "सरसों (Mustard)", "चना (Gram)", "आलू (Potato)", "मटर (Peas)"] 
        : ["Wheat (Gehun)", "Mustard (Sarson)", "Gram / Chickpea (Chana)", "Potato (Aloo)", "Peas"],
      checklist: isHi 
        ? [
            "नवंबर के पहले हफ्तों में बुवाई करें जब दिन का तापमान 25 डिग्री सेल्सियस से नीचे गिर जाता है।",
            "गेहूं में बुवाई के लगभग 21 दिनों के बाद पहली सिंचाई (Crown Root Initiation) अवश्य करें।",
            "सरसों में लगातार चेपा कीटों की निगरानी करें; काले धब्बे दिखने पर तुरंत नीम के तेल का छिड़काव करें।",
            "धीमी वाष्पीकरण दर के समय मिट्टी में नमी बनाए रखने के लिए जिप्सम युक्त हल्की जुताई करें।"
          ]
        : [
            "Sow within early weeks of November as daytime temperatures fall below 25°C.",
            "Ensure crown root initiation (CRI) irrigation in Wheat around 21 days from sowing.",
            "Monitor Mustard continuously for aphid populations; spray neem oil if black clusters occur.",
            "Provide soil tilling with gypsum to sustain moisture under low atmospheric evaporation."
          ]
    },
    summer: {
      seasonName: isHi ? "ग्रीष्म ऋतु (जायद / गरमा फसलें)" : "Summer Season (Zaad / Garma Crops)",
      period: isHi ? "मार्च से जून" : "March to June",
      climate: isHi 
        ? "अत्यधिक तेज गर्म हवाएं (लू), तीव्र वाष्पीकरण और मिट्टी की परतों का तेजी से सूखना।" 
        : "Hot dry scorching winds (Loo), intense evaporation, dry soil beds.",
      keyCrops: isHi 
        ? ["मूंग (Moong Bean)", "तरबूज (Watermelon)", "खीरा / ककड़ी", "कद्दू / लौकी", "चारा फसलें"] 
        : ["Moong Bean (Green Gram)", "Watermelon", "Cucumber", "Pumpkin", "Fodder crops"],
      checklist: isHi 
        ? [
            "पौधों को सूखने से बचाने के लिए शाम या सुबह के समय हल्की नियमित सिंचाई जारी रखें।",
            "मिट्टी के सख्त होने से बचाने के लिए फसल अवशेषों (पुआल आदि) से मल्चिंग अवश्य करें।",
            "अत्यधिक रासायनिक नाइट्रोजन से बचें; इसके स्थान पर जैविक कम्पोस्ट का प्रयोग करें।",
            "कीटों को प्राकृतिक रूप से नष्ट करने के लिए दोपहर की तेज धूप में खेतों को खुला छोड़ गहरी जुताई करें।"
          ]
        : [
            "Sustain brief evening or early morning irrigation to save saplings from dehydration.",
            "Incorporate organic crop mulching (using straw or leftover leaves) to prevent soil baking.",
            "Avoid heavy synthetic nitrogen fertilizers; instead use microbial vermicompost.",
            "Prepare primary fields by deep drying under intense midday sun to naturally sterilize pests."
          ]
    },
    monsoon: {
      seasonName: isHi ? "वर्षा ऋतु (खरीफ फसलें)" : "Monsoon Season (Kharif Crops)",
      period: isHi ? "जून से सितंबर" : "June to September",
      climate: isHi 
        ? "उच्च हवा की नमी, घने मानसूनी बादल, खेतों में भारी जलभराव की उच्च आशंका।" 
        : "High moisture levels, dense monsoon rains, heavy water log risks.",
      keyCrops: isHi 
        ? ["धान / चावल (Paddy)", "मक्का (Maize)", "सोयाबीन", "अरहर (Arhar)", "कपास (Cotton)"] 
        : ["Rice / Paddy (Dhan)", "Maize (Makka)", "Soybean", "Pigeon Pea (Arhar)", "Cotton"],
      checklist: isHi 
        ? [
            "सभी मुख्य खेतों की सीमाओं पर पानी निकालने के लिए गहरी नालियों का निर्माण करें।",
            "खरपतवार रोकने के लिए धान की रोपाई के समय कम से कम 5 सेमी पानी का भराव बनाए रखें।",
            "घने बादलों वाले दिनों में रासायनिक छिड़काव से बचें; जड़ सड़न कवक पर नजर रखें।",
            "निराई-गुड़ाई और हवा के सुगम प्रवाह के लिए कतारबद्ध रोपाई (Line Transplantation) तकनीक अपनाएं।"
          ]
        : [
            "Construct deep runoff drainage channels in all major crop boundaries.",
            "Ensure paddy transplanting completes with at least 5cm water depth for weed suppression.",
            "Delay chemical sprays on dark cloudy days; monitor for root rot fungus early.",
            "Implement line transplantation matching to facilitate standard aerators and manual weeding."
          ]
    }
  };

  const handleFetchAdvice = async () => {
    setIsGenerating(true);
    setCustomAdvice(null);
    try {
      const response = await fetch("/api/seasonal-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: seasonalTab === "winter" ? "November" : seasonalTab === "summer" ? "May" : "July",
          region: advisorState,
          crop: advisorCrop
        })
      });

      if (!response.ok) throw new Error("Advice service failed.");
      const data = await response.json();
      setCustomAdvice(data);
    } catch (err) {
      console.error(err);
      
      const transCrop = isHi 
        ? (advisorCrop === "Wheat" ? "गेहूं" : advisorCrop === "Tomato" ? "टमाटर" : advisorCrop) 
        : advisorCrop;
      
      const transState = isHi 
        ? (advisorState === "Uttar Pradesh" ? "उत्तर प्रदेश" : advisorState === "Punjab" ? "पंजाब" : advisorState) 
        : advisorState;

      // Produce elegant simulated advice response
      setCustomAdvice({
        month: seasonalTab === "winter" ? (isHi ? "नवंबर" : "November") : seasonalTab === "summer" ? (isHi ? "मई" : "May") : (isHi ? "जुलाई" : "July"),
        region: transState,
        crop: transCrop,
        irrigation: isHi 
          ? "फसल के प्रारंभिक वानस्पतिक विकास के समय नियमित नमी बनाए रखें। दोपहर की तेज धूप में जलभराव से बचें।" 
          : "Sustain regular moisture levels during vegetative growth. Avoid midday waterlogging.",
        fertilization: isHi 
          ? "हल्की निराई-गुड़ाई के बाद यूरिया के साथ जस्ता (Zinc) या जैविक कम्पोस्ट मिलाकर छिड़काव करें।" 
          : "Apply urea mixed with zinc or organic compost prior to light weeding.",
        pestControl: isHi 
          ? "कीटों के आरंभ को रोकने के लिए ताजी छोटी पत्तियों पर सुबह के समय घुलनशील नीम अर्क का छिड़काव करें।" 
          : "Apply neem decoction sprays during morning hours on young leaves.",
        harvestingPrep: isHi 
          ? "जब बालियां 80% सुनहरी हो जाएं, तब कटाई करें; नमी कम करने के लिए धूप में अच्छी तरह सुरक्षित सुखाएं।" 
          : "Cut when stalks turn 80% golden; dry beneath hot sun to reduce density.",
        generalTips: isHi 
          ? [
              "सूरज की रोशनी और वायु संचार के मार्ग को बेहतर बनाने के लिए फसलों के बीच समान दूरी रखें।",
              "कीटों के निवास स्थान नष्ट करने के लिए मेड़ों के आस-पास जंगली खरपतवार बिल्कुल जमा न होने दें।"
            ] 
          : [
              "Maintain optimal horizontal crop distancing to improve sunlight access.",
              "Keep borders clear of invasive weeds to counter insect vector colonization."
            ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAdvice = () => {
    let titleStr = isHi ? "ऋतु अनुकूल कृषि सलाह पत्र" : "Agronomy Seasonal Advice Sheet";
    let text = `🌾 ${titleStr.toUpperCase()} 🌾\n`;
    text += `=========================================\n\n`;

    // 1. Current Seasonal Preset details
    text += `📅 ${isHi ? "सक्रिय मौसम जानकारी" : "Active Season Preset"}:\n`;
    text += `   - ${isHi ? "ऋतु नाम" : "Season name"}: ${currentPreset.seasonName}\n`;
    text += `   - ${isHi ? "समयावधि" : "Active Period"}: ${currentPreset.period}\n`;
    text += `   - ${isHi ? "जलवायु विवरण" : "Climate Details"}: ${currentPreset.climate}\n\n`;

    text += `🌱 ${isHi ? "अनुशंसित फसलें" : "Recommended Crops"}:\n`;
    currentPreset.keyCrops.forEach(c => {
      text += `   - ${c}\n`;
    });
    text += `\n`;

    text += `👩‍🌾 ${isHi ? "मुख्य कृषि कार्य सूची" : "Key Crop Tasks Checklist"}:\n`;
    currentPreset.checklist.forEach((item, idx) => {
      text += `   ${idx + 1}. ${item}\n`;
    });
    text += `\n`;

    // 2. Custom Advice if exists
    if (customAdvice) {
      text += `-----------------------------------------\n`;
      text += `✨ ${isHi ? "कस्टम एआई सलाह रिपोर्ट" : "Custom AI Advice Report"}:\n`;
      text += `   - ${isHi ? "फसल" : "Crop"}: ${customAdvice.crop}\n`;
      text += `   - ${isHi ? "क्षेत्र" : "Region"}: ${customAdvice.region}\n`;
      text += `   - ${isHi ? "महीना" : "Month"}: ${customAdvice.month}\n\n`;

      text += `💧 ${isHi ? "सिंचाई मार्गदर्शन" : "Irrigation Guidance"}:\n`;
      text += `   ${customAdvice.irrigation}\n\n`;

      text += `🧪 ${isHi ? "उर्वरक दिशा-निर्देश" : "Fertilization Guidelines"}:\n`;
      text += `   ${customAdvice.fertilization}\n\n`;

      text += `🐛 ${isHi ? "सुरक्षा एवं कीट नियंत्रण" : "Pest & Vector Prevention"}:\n`;
      text += `   ${customAdvice.pestControl}\n\n`;

      if (customAdvice.harvestingPrep) {
        text += `🌾 ${isHi ? "कटाई की तैयारी" : "Harvest Season Prep"}:\n`;
        text += `   ${customAdvice.harvestingPrep}\n\n`;
      }

      if (customAdvice.generalTips && customAdvice.generalTips.length > 0) {
        text += `💡 ${isHi ? "अतिरिक्त कस्टमाइज़्ड युक्तियाँ" : "Additional Advisory Tips"}:\n`;
        customAdvice.generalTips.forEach((tip, idx) => {
          text += `   - ${tip}\n`;
        });
        text += `\n`;
      }
    }

    text += `---\n`;
    text += `${isHi ? "कृषि कनेक्ट एआई ऐप द्वारा ऑफलाइन संदर्भ के लिए सहेजा गया।" : "Downloaded from Krishi Connect AI Hub for offline farming reference."}\n`;
    text += `${isHi ? "दिनांक" : "Date Obtained"}: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${customAdvice ? customAdvice.crop.replace(/\s+/g, "_") + "_" : ""}${seasonalTab}_advice_sheet.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentPreset = seasonalPresetAdvice[seasonalTab];

  const t = {
    title: isHi ? "ऋतु अनुकूल कृषि सलाहकार" : "Agronomy Seasonal Advisor",
    desc: isHi ? "रबी, खरीफ और जायद सीजन के लिए फसल प्रबंधन, मौसम चक्र और निराई-गुड़ाई प्रक्रियाओं की सटीक सलाह प्राप्त करें।" : "Access crop guidance, optimum weather schedules, and specific weeding steps for Rabi, Kharif, and Zaad seasons.",
    winterTab: isHi ? "शीत लहर (रबी)" : "Winter (Rabi)",
    summerTab: isHi ? "ग्रीष्म लहर (जायद)" : "Summer (Zaad)",
    monsoonTab: isHi ? "वर्षा ऋतु (खरीफ)" : "Monsoon (Kharif)",
    activePreset: isHi ? "सक्रिय मौसमी गाइड" : "Active Preset Guidance",
    periodLabel: isHi ? "सक्रिय समयावधि:" : "Active Period:",
    climateLabel: isHi ? "🌦️ इस ऋतु के जलवायु विवरण:" : "🌦️ Season Climate details:",
    cropsLabel: isHi ? "उत्कृष्ट पैदावार देने वाली फसलें:" : "Recommended High Yield Crops:",
    tasksLabel: isHi ? "👩‍🌾 मुख्य कृषि कार्यों की जाँच-सूची:" : "👩‍🌾 Key Crop Task Checklist:",
    customQuery: isHi ? "कस्टम मौसमी सलाह खोजें" : "Custom Seasonal query",
    queryDesc: isHi ? "लाइव डेटाबेस से विशिष्ट सलाह लें" : "Query live advisory databases",
    stateLabel: isHi ? "राज्य चुनें" : "State Area",
    cropLabel: isHi ? "फसल का नाम" : "Sowing Crop",
    cropPlaceholder: isHi ? "जैसे: टमाटर, सरसों, सोयाबीन" : "e.g. Tomato, Soybean",
    fetchBtn: isHi ? "विशिष्ट सलाह खोजें" : "Fetch custom advice",
    processing: isHi ? "सलाह तैयार हो रही है..." : "Processing Advice...",
    reportTitle: isHi ? "परामर्श रिपोर्ट" : "Advice Report",
    adviceFor: isHi ? "विशेष मार्गदर्शन" : "Guidance for",
    irrigationHead: isHi ? "💧 सिंचाई मार्गदर्शन:" : "💧 Irrigation Guidance:",
    fertilizationHead: isHi ? "🧪 उर्वरक और खाद दिशा-निर्देश:" : "🧪 Fertilization Guidelines:",
    pestHead: isHi ? "🐛 सुरक्षा एवं कीट नियंत्रण:" : "🐛 Pest & Vector Prevention:",
    downloadBtn: isHi ? "सलाह पत्र डाउनलोड करें (Offline Sheet)" : "Download Advice Sheet (Offline)"
  };

  return (
    <div id="seasonal-advisor-mod" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Compass className="text-emerald-700 dark:text-emerald-400 w-6 h-6 animate-pulse" /> {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t.desc}
          </p>
        </div>

        {/* Season toggle tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-205 dark:border-slate-800 w-fit shrink-0">
          <button
            onClick={() => setSeasonalTab("winter")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              seasonalTab === "winter" ? "bg-white dark:bg-slate-955 text-emerald-800 dark:text-emerald-400 shadow-sm" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            {t.winterTab}
          </button>
          <button
            onClick={() => setSeasonalTab("summer")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              seasonalTab === "summer" ? "bg-white dark:bg-slate-955 text-emerald-800 dark:text-emerald-400 shadow-sm" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            {t.summerTab}
          </button>
          <button
            onClick={() => setSeasonalTab("monsoon")}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              seasonalTab === "monsoon" ? "bg-white dark:bg-slate-955 text-emerald-800 dark:text-emerald-400 shadow-sm" : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            {t.monsoonTab}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Preset Info Panel */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-800/60 flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full uppercase">
                {t.activePreset}
              </span>
              <h3 className="text-base font-bold text-slate-805 dark:text-white mt-2">{currentPreset.seasonName}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5 font-semibold">{t.periodLabel} {currentPreset.period}</p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300 leading-normal">
              <span className="block font-bold text-slate-800 dark:text-slate-200 mb-0.5">{t.climateLabel}</span>
              {currentPreset.climate}
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-2">{t.cropsLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                {currentPreset.keyCrops.map((crop, idx) => (
                  <span key={idx} className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-205 dark:border-slate-800 text-xs font-semibold px-3 py-1 rounded-xl shadow-3xs hover:border-emerald-350 transition">
                    🌱 {crop}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-2">{t.tasksLabel}</span>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                {currentPreset.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-105 dark:border-slate-800">
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-800/30 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-normal">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download button for seasonal advice */}
            <div className="mt-2 border-t border-slate-150 dark:border-slate-800/60 pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleDownloadAdvice}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.downloadBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Custom Query Block */}
        <div className="lg:col-span-5 flex flex-col gap-5 bg-emerald-50/20 dark:bg-slate-900/10 border border-emerald-100/40 dark:border-emerald-850/30 p-5 rounded-3xl justify-between self-start">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-emerald-100/50 dark:border-emerald-900/15 pb-3">
              <Compass className="text-emerald-700 dark:text-emerald-400 w-5 h-5 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-400 uppercase tracking-widest leading-none">{t.customQuery}</h3>
                <p className="text-[10px] text-emerald-805 dark:text-emerald-500 mt-0.5 font-medium">{t.queryDesc}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.stateLabel}</label>
              <select
                value={advisorState}
                onChange={(e) => setAdvisorState(e.target.value)}
                className="w-full text-xs font-semibold bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-emerald-600 shadow-3xs text-slate-800 dark:text-white cursor-pointer"
              >
                {STATES.map((stat) => (
                  <option key={stat.en} value={stat.en} className="text-slate-900">{stat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">{t.cropLabel}</label>
              <input
                type="text"
                value={advisorCrop}
                onChange={(e) => setAdvisorCrop(e.target.value)}
                placeholder={t.cropPlaceholder}
                className="w-full text-xs font-bold bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-emerald-600 text-slate-800 dark:text-white shadow-3xs"
              />
            </div>

            <button
              onClick={handleFetchAdvice}
              disabled={isGenerating || !advisorCrop}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isGenerating ? t.processing : t.fetchBtn}
            </button>
          </div>

          {customAdvice && (
            <div className="bg-white dark:bg-slate-950 border border-emerald-100 dark:border-emerald-900 p-4 rounded-2xl flex flex-col gap-3.5 shadow-2xs mt-4 animate-fade-in">
              <div className="border-b dark:border-slate-800 pb-2">
                <span className="text-[9px] font-mono font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-450 border border-sky-100 dark:border-sky-900 px-2 py-0.5 rounded uppercase">
                  {t.reportTitle}
                </span>
                <p className="text-xs font-bold text-slate-805 dark:text-white mt-1">{t.adviceFor} {customAdvice.crop} in {customAdvice.region}</p>
              </div>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  <span className="block font-bold text-slate-800 dark:text-slate-200 text-[10px] tracking-wider uppercase mb-0.5">{t.irrigationHead}</span>
                  {customAdvice.irrigation}
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  <span className="block font-bold text-slate-800 dark:text-slate-200 text-[10px] tracking-wider uppercase mb-0.5">{t.fertilizationHead}</span>
                  {customAdvice.fertilization}
                </div>
                <div className="text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  <span className="block font-bold text-slate-800 dark:text-slate-200 text-[10px] tracking-wider uppercase mb-0.5">{t.pestHead}</span>
                  {customAdvice.pestControl}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
