import React, { useState, useEffect } from "react";
import { CloudSun, CloudRain, Sun, CloudSnow, Wind, AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { getMonthAlerts } from "../data";

interface WeatherWidgetProps {
  selectedState: string;
  selectedMonth: string;
  lang?: "en" | "hi";
}

const HI_ALERTS_MAP: Record<string, string> = {
  "Monsoon arrival: Expect heavy pre-monsoon showers. Prepare drainage channels.": "मानसून का आगमन: भारी पूर्व-मानसून वर्षा की संभावना। जल निकासी चैनल सक्रिय करें।",
  "High temperature alert: Crop sowing during cooler morning hours recommended.": "उच्च तापमान चेतावनी: ठंडे सुबह के घंटों के दौरान फसल बुवाई की सलाह दी जाती है।",
  "Active Monsoon: Flood warning in low-lying zones. Delay fertilizer spraying during rainy days.": "सक्रिय मानसून: निचले क्षेत्रों में बाढ़ की चेतावनी। बरसात के दिनों में उर्वरक छिड़काव टालें।",
  "Humidity spike: Favorable for bacterial leaf blight. Monitor closely.": "आर्द्रता में वृद्धि: पत्ती का जीवाणु झुलसा रोग (bacterial leaf blight) होने की संभावना। निगरानी रखें।",
  "Continuous Rainfall: Waterlogging may rot potato & sugarcane roots. Keep drains open.": "लगातार वर्षा: जलजमाव से आलू और गन्ने की जड़ें सड़ सकती हैं। जल निकासी खुली रखें।",
  "Pest warning: Rice stem borer moth flights observed. Set up light traps.": "कीट चेतावनी: धान के तना छेदक पतंगे देखे गए। प्रकाश जाल (light traps) लगाएं।",
  "Monsoon exit phase: High afternoon temperature. Irrigate only if dry spells persist.": "मानसून निकास चरण: दोपहर का उच्च तापमान। केवल सूखा रहने पर ही सिंचाई करें।",
  "Leaf damage: Armyworm risk in young maize. Keep neem oil solution ready.": "पत्तियों का नुकसान: मक्के में सैनिक कीट का खतरा। नीम तेल का घोल तैयार रखें।",
  "Post-monsoon transition: Cool nights and warm days. Harvest Kharif crops under dry sun.": "मानसून के बाद का बदलाव: रातें ठंडी और दिन गर्म। सूखे मौसम में खरीफ फसलों की कटाई करें।",
  "Rabi season prep: Start deep tilling fields for Wheat sowing.": "रबी सीजन की तैयारी: गेहूं की बुवाई के लिए खेतों में गहरी जुताई शुरू करें।",
  "Pest risk: Aphids peak in mustard crops as dew rises. Apply systemic bio-agents.": "कीट जोखिम: ओस बढ़ने से सरसों की फसलों में चेपा/माहू (aphids) का प्रकोप। जैविक एजेंटों का छिड़काव करें।",
  "Winter temperature dip: Protect seedlings from early morning cold by light mulch.": "तापमान में गिरावट: सुबह की ठंड से पौधों को बचाने के लिए हल्की मल्चिंग करें।",
  "Dense Fog Alert: High powdery mildew risk in potato & mustard. Ensure sunlight reaches crop floors.": "घने कोहरे की चेतावनी: आलू और सरसों में पाउडरी मिल्ड्यू (धब्बा रोग) का अधिक खतरा। पराबैंगनी धूप पहुँचने दें।",
  "Deep winter frost: Irrigate lightly in evenings to keep soil warm.": "घोर शीत लहर: मिट्टी को गर्म रखने के लिए शाम के समय हल्की सिंचाई करें।",
  "Severe Cold & Frost Warning: High risk of frostbite in tomato & gourd nursery crops.": "भीषण ठंड और पाला की चेतावनी: टमाटर और लौकी जैसी नर्सरी फसलों में पाला लगने का उच्च जोखिम।",
  "Wheat irrigation crucial: Crown Root Initiation stage. Do not miss key watering cycle.": "गेहूं की सिंचाई महत्वपूर्ण: क्राउन रूट इनिशिएशन अवस्था। पानी देने का महत्वपूर्ण चक्र न चूकें।",
  "Sudden warm winds: Speeds wheat grain formation. Maintain soil moisture.": "अचानक गर्म हवाएँ: गेहूं के दानों के निर्माण को तेज करती हैं। मिट्टी की नमी बनाए रखें।",
  "Whitefly warning: Spotted in early cotton and vegetables. Spray soap water.": "सफेद मक्खी की चेतावनी: शुरुआती कपास और सब्जियों में देखी गई। साबुन पानी का छिड़काव करें।",
  "Heatwave build-up: Sudden temperature surge. Harvest mustard & gram.": "लू का प्रकोप: अचानक तापमान में वृद्धि। सरसों और चने की कटाई करें।",
  "Hailstorm risk: Keep close eye on meteorological alerts before harvesting.": "ओलावृष्टि का जोखिम: कटाई से पहले मौसम संबंधी चेतावनियों पर पैनी नजर रखें।",
  "Peak Summer: Extreme heat waves. Water summer green gram (Moong) at evening hours.": "भीषण गर्मी: अत्यधिक लू का मौसम। गर्मी मूंग को शाम के समय पानी दें।",
  "Dry dust storms: Use windbreaks or tall hedges to protect fruit plants.": "धूल भरी आंधी: फलों के पौधों की सुरक्षा के लिए पवन अवरोधक या ऊंचे वाड़ का उपयोग करें।",
  "Intense heat: Let soil dry up well for deep field sterilization (solarization).": "अत्यंत गर्मी: गहरी जुताई कर खेत सौरीकरण (solarization) के लिए मिट्टी को सूखने दें।",
  "Water table alert: Save groundwater, plant heat-tolerant varieties.": "भूजल स्तर की चेतावनी: भूजल बचाएं, गर्मी सहने वाली किस्मों को बोएं।"
};

export default function WeatherWidget({ selectedState, selectedMonth, lang = "en" }: WeatherWidgetProps) {
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(65);
  const [precipitation, setPrecipitation] = useState(20);

  useEffect(() => {
    // Generate organic parameters depending on month
    let temp = 25;
    let hum = 50;
    let rain = 10;

    switch (selectedMonth) {
      case "May":
      case "June":
        temp = 38 + Math.floor(Math.random() * 5);
        hum = 40 + Math.floor(Math.random() * 15);
        rain = 15;
        break;
      case "July":
      case "August":
        temp = 29 + Math.floor(Math.random() * 4);
        hum = 80 + Math.floor(Math.random() * 15);
        rain = 85;
        break;
      case "September":
      case "October":
        temp = 27 + Math.floor(Math.random() * 4);
        hum = 65 + Math.floor(Math.random() * 10);
        rain = 30;
        break;
      case "November":
      case "December":
      case "January":
        temp = 14 + Math.floor(Math.random() * 6);
        hum = 70 + Math.floor(Math.random() * 15);
        rain = 5;
        break;
      case "February":
      case "March":
      case "April":
        temp = 24 + Math.floor(Math.random() * 8);
        hum = 45 + Math.floor(Math.random() * 15);
        rain = 10;
        break;
    }

    setTemperature(temp);
    setHumidity(hum);
    setPrecipitation(rain);
  }, [selectedMonth, selectedState]);

  const alerts = getMonthAlerts(selectedMonth);

  const getWeatherIcon = () => {
    if (precipitation > 60) return <CloudRain id="cloud-rain-icon" className="w-12 h-12 text-blue-500 animate-bounce" />;
    if (temperature > 35) return <Sun id="sun-icon" className="w-12 h-12 text-amber-500 animate-spin-slow" />;
    if (temperature < 15) return <CloudSnow id="snow-icon" className="w-12 h-12 text-sky-400" />;
    return <CloudSun id="cloud-sun-icon" className="w-12 h-12 text-yellow-500 animate-pulse" />;
  };

  const isHi = lang === "hi";
  const getPrecipitationText = () => {
    if (precipitation > 60) return isHi ? "भारी मानसून की बारिश" : "Heavy Monsoon Rainfall";
    if (temperature > 35) return isHi ? "भीषण शुष्क गर्मी (लू)" : "Intense Dry Summer Heat";
    return isHi ? "अनुकूल साफ आसमान" : "Optimal Clear Sky";
  };

  const getMonthHindiName = (m: string) => {
    const monthsMap: Record<string, string> = {
      January: "जनवरी", February: "फरवरी", March: "मार्च", April: "अप्रैल",
      May: "मई", June: "जून", July: "जुलाई", August: "अगस्त",
      September: "सितंबर", October: "अक्टूबर", November: "नवंबर", December: "दिसंबर"
    };
    return monthsMap[m] || m;
  };

  const weatherTitle = isHi ? `लाइव पूर्वानुमान • ${selectedState}` : `Live Forecast • ${selectedState}`;
  const weatherSub = isHi 
    ? `${getMonthHindiName(selectedMonth)} में ${getPrecipitationText()}` 
    : `${getPrecipitationText()} in ${selectedMonth}`;

  return (
    <div id="weather-widget" className="kisan-card-glass rounded-3xl p-6 shadow-lg flex flex-col md:flex-row gap-6 transition-all duration-300">
      <div id="weather-info-main" className="flex-1 flex gap-5 items-center">
        <div id="weather-main-icon" className="p-4 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl shrink-0">
          {getWeatherIcon()}
        </div>
        <div id="weather-detail-values">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-1">{weatherTitle}</span>
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1 capitalize">
            {weatherSub}
          </p>
        </div>
      </div>

      <div id="weather-alerts" className="flex-1 border-t md:border-t-0 md:border-l border-emerald-100/40 dark:border-emerald-800/30 pt-4 md:pt-0 md:pl-6 flex flex-col gap-2.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
          <AlertTriangle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" /> {isHi ? "कृषि सलाह अलर्ट" : "Agronomy Alerts"}
        </h4>
        <div id="weather-alerts-list" className="flex flex-col gap-2.5 text-[11px] overflow-y-auto max-h-[100px] no-scrollbar">
          {alerts.map((alertItem, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 p-2.5 rounded-xl border ${
                alertItem.severity === "error"
                  ? "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20"
                  : alertItem.severity === "warning"
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
              }`}
            >
              {alertItem.severity === "error" ? (
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              ) : alertItem.severity === "warning" ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              ) : (
                <Info className="w-4 h-4 shrink-0 text-blue-500" />
              )}
              <span className="font-semibold leading-relaxed">
                {isHi ? (HI_ALERTS_MAP[alertItem.alert] || alertItem.alert) : alertItem.alert}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
