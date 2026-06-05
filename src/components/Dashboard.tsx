import React, { useState } from "react";
import { Sprout, Wheat, Droplet, Bug, BarChart3, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import WeatherWidget from "./WeatherWidget";
import { SIMULATED_MANDI_PRICES } from "../data";

interface DashboardProps {
  selectedState: string;
  selectedCrop: string;
  selectedMonth: string;
  setActiveTab: (tab: any) => void;
  lang?: "en" | "hi";
}

export default function Dashboard({ selectedState, selectedCrop, selectedMonth, setActiveTab, lang = "en" }: DashboardProps) {
  // Crop prediction yield simulation
  const [predictionCrop, setPredictionCrop] = useState("Wheat");
  const [predictionArea, setPredictionArea] = useState("2.5");
  const [predictionSoil, setPredictionSoil] = useState("Loamy");
  const [predictedYield, setPredictedYield] = useState<string | null>(null);
  const [loadingYield, setLoadingYield] = useState(false);

  const isHi = lang === "hi";

  const handleYieldPredict = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingYield(true);
    setTimeout(() => {
      const areaVal = parseFloat(predictionArea) || 1.0;
      let multiplier = 1.8; // tons per acre typical
      if (predictionSoil === "Alluvial") multiplier = 2.4;
      if (predictionSoil === "Black (Regur)") multiplier = 2.1;
      if (predictionSoil === "Sandy") multiplier = 1.1;

      const estimated = (areaVal * multiplier).toFixed(1);
      const estValue = (parseFloat(estimated) * 22750).toLocaleString("en-IN");
      const yieldText = isHi
        ? `${estimated} टन (अनुमानित मूल्य ₹${estValue})`
        : `${estimated} Tons (est. value ₹${estValue})`;
      setPredictedYield(yieldText);
      setLoadingYield(false);
    }, 700);
  };

  const TEXTS = {
    en: {
      soilHealth: "SOIL HEALTH",
      soilHealthVal: "Perfect 6.8 pH, Loamy",
      soilHealthSub: "Suitable for Rabi sowing",
      pestRisk: "PEST OUTBREAK RISK",
      pestRiskVal: "No active alerts",
      pestRiskSub: "Mild aphid risk in mustard",
      soilMoisture: "SOIL MOISTURE",
      soilMoistureVal: "Current index: 35%",
      soilMoistureSub: "Irrigation advised in 4d",
      activeHarvest: "ACTIVE HARVEST MAP",
      activeHarvestSub: "Sow state currently active",
      estimatedRate: "Estimated Mandi Rate Snapshot",
      viewBulletin: "View Live Bulletin Board",
      perQuintal: " / Quintal",
      agronomistInsights: "Daily Precision Agronomist Insights",
      agronomistDesc: `Based on current climate mapping in ${selectedState} during ${selectedMonth}, ensure you apply organic cold-pressed seed oils with warm irrigation water near crop stems. Refrain from heavy micro-nutrient spray routines during high soil moisture days.`,
      openAdvisor: "Open Seasonal Advice Sheets",
      yieldPredictor: "Yield Predictor",
      yieldDesc: "Model-based output estimations",
      targetCrop: "Target Crop Sowing",
      cultivatedArea: "Cultivated Land Area (Acres)",
      soilTexture: "Primary Soil Texture",
      calculateBtn: "Calculate Estimated Yield Output",
      calculating: "Processing Regional Factors...",
      estModel: "Estimated Model Output",
      estMsp: "Based on target MSP rate calculations",
    },
    hi: {
      soilHealth: "मिट्टी स्वास्थ्य",
      soilHealthVal: "उत्कृष्ट 6.8 pH, दोमट (Loamy)",
      soilHealthSub: "रबी की बुवाई के लिए उपयुक्त",
      pestRisk: "कीट प्रकोप का खतरा",
      pestRiskVal: "कोई सक्रिय चेतावनी नहीं",
      pestRiskSub: "सरसों में हल्के चेपा का जोखिम",
      soilMoisture: "मिट्टी की नमी",
      soilMoistureVal: "वर्तमान सूचकांक: 35%",
      soilMoistureSub: "4 दिन में सिंचाई की सलाह",
      activeHarvest: "सक्रिय फसल चक्र",
      activeHarvestSub: "बुवाई की अवस्था सक्रिय है",
      estimatedRate: "अनुमानित मंडी दरों की झलक",
      viewBulletin: "लाइव बुलेटिन बोर्ड देखें",
      perQuintal: " / क्विंटल",
      agronomistInsights: "दैनिक सटीक कृषि विशेषज्ञ सलाह",
      agronomistDesc: `${selectedMonth} के दौरान ${selectedState} में वर्तमान जलवायु मानचित्रण के आधार पर, यह सुनिश्चित करें कि आप फसल के तनों के पास गर्म सिंचाई के पानी के साथ जैविक कोल्ड-प्रेस बीज तेल का उपयोग करें। मिट्टी में अधिक नमी होने पर भारी सूक्ष्म पोषक तत्वों के छिड़काव से बचें।`,
      openAdvisor: "मौसमी सलाह पत्रक खोलें",
      yieldPredictor: "फसल उपज कैलकुलेटर",
      yieldDesc: "मॉडल आधारित उत्पादन अनुमान",
      targetCrop: "लक्षित बुवाई फसल",
      cultivatedArea: "कृषि भूमि क्षेत्र (एकड़)",
      soilTexture: "मुख्य मिट्टी की बनावट",
      calculateBtn: "अनुमानित उपज की गणना करें",
      calculating: "क्षेत्रीय कारकों की गणना चालू है...",
      estModel: "अनुमानित मॉडल उत्पादन",
      estMsp: "लक्षित न्यूनतम समर्थन मूल्य (MSP) गणना आधारित",
    }
  };

  const t = TEXTS[isHi ? "hi" : "en"];

  // Helper translations for static data in cards
  const translateCommodity = (commodity: string) => {
    if (!isHi) return commodity;
    return commodity
      .replace("Rice / Paddy (Dhan)", "धान / चावल (Paddy)")
      .replace("Wheat (Gehun)", "गेहूं (Wheat)")
      .replace("Maize (Makka)", "मक्का (Maize)")
      .replace("Sugarcane (Ganna)", "गन्ना (Sugarcane)")
      .replace("Cotton (Kapas)", "कपास (Cotton)")
      .replace("Soybean", "सोयाबीन (Soybean)")
      .replace("Groundnut (Moongphali)", "मूंगफली (Groundnut)")
      .replace("Mustard (Sarson)", "सरसों (Mustard)")
      .replace("Tomato (Tamatar)", "टमाटर (Tomato)")
      .replace("Potato (Aloo)", "आलू (Potato)")
      .replace("Onion (Pyaz)", "प्याज (Onion)")
      .replace("Gram / Chickpea (Chana)", "चना (Gram)")
      .replace("Pigeon Pea (Arhar/Tur)", "अरहर (Pigeon Pea)")
      .replace("Black Gram (Urad)", "उड़द (Black Gram)");
  };

  const translateMarket = (market: string) => {
    if (!isHi) return market;
    return market
      .replace("Khanna Mandi (Punjab)", "खन्ना मंडी (पंजाब)")
      .replace("Agra Mandi (UP)", "आगरा मंडी (उत्तर प्रदेश)")
      .replace("Lasalgaon Mandi (Maharashtra)", "लासलगांव मंडी (महाराष्ट्र)")
      .replace("Guntur Mandi (Andhra Pradesh)", "गुंटर मंडी (आंध्र प्रदेश)")
      .replace("Warangal Mandi (Telangana)", "वारंगल मंडी (तेलंगाना)")
      .replace("Patna Mandi (Bihar)", "पटना मंडी (बिहार)")
      .replace("Rajkot Mandi (Gujarat)", "राजकोट मंडी (गुजरात)")
      .replace("Kolar Mandi (Karnataka)", "कोलार मंडी (कर्नाटक)")
      .replace("Indore Mandi (MP)", "इंदौर मंडी (मध्य प्रदेश)")
      .replace("Alwar Mandi (Rajasthan)", "अलवर मंडी (राजस्थान)")
      .replace("Karnal Mandi (Haryana)", "करनाल मंडी (हरियाणा)")
      .replace("Kolkata Hub Mandi (West Bengal)", "कोलकाता प्रमुख मंडी (पश्चिम बंगाल)")
      .replace("Coimbatore Mandi (Tamil Nadu)", "कोयंबटूर मंडी (तमिलनाडु)")
      .replace("Amritsar (Punjab)", "अमृतसर (पंजाब)")
      .replace("Karnal (Haryana)", "करनाल (हरियाणा)")
      .replace("Khanna (Punjab)", "खन्ना (पंजाब)")
      .replace("Indore (MP)", "इन्दौर (मध्य प्रदेश)")
      .replace("Muzaffarnagar (UP)", "मुजफ्फरनगर (उत्तर प्रदेश)")
      .replace("Rajkot (Gujarat)", "राजकोट (गुजरात)")
      .replace("Latur (Maharashtra)", "लातूर (महाराष्ट्र)")
      .replace("Alwar (Rajasthan)", "अलवर (राजस्थान)")
      .replace("Agra (UP)", "आगरा (उत्तर प्रदेश)")
      .replace("Lasalgaon (Maharashtra)", "लासलगांव (महाराष्ट्र)")
      .replace("Kolar (Karnataka)", "कोलार (कर्नाटक)")
      .replace("Akola (Maharashtra)", "अकोला (महाराष्ट्र)");
  };

  return (
    <div id="dashboard-component-panel" className="flex flex-col gap-6">
      
      {/* Dynamic Weather Banner */}
      <WeatherWidget selectedState={selectedState} selectedMonth={selectedMonth} lang={lang} />

      {/* Grid of Key Farmers Status Indicators with premium Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Soil Health */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.025, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: 0.97 }}
          className="kisan-card-glass hover:border-emerald-500/40 transition-all p-5 rounded-2xl flex items-center gap-3.5 shadow-md hover:shadow-lg cursor-pointer group" 
          onClick={() => setActiveTab("advisor")}
        >
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Sprout className="w-5.5 h-5.5 text-emerald-500" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-mono font-bold block tracking-wider">{t.soilHealth}</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-white block mt-0.5">{t.soilHealthVal}</span>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{t.soilHealthSub}</p>
          </div>
        </motion.div>

        {/* Card 2: Pest alerts */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.025, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: 0.97 }}
          className="kisan-card-glass hover:border-amber-500/40 transition-all p-5 rounded-2xl flex items-center gap-3.5 shadow-md hover:shadow-lg cursor-pointer group" 
          onClick={() => setActiveTab("scanner")}
        >
          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 group-hover:animate-bounce transition-all duration-300">
            <Bug className="w-5.5 h-5.5 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-mono font-bold block tracking-wider">{t.pestRisk}</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-white block mt-0.5">{t.pestRiskVal}</span>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">{t.pestRiskSub}</p>
          </div>
        </motion.div>

        {/* Card 3: Irrigation rule */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.025, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: 0.97 }}
          className="kisan-card-glass hover:border-blue-500/40 transition-all p-5 rounded-2xl flex items-center gap-3.5 shadow-md hover:shadow-lg cursor-pointer group"
          onClick={() => setActiveTab("advisor")}
        >
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 group-hover:translate-y-0.5 transition-transform duration-300">
            <Droplet className="w-5.5 h-5.5 text-blue-500" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-mono font-bold block tracking-wider">{t.soilMoisture}</span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-white block mt-0.5">{t.soilMoistureVal}</span>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{t.soilMoistureSub}</p>
          </div>
        </motion.div>

        {/* Card 4: Crop Status progress */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.025, transition: { duration: 0.2, ease: "easeOut" } }}
          whileTap={{ scale: 0.97 }}
          className="kisan-card-glass hover:border-purple-500/40 transition-all p-5 rounded-2xl flex items-center gap-3.5 shadow-md hover:shadow-lg cursor-pointer group" 
          onClick={() => setActiveTab("calendar")}
        >
          <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Wheat className="w-5.5 h-5.5 text-purple-500" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-400 font-mono font-bold block tracking-wider">{t.activeHarvest}</span>
            <span className="text-xs font-extrabold text-slate-850 dark:text-white block mt-0.5 truncate max-w-[110px]">{selectedCrop}</span>
            <p className="text-[10px] text-purple-605 dark:text-purple-400 font-bold mt-0.5">{t.activeHarvestSub}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Mandi snapshot and advisor advice */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Live mandi price snapshot with glassmorphism */}
          <div className="kisan-card-glass rounded-3xl p-6 border shadow-lg">
            <div className="flex items-center justify-between border-b pb-4 mb-5 border-emerald-500/10">
              <div className="flex items-center gap-2">
                <BarChart3 className="text-emerald-500 w-5 h-5 animate-pulse" />
                <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm">{t.estimatedRate}</h3>
              </div>
              <button 
                onClick={() => setActiveTab("mandi")} 
                className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline cursor-pointer tracking-wider"
              >
                {t.viewBulletin}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SIMULATED_MANDI_PRICES.slice(0, 3).map((item, idx) => (
                <div key={idx} className="bg-emerald-50/30 dark:bg-slate-900/40 p-4 rounded-xl border border-emerald-500/10 hover:border-emerald-500/20 transition duration-200">
                  <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">{translateCommodity(item.commodity)}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 block">{translateMarket(item.market)}</span>
                  <div className="mt-2 text-right">
                    <span className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400">₹{item.modalPrice}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{t.perQuintal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sowing checklist guidelines info and smart recommendation */}
          <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10 p-6 rounded-3xl border border-emerald-500/15">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl p-2.5 shrink-0 animate-pulse">
                <Sparkles className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950 dark:text-white">{t.agronomistInsights}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mt-2 font-medium">
                  {t.agronomistDesc}
                </p>
                <button 
                  onClick={() => setActiveTab("advisor")} 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] px-4 py-2 rounded-xl mt-4 border border-emerald-500/10 hover:scale-105 transition-all cursor-pointer"
                >
                  {t.openAdvisor}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Crop Yield prediction calculator card */}
        <div className="lg:col-span-4 kisan-card-glass border p-6 rounded-3xl shrink-0 shadow-lg">
          <div className="flex items-center gap-2 border-b pb-4 border-emerald-500/10 mb-5">
            <BarChart3 className="text-emerald-500 w-5 h-5 shrink-0" />
            <div>
              <h3 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest leading-none mb-1">{t.yieldPredictor}</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{t.yieldDesc}</p>
            </div>
          </div>

          <form onSubmit={handleYieldPredict} className="flex flex-col gap-4 text-xs font-medium">
            <div>
              <label className="text-slate-550 dark:text-slate-400 font-bold block mb-1">{t.targetCrop}</label>
              <select
                value={predictionCrop}
                onChange={(e) => setPredictionCrop(e.target.value)}
                className="w-full bg-slate-900/5 dark:bg-slate-950/40 border border-emerald-500/15 dark:border-emerald-500/30 rounded-xl p-2.5 text-slate-800 dark:text-white font-semibold focus:outline-emerald-500"
              >
                <option value="Wheat" className="text-slate-900">{isHi ? "गेहूं (Wheat)" : "Wheat (गेहूं)"}</option>
                <option value="Paddy / Rice" className="text-slate-900">{isHi ? "धान / चावल (Paddy / Rice)" : "Paddy / Rice (धान)"}</option>
                <option value="Sugarcane" className="text-slate-900">{isHi ? "गन्ना (Sugarcane)" : "Sugarcane (गन्ना)"}</option>
                <option value="Mustard" className="text-slate-900">{isHi ? "सरसों (Mustard)" : "Mustard (सरसों)"}</option>
              </select>
            </div>

            <div>
              <label className="text-slate-550 dark:text-slate-400 font-bold block mb-1">{t.cultivatedArea}</label>
              <input
                type="number"
                placeholder="e.g. 2.5"
                step="0.1"
                min="0.5"
                value={predictionArea}
                onChange={(e) => setPredictionArea(e.target.value)}
                className="w-full bg-slate-900/5 dark:bg-slate-950/40 border border-emerald-500/15 dark:border-emerald-500/30 rounded-xl p-2.5 text-slate-850 dark:text-white focus:outline-emerald-500 font-black"
                required
              />
            </div>

            <div>
              <label className="text-slate-550 dark:text-slate-400 font-bold block mb-1">{t.soilTexture}</label>
              <select
                value={predictionSoil}
                onChange={(e) => setPredictionSoil(e.target.value)}
                className="w-full bg-slate-900/5 dark:bg-slate-950/40 border border-emerald-500/15 dark:border-emerald-500/30 rounded-xl p-2.5 text-slate-800 dark:text-white font-semibold focus:outline-emerald-500"
              >
                <option value="Loamy" className="text-slate-900">{isHi ? "दोमट मिट्टी (Loamy Soil)" : "Loamy Soil"}</option>
                <option value="Alluvial" className="text-slate-900">{isHi ? "जलोढ़ मिट्टी (Alluvial Soil)" : "Alluvial Soil"}</option>
                <option value="Black (Regur)" className="text-slate-900">{isHi ? "काली मिट्टी (Black Soil)" : "Black Soil"}</option>
                <option value="Sandy" className="text-slate-900">{isHi ? "रेतीली मिट्टी (Sandy Soil)" : "Sandy Soil"}</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loadingYield}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              {loadingYield ? t.calculating : t.calculateBtn}
            </button>
          </form>

          {predictedYield && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl shadow-inner mt-4 animate-opacity text-center">
              <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded inline-block uppercase mb-1 tracking-wider">{t.estModel}</span>
              <span className="text-[13px] font-extrabold text-emerald-800 dark:text-emerald-200 block">{predictedYield}</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 italic font-semibold">{t.estMsp}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
