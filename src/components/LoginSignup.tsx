import React, { useState, useEffect, useRef } from "react";
import {
  User,
  ShieldCheck,
  MapPin,
  Lock,
  Calendar,
  Trash2,
  CheckCircle2,
  UserCheck,
  Phone,
  Droplet,
  Activity,
  Edit3,
  Save,
  Upload,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Wheat,
  Info,
  CalendarDays,
  Flame,
  Sprout,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  deleteUser,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

interface SeedHistoryItem {
  id: string;
  crop: string;
  season: string;
  yieldReport: string;
  sowingDate: string;
  isAboveAverage: boolean;
}

interface LoginSignupProps {
  lang?: "en" | "hi";
  selectedState?: string;
  setSelectedState?: (state: string) => void;
  selectedCrop?: string;
  setSelectedCrop?: (crop: string) => void;
  setActiveTab?: (
    tab:
      | "dashboard"
      | "scanner"
      | "calendar"
      | "general_calendar"
      | "advisor"
      | "mandi"
      | "schemes"
      | "voice"
      | "chat"
      | "soil"
      | "profile"
  ) => void;
}

const T_PROFILE = {
  en: {
    title: "Farmer Profile & Identity Hub",
    subtitle: "Establish authentic user records, local land sizes, and manage security-locked soil parameters connected with Firebase Auth.",
    login: "Login in to Cabinet",
    signup: "Register e-Kisan Profile",
    enterDetails: "Farmer Personal Details",
    email: "Email Address",
    phone: "Mobile Number",
    village: "Village Name",
    district: "District Name",
    state: "State Territory",
    saveSuccess: "Farmer profile records synchronized successfully!",
    logOut: "Sign Out",
    deleteAccount: "Delete Profile & Account",
    kccLimitTitle: "Digital KCC Estimate",
    kccScale: "(Calculated on scale of ₹45,000/acre)",
    digitalKcc: "E-Kisan Smart Credit",
    issuedBy: "GOVERNMENT OF BHARAT • SECURE KCC",
    securedBadge: "Firebase Verified User",
    verificationSent: "Email verification link successfully sent to your mailbox!",
    resetSent: "Password reset instructions dispatched to your mailbox!",
    personalDetails: "Farmer Personal Details",
    farmDetails: "Farm & Land Profiler",
    soilValues: "Soil Lab Metrics",
    landSize: "Land Size (in Acres)",
    landType: "Soil Texture Type",
    waterSource: "Irrigation Infrastructure",
    seasonType: "Primary Sowing Season",
    activeCrop: "Active Crop Preference",
    registeredLogs: "Historic Sowing Registry",
    noHistory: "No crop history logs registered yet. Sowing logs can help analyze farm trends.",
    cropName: "Crop Variety Name",
    seasonLabel: "Crop Sowing Season",
    yieldLabel: "Yield (per Acre)",
    logBtn: "Register Harvest Record",
    soilNitrogen: "Nitrogen Level (N)",
    soilPhosphorus: "Phosphorus Level (P)",
    soilPotassium: "Potassium Level (K)",
    soilPh: "Measured Soil pH",
  },
  hi: {
    title: "किसान प्रोफाइल और पहचान केंद्र",
    subtitle: "फायरबेस क्लाउड प्रमाणीकरण के साथ वास्तविक उपयोगकर्ता विवरण, भूमि विन्यास और मिट्टी गुणवत्ता स्तर प्रबंधित करें।",
    login: "कैबिनेट में लॉगिन करें",
    signup: "ई-किसान खाता बनाएं",
    enterDetails: "कृषक व्यक्तिगत विवरण दर्ज करें",
    email: "ईमेल पता",
    phone: "मोबाइल नंबर",
    village: "ग्राम स्तर का नाम",
    district: "जिले का नाम",
    state: "राज्य का नाम",
    saveSuccess: "किसान प्रोफाइल रिकॉर्ड क्लाउड पर सुरक्षित सिंक हो गया है!",
    logOut: "बाहर निकलें",
    deleteAccount: "खाता और प्रोफाइल हटाएं",
    kccLimitTitle: "डिजिटल ऋण सीमा",
    kccScale: "(₹45,000 प्रति एकड़ बुवाई पर अनुमानित)",
    digitalKcc: "ई-किसान डिजिटल कार्ड",
    issuedBy: "भारत सरकार • डिजिटल केसीसी",
    securedBadge: "प्रमाणित किसान पहचान",
    verificationSent: "ईमेल पुष्टिकरण लिंक आपके इनबॉक्स में भेज दिया गया है!",
    resetSent: "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है!",
    personalDetails: "कृषक व्यक्तिगत विवरण",
    farmDetails: "खेत एवं भूमि प्रोफाइलर",
    soilValues: "मृदा प्रयोगशाला पैरामीटर",
    landSize: "भूमि का आकार (एकड़ में)",
    landType: "मिट्टी की बनावट",
    waterSource: "सिंचाई बुनियादी ढांचा",
    seasonType: "मुख्य बुवाई का मौसम",
    activeCrop: "पसंदीदा सक्रिय फसल",
    registeredLogs: "फसल इतिहास सूची",
    noHistory: "अभी तक कोई फसल इतिहास लॉग नहीं है। फसल इतिहास विवरण दर्ज करें।",
    cropName: "फसल किस्म का नाम",
    seasonLabel: "फसल बुवाई का मौसम",
    yieldLabel: "पैदावार (प्रति एकड़)",
    logBtn: "फसल इतिहास दर्ज करें",
    soilNitrogen: "नाइट्रोजन स्तर (N)",
    soilPhosphorus: "फास्फोरस स्तर (P)",
    soilPotassium: "पोटेशियम स्तर (K)",
    soilPh: "मापा गया मिट्टी का pH",
  },
};

const SOIL_TYPES = [
  "Alluvial Soil (जलोढ़ मिट्टी)",
  "Black / Regur Soil (काली मिट्टी)",
  "Clayey Soil (चिकनी मिट्टी)",
  "Sandy Loam (बलुई दोमट)",
  "Red & Yellow Soil (लाल और पीली मिट्टी)",
  "Laterite Soil (लेटराइट मिट्टी)",
];

const IRRIGATION_TYPES = [
  "Canal Supply (नहर सिंचाई)",
  "Deep Tube Well Pump (नलकूप सिंचाई)",
  "Solar Contact Drip Setup (सोलर टपक सिंचाई)",
  "Rain-fed Traditional (वर्षा आधारित खेती)",
];

export default function LoginSignup({
  lang = "en",
  selectedState = "Uttar Pradesh",
  setSelectedState,
  selectedCrop = "Wheat (Gehun)",
  setSelectedCrop,
  setActiveTab,
}: LoginSignupProps) {
  const t = T_PROFILE[lang];
  const isHi = lang === "hi";

  // Authentication states
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "google">("google");
  const [emailTab, setEmailTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form input variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Registration profile wizard states
  const [isRegisteringProfile, setIsRegisteringProfile] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regState, setRegState] = useState(selectedState);
  const [regDistrict, setRegDistrict] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [regPhoto, setRegPhoto] = useState("");

  const [landSize, setLandSize] = useState("4.5");
  const [soilType, setSoilType] = useState("Sandy Loam (बलुई दोमट)");
  const [irrigationType, setIrrigationType] = useState("Deep Tube Well Pump (नलकूप सिंचाई)");
  const [season, setSeason] = useState("Rabi (Winter)");
  const [soilN, setSoilN] = useState("Medium");
  const [soilP, setSoilP] = useState("Medium");
  const [soilK, setSoilK] = useState("High");
  const [soilPh, setSoilPh] = useState("6.8");

  // Local state representing synchronized client profile
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sowing history stored locally inside localstorage
  const [history, setHistory] = useState<SeedHistoryItem[]>(() => {
    const backup = localStorage.getItem("kisan_crop_history");
    return backup ? JSON.parse(backup) : [];
  });

  // OTP helper countdown timer
  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Sowing logs feedback banner state
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [opsLoading, setOpsLoading] = useState(false);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Authenticated! Check if profile data exists in Firestore database
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setRegState(data.state);
            setRegDistrict(data.district);
            setRegVillage(data.village);
            setRegPhoto(data.profilePhoto || "");
            setIsRegisteringProfile(false);
            
            // Auto sync outer application values
            if (setSelectedState) setSelectedState(data.state);
          } else {
            // Profile is missing. Prompt registration wizard
            setRegName(currentUser.displayName || "");
            setRegEmail(currentUser.email || "");
            setRegPhone(currentUser.phoneNumber || "");
            setIsRegisteringProfile(true);
          }
        } catch (err) {
          console.error("Error fetching Firestore record:", err);
          // Fallback to offline registration wizard
          setIsRegisteringProfile(true);
        }
      } else {
        setProfile(null);
        setIsRegisteringProfile(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setSelectedState]);

  // Synchronize history logs changes locally
  useEffect(() => {
    localStorage.setItem("kisan_crop_history", JSON.stringify(history));
  }, [history]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setOpsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setToastMsg(isHi ? "गूगल लॉगिन सफल!" : "Google log in successful!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Google sign in failure:", err);
      setErrorMsg(err.message || "Failed to sign in with Google.");
    } finally {
      setOpsLoading(false);
    }
  };

  // Handle Log Out
  const handleLogOut = async () => {
    setErrorMsg("");
    setOpsLoading(true);
    try {
      await signOut(auth);
      setProfile(null);
      setIsRegisteringProfile(false);
      setToastMsg(isHi ? "सफलतापूर्वक लॉग आउट किया गया!" : "Signed out successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log out.");
    } finally {
      setOpsLoading(false);
    }
  };

  // Handle Delete Profile & Firebase account
  const handleDeleteSelf = async () => {
    const confirmText = isHi
      ? "क्या आप निश्चित रूप से अपना किसान डेटा और खाता मिटाना चाहते हैं? यह प्रक्रिया वापस नहीं ली जा सकती।"
      : "Are you sure you want to permanently delete your farmer profile and account? This action is irreversible.";
    if (!window.confirm(confirmText)) return;

    setErrorMsg("");
    setOpsLoading(true);
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const uid = currentUser.uid;
      // 1. Delete Firestore profile document
      try {
        await deleteDoc(doc(db, "users", uid));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
      }

      // 2. Delete Auth Account
      await currentUser.delete();
      setProfile(null);
      setIsRegisteringProfile(false);
      setToastMsg(isHi ? "खाता और डेटा स्थायी रूप से हटा दिया गया!" : "Account and records successfully wiped!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error deleting profile:", err);
      setErrorMsg(
        isHi
          ? "सुरक्षा कारणों से, कृपया पुनः लॉगिन करें और खाता तुरंत हटाने का प्रयास करें।"
          : "For security, please log out, log back in, and try deleting your account immediately."
      );
    } finally {
      setOpsLoading(false);
    }
  };

  // Handle Email Registration and login
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOpsLoading(true);

    try {
      if (emailTab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        setToastMsg(isHi ? "लॉगिन सफल!" : "Sign in successful!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Register standard email account
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Dispatch email verification strictly (Pillar requirement)
        await sendEmailVerification(userCred.user);
        setToastMsg(t.verificationSent);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (err: any) {
      console.error("Email auth error:", err);
      setErrorMsg(err.message || "Authentication error.");
    } finally {
      setOpsLoading(false);
    }
  };

  // Handle Email Password Reset Trigger
  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMsg(isHi ? "कृपया रीसेट लिंक भेजने के लिए ईमेल पता दर्ज करें।" : "Please enter your email to receive password reset link.");
      return;
    }
    setErrorMsg("");
    setOpsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setToastMsg(t.resetSent);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset email.");
    } finally {
      setOpsLoading(false);
    }
  };

  // Setup Hidden Recaptcha and send phone authentication OTP code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setOpsLoading(true);

    try {
      // Clear recaptcha container first
      const container = document.getElementById("recaptcha-container");
      if (container) container.innerHTML = "";

      const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      setCountdown(60);
      setToastMsg(isHi ? "ओटीपी सफलतापूर्वक भेजा गया!" : "OTP dispatch SMS sent successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("SMS dispatch failure:", err);
      if (err.code === "auth/operation-not-allowed" || (err.message && err.message.includes("operation-not-allowed"))) {
        const customMsg = isHi
          ? "फ़ायरबेस प्रोजेक्ट में फ़ोन प्रमाणीकरण (Phone Authentication) सक्षम नहीं है।\n\nइसे सक्षम करने के लिए:\n1. फ़ायरबेस कंसोल (Firebase Console) पर जाएं।\n2. 'Authentication' > 'Sign-in method' पर जाएं।\n3. 'Add new provider' पर क्लिक करें और 'Phone' प्रमाणीकरण चालू (Enable) करें।"
          : "Phone Authentication is not enabled in your Firebase project.\n\nTo enable it:\n1. Go to your Firebase Console.\n2. In the left sidebar, click 'Authentication' > 'Sign-in method'.\n3. Click 'Add new provider' and enable 'Phone' login.";
        setErrorMsg(customMsg);
      } else {
        setErrorMsg(err.message || "Failed to deliver SMS OTP. Ensure number is fully formatted with country code (e.g., +919876543210).");
      }
    } finally {
      setOpsLoading(false);
    }
  };

  // Verify numerical SMS OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !otpCode) return;

    setErrorMsg("");
    setOpsLoading(true);
    try {
      await confirmationResult.confirm(otpCode);
      setToastMsg(isHi ? "ओटीपी प्रमाणित!" : "OTP Code Verified!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("OTP Code mismatch:", err);
      setErrorMsg(isHi ? "गलत ओटीपी। कृपया पुन: प्रयास करें।" : "Incorrect verification code. Please request another SMS code.");
    } finally {
      setOpsLoading(false);
    }
  };

  // Handle saving completed profile to Firebase Firestore database
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setErrorMsg("");
    setOpsLoading(true);

    const targetUid = currentUser.uid;
    const documentData = {
      uid: targetUid,
      name: regName || currentUser.displayName || "Unknown Farmer",
      email: regEmail || currentUser.email || "",
      mobileNumber: regPhone || currentUser.phoneNumber || "",
      profilePhoto: regPhoto || "",
      state: regState,
      district: regDistrict || "Regional Land",
      village: regVillage || "Rural Center",
      registrationDate: profile?.registrationDate || new Date().toISOString(),
      createdAt: profile?.createdAt || serverTimestamp(), // Fallback if local timestamp check
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = doc(db, "users", targetUid);
      
      // We will perform atomic setDoc (using standard format adhering 100% to firestore rules timestamp keys)
      // Note: we must use serverTimestamp() to conform with our validation schema format in firestore.rules
      await setDoc(docRef, {
        ...documentData,
        createdAt: profile?.createdAt ? profile.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Refetch the document to sync server-resolved Timestamp objects to React state
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile(documentData);
      }

      setIsRegisteringProfile(false);
      setIsEditing(false);

      if (setSelectedState) setSelectedState(regState);

      setToastMsg(isHi ? "प्रोफ़ाइल सफलतापूर्वक सहेज ली गई है!" : "Farmer Sowing passport synchronized successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      console.error("Error updating Firestore User profile:", err);
      try {
        handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}`);
      } catch (formattedErr: any) {
        setErrorMsg(formattedErr.message || "Failed to commit Firestore changes.");
      }
    } finally {
      setOpsLoading(false);
    }
  };

  // Sowing log management callbacks
  const handleAddHistory = (e: React.FormEvent) => {
    e.preventDefault();
    const cropInput = (e.currentTarget.elements.namedItem("cropInput") as HTMLInputElement)?.value;
    const seasonInput = (e.currentTarget.elements.namedItem("seasonInput") as HTMLSelectElement)?.value;
    const yieldInput = (e.currentTarget.elements.namedItem("yieldInput") as HTMLInputElement)?.value;

    if (!cropInput) return;

    const newItem: SeedHistoryItem = {
      id: Date.now().toString(),
      crop: cropInput,
      season: seasonInput,
      yieldReport: yieldInput ? `${yieldInput} Tons / Acre` : "Under active cult.",
      sowingDate: new Date().toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      isAboveAverage: true,
    };

    setHistory((prev) => [newItem, ...prev]);
    // Clear inputs
    (e.currentTarget.elements.namedItem("cropInput") as HTMLInputElement).value = "";
    (e.currentTarget.elements.namedItem("yieldInput") as HTMLInputElement).value = "";
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  // Base64 Image upload local parser
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        alert(isHi ? "कृपया 1MB से छोटी फ़ाइल चुनें।" : "Please select an image file smaller than 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic KCC Smart Limit Estimator calculator
  const calcKccLimit = () => {
    const area = parseFloat(landSize) || 0;
    const amount = Math.round(area * 45000);
    return new Intl.NumberFormat(isHi ? "en-IN" : "en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900/40 rounded-3xl min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-400 font-mono">
          {isHi ? "फायरबेस सुरक्षा प्रणाली लोड हो रही है..." : "Synchronizing Firebase secure credentials..."}
        </p>
      </div>
    );
  }

  if (user && !profile && !isRegisteringProfile) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900/40 rounded-3xl min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-slate-400 font-mono">
          {isHi ? "सुरक्षित डेटाबेस से किसान क्रेडेंशियल प्राप्त किए जा रहे हैं..." : "Retrieving farmer credentials from secure database..."}
        </p>
      </div>
    );
  }

  return (
    <div
      id="login-signup-profile"
      className="bg-white dark:bg-slate-900/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 relative"
    >
      <div id="recaptcha-container"></div>

      {/* Synchronized Feedback Alerts */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <User className="text-emerald-700 dark:text-emerald-400 w-6 h-6 shrink-0" /> {t.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            {t.subtitle}
          </p>
        </div>

        {/* Sync Status Banner */}
        <AnimatePresence>
          {(showToast || errorMsg) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold shadow-md ${
                errorMsg ? "bg-red-550 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              {errorMsg ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span className="whitespace-pre-line text-left leading-normal">{errorMsg || toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LOGGED OUT VIEW - PROVIDE OUTSTANDING SECURED AUTH options */}
      {!user ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto py-6 w-full">
          {/* Creative Branding Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-950 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[380px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <span className="text-[10px] uppercase bg-emerald-500/20 text-emerald-300 font-black tracking-widest px-2.5 py-1 rounded-md border border-emerald-500/30 font-mono">
                Kisan AI Dost Secure Cloud
              </span>
              <h3 className="text-2xl font-black mt-4 tracking-tight leading-snug">
                Personalize Your Connected Agro Workspace
              </h3>
              <p className="text-xs text-emerald-100/85 mt-3 leading-relaxed">
                Connect your real account using Firebase Authentication. Unlock automated weather overlays, persistent digital soil metrics, sowed crop histories, and digital KCC certificate generation.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-emerald-950/50 p-4 rounded-2xl border border-emerald-700/40 mt-4 z-10">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-[10px] font-semibold text-emerald-100/90 leading-normal">
                Credentials are encrypted and secured. Personal locations, farm yields, and historic registers are strictly access-controlled to your own authenticated profile.
              </span>
            </div>
          </div>

          {/* Authentication Manager Terminal */}
          <div className="flex flex-col gap-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-4 text-center py-4 justify-center items-center">
              <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400 font-bold border-b dark:border-slate-800 pb-2 w-full">
                One-Click Secure Google OAuth
              </span>
              <p className="text-xs text-slate-500 leading-normal max-w-sm">
                Sign in instantly. Your email verification is passed automatically, pre-populating your e-Kisan dashboard profile setup parameters.
              </p>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={opsLoading}
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-black text-xs py-3.5 rounded-xl transition shadow-3xs cursor-pointer active:scale-98"
              >
                <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Authenticate with Google account</span>
              </button>
            </div>
          </div>
        </div>
      ) : isRegisteringProfile ? (
        /* WIZARD VIEW - FORCE TO FILL COMPLETE SPAN PROFILE REGISTRATION FORM */
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto py-4 w-full">
          <div className="bg-emerald-50/20 dark:bg-emerald-950/10 p-5 rounded-2.5xl border border-emerald-500/20">
            <h3 className="text-sm font-black text-slate-800 dark:text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
              {isHi ? "बस एक और कदम: अपनी प्रोफाइल पूरी करें" : "One final step: Setup Your Sowing Coordinates"}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We detected you have signed in using your cloud coordinates. Please provide your localized regional parameters and district centers to complete registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2.5">
            {/* Left section: Personal Info details */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-widest border-b pb-1 dark:border-slate-800">
                {t.personalDetails}
              </h4>

              {/* Avatar Selector or upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {regPhoto ? (
                    <img
                      src={regPhoto}
                      alt="uploaded view"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-3xl border border-slate-200 dark:border-slate-800">
                      🌾
                    </div>
                  )}

                  {regPhoto && (
                    <button
                      type="button"
                      onClick={() => setRegPhoto("")}
                      className="absolute -top-1.5 -right-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 shadow transition-transform cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Upload Farmer Photo (under 1MB)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="passport-photo-file"
                    />
                    <label
                      htmlFor="passport-photo-file"
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold hover:bg-slate-200 hover:text-slate-950 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" /> File Upload
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Full Farmer Name *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.email} (ReadOnly via Auth)</label>
                <input
                  type="email"
                  value={regEmail}
                  readOnly
                  placeholder="No email tied"
                  className="w-full text-xs font-semibold p-3 border border-slate-150 bg-slate-100/55 dark:bg-slate-900/40 text-slate-450 dark:border-slate-850 rounded-xl cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.phone} *</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  required
                />
              </div>
            </div>

            {/* Right section: Land and Location coordinates */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-widest border-b pb-1 dark:border-slate-800">
                {t.farmDetails}
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.state} *</label>
                  <input
                    type="text"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    placeholder="e.g. Uttar Pradesh"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.district} *</label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Lucknow"
                    className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.village} *</label>
                <input
                  type="text"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  placeholder="e.g. Malihabad"
                  className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.landSize}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.landType}</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                  >
                    {SOIL_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-end border-t dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={handleLogOut}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 font-bold text-xs rounded-xl"
            >
              Sign Out Account
            </button>
            <button
              type="submit"
              disabled={opsLoading}
              className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl"
            >
              {opsLoading ? "Saving Sowing Passport..." : "Confirm & Setup e-Kisan Profile"}
            </button>
          </div>
        </form>
      ) : (
        /* LOGGED IN CABINET PANEL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {isEditing ? (
              /* ACTIVE PROFILE EDITOR VIEW */
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-6 w-full">
                <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-2.5xl p-5 border border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-mono font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      {t.personalDetails}
                    </h3>

                    <div className="flex items-center gap-4">
                      {regPhoto ? (
                        <div className="relative">
                          <img
                            src={regPhoto}
                            alt="avatar uploaded"
                            referrerPolicy="no-referrer"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setRegPhoto("")}
                            className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-3xl border border-slate-205 dark:border-slate-800">
                          🌾
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] font-bold text-slate-450 block mb-1">Replace Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="passport-photo-edit-file"
                        />
                        <label
                          htmlFor="passport-photo-edit-file"
                          className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-200 hover:text-white rounded-xl cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" /> Select File
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Farmer Full Name *</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.phone} *</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h3 className="text-xs font-mono font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                      {t.farmDetails}
                    </h3>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.state} *</label>
                        <input
                          type="text"
                          value={regState}
                          onChange={(e) => setRegState(e.target.value)}
                          className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.district} *</label>
                        <input
                          type="text"
                          value={regDistrict}
                          onChange={(e) => setRegDistrict(e.target.value)}
                          className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.village} *</label>
                      <input
                        type="text"
                        value={regVillage}
                        onChange={(e) => setRegVillage(e.target.value)}
                        className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.landSize}</label>
                        <input
                          type="number"
                          step="0.1"
                          value={landSize}
                          onChange={(e) => setLandSize(e.target.value)}
                          className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-3"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.landType}</label>
                        <select
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                        >
                          {SOIL_TYPES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-2.5xl p-5 border border-slate-100 dark:border-slate-800/80 flex flex-col gap-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 font-mono tracking-widest flex items-center gap-2 border-b dark:border-slate-800 pb-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> {t.soilValues}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        {t.soilNitrogen} (N)
                      </label>
                      <select
                        value={soilN}
                        onChange={(e) => setSoilN(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                      >
                        <option value="High">High (उच्च)</option>
                        <option value="Medium">Medium (मध्यम)</option>
                        <option value="Low">Low (निम्न)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        {t.soilPhosphorus} (P)
                      </label>
                      <select
                        value={soilP}
                        onChange={(e) => setSoilP(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                      >
                        <option value="High">High (उच्च)</option>
                        <option value="Medium">Medium (मध्यम)</option>
                        <option value="Low">Low (निम्न)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        {t.soilPotassium} (K)
                      </label>
                      <select
                        value={soilK}
                        onChange={(e) => setSoilK(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                      >
                        <option value="High">High (उच्च)</option>
                        <option value="Medium">Medium (मध्यम)</option>
                        <option value="Low">Low (निम्न)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">{t.soilPh}</label>
                      <input
                        type="number"
                        step="0.1"
                        min="4.0"
                        max="10.0"
                        value={soilPh}
                        onChange={(e) => setSoilPh(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-end border-t dark:border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-805 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={opsLoading}
                    className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl"
                  >
                    {opsLoading ? "Saving..." : "Save Passport"}
                  </button>
                </div>
              </form>
            ) : (
              /* DETAILED VIEW - STATIC CABINET PANEL info metrics */
              <div className="flex flex-col gap-6">
                <div className="p-5 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 rounded-2.5xl border border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {profile?.profilePhoto ? (
                      <img
                        src={profile?.profilePhoto}
                        referrerPolicy="no-referrer"
                        alt="avatar"
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-3xl border border-slate-200">
                        🌾
                      </div>
                    )}

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {profile?.name}
                      </h3>
                      <p className="text-xs text-slate-450 dark:text-slate-400 font-mono mt-1">
                        {profile?.village}, {profile?.district} • {profile?.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4.5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-4 h-4 text-emerald-600" /> Edit Profile
                    </button>

                    <button
                      type="button"
                      onClick={handleLogOut}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-650 dark:text-slate-350 text-xs font-bold rounded-xl transition"
                    >
                      {t.logOut}
                    </button>
                  </div>
                </div>

                {/* Sowing Logs Timeline Registry */}
                <div className="flex flex-col gap-4">
                  <div className="border-b dark:border-slate-800 pb-2.5 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase text-slate-450 dark:text-slate-500 font-mono tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-4.5 h-4.5 text-emerald-700 dark:text-emerald-400" /> {t.registeredLogs}
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/5 px-2.5 py-1 rounded-md border border-emerald-500/10 font-bold">
                      {history.length} {isHi ? "फसलें दर्ज" : "crops sowed"}
                    </span>
                  </div>

                  {/* Harvest Form */}
                  <form
                    onSubmit={handleAddHistory}
                    className="bg-emerald-50/20 dark:bg-slate-950/25 p-4 rounded-2.5xl border border-emerald-110/30 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-4">
                      <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 block mb-1">
                        {t.cropName}
                      </label>
                      <input
                        type="text"
                        name="cropInput"
                        placeholder="e.g. Soybeans"
                        className="w-full text-xs font-medium p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 block mb-1">
                        {t.seasonLabel}
                      </label>
                      <select
                        name="seasonInput"
                        className="w-full text-xs font-semibold p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                      >
                        <option value="Rabi 2026">Rabi 2026</option>
                        <option value="Kharif 2026">Kharif 2026</option>
                        <option value="Zaad 2026">Zaad 2026</option>
                        <option value="Rabi 2025">Rabi 2025</option>
                        <option value="Kharif 2025">Kharif 2025</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-650 dark:text-slate-400 block mb-1">
                        {t.yieldLabel}
                      </label>
                      <input
                        type="text"
                        name="yieldInput"
                        placeholder="e.g. 3.8 Tons"
                        className="w-full text-xs font-medium p-2.5 border border-slate-205 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-lg transition shrink-0 active:scale-95"
                      >
                        {isHi ? "दर्ज करें" : "Log Crop"}
                      </button>
                    </div>
                  </form>

                  {/* Historic list */}
                  <div className="flex flex-col gap-3">
                    {history.length > 0 ? (
                      history.map((h) => (
                        <div
                          key={h.id}
                          className="p-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0 mt-0.5">
                              <Wheat className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] font-mono tracking-wider font-extrabold bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900 rounded px-2.5 py-0.5 uppercase">
                                  {h.season}
                                </span>
                              </div>
                              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1">
                                {h.crop}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 flex gap-4">
                                <span>
                                  Sowed on: <strong className="font-semibold">{h.sowingDate}</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Reported Yield:{" "}
                                  <strong className="text-emerald-700 dark:text-emerald-400">
                                    {h.yieldReport}
                                  </strong>
                                </span>
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteHistory(h.id)}
                            className="p-1.5 border dark:border-slate-800 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-800 rounded-2xl">
                        <p className="text-xs font-semibold text-slate-400">{t.noHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Secure account destroy controls */}
                <div className="mt-4 border-t dark:border-slate-800 pt-4 flex justify-between items-center bg-red-50/5 dark:bg-red-950/5 p-4 rounded-2xl border border-red-500/[0.05]">
                  <div>
                    <h4 className="text-xs font-bold text-red-700 dark:text-red-400">Danger Zone</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Permanently delete your Firestore farmer coordinates and remove auth details.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteSelf}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 hover:text-red-700 dark:text-red-400 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    {isHi ? "किसान प्रोफ़ाइल हटाएं" : "Delete Farmer Profile"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Holographic Right Panel - e-Kisan Digital Credit Card */}
          <div className="lg:col-span-4 flex flex-col gap-5 sticky top-6">
            <h3 className="text-xs font-mono font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
              {isHi ? "डिजिटल प्रमाण पत्र" : "Kisan Digital Pass"}
            </h3>

            <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white rounded-3xl p-5 shadow-xl border border-emerald-600/30 overflow-hidden flex flex-col justify-between min-h-[220px] group transition-transform duration-300">
              <div className="absolute inset-0 bg-radial-at-t from-emerald-500/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl group-hover:scale-120 transition-transform duration-500"></div>

              <div className="flex justify-between items-start z-10 gap-4">
                <div>
                  <span className="text-[8px] font-mono tracking-widest font-bold uppercase block bg-white/10 px-2 py-0.5 rounded border border-white/5 w-fit">
                    {t.digitalKcc}
                  </span>
                  <span className="text-[9px] font-medium text-emerald-300 block mt-1 uppercase font-mono font-bold">
                    {t.issuedBy}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  <div className="w-8 h-6 bg-amber-500 rounded-md border border-amber-300/40 relative flex items-center justify-center p-1 shadow-sm leading-none shrink-0 overflow-hidden">
                    <span className="w-full h-[0.5px] bg-amber-950/20 absolute"></span>
                    <span className="h-full w-[0.5px] bg-amber-950/20 absolute"></span>
                    <div className="w-3 h-2.5 border border-amber-950/30 rounded bg-transparent"></div>
                  </div>
                  <div className="flex gap-0.5 text-emerald-300/60 text-[8px] leading-tight font-mono select-none font-bold">
                    <span>(((</span>
                  </div>
                </div>
              </div>

              <div className="z-10 mt-5">
                <span className="text-[8px] uppercase tracking-wider text-emerald-300/80 font-mono leading-none block">
                  Primary Holder
                </span>
                <p className="text-sm font-black tracking-wide truncate max-w-[200px] font-sans text-emerald-50">
                  {profile?.name}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <span className="text-[7px] uppercase tracking-wider text-emerald-400 font-mono leading-none block">
                      Land Area Size
                    </span>
                    <p className="text-[10px] font-bold text-white tracking-wide mt-0.5">
                      {landSize} Acres
                    </p>
                  </div>
                  <div>
                    <span className="text-[7px] uppercase tracking-wider text-emerald-400 font-mono leading-none block">
                      Secure ID
                    </span>
                    <p className="text-[10px] font-mono tracking-wide text-white mt-0.5 truncate max-w-[100px]">
                      {profile?.uid?.substring(0, 8)}...
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-2.5 flex items-center justify-between z-10">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-teal-300 font-mono block font-bold leading-none">
                    {t.kccLimitTitle}
                  </span>
                  <span className="text-[7px] text-emerald-300 leading-none">{t.kccScale}</span>
                </div>
                <span className="text-base font-extrabold text-amber-300 tracking-tight font-mono">
                  {calcKccLimit()}
                </span>
              </div>

              <div className="absolute right-4 bottom-14 opacity-25 pointer-events-none select-none text-right">
                <span className="text-[7px] font-mono uppercase block text-emerald-300 font-bold tracking-widest">
                  {t.securedBadge}
                </span>
                <span className="text-[5px] text-emerald-400 block font-bold font-mono">
                  SEC_CLOUD_PASS
                </span>
              </div>
            </div>

            {/* AI Review Summary banner based on Firestore parameters */}
            <div className="bg-slate-50 dark:bg-slate-950/20 p-4.5 rounded-2.5xl border border-slate-150 dark:border-slate-800/80 hover:border-emerald-500/20 transition flex flex-col gap-3.5">
              <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                <Sparkles className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h4 className="text-xs font-black uppercase tracking-wide">
                  {isHi ? "वैयक्तिकृत एआई समीक्षा" : "Personalized AI Review"}
                </h4>
              </div>

              <div className="text-[11px] leading-relaxed text-slate-650 dark:text-slate-350 flex flex-col gap-2.5">
                <p>
                  {isHi ? "नमस्ते " : "Hello "}{" "}
                  <strong className="font-bold text-slate-850 dark:text-slate-100">{profile?.name}</strong>,{" "}
                  {isHi ? "आपकी वर्तमान प्रोफ़ाइल के अनुसार परामर्श:" : "based on your active profile:"}
                </p>
                <ul className="list-disc pl-4 flex flex-col gap-2">
                  <li>
                    {isHi ? "आपकी " : "Your "}{" "}
                    <strong className="font-bold">{landSize} Acres</strong>{" "}
                    {isHi
                      ? " भूमि पर कृषि लागत के पैमाने के आधार पर डिजिटल ऋण स्वीकृत किया गया है।"
                      : " land area is allocated to localized crop configurations."}
                  </li>
                  <li>
                    {isHi ? "सिंचाई प्रकार " : "Irrigation system "}{" "}
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">
                      {irrigationType}
                    </strong>
                    {isHi ? " को सुदृढ़ कर जल भराव से फसल बचाएं।" : " requires pre-emptive schedulers."}
                  </li>
                  <li>
                    {isHi ? "मिट्टी प्रकार " : "Soil structure "}{" "}
                    <strong className="font-semibold text-slate-800 dark:text-slate-200">{soilType}</strong>{" "}
                    {isHi
                      ? " केंचुए संवर्धन व जैव कार्बन बढ़ाने के अनुकूल है।"
                      : " influences water availability parameters."}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
