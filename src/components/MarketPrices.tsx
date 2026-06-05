import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Search, 
  MapPin, 
  Filter, 
  RefreshCw, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Scale, 
  Globe, 
  Building2, 
  HelpCircle,
  TrendingDown,
  User,
  X
} from "lucide-react";
import { SIMULATED_MANDI_PRICES, INDIAN_STATES } from "../data";

interface MarketPricesProps {
  lang?: "en" | "hi";
  selectedState?: string;
  selectedCrop?: string;
  palette?: "emerald" | "golden" | "clay" | "sky";
}

// Map crop names from top dropdown to matching normalized terms.
const normalizeCrop = (crop: string) => {
  const lowered = crop.toLowerCase();
  if (lowered.includes("wheat") || lowered.includes("gehun")) return "wheat";
  if (lowered.includes("rice") || lowered.includes("paddy") || lowered.includes("dhan")) return "paddy";
  if (lowered.includes("maize") || lowered.includes("makka")) return "maize";
  if (lowered.includes("sugarcane") || lowered.includes("ganna")) return "sugar";
  if (lowered.includes("cotton") || lowered.includes("kapas")) return "cotton";
  if (lowered.includes("soybean")) return "soybean";
  if (lowered.includes("groundnut") || lowered.includes("moongphali")) return "groundnut";
  if (lowered.includes("mustard") || lowered.includes("sarson")) return "mustard";
  if (lowered.includes("tomato") || lowered.includes("tamatar")) return "tomato";
  if (lowered.includes("potato") || lowered.includes("aloo")) return "potato";
  if (lowered.includes("onion") || lowered.includes("pyaz")) return "onion";
  if (lowered.includes("gram") || lowered.includes("chana") || lowered.includes("chickpea")) return "gram";
  if (lowered.includes("pigeon") || lowered.includes("arhar") || lowered.includes("tur")) return "pigeon";
  if (lowered.includes("black gram") || lowered.includes("urad")) return "black gram";
  return lowered;
};

const normalizeCommodity = (comm: string) => {
  const lowered = comm.toLowerCase();
  if (lowered.includes("wheat") || lowered.includes("gehun")) return "wheat";
  if (lowered.includes("rice") || lowered.includes("paddy") || lowered.includes("dhan")) return "paddy";
  if (lowered.includes("maize") || lowered.includes("makka")) return "maize";
  if (lowered.includes("sugarcane") || lowered.includes("ganna")) return "sugar";
  if (lowered.includes("cotton") || lowered.includes("kapas")) return "cotton";
  if (lowered.includes("soybean")) return "soybean";
  if (lowered.includes("groundnut") || lowered.includes("moongphali")) return "groundnut";
  if (lowered.includes("mustard") || lowered.includes("sarson")) return "mustard";
  if (lowered.includes("tomato") || lowered.includes("tamatar")) return "tomato";
  if (lowered.includes("potato") || lowered.includes("aloo")) return "potato";
  if (lowered.includes("onion") || lowered.includes("pyaz")) return "onion";
  if (lowered.includes("gram") || lowered.includes("chana") || lowered.includes("chickpea")) return "gram";
  if (lowered.includes("pigeon") || lowered.includes("arhar") || lowered.includes("tur")) return "pigeon";
  if (lowered.includes("black gram") || lowered.includes("urad")) return "black gram";
  return lowered;
};

const CROP_BASE_PRICES: Record<string, { nameEn: string; nameHi: string; baseModel: number; unit: string; variety: string }> = {
  wheat: { nameEn: "Wheat (Gehun)", nameHi: "गेहूं", baseModel: 2300, unit: "100 kg (Quintal)", variety: "Lokwan/Lok-1" },
  paddy: { nameEn: "Paddy (Dhan)", nameHi: "धान / चावल", baseModel: 2195, unit: "100 kg (Quintal)", variety: "Common Grade A" },
  maize: { nameEn: "Maize (Makka)", nameHi: "मक्का", baseModel: 2090, unit: "100 kg (Quintal)", variety: "Hybrid Yellow" },
  sugar: { nameEn: "Sugarcane (Ganna)", nameHi: "गन्ना", baseModel: 375, unit: "100 kg (Quintal)", variety: "Co-0238" },
  cotton: { nameEn: "Cotton (Kapas)", nameHi: "कपास", baseModel: 7100, unit: "100 kg (Quintal)", variety: "BT Cotton Shankar" },
  soybean: { nameEn: "Soybean", nameHi: "सोयाबीन", baseModel: 4450, unit: "100 kg (Quintal)", variety: "Yellow Soybean" },
  groundnut: { nameEn: "Groundnut (Moongphali)", nameHi: "मूंगफली", baseModel: 6375, unit: "100 kg (Quintal)", variety: "Desi Bold" },
  mustard: { nameEn: "Mustard (Sarson)", nameHi: "सरसों", baseModel: 5400, unit: "100 kg (Quintal)", variety: "Mustard Seed" },
  potato: { nameEn: "Potato (Aloo)", nameHi: "आलू", baseModel: 1350, unit: "100 kg (Quintal)", variety: "Kufri Bahar" },
  onion: { nameEn: "Onion (Pyaz)", nameHi: "प्याज़", baseModel: 1950, unit: "100 kg (Quintal)", variety: "Red Onion" },
  tomato: { nameEn: "Tomato (Tamatar)", nameHi: "टमाटर", baseModel: 1300, unit: "100 kg (Quintal)", variety: "Local Sona" },
  gram: { nameEn: "Gram (Chana)", nameHi: "चना", baseModel: 5900, unit: "100 kg (Quintal)", variety: "Desi Chana" },
  pigeon: { nameEn: "Pigeon Pea (Arhar)", nameHi: "अरहर", baseModel: 7000, unit: "100 kg (Quintal)", variety: "Maruti" },
  "black gram": { nameEn: "Black Gram (Urad)", nameHi: "उड़द", baseModel: 6955, unit: "100 kg (Quintal)", variety: "Bold Urad" }
};

