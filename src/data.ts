import { MarketPriceItem } from "./types";

export const INDIAN_STATES = [
  "Punjab",
  "Uttar Pradesh",
  "Maharashtra",
  "Andhra Pradesh",
  "Telangana",
  "Bihar",
  "Gujarat",
  "Karnataka",
  "Madhya Pradesh",
  "Rajasthan",
  "Haryana",
  "West Bengal",
  "Tamil Nadu"
];

export const GENERAL_CROPS = [
  "Wheat (Gehun)",
  "Rice / Paddy (Dhan)",
  "Maize (Makka)",
  "Sugarcane (Ganna)",
  "Cotton (Kapas)",
  "Soybean",
  "Groundnut (Moongphali)",
  "Mustard (Sarson)",
  "Tomato (Tamatar)",
  "Potato (Aloo)",
  "Onion (Pyaz)",
  "Gram / Chickpea (Chana)",
  "Pigeon Pea (Arhar/Tur)",
  "Black Gram (Urad)"
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const generateAllMandiPrices = (): MarketPriceItem[] => {
  const list: MarketPriceItem[] = [];

  const STATE_MARKETS: Record<string, string> = {
    "Punjab": "Khanna Mandi (Punjab)",
    "Uttar Pradesh": "Agra Mandi (UP)",
    "Maharashtra": "Lasalgaon Mandi (Maharashtra)",
    "Andhra Pradesh": "Guntur Mandi (Andhra Pradesh)",
    "Telangana": "Warangal Mandi (Telangana)",
    "Bihar": "Patna Mandi (Bihar)",
    "Gujarat": "Rajkot Mandi (Gujarat)",
    "Karnataka": "Kolar Mandi (Karnataka)",
    "Madhya Pradesh": "Indore Mandi (MP)",
    "Rajasthan": "Alwar Mandi (Rajasthan)",
    "Haryana": "Karnal Mandi (Haryana)",
    "West Bengal": "Kolkata Hub Mandi (West Bengal)",
    "Tamil Nadu": "Coimbatore Mandi (Tamil Nadu)"
  };

  const BASE_CROP_METADATA: Record<string, { basePrice: number; variety: string; unit: string }> = {
    "Wheat (Gehun)": { basePrice: 2275, variety: "Lokwan Good Quality", unit: "100 kg (Quintal)" },
    "Rice / Paddy (Dhan)": { basePrice: 2183, variety: "Common Grade A", unit: "100 kg (Quintal)" },
    "Maize (Makka)": { basePrice: 2090, variety: "Hybrid Yellow", unit: "100 kg (Quintal)" },
    "Sugarcane (Ganna)": { basePrice: 385, variety: "Co-0238 High Sucrose", unit: "100 kg (Quintal)" },
    "Cotton (Kapas)": { basePrice: 7020, variety: "BT Cotton Shankar-6", unit: "100 kg (Quintal)" },
    "Soybean": { basePrice: 4400, variety: "Yellow Soybean Seed", unit: "100 kg (Quintal)" },
    "Groundnut (Moongphali)": { basePrice: 6375, variety: "G-20 Desi Bold", unit: "100 kg (Quintal)" },
    "Mustard (Sarson)": { basePrice: 5450, variety: "Mustard Seed Bold", unit: "100 kg (Quintal)" },
    "Tomato (Tamatar)": { basePrice: 1250, variety: "Hybrid Vaishali", unit: "100 kg (Quintal)" },
    "Potato (Aloo)": { basePrice: 1350, variety: "Kufri Jyoti", unit: "100 kg (Quintal)" },
    "Onion (Pyaz)": { basePrice: 1950, variety: "Nasik Red Medium", unit: "100 kg (Quintal)" },
    "Gram / Chickpea (Chana)": { basePrice: 5850, variety: "Desi Chana", unit: "100 kg (Quintal)" },
    "Pigeon Pea (Arhar/Tur)": { basePrice: 7000, variety: "Maruti Grains", unit: "100 kg (Quintal)" },
    "Black Gram (Urad)": { basePrice: 6950, variety: "Urad Bold G-1", unit: "100 kg (Quintal)" }
  };

  const getDeterministicFactor = (state: string, crop: string): number => {
    const str = state + crop;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const percent = (Math.abs(hash) % 15) - 7; // -7% to +7% deterministically
    return 1 + (percent / 100);
  };

  const STATE_CROP_MULTIPLIERS: Record<string, Record<string, number>> = {
    "Punjab": { "Wheat (Gehun)": 1.05, "Rice / Paddy (Dhan)": 1.06, "Maize (Makka)": 0.98 },
    "Uttar Pradesh": { "Wheat (Gehun)": 1.02, "Sugarcane (Ganna)": 1.04, "Potato (Aloo)": 1.05, "Onion (Pyaz)": 0.95 },
    "Maharashtra": { "Onion (Pyaz)": 1.08, "Soybean": 1.05, "Gram / Chickpea (Chana)": 1.03 },
    "Andhra Pradesh": { "Rice / Paddy (Dhan)": 1.03, "Cotton (Kapas)": 1.02, "Tomato (Tamatar)": 0.96 },
    "Telangana": { "Rice / Paddy (Dhan)": 1.02, "Cotton (Kapas)": 1.03 },
    "Bihar": { "Wheat (Gehun)": 0.96, "Maize (Makka)": 1.02, "Potato (Aloo)": 0.97 },
    "Gujarat": { "Cotton (Kapas)": 1.06, "Groundnut (Moongphali)": 1.04 },
    "Karnataka": { "Tomato (Tamatar)": 1.08 },
    "Madhya Pradesh": { "Wheat (Gehun)": 1.06, "Soybean": 1.04, "Gram / Chickpea (Chana)": 1.02 },
    "Rajasthan": { "Mustard (Sarson)": 1.06 },
    "Haryana": { "Wheat (Gehun)": 1.04, "Rice / Paddy (Dhan)": 1.04, "Sugarcane (Ganna)": 1.02 },
    "West Bengal": { "Rice / Paddy (Dhan)": 1.05, "Potato (Aloo)": 0.98 },
    "Tamil Nadu": { "Rice / Paddy (Dhan)": 1.02, "Sugarcane (Ganna)": 1.03 }
  };

  const getSpecificStateMultiplier = (state: string, crop: string): number => {
    const stateMultipliers = STATE_CROP_MULTIPLIERS[state];
    if (stateMultipliers && stateMultipliers[crop]) {
      return stateMultipliers[crop];
    }
    return getDeterministicFactor(state, crop);
  };

  // Generate 14 crops for each of the 13 states = 182 entries!
  for (const state of INDIAN_STATES) {
    const market = STATE_MARKETS[state] || `${state} General Mandi`;
    for (const crop of GENERAL_CROPS) {
      const meta = BASE_CROP_METADATA[crop] || { basePrice: 2000, variety: "Regular Grade", unit: "100 kg (Quintal)" };
      const multiplier = getSpecificStateMultiplier(state, crop);
      const modalPrice = Math.round(meta.basePrice * multiplier);
      
      const spread = Math.round(modalPrice * 0.08); // 8% variance
      const minPrice = modalPrice - spread;
      const maxPrice = modalPrice + Math.round(spread * 1.2);

      list.push({
        commodity: crop,
        market: market,
        minPrice: minPrice,
        maxPrice: maxPrice,
        modalPrice: modalPrice,
        variety: meta.variety,
        unit: meta.unit
      });
    }
  }

  return list;
};

export const SIMULATED_MANDI_PRICES: MarketPriceItem[] = generateAllMandiPrices();

export const WEATHER_ALERTS_BY_MONTH: Record<string, { alert: string; severity: "info" | "warning" | "error"; icon: string }[]> = {
  "June": [
    { alert: "Monsoon arrival: Expect heavy pre-monsoon showers. Prepare drainage channels.", severity: "info", icon: "CloudRain" },
    { alert: "High temperature alert: Crop sowing during cooler morning hours recommended.", severity: "warning", icon: "Thermometer" }
  ],
  "July": [
    { alert: "Active Monsoon: Flood warning in low-lying zones. Delay fertilizer spraying during rainy days.", severity: "warning", icon: "AlertTriangle" },
    { alert: "Humidity spike: Favorable for bacterial leaf blight. Monitor closely.", severity: "info", icon: "Cloud" }
  ],
  "August": [
    { alert: "Continuous Rainfall: Waterlogging may rot potato & sugarcane roots. Keep drains open.", severity: "warning", icon: "Droplet" },
    { alert: "Pest warning: Rice stem borer moth flights observed. Set up light traps.", severity: "info", icon: "Bug" }
  ],
  "September": [
    { alert: "Monsoon exit phase: High afternoon temperature. Irrigate only if dry spells persist.", severity: "info", icon: "Sun" },
    { alert: "Leaf damage: Armyworm risk in young maize. Keep neem oil solution ready.", severity: "warning", icon: "Bug" }
  ],
  "October": [
    { alert: "Post-monsoon transition: Cool nights and warm days. Harvest Kharif crops under dry sun.", severity: "info", icon: "Sparkles" },
    { alert: "Rabi season prep: Start deep tilling fields for Wheat sowing.", severity: "info", icon: "Hammer" }
  ],
  "November": [
    { alert: "Pest risk: Aphids peak in mustard crops as dew rises. Apply systemic bio-agents.", severity: "warning", icon: "Bug" },
    { alert: "Winter temperature dip: Protect seedlings from early morning cold by light mulch.", severity: "info", icon: "Thermometer" }
  ],
  "December": [
    { alert: "Dense Fog Alert: High powdery mildew risk in potato & mustard. Ensure sunlight reaches crop floors.", severity: "warning", icon: "Wind" },
    { alert: "Deep winter frost: Irrigate lightly in evenings to keep soil warm.", severity: "info", icon: "CloudSnow" }
  ],
  "January": [
    { alert: "Severe Cold & Frost Warning: High risk of frostbite in tomato & gourd nursery crops.", severity: "warning", icon: "CloudSnow" },
    { alert: "Wheat irrigation crucial: Crown Root Initiation stage. Do not miss key watering cycle.", severity: "info", icon: "Droplet" }
  ],
  "February": [
    { alert: "Sudden warm winds: Speeds wheat grain formation. Maintain soil moisture.", severity: "info", icon: "Thermometer" },
    { alert: "Whitefly warning: Spotted in early cotton and vegetables. Spray soap water.", severity: "warning", icon: "Bug" }
  ],
  "March": [
    { alert: "Heatwave build-up: Sudden temperature surge. Harvest mustard & gram.", severity: "warning", icon: "Sun" },
    { alert: "Hailstorm risk: Keep close eye on meteorological alerts before harvesting.", severity: "warning", icon: "CloudLightning" }
  ],
  "April": [
    { alert: "Peak Summer: Extreme heat waves. Water summer green gram (Moong) at evening hours.", severity: "warning", icon: "Thermometer" },
    { alert: "Dry dust storms: Use windbreaks or tall hedges to protect fruit plants.", severity: "info", icon: "Wind" }
  ],
  "May": [
    { alert: "Intense heat: Let soil dry up well for deep field sterilization (solarization).", severity: "info", icon: "Sun" },
    { alert: "Water table alert: Save groundwater, plant heat-tolerant varieties.", severity: "warning", icon: "AlertOctagon" }
  ]
};

export function getMonthAlerts(month: string) {
  return WEATHER_ALERTS_BY_MONTH[month] || [
    { alert: "Maintain optimal irrigation and check crop parameters regularly.", severity: "info", icon: "CheckCircle" }
  ];
}
