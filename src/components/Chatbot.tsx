import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, Sparkles, User, RefreshCw, HelpCircle, Mic, MicOff, Image, Volume2, VolumeX, Download } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  text: string;
  image?: string;
}

interface ChatbotProps {
  lang?: "en" | "hi";
}

export default function Chatbot({ lang = "en" }: ChatbotProps) {
  const isHi = lang === "hi";

  const defaultWelcomeMessage = isHi
    ? "नमस्ते किसान भाई! मैं हूँ आपका किसान एआई दोस्त। आपकी फसल, बुवाई, मंडी या खाद के बारे में कोई भी प्रश्न हो, यहाँ पूछें। मैं हिंदी और अंग्रेजी दोनों अच्छे से समझता हूँ।"
    : "Namaste Kisan Bhai! I am your Kisan AI Dost. Ask me any question about your crops, sowing, markets, or fertilizers. I understand both English and Hindi very well.";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Speech-to-Text states
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"hi-IN" | "en-IN">(isHi ? "hi-IN" : "en-IN");
  const recognitionRef = useRef<any>(null);

  // Text-to-Speech (TTS) states
  const [currentlySpeakingIndex, setCurrentlySpeakingIndex] = useState<number | null>(null);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested Queries
  const SUGGESTED_QUERIES = isHi
    ? [
        "धान की फसल में खरपतवार नियंत्रण कैसे करें?",
        "कपास की सफेद मक्खी के लिए जैविक उपाय क्या हैं?",
        "ड्रिप सिंचाई प्रणाली के लिए सरकारी सब्सिडी कैसे मिलेगी?"
      ]
    : [
        "How to control weeds in paddy crops?",
        "Organic solutions for cotton whiteflies",
        "Government subsidy for drip irrigation systems"
      ];

  // Set initial welcome message when messages are empty or when lang changes and we only have the greeting
  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && (messages[0].text.startsWith("Namaste") || messages[0].text.startsWith("नमस्ते")))) {
      setMessages([
        {
          role: "model",
          text: defaultWelcomeMessage
        }
      ]);
    }
    setVoiceLang(isHi ? "hi-IN" : "en-IN");
  }, [lang]);

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? prev + " " + transcript : transcript));
        }
      };
      
      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error", e);
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  // Update speech language whenever voiceLang changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = voiceLang;
    }
  }, [voiceLang]);

  // Clean up any speech synthesis activities on component unmount to prevent lingering audio loops
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakMessage = (text: string, index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(
        isHi
          ? "आपके ब्राउज़र में टेक्स्ट-टू-स्पीच (आवाज़ में सुनना) समर्थित नहीं है।"
          : "Text-to-Speech is not supported in your browser."
      );
      return;
    }

    if (currentlySpeakingIndex === index) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Remove markdown formatting sequences prior to synthesis for accurate, clean words pronunciation
    const cleanText = text
      .replace(/\*\*?/g, "")
      .replace(/##?/g, "")
      .replace(/`/g, "")
      .replace(/- /g, " ")
      .replace(/ Kisan Bhai /gi, " किसान भाई ")
      .replace(/ Kisan AI /gi, " किसान एआई ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Auto-detect script character-set (if text contains Hindi script, play via hi-IN, else use Indian English)
    const hasHindi = /[\u0900-\u097F]/.test(text);
    utterance.lang = hasHindi ? "hi-IN" : "en-IN";
    
    utterance.pitch = 1.0;
    utterance.rate = 0.95; // Slightly slower dynamic rate for maximum clear guidance to farmers

    utterance.onend = () => {
      setCurrentlySpeakingIndex(null);
    };

    utterance.onerror = (e) => {
      console.error("Speech Synthesis Error", e);
      setCurrentlySpeakingIndex(null);
    };

    setCurrentlySpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        isHi
          ? "आपके ब्राउज़र या आईफ्रेम में वॉयस रिकग्निशन पूरी तरह से समर्थित नहीं है। कृपया किसान एआई को नए टैब में खोलें या गूगल क्रोम / सफारी का उपयोग करें।"
          : "Speech recognition is not fully supported in this browser mode or iframe. Please open Kisan AI in a new tab or try a modern Google Chrome/Safari browser."
      );
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Recognition start failed", err);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert(
          isHi
            ? "छवि का आकार 12MB से कम होना चाहिए। कृपया कोई छोटी फ़ाइल चुनें।"
            : "Image should be smaller than 12MB. Please select a smaller photo file."
        );
        return;
      }
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setMimeType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if ((!textToSend.trim() && !selectedImage) || loading) return;

    // Append local user message
    const updated = [
      ...messages, 
      { 
        role: "user" as const, 
        text: textToSend || (isHi ? "फसल रोग निदान सूचकों का विश्लेषण किया जा रहा है..." : "Analyzing crop photo diagnostic indicators..."),
        image: selectedImage || undefined
      }
    ];
    setMessages(updated);
    setInput("");
    
    const imageToSend = selectedImage;
    const mimeToSend = mimeType;
    
    // Clear UI attachments immediately
    setSelectedImage(null);
    setMimeType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: textToSend,
          imageBase64: imageToSend,
          mimeType: mimeToSend,
          lang: lang
        })
      });

      if (!response.ok) {
        throw new Error("Chat response returned failure from the server.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: isHi
            ? "प्रणाम! सर्वर थोड़ा व्यस्त लग रहा है। कृपया अपनी सेटिंग्स में जेमिनी एपीआई कुंजी जांचें और पुनः प्रयास करें। तब तक आप मेरे सुझाए गए प्रश्नों का उपयोग कर सकते हैं।"
            : "Pranam! Server seems a bit busy right now. Please check your Gemini API key in Secrets/Settings and try again. In the meantime, you can use my pre-loaded suggestions."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadChatHistory = () => {
    if (messages.length === 0) return;

    let titleStr = isHi ? "किसान एआई दोस्त चैट इतिहास" : "Kisan AI Chatbot History";
    let text = `🌾 ${titleStr.toUpperCase()} 🌾\n`;
    text += `=========================================\n\n`;

    messages.forEach((m, idx) => {
      const sender = m.role === "user" ? (isHi ? "किसान (User)" : "Farmer (User)") : (isHi ? "किसान दोस्त AI (Model)" : "Kisan Dost AI (Model)");
      text += `[${sender}]:\n${m.text}\n`;
      if (m.image) {
        text += `[${isHi ? "संलग्न चित्र" : "Attached Image"}]\n`;
      }
      text += `-----------------------------------------\n\n`;
    });

    text += `Generated by Krishi Connect AI Assistant\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kisan_ai_chat_history.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const t = {
    title: isHi ? "किसान एआई दोस्त (AI Chatbot)" : "Kisan AI Chatbot",
    desc: isHi
      ? "अपने डिजिटल कृषि मार्गदर्शक से तुरंत बात करें। बुवाई चक्र, रोग निवारण और जैविक कीटनाशकों के बारे में सलाह लें। यह वॉयस कमांड तथा फसल की तस्वीरों को भी समझता है!"
      : "Talk with your digital farm guide instantly. Receive answers regarding sowing cycles, disease preventions, and organic pesticides. Now supports Voice commands and Crop Photos!",
    onlineLabel: isHi ? "ऑनलाइन दोस्त" : "Online Dost",
    thinkingText: isHi ? "दोस्त आपके लिए कृषि समाधान खोज रहा है..." : "Dost is thinking of an agricultural solution...",
    quickHeader: isHi ? "त्वरित प्रश्न (Quick Presets):" : "Quick Questions:",
    previewHeader: isHi ? "फसल की तस्वीर संलग्न है" : "CROP PHOTO ATTACHED",
    previewSub: isHi ? "दोस्त आपके संदेश के साथ इस चित्र का भी विश्लेषण करेगा" : "Dost will analyze this image with the message",
    clearBtn: isHi ? "चयनित साफ़ करें" : "Clear Selected",
    listeningPlaceholder: isHi ? "सुन रहा हूँ... बोलिए (Speak now in Hindi/English)" : "Listening... boliyye (Speak now in Hindi/English)",
    normalPlaceholder: isHi ? "कुछ भी पूछें (जैसे: टमाटर झुलसा रोग, पम्प सब्सिडी...)" : "Ask anything (e.g. Tomato blight, pump schemes...)",
    addPhotoLabel: isHi ? "तस्वीर जोड़ें" : "Add Crop Photo",
    speakLabel: isHi ? "बोलें" : "Speak Voice",
    listeningLabel: isHi ? "सुन रहा हूँ" : "Listening",
    sendBtn: isHi ? "संदेश भेजें" : "Send Ask"
  };

  return (
    <div id="ai-chat-com" className="bg-white dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col gap-6 font-medium">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="text-emerald-700 dark:text-emerald-400 w-6 h-6 animate-pulse" /> {t.title}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {t.desc}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={downloadChatHistory}
              title={isHi ? "चैट इतिहास डाउनलोड करें" : "Download Chat History"}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-emerald-100/65 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-4xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline-block">{isHi ? "डाउनलोड चैट" : "Download Chat"}</span>
            </button>
          )}
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1 rounded-full font-mono font-bold uppercase shrink-0">
            {t.onlineLabel}
          </span>
        </div>
      </div>

      {/* Main chat log output */}
      <div className="bg-slate-50 dark:bg-slate-900/15 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 min-h-[300px] max-h-[460px] overflow-y-auto flex flex-col gap-4 no-scrollbar">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${
              m.role === "user" ? "self-end flex-row-reverse" : "self-start"
            }`}
          >
            {/* Avatar icon */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-3xs ${
              m.role === "user" ? "bg-emerald-700 text-white" : "bg-emerald-50 border border-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-850 dark:text-emerald-300"
            }`}>
              {m.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-emerald-500" />}
            </div>

            {/* Message Box */}
            <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed relative group ${
              m.role === "user"
                ? "bg-emerald-700 text-white rounded-tr-none"
                : "bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-850 rounded-tl-none shadow-3xs"
            }`}>
              {m.image && (
                <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-emerald-505/20 shadow-sm bg-slate-900/5 p-1">
                  <img src={m.image} alt="Farmers Crop Attachment" className="w-full max-h-48 object-cover rounded-lg" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="whitespace-pre-wrap pr-6">{m.text}</div>

              {/* Text speaker button controller with custom hover tooltips */}
              <button
                type="button"
                onClick={() => speakMessage(m.text, idx)}
                title={currentlySpeakingIndex === idx ? (isHi ? "सुनना बंद करें" : "Stop listening") : (isHi ? "आवाज़ में सुनें" : "Speak aloud")}
                className={`absolute right-2 bottom-1.5 rounded-lg p-1 transition cursor-pointer hover:scale-110 active:scale-95 ${
                  m.role === "user"
                    ? "text-emerald-300 hover:text-white hover:bg-emerald-600/50"
                    : "text-slate-400 hover:text-emerald-700 dark:text-slate-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-900/40"
                }`}
              >
                {currentlySpeakingIndex === idx ? (
                  <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%] self-start items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 dark:bg-emerald-950/30 dark:border-emerald-850">
              <Sparkles className="w-4 h-4 animate-spin text-emerald-500" />
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-350 text-xs italic border border-slate-200/60 dark:border-slate-850 rounded-2xl rounded-tl-none shadow-3xs flex items-center gap-1.5 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" /> {t.thinkingText}
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested quick presets */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> {t.quickHeader}
        </span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={loading}
              className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-350 bg-emerald-50 hover:bg-emerald-100/60 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Image Preview Box */}
      {selectedImage && (
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-400/40 shadow-sm shrink-0">
              <img src={selectedImage} alt="Preview Attachment" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 block tracking-wider uppercase">{t.previewHeader}</span>
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{t.previewSub}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={removeSelectedImage}
            className="p-1 px-2.5 rounded-xl text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 transition border border-red-200 cursor-pointer bg-white shadow-3xs dark:bg-slate-950 dark:border-red-900/45 text-red-500"
          >
            {t.clearBtn}
          </button>
        </div>
      )}

      {/* Interactive Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex flex-col gap-3 border border-slate-205/90 dark:border-slate-800 p-2 rounded-2xl shadow-3xs focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/10 transition bg-slate-50/50 dark:bg-slate-900/5"
      >
        <div className="flex items-center gap-3 w-full">
          {/* File input handler */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            disabled={loading}
          />
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? t.listeningPlaceholder : t.normalPlaceholder}
            className={`flex-1 text-xs font-semibold outline-none border-none bg-transparent px-3 py-2 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 ${isListening ? "text-emerald-700 dark:text-emerald-400 placeholder-emerald-400 font-extrabold animate-pulse" : ""}`}
            disabled={loading}
            required={!selectedImage}
          />
        </div>

        {/* Input option controls bar */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 px-1 gap-2 flex-wrap sm:flex-nowrap">
          
          {/* Option elements triggers */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Crop Photo Selector */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Add a plant crop or pest leaf photo"
              className={`p-2 rounded-xl flex items-center justify-center transition cursor-pointer text-xs ${selectedImage ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black border border-emerald-300" : "bg-white hover:bg-emerald-50 dark:bg-slate-950 dark:hover:bg-slate-900 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-500 border border-slate-200 dark:border-slate-800"}`}
            >
              <Image className="w-4 h-4" />
              <span className="text-[10px] ml-1 font-bold hidden sm:inline-block">{t.addPhotoLabel}</span>
            </button>

            {/* Speech to Text mic trigger */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={loading}
              title="Speak commands with voice input"
              className={`p-2 rounded-xl flex items-center justify-center transition cursor-pointer relative text-xs ${isListening ? "bg-red-500 text-white font-black animate-pulse" : "bg-white hover:bg-emerald-50 dark:bg-slate-950 dark:hover:bg-slate-900 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-500 border border-slate-200 dark:border-slate-800"}`}
            >
              {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-emerald-650" />}
              <span className="text-[10px] ml-1 font-bold hidden sm:inline-block">
                {isListening ? t.listeningLabel : t.speakLabel}
              </span>
              
              {isListening && (
                <span className="absolute -top-1 -right-1 block w-2.5 h-2.5 rounded-full bg-red-400 border border-white animate-ping"></span>
              )}
            </button>

            {/* Voice system language toggler config */}
            <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-1.5 py-1 text-[10px] font-medium text-slate-500 shadow-3xs">
              <span className="text-slate-400 mr-1.5 font-semibold text-[9px] uppercase tracking-wider">Voice:</span>
              <button
                type="button"
                onClick={() => setVoiceLang("hi-IN")}
                className={`px-1.5 py-0.5 rounded-lg transition text-[9px] font-extrabold ${voiceLang === "hi-IN" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-emerald-700"}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setVoiceLang("en-IN")}
                className={`px-1.5 py-0.5 rounded-lg transition text-[9px] font-extrabold ${voiceLang === "en-IN" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-emerald-700"}`}
              >
                EN
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
            disabled={loading || (!input.trim() && !selectedImage)}
          >
            <span>{t.sendBtn}</span>
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
