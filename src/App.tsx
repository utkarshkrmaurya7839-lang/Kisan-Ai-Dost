import React, { useState } from "react";
import {
  Sprout,
  Compass,
  ScanEye,
  Calendar,
  Layers,
  Landmark,
  Mic,
  MessageSquare,
  UserCheck,
  TestTube,
  Sparkles,
  TrendingUp,
  MapPin,
  CalendarDays,
  Wheat,
  Globe,
  Sun,
  Moon
} from "lucide-react";

// Import modular crop-assisting sub-modules
import Dashboard from "./components/Dashboard";
import PlantScanner from "./components/PlantScanner";
import CropCalendar from "./components/CropCalendar";
import GeneralCalendar from "./components/GeneralCalendar";
import SeasonalAdvisor from "./components/SeasonalAdvisor";
import MarketPrices from "./components/MarketPrices";
import GovernmentSchemes from "./components/GovernmentSchemes";
import VoiceAssistant from "./components/VoiceAssistant";
import Chatbot from "./components/Chatbot";
import SplashScreen from "./components/SplashScreen";
import LoginSignup from "./components/LoginSignup";

import { INDIAN_STATES, GENERAL_CROPS, MONTHS } from "./data";

export default function App() {
  // Show / Hide Splash Screen on initial app opening
  const [showSplash, setShowSplash] = useState(true);

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "scanner" | "calendar" | "general_calendar" | "advisor" | "mandi" | "schemes" | "voice" | "chat" | "profile"
  >("dashboard");

  // Multi-language support (English / Hindi toggle)
  const [lang, setLang] = useState<"en" | "hi">("en");

  // Premium Dark / Light Mode state
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Agricultural seasonal themes: emerald (Monsoon/Kharif), golden (Autumn/Rabi), clay (Terracotta Organic Soil), sky (Spring Frost/Winter)
  const [palette, setPalette] = useState<"emerald" | "golden" | "clay" | "sky">("emerald");

  const palettes = {
    emerald: {
      activeTab: "bg-emerald-500/10 dark:bg-emerald-550/20 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-500 shadow-sm font-black",
      hoverTab: "text-slate-600 dark:text-slate-350 hover:bg-emerald-50/50 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white",
      tabIcon: "text-emerald-500",
      headerBg: "bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-emerald-800/40",
      logoBadge: "bg-emerald-400/20 text-emerald-200 border-emerald-400/30",
      logoIconBg: "bg-emerald-500 hover:bg-emerald-400",
      heroBg: "bg-gradient-to-b from-emerald-950 via-teal-955 to-emerald-955 border-emerald-800/20",
      heroBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
      heroTitleSpan: "from-emerald-400 to-teal-300",
      heroBtnActive: "bg-emerald-500 hover:bg-emerald-400 text-white",
      heroBtnAlt: "bg-teal-500 hover:bg-teal-400 text-white",
      satelliteBadge: "border-emerald-400/30 text-emerald-300",
      orbsBg1: "bg-emerald-100/50 dark:bg-emerald-555/15",
      orbsBg2: "bg-teal-100/45 dark:bg-teal-555/15",
      contourColor: "text-emerald-700/[0.05] dark:text-emerald-400/[0.03]"
    },
    golden: {
      activeTab: "bg-amber-500/10 dark:bg-amber-550/20 text-amber-700 dark:text-amber-300 border-l-4 border-amber-500 shadow-sm font-black",
      hoverTab: "text-slate-600 dark:text-slate-350 hover:bg-amber-50/50 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white",
      tabIcon: "text-amber-500",
      headerBg: "bg-gradient-to-r from-amber-950 via-amber-900 to-orange-950 border-amber-800/40",
      logoBadge: "bg-amber-400/20 text-amber-200 border-amber-400/30",
      logoIconBg: "bg-amber-500 hover:bg-amber-400",
      heroBg: "bg-gradient-to-b from-amber-950 via-orange-955 to-amber-955 border-amber-800/20",
      heroBadge: "bg-amber-500/15 text-amber-300 border-amber-400/20",
      heroTitleSpan: "from-amber-400 to-orange-300",
      heroBtnActive: "bg-amber-500 hover:bg-amber-400 text-white",
      heroBtnAlt: "bg-orange-500 hover:bg-orange-400 text-white",
      satelliteBadge: "border-amber-400/30 text-amber-300",
      orbsBg1: "bg-amber-100/50 dark:bg-amber-555/15",
      orbsBg2: "bg-orange-100/45 dark:bg-orange-555/15",
      contourColor: "text-amber-700/[0.05] dark:text-amber-400/[0.03]"
    },
    clay: {
      activeTab: "bg-orange-500/10 dark:bg-orange-550/20 text-orange-750 dark:text-orange-300 border-l-4 border-orange-520 shadow-sm font-black",
      hoverTab: "text-slate-600 dark:text-slate-350 hover:bg-orange-50/50 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white",
      tabIcon: "text-orange-520",
      headerBg: "bg-gradient-to-r from-stone-900 via-stone-850 to-orange-950 border-orange-800/40",
      logoBadge: "bg-orange-400/20 text-orange-200 border-orange-400/30",
      logoIconBg: "bg-orange-600 hover:bg-orange-505",
      heroBg: "bg-gradient-to-b from-stone-955 via-orange-955 to-stone-955 border-stone-800/20",
      heroBadge: "bg-orange-500/15 text-orange-305 border-orange-400/20",
      heroTitleSpan: "from-orange-450 to-amber-400",
      heroBtnActive: "bg-orange-600 hover:bg-orange-500 text-white",
      heroBtnAlt: "bg-amber-600 hover:bg-amber-500 text-white",
      satelliteBadge: "border-orange-400/30 text-orange-350",
      orbsBg1: "bg-orange-100/50 dark:bg-orange-555/15",
      orbsBg2: "bg-amber-100/45 dark:bg-amber-555/15",
      contourColor: "text-orange-700/[0.05] dark:text-orange-400/[0.03]"
    },
    sky: {
      activeTab: "bg-sky-500/10 dark:bg-sky-550/20 text-sky-700 dark:text-sky-305 border-l-4 border-sky-500 shadow-sm font-black",
      hoverTab: "text-slate-600 dark:text-slate-350 hover:bg-sky-50/50 dark:hover:bg-slate-900/30 hover:text-slate-950 dark:hover:text-white",
      tabIcon: "text-sky-555",
      headerBg: "bg-gradient-to-r from-sky-950 via-sky-900 to-indigo-950 border-sky-800/40",
      logoBadge: "bg-sky-400/20 text-sky-200 border-sky-400/30",
      logoIconBg: "bg-sky-555 hover:bg-sky-455",
      heroBg: "bg-gradient-to-b from-sky-950 via-indigo-955 to-sky-955 border-sky-800/20",
      heroBadge: "bg-sky-500/15 text-sky-300 border-sky-400/20",
      heroTitleSpan: "from-sky-450 to-indigo-305",
      heroBtnActive: "bg-sky-555 hover:bg-sky-455 text-white",
      heroBtnAlt: "bg-indigo-555 hover:bg-indigo-455 text-white",
      satelliteBadge: "border-sky-400/30 text-sky-300",
      orbsBg1: "bg-sky-100/50 dark:bg-sky-555/15",
      orbsBg2: "bg-indigo-100/45 dark:bg-indigo-555/15",
      contourColor: "text-sky-700/[0.05] dark:text-sky-400/[0.03]"
    }
  };

  const pal = palettes[palette];

  // Core farmer regional environment context
  const [selectedState, setSelectedState] = useState<string>("Uttar Pradesh");
  const [selectedCrop, setSelectedCrop] = useState<string>("Wheat (Gehun)");
  const [selectedMonth, setSelectedMonth] = useState<string>("June");

  // Show/Hide introductory Hero section
  const [showHero, setShowHero] = useState(true);

  // Translation sets
  const TEXTS = {
    en: {
      appName: "Kisan AI Dost",
      tagline: "Smart Farming with AI",
      heroDesc: "A complete agricultural intelligence assistant. Scan crop leaf defects, generate month-specific sowing timelines, review up-to-date regional mandi bids, and verify eligibility for central subsidies instantly.",
      btnGetStarted: "Get Started",
      btnScanPlant: "Scan Specimen Leaf",
      btnViewDashboard: "View Active Console",
      tabDashboard: "Dashboard Hub",
      tabScanner: "Plant Disease Scanner",
      tabCalendar: "Crop Calendar Tracker",
      tabGeneralCalendar: "General Farm Calendar",
      tabAdvisor: "Seasonal Advisor",
      tabMandi: "Mandi Prices Portal",
      tabSchemes: "Government Schemes",
      tabVoice: "Voice Assistant (आवाज)",
      tabChat: "AI Dost Chatbot",
      tabProfile: "Farmer Profile",
      selectLabelRegion: "Target Region",
      selectLabelCrop: "Favoured Crop",
      selectLabelMonth: "Operational Month",
      langToggleLabel: "Language / भाषा हिंदी"
    },
    hi: {
      appName: "किसान एआई दोस्त",
      tagline: "कृषि विज्ञान और एआई का मिलाप",
      heroDesc: "भारतीय किसान भाइयों के लिए एक पूर्ण डिजिटल सहायता मंच। मौसम की भविष्यवाणी, उन्नत खाद चक्र, पत्ती की बीमारियों का सटीक समाधान, सब्सिडी जानकारी और मंडी भाव को अपनी भाषा में जांचें।",
      btnGetStarted: "शुरू करें",
      btnScanPlant: "बीमारी की जांच करें",
      btnViewDashboard: "डैशबोर्ड देखें",
      tabDashboard: "मुख्य डैशबोर्ड (Hub)",
      tabScanner: "फसल रोग स्कैनर",
      tabCalendar: "फसल कैलेंडर योजना",
      tabGeneralCalendar: "सामान्य कृषि कैलेंडर",
      tabAdvisor: "मौसमी सलाह शीट",
      tabMandi: "ताज़ा मंडी भाव दरें",
      tabSchemes: "सरकारी सब्सिडी योजना",
      tabVoice: "आवाज सहायक सलाहकार",
      tabChat: "एआई दोस्त बातचीत",
      tabProfile: "किसान प्रोफाइल कार्ड",
      selectLabelRegion: "राज्य क्षेत्र",
      selectLabelCrop: "मुख्य फसल",
      selectLabelMonth: "चालू मास",
      langToggleLabel: "Language / English"
    }
  };

  const t = TEXTS[lang];

  const handleCTA = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowHero(false);
    // Scroll window smoothly to workspace section
    document.getElementById("main-workspace-frame")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div id="kisan-app-shell" className={`min-h-screen font-sans text-slate-800 dark:text-slate-100 flex flex-col antialiased relative overflow-x-hidden selection:bg-emerald-200 transition-colors duration-500 ${theme === "dark" ? "dark bg-slate-950" : "bg-slate-50/40"}`}>
      
      {/* Dynamic Premium Agriculture Theme Background Elements */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none">
        {/* Soft, beautiful nature-inspired gradient backdrop matching selected seasonal theme */}
        <div className={`absolute inset-0 bg-gradient-to-b ${
          palette === "emerald" 
            ? "from-emerald-50/80 via-white to-teal-50/50 dark:from-slate-950 dark:via-emerald-950/15 dark:to-slate-950"
            : palette === "golden"
            ? "from-amber-50/85 via-white to-orange-50/40 dark:from-slate-950 dark:via-amber-950/10 dark:to-slate-950"
            : palette === "clay"
            ? "from-orange-50/30 via-white to-stone-100/70 dark:from-slate-950 dark:via-stone-900/30 dark:to-slate-950"
            : "from-sky-50/80 via-white to-indigo-50/40 dark:from-slate-950 dark:via-sky-950/10 dark:to-slate-950"
        } transition-all duration-700`}></div>
        
        {/* Futuristic Glowing AI Orbs for light-emission feel */}
        <div className={`absolute top-10 right-10 w-[550px] h-[550px] rounded-full blur-3xl filter animate-amber-pulse transition-all duration-700 ${pal.orbsBg1}`}></div>
        <div className={`absolute top-1/3 -left-20 w-[650px] h-[650px] rounded-full blur-3xl filter animate-bloom-slow1 transition-all duration-700 ${pal.orbsBg2}`}></div>
        <div className={`absolute bottom-20 right-5 w-[600px] h-[600px] rounded-full blur-3xl filter animate-bloom-slow2 transition-all duration-700 ${pal.orbsBg1}`}></div>
 
        {/* Floating Animated Leaf Particles & Agricultural Dust */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-75">
          {/* Falling Leaf 1 */}
          <div className="absolute left-[8%] -top-[10%] w-6 h-6 text-emerald-500/35 dark:text-emerald-400/45 animate-leaf-left-slow">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7,18C12,14 16,12 21,8C22,7 22,5 20,3C18,1 16,1 15,2C11,7 9,9 17,8Z" />
            </svg>
          </div>
          {/* Falling Leaf 2 */}
          <div className="absolute right-[12%] -top-[10%] w-8 h-8 text-teal-650/25 dark:text-teal-400/35 animate-leaf-right-slow">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7,18C12,14 16,12 21,8C22,7 22,5 20,3C18,1 16,1 15,2C11,7 9,9 17,8Z" />
            </svg>
          </div>
          {/* Falling Leaf 4 */}
          <div className="absolute right-[28%] -top-[10%] w-7 h-7 text-emerald-500/30 dark:text-emerald-500/40 animate-leaf-right-fast">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7,18C12,14 16,12 21,8C22,7 22,5 20,3C18,1 16,1 15,2C11,7 9,9 17,8Z" />
            </svg>
          </div>
          
          {/* AI Neon Glow particles popping regularly */}
          <div className="absolute left-[15%] top-[25%] w-2 h-2 rounded-full bg-emerald-400/60 dark:bg-emerald-400/80 animate-ping" style={{ animationDuration: "5s" }}></div>
          <div className="absolute right-[22%] top-[55%] w-3 h-3 rounded-full bg-teal-400/40 dark:bg-teal-300/60 animate-pulse" style={{ animationDuration: "6s" }}></div>
          <div className="absolute left-[35%] top-[75%] w-2 h-2 rounded-full bg-amber-400/50 dark:bg-amber-300/50 animate-bounce" style={{ animationDuration: "9s" }}></div>
        </div>
 
        {/* Detailed Agrarian Topography Contour Lines & Dynamic Crop Rows */}
        <svg className={`absolute inset-0 w-full h-full opacity-60 transition-all duration-700 ${pal.contourColor} animate-drift-terrain`} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="soil-furrows" width="80" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <line x1="0" y1="12" x2="80" y2="12" stroke="currentColor" strokeWidth="0.8" />
              {/* Sprouting crop seeds in neat geometric lines */}
              <circle cx="20" cy="12" r="1.5" fill="currentColor" />
              <circle cx="60" cy="12" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#soil-furrows)" />
          
          {/* Sweeping contour maps showing terrace hills */}
          <path d="M-100,250 C350,150 550,450 950,200 C1350,-50 1650,350 2050,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,550 C450,400 650,700 1150,500 C1650,300 1750,750 2050,550" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M-100,950 C250,900 750,1100 1250,900 C1750,700 1850,1150 2050,950" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" />
        </svg>
      </div>

      {/* Top Banner & Multi-language/Theme Switches bar with high readability contrast */}
      <div className={`transition-colors duration-500 bg-slate-900 text-white border-b border-white/10 text-xs py-2 px-4 shadow-sm z-50`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-1.5 font-medium">
            {/* Tagline removed as requested */}
          </div>

          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Seasonal Agricultural Theme Picker */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[11px] font-semibold">
              <span className="text-slate-350 text-[10px]">
                {lang === "hi" ? "ऋतु थीम:" : "Season Theme:"}
              </span>
              <select
                value={palette}
                onChange={(e) => setPalette(e.target.value as any)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer pr-1 text-[11px]"
              >
                <option value="emerald" className="text-slate-900 font-bold">🌿 {lang === "hi" ? "मानसून खराइफ" : "Monsoon Kharif"}</option>
                <option value="golden" className="text-slate-900 font-bold">🌾 {lang === "hi" ? "स्वर्ण रबी" : "Golden Rabi"}</option>
                <option value="clay" className="text-slate-900 font-bold">🪵 {lang === "hi" ? "जैविक मिट्टी" : "Organic Soil"}</option>
                <option value="sky" className="text-slate-900 font-bold">❄️ {lang === "hi" ? "वसंत कोहरा" : "Spring Frost"}</option>
              </select>
            </div>

            {/* Theme Toggle Switcher */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded font-bold cursor-pointer transition border border-white/15 text-[11px]"
              title={lang === "hi" ? "थीम बदलें" : "Toggle Color Theme"}
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                  <span>{lang === "hi" ? "डार्क थीम" : "Dark Aura"}</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>{lang === "hi" ? "लाइट थीम" : "Golden Light"}</span>
                </>
              )}
            </button>

            {/* Language switcher */}
            <button
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded font-bold cursor-pointer transition border border-white/15"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-250 animate-spin" style={{ animationDuration: "12s" }} />
              <span>{t.langToggleLabel}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glassmorphism Navigation Header */}
      <header id="kisan-glass-header" className={`bg-gradient-to-r ${pal.headerBg} text-white shadow-xl sticky top-0 z-40 transition-all duration-300 border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo and metadata info */}
          <div className="flex items-center gap-3">
            <div className={`${pal.logoIconBg} p-2.5 rounded-2xl shadow-inner transition duration-200`}>
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t.appName} <span className={`text-[10px] ${pal.logoBadge} px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold`}>Smart Guide</span>
              </h1>
              <p className="text-xs opacity-85 font-medium tracking-wide italic">“{t.tagline}”</p>
            </div>
          </div>

          {/* Environmental Global Selectors synced beautifully across all modules */}
          <div className="flex flex-wrap items-center gap-3.5 bg-black/20 p-2 rounded-2.5xl border border-white/10 shadow-inner">
            
            {/* Region dropdown */}
            <div className="flex items-center gap-1 py-0.5 px-2">
              <MapPin className={`w-3.5 h-3.5 shrink-0`} style={{ color: "rgba(255,255,255,0.7)" }} />
              <div className="text-left">
                <span className="text-[9px] opacity-75 block uppercase font-mono font-bold leading-none mb-0.5">{t.selectLabelRegion}</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st} className="text-slate-900 font-semibold">{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-[1px] h-6 bg-white/10 shrink-0"></div>

            {/* Crop dropdown */}
            <div className="flex items-center gap-1 py-0.5 px-2">
              <Wheat className={`w-3.5 h-3.5 shrink-0`} style={{ color: "rgba(255,255,255,0.7)" }} />
              <div className="text-left">
                <span className="text-[9px] opacity-75 block uppercase font-mono font-bold leading-none mb-0.5">{t.selectLabelCrop}</span>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  {GENERAL_CROPS.map((cr) => (
                    <option key={cr} value={cr} className="text-slate-900 font-semibold">{cr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-[1px] h-6 bg-white/10 shrink-0"></div>

            {/* Sowing month dropdown */}
            <div className="flex items-center gap-1 py-0.5 px-2">
              <CalendarDays className={`w-3.5 h-3.5 shrink-0`} style={{ color: "rgba(255,255,255,0.7)" }} />
              <div className="text-left">
                <span className="text-[9px] opacity-75 block uppercase font-mono font-bold leading-none mb-0.5">{t.selectLabelMonth}</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
                >
                  {MONTHS.map((mn) => (
                    <option key={mn} value={mn} className="text-slate-900 font-semibold">{mn}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section if showHero is active */}
      {showHero && (
        <section id="kisan-hero-deck" className="bg-gradient-to-b from-emerald-900 via-teal-950 to-emerald-950 text-white relative py-12 sm:py-16 px-4 z-10 overflow-hidden border-b border-emerald-800/20">
          {/* Subtle background glow graphics */}
          <div className="absolute right-0 top-0 bottom-0 left-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            
            {/* Left Column: Title and details */}
            <div className="lg:col-span-7 flex flex-col items-start text-left gap-5">
              <div className="bg-emerald-500/15 text-emerald-300 text-xs px-4 py-1.5 rounded-full font-mono uppercase tracking-widest font-black border border-emerald-400/20 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "8s" }} /> AI AGRI COMPANION FOR INDIAN FARMERS
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight leading-tight text-white">
                {t.appName}: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 leading-tight">{t.tagline}</span>
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-semibold max-w-xl">
                {t.heroDesc}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCTA("dashboard")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow transition-all active:scale-95 cursor-pointer duration-200"
                >
                  {t.btnViewDashboard}
                </button>
                <button
                  onClick={() => handleCTA("scanner")}
                  className="bg-teal-500 hover:bg-teal-405 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg hover:shadow transition-all active:scale-95 cursor-pointer duration-200"
                >
                  {t.btnScanPlant}
                </button>
                <button
                  onClick={() => {
                    setShowHero(false);
                    document.getElementById("main-workspace-frame")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-slate-900/70 hover:bg-slate-800 text-white border border-white/20 font-extrabold text-xs px-5 py-3 rounded-xl transition duration-205 cursor-pointer"
                >
                  {t.btnGetStarted}
                </button>
              </div>
            </div>

            {/* Right Column: Premium Smart Farming Vector Landscape & Sunrise */}
            <div className="lg:col-span-5 w-full">
              <div className="w-full h-56 md:h-64 relative overflow-hidden rounded-3xl bg-emerald-900/30 border border-emerald-500/20 shadow-inner">
                <svg viewBox="0 0 400 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    {/* Sunrise Sky Gradient */}
                    <linearGradient id="sunriseSky" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0f172a" /> {/* Deep dark slate */}
                      <stop offset="45%" stopColor="#115e59" /> {/* Teal */}
                      <stop offset="85%" stopColor="#047857" /> {/* Emerald */}
                      <stop offset="100%" stopColor="#ea580c" /> {/* Sunrise gold orange */}
                    </linearGradient>
                    {/* Sun Rise Halo Gradient */}
                    <radialGradient id="sunRise" cx="50%" cy="100%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                      <stop offset="40%" stopColor="#f97316" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#115e59" stopOpacity="0" />
                    </radialGradient>
                    {/* Field Soil Gradient */}
                    <linearGradient id="fieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#022c22" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                    {/* Laser Beam Gradient */}
                    <linearGradient id="laserBeam" x1="0%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Sky Backing */}
                  <rect width="400" height="240" fill="url(#sunriseSky)" />
                  
                  {/* Sun rising from the horizon */}
                  <circle cx="200" cy="180" r="70" fill="url(#sunRise)" className="animate-pulse" style={{ animationDuration: "6s" }} />
                  
                  {/* Agricultural Fields / Rolling Terraced Hills */}
                  <path d="M-50,240 C100,165 150,215 250,155 C320,115 380,185 450,135 L450,240 Z" fill="#064e3b" opacity="0.8" />
                  <path d="M-20,240 C80,195 180,165 280,185 C340,195 410,165 450,175 L450,240 Z" fill="url(#fieldGrad)" />
                  
                  {/* Intelligent Sowing Crop Lines/Rows */}
                  <path d="M200,180 L50,240" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />
                  <path d="M200,180 L120,240" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
                  <path d="M200,180 L200,240" stroke="#10b981" strokeWidth="2.5" strokeDasharray="1,2" opacity="0.5" />
                  <path d="M200,180 L280,240" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.6" />
                  <path d="M200,180 L350,240" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" opacity="0.6" />

                  {/* Sprout Indicators on rows */}
                  <circle cx="100" cy="210" r="3" fill="#34d399" />
                  <circle cx="150" cy="220" r="4" fill="#34d399" className="animate-pulse" style={{ animationDuration: "3s" }} />
                  <circle cx="250" cy="220" r="3" fill="#34d399" />
                  <circle cx="300" cy="210" r="3.5" fill="#34d399" />

                  {/* Smart Farming Tech Weather Mast Tower */}
                  <g transform="translate(60, 110)">
                    <line x1="20" y1="90" x2="20" y2="20" stroke="#a7f3d0" strokeWidth="2" />
                    <polygon points="20,20 11,35 29,35" fill="#34d399" />
                    <circle cx="20" cy="20" r="4.5" fill="#67e8f9" className="animate-ping" style={{ animationDuration: "2.5s" }} />
                    <circle cx="20" cy="20" r="3.5" fill="#22d3ee" />
                    {/* Signal Wifi Waves */}
                    <path d="M10,12 A15,15 0 0,1 30,12" fill="none" stroke="#67e8f9" strokeWidth="1" opacity="0.8" />
                    <path d="M5,7 A22,22 0 0,1 35,7" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.5" />
                  </g>

                  {/* Autonomous Smart Drone Scanning with Laser Indicator */}
                  <g transform="translate(250, 45)">
                    {/* Custom Drone with hovering bounce */}
                    <g className="animate-pulse" style={{ animationDuration: "4s" }}>
                      {/* Drone Chassis */}
                      <rect x="20" y="20" width="30" height="8" rx="4" fill="#ffffff" />
                      <line x1="12" y1="24" x2="58" y2="24" stroke="#e2e8f0" strokeWidth="2" />
                      {/* Rotors */}
                      <line x1="12" y1="18" x2="12" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                      <line x1="58" y1="18" x2="58" y2="24" stroke="#94a3b8" strokeWidth="1.5" />
                      <ellipse cx="12" cy="18" rx="8" ry="2" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      <ellipse cx="58" cy="18" rx="8" ry="2" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                      <circle cx="35" cy="28" r="2.5" fill="#ef4444" />
                      {/* Neon Laser Scanning Beam pointing to the fields */}
                      <polygon points="35,28 120,180 180,180" fill="url(#laserBeam)" opacity="0.22" />
                    </g>
                  </g>
                </svg>
                
                {/* Premium Floating Badge overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/30 text-[10px] text-emerald-300 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping shrink-0"></span>
                  <span className="font-extrabold uppercase tracking-widest text-[9px]">SATELLITE IOT ACTIVE</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Main Workspace Frame container */}
      <div id="main-workspace-frame" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 relative z-10">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="w-full lg:w-72 shrink-0 self-start">
          <div className="kisan-card-glass rounded-3xl p-4.5 flex flex-row lg:flex-col gap-2 overflow-x-auto whitespace-nowrap lg:whitespace-normal no-scrollbar scroll-smooth">
            
            {/* Dashboard option */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "dashboard" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <Layers className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabDashboard}</span>
            </button>

            {/* Plant scanner option */}
            <button
              onClick={() => setActiveTab("scanner")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "scanner" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <ScanEye className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabScanner}</span>
            </button>

            {/* Crop calendar option */}
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "calendar" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <Calendar className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabCalendar}</span>
            </button>

            {/* General calendar option */}
            <button
              onClick={() => setActiveTab("general_calendar")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "general_calendar" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <CalendarDays className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabGeneralCalendar}</span>
            </button>

            {/* Seasonal advisor option */}
            <button
              onClick={() => setActiveTab("advisor")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "advisor" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <Compass className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabAdvisor}</span>
            </button>

            {/* Mandi portal option */}
            <button
              onClick={() => setActiveTab("mandi")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "mandi" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <TrendingUp className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabMandi}</span>
            </button>

            {/* Subsidy systems option */}
            <button
              onClick={() => setActiveTab("schemes")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "schemes" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <Landmark className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabSchemes}</span>
            </button>

            {/* Voice Advisor option */}
            <button
              onClick={() => setActiveTab("voice")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "voice" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <Mic className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabVoice}</span>
            </button>

            {/* AI dost chat option */}
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "chat" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <MessageSquare className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabChat}</span>
            </button>

            {/* Profile cabinet option */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition cursor-pointer w-full text-left ${
                activeTab === "profile" ? pal.activeTab : pal.hoverTab
              }`}
            >
              <UserCheck className={`w-4.5 h-4.5 shrink-0 ${pal.tabIcon}`} />
              <span>{t.tabProfile}</span>
            </button>
          </div>

          {/* Quick Help Desk summary */}
          <div className="mt-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-850 shadow-md hidden lg:block">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Agronomist Advise</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed leading-relaxed">
              Maintain close crop field insulation during early November mornings to prevent frostbite damages on young Rabi vegetables.
            </p>
          </div>
        </aside>

        {/* Major Workspaces dynamic panels */}
        <main className="flex-1 flex flex-col gap-6 w-full overflow-hidden">
          {activeTab === "dashboard" && (
            <Dashboard
              selectedState={selectedState}
              selectedCrop={selectedCrop}
              selectedMonth={selectedMonth}
              setActiveTab={setActiveTab}
              lang={lang}
            />
          )}

          {activeTab === "scanner" && <PlantScanner lang={lang} />}

          {activeTab === "calendar" && <CropCalendar lang={lang} />}

          {activeTab === "general_calendar" && <GeneralCalendar lang={lang} />}

          {activeTab === "advisor" && <SeasonalAdvisor lang={lang} />}

          {activeTab === "mandi" && (
            <MarketPrices 
              lang={lang} 
              selectedState={selectedState} 
              selectedCrop={selectedCrop} 
              palette={palette} 
            />
          )}

          {activeTab === "schemes" && <GovernmentSchemes lang={lang} />}

          {activeTab === "voice" && <VoiceAssistant lang={lang} />}

          {activeTab === "chat" && <Chatbot lang={lang} />}

          {activeTab === "profile" && (
            <LoginSignup
              lang={lang}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedCrop={selectedCrop}
              setSelectedCrop={setSelectedCrop}
              setActiveTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Modern agricultural footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm">Kisan AI Dost (किसान एआई दोस्त)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Empowering Indian agriculture with modern intelligence models</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-semibold text-slate-350">
            <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="hover:text-emerald-400 cursor-pointer">
              {lang === "en" ? "भाषा बदलें (Hindi)" : "Change Language (English)"}
            </button>
            <span className="text-slate-750">|</span>
            <span className="text-[11px] text-slate-500 font-mono">Build Version 1.4.3 (Beta Live)</span>
          </div>
        </div>
      </footer>

      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} lang={lang} />
      )}
    </div>
  );
}
