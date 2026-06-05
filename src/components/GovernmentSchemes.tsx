import React, { useState } from "react";
import { Landmark, ArrowUpRight, Search, CheckCircle2, ShieldCheck } from "lucide-react";

interface GovernmentSchemesProps {
  lang?: "en" | "hi";
}

export default function GovernmentSchemes({ lang = "en" }: GovernmentSchemesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "subsidies" | "insurance" | "loans">("all");
  const [eligibilityCheck, setEligibilityCheck] = useState({
    landHold: "",
    state: "Uttar Pradesh",
    incomeTaxPayer: "no",
  });
  const [checkingResult, setCheckingResult] = useState<any | null>(null);

  const isHi = lang === "hi";

  const STATES = isHi
    ? [
        { en: "Uttar Pradesh", label: "उत्तर प्रदेश" },
        { en: "Punjab", label: "पंजाब" },
        { en: "Bihar", label: "बिहार" },
        { en: "Madhya Pradesh", label: "मध्य प्रदेश" },
        { en: "Maharashtra", label: "महाराष्ट्र" },
        { en: "Haryana", label: "हरियाणा" }
      ]
    : [
        { en: "Uttar Pradesh", label: "Uttar Pradesh" },
        { en: "Punjab", label: "Punjab" },
        { en: "Bihar", label: "Bihar" },
        { en: "Madhya Pradesh", label: "Madhya Pradesh" },
        { en: "Maharashtra", label: "Maharashtra" },
        { en: "Haryana", label: "Haryana" }
      ];

  const SCHEMES_LIST = [
    {
      id: "pm-kisan",
      category: "subsidies",
      name: isHi ? "पीएम-किसान सम्मान निधि योजना" : "PM-Kisan Samman Nidhi Yojana",
      tagline: isHi ? "भारतीय किसानों को प्रत्यक्ष आय सहायता" : "Direct Income Support to Indian Farmers",
      benefit: isHi 
        ? "प्रति वर्ष ₹6,000 की राशि सीधे बैंक खातों में तीन बराबर किश्तों में हस्तांतरित की जाती है।"
        : "₹6,000 per year delivered in 3 equal installments directly to bank accounts.",
      eligibility: isHi
        ? "सभी भूमिधारक किसान परिवार जिनके नाम खेती योग्य भूमि है। आयकर दाता और संवैधानिक पदों वाले वंचित हैं।"
        : "All landholder farmer families having cultivable landholding in their names. Must not be income-tax payers or holding key political positions.",
      linkText: isHi ? "पीएम-किसान पोर्टल पर जाएं" : "Apply via PM-Kisan Portal",
      portalUrl: "https://pmkisan.gov.in/",
      steps: isHi
        ? [
            "आधार कार्ड नंबर और ओटीपी के माध्यम से पोर्टल पर स्वयं पंजीकरण करें।",
            "भूमि राजस्व रिकॉर्ड (खतौनी/जमाबंदी) के प्रामाणिक डिजिटल दस्तावेज अपलोड करें।",
            "नजदीकी जन सेवा केंद्र (CSC) पर जाकर ई-केवाईसी सत्यापन संपन्न करवाएं।"
          ]
        : [
            "Self registration using Aadhaar number and OTP.",
            "Uploading land revenue registry documents (Khatauni).",
            "E-KYC verification complete by local CSC office."
          ]
    },
    {
      id: "pmfby",
      category: "insurance",
      name: isHi ? "प्रधानमंत्री फसल बीमा योजना (PMFBY)" : "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      tagline: isHi ? "व्यापक फसल बीमा सुरक्षा चक्र" : "Comprehensive Crop Insurance Cover",
      benefit: isHi
        ? "बाढ़, सूखा या पाला से नुकसान पर खरीफ फसलों हेतु मात्र 2%, रबी के लिए 1.5% और बागवानी के लिए 5% प्रीमियम।"
        : "Low premium rates of only 2% for Kharif crops, 1.5% for Rabi, and 5% for horticultural crops to safeguard from unforeseen hailstorms and floods.",
      eligibility: isHi
        ? "सभी अधिसूचित क्षेत्रों में स्वीकृत फसलों की खेती करने वाले किसान। गैर-ऋणी किसानों के लिए स्वैच्छिक रूप से उपलब्ध है।"
        : "All farmers growing authorized crops in notified farm zones have eligibility. Voluntary options available for non-loanee farmers.",
      linkText: isHi ? "प्रीमियम दर की गणना और पंजीकरण" : "Calculate Premium & Enroll",
      portalUrl: "https://pmfby.gov.in/",
      steps: isHi
        ? [
            "नियोजित फसल बुवाई की अंतिम तिथि से पूर्व स्थानीय सहकारी बैंक या ऑनलाइन पोर्टल पर पंजीकरण करें।",
            "पटवारी या अधिकृत विलेज ऑफिसर द्वारा जारी फसल बुवाई प्रमाणपत्र (Sowing Certificate) प्रस्तुत करें।",
            "मौसम और क्षेत्रीय फसल नुकसान 50% से अधिक प्रमाणित होने पर दावा सीधे बैंक खाते में भुगतान किया जाएगा।"
          ]
        : [
            "Register with your local crop detail prior to sowing deadlines.",
            "Submit sowing certificate issued by Patwari/Village officer.",
            "Payout is auto-deposited directly if seasonal regional crop diagnostics show greater than 50% loss."
          ]
    },
    {
      id: "solar-pump",
      category: "subsidies",
      name: isHi ? "पीएम-कुसुम सोलर पंप योजना" : "PM-Kusum Solar Pump Subsidy",
      tagline: isHi ? "हरित ऊर्जा और सौर सिंचाई क्रांति" : "Green Energy & Free Solar Power",
      benefit: isHi
        ? "सोलर इन्स्टॉलेशन हेतु 60% प्रत्यक्ष सरकारी सब्सिडी। इसके अतिरिक्त राज्य सहकारी बैंक से 30% आसान ऋण।"
        : "Up to 60% direct subsidy for installing highly efficient off-grid solar water pumps. State banks provides extra 30% soft loan.",
      eligibility: isHi
        ? "व्यक्तिगत किसान, संयुक्त कृषक समूह, जल उपभोक्ता संघ जिनके पास वैध भूजल निष्कर्षण अथवा बोरवेल है।"
        : "Individual farmers, groups, cooperatives, water associations holding groundwater water permits under specified areas.",
      linkText: isHi ? "कुसुम सोलर पंजीकरण पोर्टल" : "Kusum Solar Registration",
      portalUrl: "https://pmkusum.mnre.gov.in/",
      steps: isHi
        ? [
            "अपने राज्य के अधिकृत विद्युत वितरण कॉर्पोरेशन (DISCOMs) के कुसुम वेब-लिंक पर आवेदन करें।",
            "अधिकारियों द्वारा बोरवेल अथवा सिंचाई जलकुंड की सुरक्षा और क्षमता की भौतिक स्थल जाँच पूरी कराएं।",
            "3 एचपी से लेकर 7.5 एचपी क्षमता के टिकाऊ सोलर वाटर पंप का सफल संस्थापन संपन्न होगा।"
          ]
        : [
            "Apply through state power distribution corporations (DISCOMs).",
            "Site inspection of open borewell or irrigation tank.",
            "Direct installation of durable 3HP to 7.5HP solar pumpsets."
          ]
    },
    {
      id: "kcc",
      category: "loans",
      name: isHi ? "किसान क्रेडिट कार्ड (KCC) योजना" : "Kisan Credit Card (KCC) Scheme",
      tagline: isHi ? "अल्पकालिक रियायती ऋण" : "Low Interest Seasonal Loans",
      benefit: isHi
        ? "त्वरित अदायगी प्रोत्साहन के पश्चात मात्र 4% रियायती दर पर ₹3 लाख तक की ऋण सीमा। ₹1.6 लाख तक कोलेटरल मुक्त।"
        : "Quick crop loans up to ₹3,00,000 with nominal 4% interest rate (after quick payment incentive credit rebates). No collateral required for loans up to ₹1.6 Lakhs.",
      eligibility: isHi
        ? "समस्त काश्तकार किसान, बटाईदार, पट्टेदार और स्व-सहायता संघ जो सीधे कृषि गतिविधियों से जुड़े हैं।"
        : "Cultivator farmers, sharecroppers, tenant farmers, self-help groups (SHG) associated directly with land tilling.",
      linkText: isHi ? "नजदीकी बैंक में आवेदन करें" : "Apply at Local State Coop",
      portalUrl: "https://www.myscheme.gov.in/schemes/kcc",
      steps: isHi
        ? [
            "अपने नजदीकी राष्ट्रीयकृत या ग्रामीण सहकारी बैंक की शाखा में संपर्क करें।",
            "भूमि राजस्व पहचान पत्र, नियत बुवाई विवरण, आधार कार्ड और खसरा विवरण प्रस्तुत करें।",
            "प्रक्रिया पूर्ण होने के पश्चात 15 दिनों के भीतर सक्रिय किसान क्रेडिट कार्ड प्राप्त करें।"
          ]
        : [
            "Visit nearby nationalized or rural co-operative bank.",
            "Present ownership certificates, crop sowing plans, and Aadhaar.",
            "Get active credit card with integrated passbook within 15 days."
          ]
    },
    {
      id: "soil-health",
      category: "subsidies",
      name: isHi ? "मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)" : "Soil Health Card Scheme",
      tagline: isHi ? "वैज्ञानिक कृषि एवं उर्वरक मार्गदर्शन" : "Informed Fertilizer & Nutrient Management",
      benefit: isHi
        ? "निशुल्क रासायनिक जाँच रिपोर्ट एवं सघन उपचार पैरामीटर। प्रत्येक २ वर्षों में खेत की सूक्ष्म-पोषक तत्वों की डिजिटल जाँच।"
        : "Free laboratory testing reporting on 12 critical chemical parameters to suggest exact optimal N-P-K fertilizer and micronutrient requirements.",
      eligibility: isHi
        ? "भारत के समस्त भूखंड धारक किसान। व्यक्तिगत खेत का वैज्ञानिक नमूना परीक्षण केंद्र स्तर पर किया जाता है।"
        : "All farmers tilling agricultural parcels in India are eligible for cyclic physical testing every 2 years.",
      linkText: isHi ? "मृदा स्वास्थ्य धारक पोर्टल" : "Visit Soil Health Card Portal",
      portalUrl: "https://soilhealth.dac.gov.in/",
      steps: isHi
        ? [
            "स्थानीय ब्लॉक विकास अधिकारी या कृषि पर्यवेक्षक को अपने खेत की मिट्टी के नमूने निःशुल्क सौंपें।",
            "मृदा परीक्षण प्रयोगशाला द्वारा मुख्य पोषक तत्वों (N, P, K) व सूक्ष्म तत्वों का डिजिटल विश्लेषण किया जाएगा।",
            "जनरेट किए गए कार्ड के नुस्खों के अनुसार संतुलित मात्रा में खाद डालें और खेती की लागत बचाएं।"
          ]
        : [
            "Submit ground soil samples to your local block agricultural development officer.",
            "The designated laboratory tests details of modern macronutrients (N, P, K) and pH values.",
            "Download your generated report and implement balanced, cost-effective fertilizer doses."
          ]
    },
    {
      id: "pmksy",
      category: "subsidies",
      name: isHi ? "प्रधानमंत्री कृषि सिंचाई योजना (PMKSY)" : "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
      tagline: isHi ? "प्रति बूंद अधिक फसल - पानी की आधुनिक बचत" : "More Crop Per Drop - Advanced Micro Irrigation",
      benefit: isHi
        ? "ड्रिप (टपक) और स्प्रिंकलर (फव्वारा) सिंचाई यंत्र लगाने पर ५५% (लघु किसानों को) से लेकर ८०% तक भारी सब्सिडी सहायता।"
        : "Drip and sprinkler setups are subsidized up to 55% for small/marginal farmers and up to 45% for other tilling cultivators.",
      eligibility: isHi
        ? "ऐसे समस्त भारतीय सीमांत अथवा बड़े किसान जिनके पास फसल हेतु सुनिश्चित सिंचाई का चालू जल स्रोत उपलब्ध है।"
        : "Cultivators holding functional tube wells, open wells, pond resources, or secure canal irrigation channels.",
      linkText: isHi ? "सूक्ष्म सिंचाई पोर्टल" : "Explore Irrigation Subsidies",
      portalUrl: "https://pmksy.gov.in/",
      steps: isHi
        ? [
            "जिला बागवानी या कृषि विभाग के अंतर्गत नामांकित प्रामाणिक सप्लायर्स से कोटेशन प्राप्त करें।",
            "पीएमकेएसवाई (PMKSY) राज्य के संबंधित ऑनलाइन वेब पोर्टल पर भूमि नक्शा और आधार के साथ पंजीकृत करें।",
            "साइट निरीक्षण के बाद सप्लायर द्वारा टपक सिंचाई लगाई जाएगी और प्रत्यक्ष सब्सिडी सप्लायर को भेजी जाएगी।"
          ]
        : [
            "Procure certified design details and quotes from registered micro-irrigation system dealers.",
            "Apply online through your respective state's agricultural department portal with land maps.",
            "Onsite field inspection is executed and subsidized drip/sprinkler networks are installed."
          ]
    },
    {
      id: "pkvy",
      category: "subsidies",
      name: isHi ? "परम्परागत कृषि विकास योजना (PKVY)" : "Paramparagat Krishi Vikas Yojana (PKVY)",
      tagline: isHi ? "जैविक व रसायन मुक्त पारंपरिक खेती" : "Promoting Organic Agriculture Clusters",
      benefit: isHi
        ? "जैविक खाद व प्रमाणीकरण के लिए प्रति हेक्टेयर ₹50,000 की नकद सहायता (3 वर्षों में किस्तवार) तथा निशुल्क विपणन।"
        : "Provides financial aid of ₹50,000 per hectare over 3 years for organic seeds, vermicompost, and cluster-based certification.",
      eligibility: isHi
        ? "कम से कम 20 या अधिक एकड़ भूमि का सामूहिक क्लस्टर बनाकर जैविक उत्पादन करने के इच्छुक लघु एवं सीमांत किसान।"
        : "Contiguous groups of tilling farmers forming regional organic clusters of minimum 20 acres.",
      linkText: isHi ? "पीजीएस ऑर्गेनिक इंडिया" : "Access Organic Certification Portal",
      portalUrl: "https://pgsindia-ncof.gov.in/",
      steps: isHi
        ? [
            "अपने क्षेत्र के 20-50 किसानों के साथ एक जैविक समूह का गठन करें और ब्लॉक नोडल अधिकारी से संपर्क करें।",
            "घरेलू कम्पोस्ट, हरी खाद, जीवामृत व कीट नियंत्रक सामग्री बनाने के निशुल्क परीक्षण शिविर में भाग लें।",
            "पीजीएस-इंडिया डिजिटल प्लेटफार्म पर अपनी फसल पंजीकृत कराएं और प्रमाणित प्रीमियम मूल्य पर बिक्री करें।"
          ]
        : [
            "Assemble a local collective of 20-50 tilling farmers to apply for organic cluster enrollment.",
            "Undergo free knowledge sessions on vermicomposting, organic pesticide formulations, and bio-fertilizers.",
            "Get verified by PGS India organic control node to sell commodities under special organic labels."
          ]
    },
    {
      id: "smam",
      category: "subsidies",
      name: isHi ? "कृषि यंत्रीकरण उप-मिशन (SMAM)" : "Sub-Mission on Agricultural Mechanization (SMAM)",
      tagline: isHi ? "ट्रैक्टर, रोटावेटर और मशीनरी पर ४०% से ५०% सहायता" : "Subsidies on Modern Farm Machinery",
      benefit: isHi
        ? "आधुनिक कृषि यंत्र खरीदने पर ४०% से ६०% की भारी सब्सिडी। कस्टम हायरिंग केंद्र बनाने हेतु ८०% तक प्रत्यक्ष लोन छूट।"
        : "Up to 40% to 50% flat financial subsidies on tractors, rotavators, power tillers, seeders, and modern harvesters.",
      eligibility: isHi
        ? "भारतीय अधिवास वाले सभी किसान। महिला किसानों तथा लघु/सीमांत (SC/ST) परिवारों को विशेष प्राथमिकता।"
        : "Valid Indian citizens tilling lands. Special preferences for women heads of household and small/marginal tilling groups.",
      linkText: isHi ? "मशीनरी डीलर निर्देशिका" : "Apply on Agrimachinery Portal",
      portalUrl: "https://agrimachinery.nic.in/",
      steps: isHi
        ? [
            "केंद्रीय कृषि मशीनरी पोर्टल पर अपने वैध आधार कार्ड, बैंक खाते की पासबुक और खतौनी के साथ पंजीकरण करें।",
            "अनुमोदित निर्माताओं के कैटलॉग से अपने पसंद के ब्रांडेड कृषि उपकरण व ट्रैक्टर मॉडल का चुनाव करें।",
            "सब्सिडी टोकन नंबर जेनरेट होने के बाद अधिकृत स्थानीय डीलर से सब्सिडी कटौती मूल्य पर मशीन खरीदें।"
          ]
        : [
            "Log in to the central SMAM portal with verified land possession indexes and secure banking accounts.",
            "Select your specified equipment from the official catalog containing approved national brands.",
            "Obtain your subsidized purchase token and buy directly from your nearest authorized machinery dealer."
          ]
    },
    {
      id: "e-nam",
      category: "subsidies",
      name: isHi ? "राष्ट्रीय कृषि डिजिटल बाजार (e-NAM)" : "National Agriculture Market (e-NAM)",
      tagline: isHi ? "एक राष्ट्र, एक डिजिटल मंडी - पारदर्शी व्यापार" : "Unified Electronic Agriculture Mandi",
      benefit: isHi
        ? "खुली पारदर्शी इलेक्ट्रॉनिक नीलामी व्यवस्था, देश के हजार से अधिक व्यापारियों से प्रत्यक्ष संपर्क और २४ घंटे में बैंक भुगतान।"
        : "Eliminates local broker fees, provides real-time digital bids from across India, and direct digital payouts in 24 hours.",
      eligibility: isHi
        ? "सभी भारतीय अनाज उत्पादक, सब्जी उत्पादक व किसान सहकारी संघ (FPOs) जो सीधे कृषि मंडियों से संबद्ध हैं।"
        : "Individual crop growers, traders, and farmer producer organizations associated with registered APMC wholesale mandis.",
      linkText: isHi ? "ई-नाम ट्रेडिंग पोर्टल" : "Register on e-NAM Platform",
      portalUrl: "https://enam.gov.in/",
      steps: isHi
        ? [
            "अपने पास की ई-नाम योजना के अंतर्गत एकीकृत मंडी (APMC) में अपनी कृषि फसल ट्रैक्टर ट्रॉली के साथ लाएं।",
            "मंडी प्रवेश गेट पर निशुल्क गुणवत्ता और नमी का इलेक्ट्रॉनिक परीक्षण (Assaying) पूरा करवाएं।",
            "परीक्षण प्रमाणपत्र के आधार पर फसल को डिजिटल बोर्ड पर लिस्ट करें और ट्रेडर्स की उच्चतम बोली पर फसल बेचें।"
          ]
        : [
            "Take your agricultural harvests into near integrated APMC electronic mandis.",
            "Get quality assaying reports evaluating moisture, shell weights, and grain values at no cost.",
            "Post details onto the digital platform, receive anonymous competitive bids, and authorize the dispatch."
          ]
    },
    {
      id: "pm-kmy",
      category: "insurance",
      name: isHi ? "प्रधानमंत्री किसान मान-धन योजना (PM-KMY)" : "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
      tagline: isHi ? "लघु सीमांत किसानों के लिए ₹3,000 मासिक पेंशन" : "Social Pension Guard for Small Farmers",
      benefit: isHi
        ? "६० वर्ष की सेवानिवृत्ति की आयु पूर्ण करने के बाद किसानों को प्रत्येक महीने ₹3,000 की निश्चित सामाजिक सुरक्षा पेंशन।"
        : "Guaranteed monthly cash pension of ₹3,000 after completing 60 years of age to offer continuous livelihood support.",
      eligibility: isHi
        ? "१८ से ४० वर्ष की आयु के ऐसे लघु व सीमांत किसान जिनके पास कुल कृषि भूमि २ हेक्टेयर (लगभग ५ एकड़) से कम हो।"
        : "Margin/marginal land tilling families between 18 to 40 years of age holding up to 2 hectares (5 acres) cultivable area.",
      linkText: isHi ? "मान-धन पंजीकरण पोर्टल" : "Enroll on Kisan Pension Scheme",
      portalUrl: "https://maandhan.in/",
      steps: isHi
        ? [
            "नजदीकी सीएससी (CSC) या जन सेवा केंद्र में आधार व बैंक बचत खाता संख्या के साथ जाएँ।",
            "प्रवेश की आयु के अनुसार प्रति माह ₹55 से ₹200 का अंशदान करें (केंद्र सरकार भी बराबर का अंशदान जमा करेगी)।",
            "६० वर्ष पूरे होते ही आपके बचत बैंक खाते में प्रत्येक माह स्वत: ₹3,000 पेंशन ट्रांसफर होनी शुरू हो जाएगी।"
          ]
        : [
            "Visit nearest Common Service Centre near your tehsil with your Aadhaar and banking indexes.",
            "Make dynamic monthly contributions (ranges from ₹55 to ₹200 based on age) which is matched 1:1 by government.",
            "Receive automatic direct deposit pension payments post completion of 60 years of age directly."
          ]
    },
    {
      id: "aif",
      category: "loans",
      name: isHi ? "कृषि अवसंरचना कोष (Agriculture Infrastructure Fund)" : "Agriculture Infrastructure Fund (AIF)",
      tagline: isHi ? "वेयरहाउस, कोल्ड-स्टोरेज व फूड प्रोसेसिंग" : "Post-Harvest Infra Low Cost Loans",
      benefit: isHi
        ? "₹2 करोड़ तक के बुनियादी ढांचा ऋणों पर निरंतर 3% वार्षिक ब्याज छूट और CGTMSE के तहत कोलेटरल-मुक्त गारंटी सुरक्षा।"
        : "3% interest subvention and CGTMSE third-party collateral guarantee support for agricultural loans up to ₹2 Crores.",
      eligibility: isHi
        ? "व्यक्तिगत प्रगतिशील किसान, कृषि उद्यमी, सहकारी समितियां, FPOs और कृषि स्टार्टअप्स जो कोल्ड चेन निर्माण में संलग्न हैं।"
        : "Individual growers, cooperatives, agri-business entities, and recognized ag-tech startups establishing cold chains/storages.",
      linkText: isHi ? "एआईएफ ऋण सहायता लिंक" : "Apply on Agri Infrastructure Portal",
      portalUrl: "https://agriinfra.dac.gov.in/",
      steps: isHi
        ? [
            "कोल्ड स्टोरेज, अनाज सुखाने की असेंबली या पैकेजिंग प्लांट स्थापित करने की तकनीकी रिपोर्ट (DPR) तैयार करें।",
            "एआईएफ के केंद्रीय ऑनलाइन पोर्टल पर अपनी डीपीआर, खसरा और फार्म की डिजिटल मैपिंग दस्तावेज अपलोड करें।",
            "केंद्रीय अनुमोदन समिति की मंजूरी मिलने पर राष्ट्रीयकृत बैंक रियायती दर पर ऋण वितरित करेगा।"
          ]
        : [
            "Prepare a Detailed Project structure Report (DPR) layout regarding planned warehouse or food grader line.",
            "Submit the proposal files directly onto the central AIF portal to receive preliminary approval numbers.",
            "The associated partner bank processes the files and dispenses credit under direct 3% discount subvention."
          ]
    }
  ];

  const handleEligibilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibilityCheck.landHold) {
      alert(isHi ? "कृपया अपना कुल कृषि क्षेत्र प्रदान करें।" : "Please provide your total landholding area.");
      return;
    }

    const acres = parseFloat(eligibilityCheck.landHold);
    let schemesMatched: string[] = [];

    if (acres > 0 && eligibilityCheck.incomeTaxPayer === "no") {
      schemesMatched.push(isHi ? "पीएम-किसान सम्मान निधि योजना (प्रति वर्ष ₹6,000 प्रत्यक्ष नकद)" : "PM-Kisan Samman Nidhi Yojana (₹6,000/yr Cash Support)");
    }
    if (acres > 0) {
      schemesMatched.push(isHi ? "मृदा स्वास्थ्य कार्ड योजना (मृदा उर्वरता प्रयोगशाला रिपोर्ट)" : "Soil Health Card Scheme (Free laboratory diagnostic test)");
      schemesMatched.push(isHi ? "राष्ट्रीय कृषि डिजिटल बाजार - e-NAM (असीमित अखिल भारतीय ऑनलाइन नीलामी मंडी)" : "National Agriculture Market - e-NAM (Sell produce in digital auction)");
      schemesMatched.push(isHi ? "प्रधानमंत्री फसल बीमा योजना (PMFBY प्राकृतिक नुकसान सुरक्षा)" : "Pradhan Mantri Fasal Bima Yojana (Unforeseen Crop insurance cover)");
      schemesMatched.push(isHi ? "किसान क्रेडिट कार्ड (KCC - अत्यंत ब्याज रियायती अल्पकालिक मौसमी ऋण @ 4%)" : "Kisan Credit Card (KCC - Soft crop loan credit limit)");
      schemesMatched.push(isHi ? "पीएम कृषि सिंचाई योजना - PMKSY (टपक/ड्रिप सिंचाई प्रणालियों हेतु ७५% तक प्रत्यक्ष सब्सिडी)" : "Pradhan Mantri Krishi Sinchayee Yojana (Up to 75% micro-irrigation systems aid)");
    }
    if (acres <= 5 && eligibilityCheck.incomeTaxPayer === "no") {
      schemesMatched.push(isHi ? "प्रधानमंत्री किसान मान-धन योजना (६० की उम्र के पश्चात ₹3,000 मासिक वृद्ध पेंशन)" : "PM-KMY Pension Scheme (₹3,000 fixed monthly retirement pension)");
    }
    if (acres >= 1 && acres <= 10) {
      schemesMatched.push(isHi ? "पीएम-कुसुम सौर ऊर्जा पानी पंप योजना (६०% सौर नलकूप सब्सिडी स्वीकृत)" : "PM-Kusum Solar Water Pump (60% Direct subsidy approved)");
      schemesMatched.push(isHi ? "परम्परागत कृषि विकास योजना - PKVY (जैविक कलस्टर विकास सब्सिडी ₹50k/हेक्टेयर स्वीकृत)" : "Paramparagat Krishi Vikas Yojana (₹50k/Hectare organic cluster aid)");
    }
    if (acres >= 1.5) {
      schemesMatched.push(isHi ? "कृषि यंत्रीकरण उप-मिशन (SMAM - ट्रैक्टर व आधुनिक रोटावेटर खरीद हेतु ५०% तक प्रत्यक्ष ट्रैक्टर सब्सिडी)" : "Sub-Mission on Agricultural Mechanization (50% farm tractor/equipment subsidy support)");
    }
    if (acres >= 2.0) {
      schemesMatched.push(isHi ? "कृषि अवसंरचना कोष - AIF (कोल्ड स्टोरेज, सुखाने की मशीनरी/वेयरहाउस स्थापित करने पर 3% ब्याज छूट)" : "Agriculture Infrastructure Fund (3% interest subvention for warehouses/cold storage loans)");
    }

    const stateLabel = STATES.find(s => s.en === eligibilityCheck.state)?.label || eligibilityCheck.state;

    setCheckingResult({
      status: "Calculated",
      title: isHi ? "सरकारी योजना योग्यता रिपोर्ट" : "Scheme Match Report",
      matches: schemesMatched,
      explanation: eligibilityCheck.incomeTaxPayer === "yes" 
        ? (isHi 
            ? `आप आयकर भुगतानकर्ता हैं, इसलिए कुछ सीधे नकद वितरण प्रतिबंधित हैं। तथापि, फसल बीमा (PMFBY), यंत्र सब्सिडी (SMAM), कृषि सिंचाई (PMKSY) और सहकारी ऋण योजनाएं आपके लिए पूर्णतः खुली हुई हैं।`
            : "Since you pay income tax, direct cash handouts are restricted. However, crop insurance (PMFBY), micro-irrigation (PMKSY), farm machinery subsidies (SMAM) and low-interest crop loans are fully accessible.")
        : (isHi
            ? `उत्कृष्ट पैरामीटर! आप राज्य (${stateLabel}) और कृषि भूमि धारण ${acres} एकड़ के अंतर्गत अनुशंसित समस्त लाभकारी योजनाओं के प्रत्यक्ष लाभ प्राप्त करने के सर्वोत्तम हकदार हैं।`
            : `Excellent parameters! With ${acres} acres within the state of ${stateLabel}, you obtain maximum eligibility across our recommended agricultural initiatives.`)
    });
  };

  const filteredSchemes = activeTab === "all" ? SCHEMES_LIST : SCHEMES_LIST.filter(s => s.category === activeTab);

  const t = {
    title: isHi ? "सरकारी योजनाएं और सब्सिडी" : "Government Schemes & Subsidies",
    desc: isHi ? "प्रत्यक्ष ऑनलाइन लिंक, अनुशंसित लाभ सूची और कृषि पहलों की चरण-दर-चरण आवेदन विधि की जानकारी प्राप्त करें।" : "Access direct links, benefit information, and learn step-by-step application instructions for central agricultural initiatives.",
    tabAll: isHi ? "सभी योजनएं" : "All Schemes",
    tabSubsidies: isHi ? "सब्सिडी (Subsidies)" : "Subsidies",
    tabInsurance: isHi ? "बीमा सुरक्षा (Insurance)" : "Insurance",
    tabLoans: isHi ? "ऋण योजना (Loans)" : "Loans",
    eligTitle: isHi ? "योजना पात्रता की जाँच करें" : "Eligibility Check",
    eligSub: isHi ? "सेकंडों में अपनी सरकारी योजनाओं की पात्रता देखें" : "Test state matching in seconds",
    landLabel: isHi ? "कृषि भूमि क्षेत्र (एकड़)" : "Cultivable Land Area (Acres)",
    stateLabel: isHi ? "राज्य चुनें" : "State of Residence",
    taxLabel: isHi ? "क्या आप आयकर भुगतानकर्ता हैं?" : "Do you pay Income Tax?",
    yesLabel: isHi ? "हाँ" : "Yes",
    noLabel: isHi ? "नहीं" : "No",
    checkBtn: isHi ? "पात्रता एवं योजनाएं खोजें" : "Check Instant Match",
    benefitsTitle: isHi ? "🎁 प्रत्यक्ष लाभ विवरण:" : "🎁 Direct Benefits:",
    stepsTitle: isHi ? "📝 आवेदन भरने की विधि:" : "📝 Application Steps:"
  };

  return (
    <div id="gov-schemes" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Landmark className="text-emerald-700 dark:text-emerald-400 w-6 h-6 animate-pulse" /> {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t.desc}
          </p>
        </div>

        {/* Categories Tab selector */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit shrink-0">
          {(["all", "subsidies", "insurance", "loans"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all capitalize cursor-pointer ${
                activeTab === cat 
                  ? "bg-white dark:bg-slate-955 text-emerald-805 dark:text-emerald-400 shadow-sm font-bold" 
                  : "text-slate-650 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              {cat === "all" ? t.tabAll : cat === "subsidies" ? t.tabSubsidies : cat === "insurance" ? t.tabInsurance : t.tabLoans}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Schemes List */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-slate-50 hover:bg-white dark:bg-slate-900/10 dark:hover:bg-slate-900/15 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/85 hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30 px-2.5 py-0.5 rounded-full">
                      {scheme.category === "subsidies" ? (isHi ? "💰 सब्सिडी" : "💰 Subsidy") : scheme.category === "insurance" ? (isHi ? "🛡️ बीमा सुरक्षा" : "🛡️ Insurance") : (isHi ? "🏦 कृषि ऋण" : "🏦 Credit Loan")}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{scheme.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{scheme.tagline}</p>

                  <div className="bg-slate-50 relative dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 mt-3 text-xs leading-relaxed text-slate-705 dark:text-slate-300">
                    <span className="block font-bold text-slate-808 dark:text-slate-200 mb-1">{t.benefitsTitle}</span>
                    {scheme.benefit}
                  </div>

                  {/* Operational details */}
                  <div className="mt-3.5 text-xs">
                    <span className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">{t.stepsTitle}</span>
                    <ul className="flex flex-col gap-1.5 text-slate-600 dark:text-slate-450 font-semibold leading-relaxed">
                      {scheme.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-[10px] bg-sky-50 dark:bg-sky-950/45 text-sky-700 dark:text-sky-450 w-4.5 h-4.5 rounded-full shrink-0 flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <span className="text-[11px] leading-normal">{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-1">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1 w-full justify-end group cursor-pointer"
                  >
                    <span>{scheme.linkText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic eligibility validator */}
        <div className="lg:col-span-4 bg-emerald-50/30 dark:bg-slate-900/10 border border-emerald-110/60 dark:border-slate-800/60 p-5 rounded-3xl flex flex-col justify-between self-start gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-emerald-100/80 dark:border-slate-800 pb-3">
              <Landmark className="text-emerald-700 dark:text-emerald-400 w-5 h-5 shrink-0 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-400 uppercase tracking-wide leading-none">{t.eligTitle}</h3>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-555 mt-0.5">{t.eligSub}</p>
              </div>
            </div>

            <form onSubmit={handleEligibilitySubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block mb-1.5">{t.landLabel}</label>
                <input
                  type="number"
                  placeholder="e.g. 2.5"
                  step="0.1"
                  value={eligibilityCheck.landHold}
                  onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, landHold: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-emerald-600 focus:ring-0 placeholder-slate-400 shadow-3xs"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block mb-1.5">{t.stateLabel}</label>
                <select
                  value={eligibilityCheck.state}
                  onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, state: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-205 dark:border-slate-800 rounded-xl px-3 py-2.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:outline-emerald-600 focus:ring-0 shadow-3xs cursor-pointer"
                >
                  {STATES.map((stat) => (
                    <option key={stat.en} value={stat.en} className="text-slate-900">{stat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 block mb-1.5">{t.taxLabel}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-650 dark:text-slate-300">
                    <input
                      type="radio"
                      name="taxpayer"
                      checked={eligibilityCheck.incomeTaxPayer === "yes"}
                      onChange={() => setEligibilityCheck({ ...eligibilityCheck, incomeTaxPayer: "yes" })}
                      className="accent-emerald-700 dark:accent-emerald-450 cursor-pointer"
                    />
                    <span>{t.yesLabel}</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-655 dark:text-slate-300">
                    <input
                      type="radio"
                      name="taxpayer"
                      checked={eligibilityCheck.incomeTaxPayer === "no"}
                      onChange={() => setEligibilityCheck({ ...eligibilityCheck, incomeTaxPayer: "no" })}
                      className="accent-emerald-700 dark:accent-emerald-450 cursor-pointer"
                    />
                    <span>{t.noLabel}</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Search className="w-4 h-4" /> {t.checkBtn}
              </button>
            </form>
          </div>

          {/* Matches Result output */}
          {checkingResult && (
            <div className="bg-white dark:bg-slate-950 border border-emerald-100 dark:border-emerald-900 p-4 rounded-2xl flex flex-col gap-2.5 shadow-2xs mt-4 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-400">{checkingResult.title}</h4>
              </div>
              <ul className="flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                {checkingResult.matches.map((sch: string, idx: number) => (
                  <li key={idx} className="flex gap-1">
                    <span className="text-emerald-700 dark:text-emerald-450 shrink-0">✔</span>
                    <span>{sch}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 italic border-t pt-2 border-slate-100 dark:border-slate-800">
                {checkingResult.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