const STATE_PRICE_FACTORS: Record<string, number> = {
  "punjab": 1.05,
  "haryana": 1.03,
  "uttar pradesh": 0.98,
  "madhya pradesh": 1.04,
  "maharashtra": 1.02,
  "gujarat": 1.01,
  "rajasthan": 0.99,
  "karnataka": 1.02,
  "bihar": 0.96,
  "andhra pradesh": 1.01,
  "telangana": 1.01,
  "west bengal": 0.97,
  "tamil nadu": 1.03
};

const STATE_CITIES: Record<string, string> = {
  "punjab": "Khanna",
  "uttar pradesh": "Muzaffarnagar / Agra",
  "maharashtra": "Latur / Lasalgaon",
  "andhra pradesh": "Guntur",
  "telangana": "Warangal",
  "bihar": "Patna",
  "gujarat": "Rajkot",
  "karnataka": "Kolar / Bengaluru",
  "madhya pradesh": "Indore",
  "rajasthan": "Alwar / Jaipur",
  "haryana": "Karnal",
  "west bengal": "Kolkata",
  "tamil nadu": "Coimbatore"
};

const stateAbbreviations: Record<string, string[]> = {
  "punjab": ["punjab"],
  "uttar pradesh": ["up", "uttar pradesh"],
  "haryana": ["haryana"],
  "madhya pradesh": ["mp", "madhya pradesh"],
  "gujarat": ["gujarat"],
  "maharashtra": ["maharashtra"],
  "rajasthan": ["rajasthan"],
  "karnataka": ["karnataka"],
  "bihar": ["bihar"],
  "andhra pradesh": ["andhra pradesh"],
  "telangana": ["telangana"],
  "west bengal": ["west bengal"],
  "tamil nadu": ["tamil nadu"]
};

const paletteStyles = {
  emerald: {
    primaryText: "text-emerald-700 dark:text-emerald-400",
    primaryBg: "bg-emerald-50 dark:bg-emerald-950/40",
    primaryBorder: "border-emerald-100 dark:border-emerald-900/30",
    primaryButton: "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 dark:bg-emerald-550",
    accentText: "text-emerald-850 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-110/50",
    cardHover: "hover:border-emerald-250",
    trendText: "text-emerald-400",
    trendBg: "bg-emerald-950 border-emerald-850",
    avgText: "text-emerald-800 dark:text-emerald-400"
  },
  golden: {
    primaryText: "text-amber-700 dark:text-amber-400",
    primaryBg: "bg-amber-50 dark:bg-amber-950/40",
    primaryBorder: "border-amber-100 dark:border-amber-900/30",
    primaryButton: "bg-amber-700 hover:bg-amber-800 text-white border-amber-750 dark:bg-amber-550",
    accentText: "text-amber-850 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-955/40 border-amber-110/50",
    cardHover: "hover:border-amber-250",
    trendText: "text-amber-400",
    trendBg: "bg-amber-950 border-amber-850",
    avgText: "text-amber-850 dark:text-amber-400"
  },
  clay: {
    primaryText: "text-orange-700 dark:text-orange-450",
    primaryBg: "bg-orange-50 dark:bg-orange-950/40",
    primaryBorder: "border-orange-100 dark:border-orange-900/30",
    primaryButton: "bg-orange-750 hover:bg-orange-800 text-white border-orange-700 dark:bg-orange-550",
    accentText: "text-orange-850 dark:text-orange-400 bg-orange-50/70 dark:bg-orange-950/40 border-orange-110/50",
    cardHover: "hover:border-orange-250",
    trendText: "text-orange-400",
    trendBg: "bg-stone-900 border-orange-850",
    avgText: "text-orange-850 dark:text-orange-400"
  },
  sky: {
    primaryText: "text-sky-700 dark:text-sky-400",
    primaryBg: "bg-sky-50 dark:bg-sky-955/40",
    primaryBorder: "border-sky-100 dark:border-sky-900/30",
    primaryButton: "bg-sky-700 hover:bg-sky-800 text-white border-sky-700 dark:bg-sky-550",
    accentText: "text-sky-850 dark:text-sky-450 bg-sky-50/70 dark:bg-sky-950/40 border-sky-110/50",
    cardHover: "hover:border-sky-250",
    trendText: "text-sky-400",
    trendBg: "bg-sky-950 border-sky-850",
    avgText: "text-sky-850 dark:text-sky-400"
  }
};

interface FarmerPersona {
  name: string;
  avatar: string;
  village: string;
  district: string;
  state: string;
  primaryCrop: string;
}

const STATIC_PERSONAS: FarmerPersona[] = [
  {
    name: "Gurpreet Singh",
    avatar: "🌾",
    village: "Meharban",
    district: "Ludhiana",
    state: "Punjab",
    primaryCrop: "Rice / Paddy (Dhan)"
  },
  {
    name: "Ramesh Rao",
    avatar: "🍅",
    village: "Vemagal",
    district: "Kolar",
    state: "Karnataka",
    primaryCrop: "Tomato (Tamatar)"
  },
  {
    name: "Kundan Lal",
    avatar: "🌱",
    village: "Kshipra",
    district: "Indore",
    state: "Madhya Pradesh",
    primaryCrop: "Soybean"
  },
  {
    name: "Anita Devi",
    avatar: "🧅",
    village: "Pimpalgaon",
    district: "Nashik",
    state: "Maharashtra",
    primaryCrop: "Onion (Pyaz)"
  }
];

export default function MarketPrices({ 
  lang = "en", 
  selectedState = "Uttar Pradesh", 
  selectedCrop = "Wheat (Gehun)",
  palette = "emerald"
}: MarketPricesProps) {
  const [search, setSearch] = useState("");
  const [filterCommodity, setFilterCommodity] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // Compare selector states (synced with global filters but allow overrides)
  const [compareState, setCompareState] = useState(selectedState);
  const [compareCrop, setCompareCrop] = useState(selectedCrop);

  // Farmer profile list & selection states
  const [personas, setPersonas] = useState<FarmerPersona[]>(STATIC_PERSONAS);
  const [selectedPersona, setSelectedPersona] = useState<FarmerPersona | null>(STATIC_PERSONAS[0]);

  useEffect(() => {
    // Attempt to read currently logged in farmer profile from localStorage
    const stored = localStorage.getItem("kisan_farmer_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          const userPersona: FarmerPersona = {
            name: parsed.name || "Logged-in Farmer",
            avatar: parsed.avatar || "🌾",
            village: parsed.village || "Your Village",
            district: parsed.district || "Your District",
            state: parsed.state || "Uttar Pradesh",
            primaryCrop: parsed.primaryCrop || "Wheat (Gehun)"
          };
          
          // Prepend user persona to list of personas and make it default active
          setPersonas([userPersona, ...STATIC_PERSONAS.filter(p => p.name !== userPersona.name)]);
          setSelectedPersona(userPersona);
          setCompareState(userPersona.state);
          setCompareCrop(userPersona.primaryCrop);
        }
      } catch (e) {
        console.error("Failed to parse stored kisan_farmer_profile", e);
      }
    }
  }, []);

  const handleSelectPersona = (p: FarmerPersona) => {
    setSelectedPersona(p);
    setCompareState(p.state);
    setCompareCrop(p.primaryCrop);
  };

  const handleDeletePersona = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(isHi ? `क्या आप सचमुच इस किसान पहचान "${name}" को हटाना चाहते हैं?` : `Are you sure you want to delete farmer identity option "${name}"?`)) {
      const filtered = personas.filter(p => p.name !== name);
      setPersonas(filtered);
      if (selectedPersona?.name === name) {
        const newSelected = filtered.length > 0 ? filtered[0] : null;
        setSelectedPersona(newSelected);
        if (newSelected) {
          setCompareState(newSelected.state);
          setCompareCrop(newSelected.primaryCrop);
        }
      }
    }
  };

  useEffect(() => {
    // If global defaults change but traveler does not overwrite selection
    if (selectedState) setCompareState(selectedState);
  }, [selectedState]);

  useEffect(() => {
    if (selectedCrop) setCompareCrop(selectedCrop);
  }, [selectedCrop]);

  const isHi = lang === "hi";
  const pal = paletteStyles[palette] || paletteStyles.emerald;

  const commodities = isHi 
    ? [
        { en: "All", label: "सभी (All)" },
        { en: "Wheat", label: "गेहूं (Wheat)" },
        { en: "Rice", label: "धान/चावल (Paddy)" },
        { en: "Maize", label: "मक्का (Maize)" },
        { en: "Sugarcane", label: "गन्ना (Sugarcane)" },
        { en: "Cotton", label: "कपास (Cotton)" },
        { en: "Soybean", label: "सोयाबीन (Soybean)" },
        { en: "Groundnut", label: "मूंगफली (Groundnut)" },
        { en: "Mustard", label: "सरसों (Mustard)" },
        { en: "Tomato", label: "टमाटर (Tomato)" },
        { en: "Potato", label: "आलू (Potato)" },
        { en: "Onion", label: "प्याज़ (Onion)" },
        { en: "Gram", label: "चना (Gram)" },
        { en: "Pigeon", label: "अरहर (Pigeon)" },
        { en: "Black Gram", label: "उड़द (Black Gram)" }
      ]
    : [
        { en: "All", label: "All" },
        { en: "Wheat", label: "Wheat" },
        { en: "Rice", label: "Paddy" },
        { en: "Maize", label: "Maize" },
        { en: "Sugarcane", label: "Sugarcane" },
        { en: "Cotton", label: "Cotton" },
        { en: "Soybean", label: "Soybean" },
        { en: "Groundnut", label: "Groundnut" },
        { en: "Mustard", label: "Mustard" },
        { en: "Tomato", label: "Tomato" },
        { en: "Potato", label: "Potato" },
        { en: "Onion", label: "Onion" },
        { en: "Gram", label: "Gram" },
        { en: "Pigeon", label: "Pigeon Pea" },
        { en: "Black Gram", label: "Black Gram" }
      ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  const filteredPrices = SIMULATED_MANDI_PRICES.filter((item) => {
    const matchesSearch = 
      item.commodity.toLowerCase().includes(search.toLowerCase()) ||
      item.market.toLowerCase().includes(search.toLowerCase()) ||
      item.variety.toLowerCase().includes(search.toLowerCase());

    let matchesFilter = false;
    if (filterCommodity === "All") {
      matchesFilter = true;
    } else {
      const normItem = normalizeCommodity(item.commodity);
      const normFilter = normalizeCommodity(filterCommodity);
      matchesFilter = normItem === normFilter;
    }
    return matchesSearch && matchesFilter;
  });

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

  const translateVariety = (variety: string) => {
    if (!isHi) return variety;
    return variety
      .replace("Lokwan Good Quality", "लोकवान उत्तम गुणवत्ता")
      .replace("Common Grade A", "सामान्य ग्रेड ए")
      .replace("Hybrid Yellow", "हाइब्रिड पीला")
      .replace("Co-0238 High Sucrose", "सीओ-०२३८ उच्च सुक्रोज़")
      .replace("BT Cotton Shankar-6", "बीटी कपास शंकर-६")
      .replace("Yellow Soybean Seed", "पीला सोयाबीन बीज")
      .replace("G-20 Desi Bold", "जी-२० देसी बोल्ड")
      .replace("Mustard Seed Bold", "सरसों मोटा दाना")
      .replace("Hybrid Vaishali", "हाइब्रिड वैशाली")
      .replace("Kufri Jyoti", "कुफरी ज्योति")
      .replace("Nasik Red Medium", "नासिक लाल मध्यम")
      .replace("Desi Chana", "देसी चना")
      .replace("Maruti Grains", "मारुति दाना")
      .replace("Urad Bold G-1", "उड़द बोल्ड जी-१")
      .replace("Basmati 1121", "बासमती ११२१")
      .replace("Sharbati", "शरबती")
      .replace("CO-0238", "सीओ-०२३८")
      .replace("Jyoti", "ज्योति")
      .replace("Red", "लाल")
      .replace("Desi Tomato", "देसी टमाटर")
      .replace("BT Cotton", "बीटी कपास")
      .replace("Yellow Soybean", "पीली सोयाबीन");
  };

  const translateUnit = (unit: string) => {
    if (!isHi) return unit;
    return unit.replace("Quintal", "क्विंटल").replace("Ton", "टन");
  };

  // Dynamically calculate: Local State Price vs National Average of Selected Crop
  const activeNormCrop = normalizeCrop(compareCrop);
  
  // 1. National Average calculation
  const cropMandis = SIMULATED_MANDI_PRICES.filter(
    item => normalizeCommodity(item.commodity) === activeNormCrop
  );
  
  const nationalAverage = cropMandis.length > 0 
    ? Math.round(cropMandis.reduce((sum, item) => sum + item.modalPrice, 0) / cropMandis.length)
    : (CROP_BASE_PRICES[activeNormCrop]?.baseModel || 2000);

  // 2. Specific State Mandi Price lookup (exact or dynamically estimated)
  const exactLocalMandi = cropMandis.find(item => {
    const marketLower = item.market.toLowerCase();
    const stateLower = compareState.toLowerCase();
    if (marketLower.includes(stateLower)) return true;
    const codes = stateAbbreviations[stateLower] || [];
    return codes.some(c => marketLower.includes(c));
  });

  const localMandiPrice = exactLocalMandi 
    ? exactLocalMandi.modalPrice 
    : Math.round(nationalAverage * (STATE_PRICE_FACTORS[compareState.toLowerCase()] || 1.0));

  const localMandiName = exactLocalMandi 
    ? exactLocalMandi.market 
    : `${STATE_CITIES[compareState.toLowerCase()] || "Regional"} State Mandi (${compareState})`;

  const unitLabel = exactLocalMandi 
    ? exactLocalMandi.unit 
    : (CROP_BASE_PRICES[activeNormCrop]?.unit || "100 kg (Quintal)");

  const varietyLabel = exactLocalMandi
    ? exactLocalMandi.variety
    : (CROP_BASE_PRICES[activeNormCrop]?.variety || "Standard Grade");

  const minVal = cropMandis.length > 0 ? Math.min(...cropMandis.map(i => i.minPrice)) : Math.round(nationalAverage * 0.85);
  const maxVal = cropMandis.length > 0 ? Math.max(...cropMandis.map(i => i.maxPrice)) : Math.round(nationalAverage * 1.15);

  const priceDiff = localMandiPrice - nationalAverage;
  const percentDiff = (priceDiff / nationalAverage) * 100;
  const isPremium = priceDiff >= 0;

  // Horizontal meter percentage placement
  const calculateMeterPosition = (val: number) => {
    const totalRange = Math.max(maxVal - minVal, 100);
    const pos = ((val - minVal) / totalRange) * 100;
    return Math.max(5, Math.min(pos, 95));
  };

  const localPos = calculateMeterPosition(localMandiPrice);
  const nationalPos = calculateMeterPosition(nationalAverage);

  const t = {
    title: isHi ? "लाइव मंडी भाव एवं रुझान" : "Live Mandi Rates & Trends (कृषि मंडी भाव)",
    desc: isHi ? "भारत के विभिन्न राज्यों में दैनिक थोक बाजार भावों की जानकारी रखें। अपनी फसल बेचने का सही निर्णय लें।" : "Track daily wholesale market transactions across Indian states. Compare regional varieties to decide when to harvest.",
    refreshBtn: isHi ? "भाव सिंक करें" : "Sync Rates",
    refreshing: isHi ? "सिंक हो रहा है..." : "Syncing...",
    searchPlaceholder: isHi ? "फसल, किस्म या मंडी का नाम खोजें..." : "Search crop, variety or market...",
    mandiCount: isHi ? "उपलब्ध बाजार मंडी भाव" : "Available Market Rates",
    varietyPrefix: isHi ? "किस्म:" : "Variety:",
    modalPriceLabel: isHi ? "औसत भाव / " : "Modal Rate / ",
    noResults: isHi ? "कोई मिलान वाली फसल या मंडी नहीं मिली।" : "No matching commodities found.",
    trendingTitle: isHi ? "रुझान वाली फसलें" : "Trending Commodities",
    guideTitle: isHi ? "मंडी विक्रय गाइड" : "Mandi Selling Guide",
    guideDesc: isHi ? "जब नमी की मात्रा 12.5% से नीचे प्रमाणित होती है, तब फसल का भाव 15% तक अधिक मिलता है। अपनी उपज को धूल-मिट्टी के धब्बों से बचाने के लिए तिरपाल की चादरों पर सुखाएं।" : "Prices command up to 15% higher value when moisture contents are certified below 12.5%. Dry your harvests beneath canvas sheets rather than direct dirt floorbeds to avoid yellow dust stains.",
    compareTitle: isHi ? "स्मार्ट मंडी दर तुलना इंजन" : "Mandi Rate Analyzer & Comparison Engine",
    compareDesc: isHi ? "चयनित राज्य के स्थानीय मंडी भाव और राष्ट्रीय औसत के बीच के अंतर का वास्तविक समय विश्लेषण।" : "Analyze real-time price variances between your local region's mandis against the country's national averages.",
    localMandiLabel: isHi ? "स्थानीय मंडी भाव" : "Local Mandi (आपके क्षेत्र का भाव)",
    nationalAvgLabel: isHi ? "राष्ट्रीय औसत भाव (National Avg)" : "National Average Price Index",
    premiumLabel: isHi ? "अतिरिक्त प्रीमियम मुनाफा" : "Premium Profit",
    discountLabel: isHi ? "राष्ट्रीय औसत से नीचे" : "Price Discount",
    analysisSubtitle: isHi ? "बाज़ार विश्लेषण परामर्श:" : "Strategic Market Advisory:",
    advisorPremiumText: isHi 
      ? "दरें राष्ट्रीय स्तर पर मजबूत हैं! यह क्षेत्र फसल आवक में गुणवत्ता प्रीमियम प्राप्त कर रहा है। अपनी फसल को तुरंत साफ और वर्गीकृत करके बेचने पर विचार करें।" 
      : "Local rates command a premium due to high quality index and strong regional transport. Clean and sort your crop lines to sell immediately.",
    advisorDiscountText: isHi 
      ? "स्थानीय मंडियों में भरपूर कटाई आवक के कारण भाव कम हैं। यदि संभव हो, तो अनाज को अच्छे वैज्ञानिक सूखे वेंटिलेशन भंडार (जैसे सरकारी गोदाम) में 2-3 सप्ताह रखें ताकि दरें स्थिर हो सकें।" 
      : "Peak harvest arrivals are temporarily depressing local prices below the national average. Consider drying and storing yields for 2-3 weeks in state-subsidized warehouses to capture seasonal recovery.",
  };

  return (
    <div id="mandi-portal-mod" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className={`${pal.primaryText} w-6 h-6 animate-pulse`} /> {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t.desc}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className={`flex items-center gap-1.5 ${pal.primaryBg} hover:opacity-90 border ${pal.primaryBorder} ${pal.primaryText} font-semibold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer self-start sm:self-auto shrink-0`}
        >
          <RefreshCw className={`w-3.5 h-3.5 hover:rotate-45 transition-transform ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? t.refreshing : t.refreshBtn}
        </button>
      </div>

      {/* FARMER PERSONAS & REGIONAL LOCALITIES CAROUSEL */}
      <div className="bg-slate-50/60 dark:bg-slate-900/10 p-5 rounded-2.5xl border border-slate-200/65 dark:border-slate-850 flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-mono">
              {isHi ? "स्थानिक पहचान और किसान प्रोफ़ाइल" : "FARMER LOCALITIES & REGIONAL IDENTITIES"}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-extrabold px-3 py-1 rounded-full">
            {isHi ? "सभी स्थान और फसलें" : "Active Location Match"}
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {personas.map((p, index) => {
            const isSelected = selectedPersona?.name === p.name;
            return (
              <div
                key={p.name + index}
                className={`flex-1 min-w-[220px] text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between gap-3 shrink-0 ${
                  isSelected 
                    ? "bg-white dark:bg-slate-950 border-emerald-500 shadow-sm ring-2 ring-emerald-500/10" 
                    : "bg-white/50 hover:bg-white dark:bg-slate-950/20 dark:hover:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                {/* Delete preset profile option button */}
                <button
                  type="button"
                  onClick={(e) => handleDeletePersona(p.name, e)}
                  title={isHi ? "पहचान हटाएं" : "Delete profile option"}
                  className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800/85 z-20 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  className="w-full text-left cursor-pointer flex flex-col justify-between gap-3 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-emerald-505/10 dark:bg-emerald-500/20 w-11 h-11 rounded-1.5xl flex items-center justify-center border border-emerald-400/20 shrink-0">
                      {p.avatar}
                    </span>
                    <div className="overflow-hidden pr-6">
                      <p className="text-xs font-black leading-none text-slate-900 dark:text-white truncate">
                        {p.name}
                      </p>
                      <span className="text-[9px] text-slate-400 font-mono tracking-wide uppercase mt-1.5 block leading-none font-bold">
                        {index === 0 && localStorage.getItem("kisan_farmer_profile") ? (isHi ? "आपकी पहचान" : "Your Identity") : (isHi ? `किसान प्रोफाइल #${index + 1}` : `Farmer Identity #${index + 1}`)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 flex flex-col gap-1 w-full text-[11px] font-bold">
                    <p className="text-slate-500 truncate flex items-center gap-1.5 leading-none">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{p.village}, {p.district}</span>
                    </p>
                    <p className="text-slate-800 dark:text-slate-300 pl-5 leading-none capitalize flex items-center justify-between">
                      <span className="opacity-60 text-[9px] font-medium tracking-wide uppercase">{isHi ? "राज्य:" : "State:"}</span>
                      <span className="font-extrabold">{p.state}</span>
                    </p>
                    <p className="text-slate-800 dark:text-slate-300 pl-5 leading-none flex items-center justify-between">
                      <span className="opacity-60 text-[9px] font-medium tracking-wide uppercase">{isHi ? "मुख्य फ़सल:" : "Main Crop:"}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black truncate max-w-[110px]" title={p.primaryCrop}>
                        {translateCommodity(p.primaryCrop)}
                      </span>
                    </p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEW SECTION: High-Fidelity Comparison & Pricing Variance Engine Card */}
      <div className="bg-gradient-to-br from-slate-50/50 via-white to-slate-100/30 dark:from-slate-900/10 dark:via-slate-950/20 dark:to-slate-900/25 border border-slate-205 dark:border-slate-800 p-5 rounded-2.5xl shadow-3xs">
        
        {/* Compare interactive selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full mb-1 inline-block">
              {isHi ? "तुलना विश्लेषक" : "VARIANCE DETECTOR"}
            </span>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Scale className={`w-4 h-4 ${pal.primaryText}`} /> {t.compareTitle}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{t.compareDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[11px] flex items-center gap-1.5 font-bold shadow-3xs text-slate-700 dark:text-slate-350">
              <span className="opacity-60">{isHi ? "राज्य:" : "State:"}</span>
              <select 
                value={compareState} 
                onChange={(e) => setCompareState(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-slate-800 dark:text-white font-black"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s} className="text-slate-900 font-bold">{s}</option>)}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-1 text-[11px] flex items-center gap-1.5 font-bold shadow-3xs text-slate-700 dark:text-slate-350">
              <span className="opacity-60">{isHi ? "फसल:" : "Crop:"}</span>
              <select 
                value={compareCrop} 
                onChange={(e) => setCompareCrop(e.target.value)}
                className="bg-transparent outline-none cursor-pointer text-slate-800 dark:text-white font-black"
                style={{ maxWidth: "160px" }}
              >
                {commodities.filter(c => c.en !== "All").map(c => <option key={c.en} value={c.en} className="text-slate-900 font-bold">{c.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Math highlights grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          
          {/* Card A: Local State Rate */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between shadow-3xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{t.localMandiLabel}</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-none truncate mb-1">
                {translateMarket(localMandiName)}
              </p>
              <span className="text-[9px] text-slate-400">
                {t.varietyPrefix} {translateVariety(varietyLabel)} • {translateUnit(unitLabel)}
              </span>
            </div>
            <p className="text-2xl font-mono font-black text-slate-900 dark:text-white mt-3 flex items-baseline gap-1">
              ₹{localMandiPrice}
              <span className="text-[10px] text-slate-400 font-medium normal-case font-sans">/Qtl</span>
            </p>
          </div>

          {/* Card B: Price Difference Gauge */}
          <div className={`p-4 rounded-2xl border flex flex-col justify-between shadow-4xs ${
            isPremium 
              ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30" 
              : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30"
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                {isPremium ? t.premiumLabel : t.discountLabel}
              </span>
              {isPremium ? (
                <ArrowUpRight className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div>
              <p className={`text-xl font-mono font-black ${isPremium ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                {isPremium ? "+" : ""}{priceDiff} ₹
              </p>
              <p className="text-[10px] font-bold text-slate-500">
                {isPremium ? "Premium" : "Difference"} of {Math.abs(percentDiff).toFixed(1)}%
              </p>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-3 self-start ${
              isPremium 
                ? "bg-emerald-600 text-white" 
                : "bg-amber-600 text-white"
            }`}>
              {isPremium ? `↑ ₹${priceDiff} Premium` : `↓ ₹${Math.abs(priceDiff)} Discount`}
            </span>
          </div>

          {/* Card C: National Average Price */}
          <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col justify-between shadow-3xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{t.nationalAvgLabel}</span>
              <Globe className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white capitalize">
                {isHi ? `${translateCommodity(compareCrop)} का औसत सूचकांक` : `General Average of ${compareCrop}`}
              </p>
              <span className="text-[9px] text-slate-400">
                {isHi ? "अखिल भारतीय कृषि भाव स्तर" : "All India Market Composite index"}
              </span>
            </div>
            <p className="text-2xl font-mono font-black text-slate-550 dark:text-slate-350 mt-3 flex items-baseline gap-1">
              ₹{nationalAverage}
              <span className="text-[10px] text-slate-400 font-medium normal-case font-sans">/Qtl</span>
            </p>
          </div>

        </div>

        {/* Comparative slider meter */}
        <div className="bg-slate-50/80 dark:bg-slate-950/80 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl mb-4">
          <div className="flex justify-between text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
            <span>Min ({minVal})</span>
            <span>All India Price Spectrum (₹/Quintal)</span>
            <span>Max ({maxVal})</span>
          </div>

          <div className="relative h-2.5 bg-slate-200 dark:bg-slate-850 rounded-full my-4">
            
            {/* Shaded connection track */}
            <div 
              className={`absolute h-full rounded-full opacity-30 ${isPremium ? "bg-emerald-500" : "bg-amber-500"}`} 
              style={{
                left: `${Math.min(localPos, nationalPos)}%`,
                width: `${Math.abs(localPos - nationalPos)}%`
              }}
            ></div>

            {/* National indicator marker */}
            <div 
              className="absolute -top-3.5 z-10 flex flex-col items-center group cursor-help transition-all" 
              style={{ left: `${nationalPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="bg-slate-700 text-white dark:bg-slate-800 text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-90 tracking-wide select-none">
                {isHi ? "राष्ट्रीय" : "National"} (₹{nationalAverage})
              </div>
              <div className="w-3 h-3 bg-white dark:bg-slate-950 rounded-full border-2 border-slate-600 dark:border-slate-300 mt-1 shadow-3xs"></div>
            </div>

            {/* Local State indicator pointer */}
            <div 
              className="absolute -top-3.5 z-20 flex flex-col items-center transition-all" 
              style={{ left: `${localPos}%`, transform: "translateX(-50%)" }}
            >
              <div className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-xs text-white ${
                isPremium ? "bg-emerald-600" : "bg-amber-600"
              }`}>
                {isHi ? "स्थानीय" : "Local"} (₹{localMandiPrice})
              </div>
              <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md mt-0.5 animate-pulse ${
                isPremium ? "bg-emerald-600" : "bg-amber-600"
              }`}></div>
            </div>

          </div>
        </div>

        {/* Thematic Agricultural Advice */}
        <div className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
          isPremium 
            ? "bg-emerald-500/5 border-emerald-100 dark:border-emerald-950 text-slate-700 dark:text-slate-350"
            : "bg-amber-500/5 border-amber-100 dark:border-amber-955 text-slate-700 dark:text-slate-350"
        }`}>
          <HelpCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isPremium ? "text-emerald-600" : "text-amber-600"}`} />
          <div className="leading-relaxed">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">
              {t.analysisSubtitle}
            </span>
            <span>
              {isPremium ? t.advisorPremiumText : t.advisorDiscountText}
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/10 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-600 text-slate-800 dark:text-white shadow-3xs animate-transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto no-scrollbar w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {commodities.map((cat) => (
            <button
              key={cat.en}
              onClick={() => setFilterCommodity(cat.en)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition-colors border cursor-pointer ${
                filterCommodity === cat.en
                  ? pal.primaryButton
                  : "bg-white border-slate-205 text-slate-600 hover:text-slate-900 shadow-3xs dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Mandi grid prices */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-805 dark:text-slate-350 uppercase tracking-wide flex items-center gap-1.5 mb-1 animate-transition">
            <Layers className={`w-4 h-4 ${pal.primaryText} font-semibold`} /> {t.mandiCount} ({filteredPrices.length})
          </h3>

          <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredPrices.map((item, idx) => (
              <div key={idx} className={`bg-slate-50/50 hover:bg-white dark:bg-slate-900/15 dark:hover:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs ${pal.cardHover}`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 ${pal.primaryBg} rounded-xl border ${pal.primaryBorder} shrink-0`}>
                    <TrendingUp className={`w-4 h-4 ${pal.primaryText}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-white leading-snug">{translateCommodity(item.commodity)}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {translateMarket(item.market)}
                    </p>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded mt-1.5 inline-block ${pal.accentText}`}>
                      {t.varietyPrefix} {translateVariety(item.variety)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between sm:flex-col sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200/50 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">{t.modalPriceLabel} {translateUnit(item.unit)}</span>
                  <div className="mt-0.5">
                    <span className={`text-base font-mono font-bold ${pal.avgText}`}>₹{item.modalPrice}</span>
                    <span className="text-[10px] text-slate-400 font-mono italic ml-1">({item.minPrice} - {item.maxPrice})</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredPrices.length === 0 && (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/20 border rounded-2xl border-dashed">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-semibold">{t.noResults}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Trends / Tips */}
        <div className="flex flex-col gap-4">
          <div className={`${pal.trendBg} text-white rounded-2.5xl p-5 shadow-sm flex flex-col gap-4`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest ${pal.trendText} border-b border-white/10 pb-2`}>{t.trendingTitle}</h3>
            
            <div className="flex flex-col gap-4 text-xs font-medium leading-relaxed">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <p className="font-bold">{isHi ? "गेहूं (गैर-मौसमी)" : "Wheat (Unseasoned)"}</p>
                  <p className="text-[10px] opacity-75">{isHi ? "आगरा मंडी, उत्तर प्रदेश" : "Agra Mandi, UP"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">↑ ₹2,600</p>
                  <p className="text-[9px] opacity-70">{isHi ? "+4.2% इस महीने" : "+4.2% This Month"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <p className="font-bold">{isHi ? "लाल प्याज़" : "Red Onions"}</p>
                  <p className="text-[10px] opacity-75">{isHi ? "नासिक, महाराष्ट्र" : "Nashik, Maharashtra"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-400">↓ ₹1,950</p>
                  <p className="text-[9px] opacity-70">{isHi ? "-1.5% आवक अधिक" : "-1.5% Dew glut"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1">
                <div>
                  <p className="font-bold">{isHi ? "बासमती 1121 धान" : "Basmati 1121 Paddy"}</p>
                  <p className="text-[10px] opacity-75">{isHi ? "करनाल, हरियाणा" : "Karnal, Haryana"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">↑ ₹4,150</p>
                  <p className="text-[9px] opacity-70">{isHi ? "+2.0% निर्यात मांग" : "+2.0% Export Demand"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-955/10 border border-amber-200/60 dark:border-amber-900/30 p-4.5 rounded-2.5xl flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-950 dark:text-amber-400">{t.guideTitle}</p>
              <p className="text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed mt-1">
                {t.guideDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
