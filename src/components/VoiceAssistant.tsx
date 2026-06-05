import React, { useState, useEffect, useRef } from "react";
import { Mic, Volume2, VolumeX, Sparkles, HelpCircle, CornerDownRight, Play, Keyboard, Send, CheckCircle2, RotateCcw, Download } from "lucide-react";

interface VoiceAssistantProps {
  lang: "en" | "hi";
}

const VOICE_QUESTIONS = [
  {
    hindi: "धान में लगने वाले कीड़ों को कैसे रोकें?",
    english: "How to stop pests in paddy field?",
    answer: "धान (पैकिका) में कीटों की रोकथाम के लिए नीम के घोल या कीट प्रतिरोधी तेल का छिड़काव करें। संध्याकाल के समय खेतों में सोलर या साधारण लाइट ट्रैप लगाएं।",
    speechText: "धान में कीटों की रोकथाम के लिए नीम के घोल का छिड़काव करें, अथवा संध्या के समय खेतों में लाइट ट्रैप लगाएं। अधिक जानकारी के लिए लाइव चैट का उपयोग करें।"
  },
  {
    hindi: "गेहूं बोने का सही समय क्या है?",
    english: "What is the best sowing time for wheat?",
    answer: "भारत में गेहूं की बुवाई का सर्वोत्तम समय पंद्रह नवंबर से पच्चीस नवंबर तक माना जाता है जब तापमान २० से २२ डिग्री तक ठंडा हो जाए।",
    speechText: "भारत में गेहूं की बुवाई का सर्वोत्तम समय पंद्रह नवंबर से पच्चीस नवंबर तक माना जाता है।"
  },
  {
    hindi: "सोलर पंप पर कितनी सरकारी सब्सिडी मिलती है?",
    english: "How much govt subsidy is available for solar pumps?",
    answer: "पीएम कुसुम योजना के अंतर्गत किसानों को सोलर वाटर पंप लगवाने पर साठ प्रतिशत तक की सीधी छूट और अनुदान प्रदान किया जाता है।",
    speechText: "पीएम कुसुम योजना के अंतर्गत किसानों को सोलर वाटर पंप लगवाने पर साठ प्रतिशत तक की सीधी छूट प्रदान की जाती है।"
  }
];

export default function VoiceAssistant({ lang }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string>("");
  const [manualInput, setManualInput] = useState<string>("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  const [speechLang, setSpeechLang] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [history, setHistory] = useState<{ query: string; reply: string; time: string }[]>([]);

  // Set default message on mount or when language changes
  useEffect(() => {
    setVoiceLog(
      lang === "hi"
        ? "नमस्ते किसान भाई! बोलकर पूछने के लिए माइक पर क्लिक करें या नीचे अपनी समस्या लिखें।"
        : "Namaste! Click the microphone to speak or type your question below."
    );
    setSpeechLang(lang === "hi" ? "hi-IN" : "en-IN");
  }, [lang]);

  // Handle Speech Synthesis voices loading dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis is not supported by your browser environment.");
      return;
    }
    window.speechSynthesis.cancel();

    // Clean up markdown / symbols so speech is seamless
    const cleanText = text
      .replace(/[\*\#\_]/g, "")
      .replace(/₹/g, "rupees")
      .replace(/INR/g, "rupees");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLangCode = lang === "hi" ? "hi-IN" : "en-IN";
    
    // Find regional matching voices
    const selectedVoice =
      availableVoices.find((v) => v.lang.startsWith(targetLangCode)) ||
      availableVoices.find((v) => v.lang.startsWith(lang)) ||
      availableVoices.find((v) => v.lang.toLowerCase().includes("india")) ||
      availableVoices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.95;
    utterance.onstart = () => setTtsActive(true);
    utterance.onend = () => setTtsActive(false);
    utterance.onerror = () => setTtsActive(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim() || isLoadingResponse) return;

    setIsLoadingResponse(true);
    setCurrentResponse("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText }),
      });

      if (!response.ok) {
        throw new Error("Chat response failure");
      }

      const data = await response.json();
      setCurrentResponse(data.reply);
      speakText(data.reply);
      setHistory((prev) => [
        ...prev,
        {
          query: queryText,
          reply: data.reply,
          time: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err) {
      console.error(err);
      const fallbackErrorMsg =
        lang === "hi"
          ? "माफ़ कीजिये, सर्वर से जुड़ने में कोई समस्या हुई है। कृपया फिर से प्रयास करें।"
          : "Pranam! There was an issue reaching the server. Please try again in a moment.";
      setCurrentResponse(fallbackErrorMsg);
      speakText(fallbackErrorMsg);
      setHistory((prev) => [
        ...prev,
        {
          query: queryText,
          reply: fallbackErrorMsg,
          time: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceLog(
        lang === "hi"
          ? "त्रुटि: आपके डिवाइस या ब्राउज़र में माइक्रोफ़ोन रिकग्निशन समर्थित नहीं है। कृपया सफारी या क्रोम का उपयोग करें और नीचे लिखकर पूछें!"
          : "Error: Speech recognition is not supported in this browser. Please use Chrome/Safari and type your query below instead!"
      );
      return;
    }

    if (isListening) {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    // Cancel ongoing sounds
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = speechLang;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceLog(
        lang === "hi"
          ? `सुन रहा हूँ (${speechLang === "hi-IN" ? "हिंदी" : "English"})... कृपया माइक्रोफ़ोन के नजदीक साफ़ आवाज में बोलें...`
          : `Listening (${speechLang === "hi-IN" ? "Hindi" : "English"})... Please speak clearly into your mic.`
      );
    };

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        setVoiceLog(lang === "hi" ? `सुना गया: "${transcript}"` : `Heard: "${transcript}"`);
        handleQuerySubmit(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event);
      setIsListening(false);
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setVoiceLog(
          lang === "hi"
            ? "माइक्रोफ़ोन अनुमति अवरुद्ध है। सुरक्षित फ़्रेम (iframe) प्रतिबंधों के कारण, कृपया ऊपर दी गई 'Open App in New Tab' लिंक पर क्लिक करें ताकि ब्राउज़र आपसे अनुमति मांग सके!"
            : "Microphone permission blocked. Due to security rules in review iframes, please click 'Open App in New Tab' above so you can grant browser credentials!"
        );
      } else if (event.error === "no-speech") {
        setVoiceLog(
          lang === "hi"
            ? "आवाज सुनाई नहीं दी। कृपया माइक्रोफ़ोन के समीप आएं और दुबारा प्रयास करें।"
            : "No speech was detected. Please stand closer to the microphone and try again."
        );
      } else {
        setVoiceLog(
          lang === "hi"
            ? `त्रुटि संकेत: ${event.error}. कृपया नीचे कीबोर्ड बॉक्स से लिखकर समाधान प्राप्त करें!`
            : `Mic state error: ${event.error}. Feel free to use the keyboard input instead!`
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setRecognitionInstance(recognition);
    try {
      recognition.start();
    } catch (err) {
      console.error("Start speech error:", err);
      setVoiceLog("Microphone initialization failed. Try clicking again.");
    }
  };

  const handleTriggerTemplate = (q: typeof VOICE_QUESTIONS[0]) => {
    const query = lang === "hi" ? q.hindi : q.english;
    const answer = q.answer;
    setVoiceLog(lang === "hi" ? `पूछा गया: "${q.hindi}"` : `Asked: "${q.english}"`);
    setCurrentResponse(answer);
    speakText(q.speechText);
    setHistory((prev) => [
      ...prev,
      {
        query,
        reply: answer,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const cancelSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setTtsActive(false);
  };

  const downloadVoiceAdviceLog = () => {
    if (history.length === 0) return;

    let titleStr = lang === "hi" ? "आवाज सहायक कृषि सलाह इतिहास" : "Voice Assistant Agronomy Advice History";
    let text = `🌾 ${titleStr.toUpperCase()} 🌾\n`;
    text += `=========================================\n\n`;

    history.forEach((h, idx) => {
      text += `📅 [Interaction #${idx + 1}] (${h.time})\n`;
      text += `🗣️ ${lang === "hi" ? "किसान का सवाल" : "Farmer's Query"}: "${h.query}"\n`;
      text += `🤖 ${lang === "hi" ? "एआई मित्र की सलाह" : "AI Dost Advice"}:\n${h.reply}\n`;
      text += `-----------------------------------------\n\n`;
    });

    text += `Generated and saved offline by Krishi Connect Voice Intelligence\n`;
    text += `Download Date: ${new Date().toLocaleDateString()}\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kisan_voice_advice_history.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setVoiceLog(lang === "hi" ? `लिखा गया सवाल: "${manualInput}"` : `Typed Question: "${manualInput}"`);
    handleQuerySubmit(manualInput);
    setManualInput("");
  };

  const handleOpenInNewTab = () => {
    window.open(window.location.href, "_blank");
  };

  return (
    <div id="voice-assistant" className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-6 text-white shadow-md border border-emerald-850 flex flex-col gap-6">
      
      {/* Header containing title and Stop Voice switches */}
      <div className="border-b border-emerald-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Mic className="text-emerald-400 w-6 h-6 animate-pulse" />{" "}
            {lang === "hi" ? "आवाज सहायक सलाहकार (Voice Advisor)" : "Voice Advisor (बोलकर पूछें)"}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-1">
            {lang === "hi"
              ? "हिंदी या अंग्रेजी में बोलकर पूछें। एआई मित्र आपको बोलकर सही सलाह देगा।"
              : "Ask questions on crop diseases, fertilizers, and schemes in English or Hindi, and listen to the voice answer."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Speaking Accent Selector */}
          <div className="bg-emerald-950/70 p-1 rounded-xl border border-emerald-800 flex items-center gap-1">
            <button
              onClick={() => setSpeechLang("hi-IN")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                speechLang === "hi-IN" ? "bg-emerald-500 text-white shadow-sm" : "text-emerald-300 hover:text-white"
              }`}
            >
              हिन्दी (IN)
            </button>
            <button
              onClick={() => setSpeechLang("en-IN")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                speechLang === "en-IN" ? "bg-emerald-500 text-white shadow-sm" : "text-emerald-300 hover:text-white"
              }`}
            >
              English (IN)
            </button>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={downloadVoiceAdviceLog}
              title={lang === "hi" ? "सलाह इतिहास संचिका को डाउनलोड करें" : "Download voice advice log"}
              className="bg-emerald-555 hover:bg-emerald-500 hover:text-white border border-emerald-500 text-emerald-100 text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition font-bold"
            >
              <Download className="w-4 h-4" /> {lang === "hi" ? "इतिहास डाउनलोड" : "Download Log"}
            </button>
          )}

          {ttsActive ? (
            <button
              onClick={cancelSpeech}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-100 text-xs px-3 py-2 rounded-xl border border-red-400/30 flex items-center gap-1.5 cursor-pointer transition font-bold"
            >
              <VolumeX className="w-4 h-4" /> {lang === "hi" ? "आवाज बंद करें" : "Stop Voice"}
            </button>
          ) : (
            <span className="text-[10px] font-mono uppercase bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              {lang === "hi" ? "ध्वनि प्रणाली" : "Audio Active"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Real Input Microphone & Speech recognition block */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="flex flex-col items-center justify-center p-6 bg-emerald-950/40 border border-emerald-700/40 rounded-2xl relative min-h-[250px] text-center shadow-inner">
            
            {/* Direct Open in New Tab Helper */}
            <button
              onClick={handleOpenInNewTab}
              className="absolute top-2.5 right-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-[9px] font-extrabold font-mono tracking-widest uppercase px-3 py-1.5 rounded-xl border border-emerald-400/35 transition cursor-pointer active:scale-95 shadow-sm"
              title="Open full page to ensure Mic works"
            >
              🌐 {lang === "hi" ? "नई टैब में खोलें" : "Open in New Tab"}
            </button>

            {/* Visual Listening Ripples */}
            <div className="relative flex items-center justify-center mt-4">
              {isListening && (
                <>
                  <span className="absolute inline-flex h-24 w-24 rounded-full bg-red-400/30 animate-ping"></span>
                  <span className="absolute inline-flex h-28 w-28 rounded-full bg-red-300/20 animate-pulse"></span>
                </>
              )}
              <button
                onClick={handleMicClick}
                className={`z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 duration-200 cursor-pointer ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700 hover:scale-105"
                    : "bg-emerald-500 hover:bg-emerald-600 hover:scale-105"
                }`}
              >
                <Mic className="w-8 h-8 text-white shrink-0" />
              </button>
            </div>
            
            <h3 className="text-sm font-bold mt-5 tracking-wide text-white">
              {isListening
                ? (lang === "hi" ? `बोलिए... (${speechLang === "hi-IN" ? "हिंदी" : "अंग्रेजी"})` : `Speaking... (${speechLang === "hi-IN" ? "Hindi" : "English"})`)
                : (lang === "hi" ? "माइक दबाकर बोलें" : "Tap Microphone to Speak")}
            </h3>
            
            <p className="text-[10px] text-teal-200/60 mt-1 max-w-[280px]">
              {lang === "hi"
                ? "मौसम, जैविक खाद, बीज चयन या सरकारी योजना के बारे में बोलें"
                : "Ask about organic fertilizer, sowing season, pests or schemes"}
            </p>

            {/* Transcription Status block */}
            <div className="mt-4 bg-emerald-900/60 border border-emerald-800 p-3 rounded-xl w-full">
              <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black text-left mb-1">
                {lang === "hi" ? "स्थिति विश्लेषण:" : "STATUS / TRANSCRIPTION:"}
              </p>
              <span className="text-xs font-semibold block text-emerald-100 text-left leading-relaxed">
                {voiceLog}
              </span>
            </div>
          </div>

          {/* Iframe Hint Alert */}
          <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl text-[11px] text-teal-100/80 leading-relaxed flex flex-col gap-2">
            <div className="flex gap-2 items-start">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">
                  {lang === "hi" ? "सुरक्षित माइक्रोफ़ोन उपयोग गाइड:" : "Secure Microphone Guide:"}
                </p>
                <p className="mt-0.5 font-medium">
                  {lang === "hi"
                    ? "सुरक्षा नियम (sandbox limits) आपकी आवाज़ सीधे एम्बेडेड फ़्रेम में ब्लॉक कर सकते हैं। माइक्रोफ़ोन की अनुमति बिना किसी रुकावट के सक्षम करने के लिए, हमारा सुझाव है कि आप ऐप को सीधे नए टैब में लोड करें:"
                    : "Chrome & Safari block secure microphones within embedded workspace previews. To bypass this restriction instantly and let the browser prompt for voice access, please load the app in full page:"}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenInNewTab}
              className="bg-emerald-500/30 hover:bg-emerald-500/50 border border-emerald-400/40 text-emerald-200 hover:text-white font-bold text-xs py-2 px-4 rounded-xl mt-1 text-center transition cursor-pointer"
            >
              🚀 {lang === "hi" ? "नए टैब में ऐप खोलें (Unlock Mic permissions)" : "Launch Full App in New Tab (Enable Mic)"}
            </button>
          </div>
        </div>

        {/* Right Column: Keyboards input fallback & Question presets */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Real query answer loading spinner */}
          {isLoadingResponse && (
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse">
              <RotateCcw className="w-5 h-5 text-emerald-400 animate-spin" />
              <span className="text-xs font-bold text-emerald-200">
                {lang === "hi" ? "एआई दोस्त समाधान ढूँढ रहा है..." : "Kisan Dost is loading solutions..."}
              </span>
            </div>
          )}

          {/* Live response display block */}
          {currentResponse && !isLoadingResponse && (
            <div className="bg-emerald-950/50 border border-emerald-800/80 p-4 rounded-2xl flex items-start gap-2.5 animate-fade-in text-emerald-100 text-xs shadow-inner leading-relaxed">
              <CornerDownRight className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300 flex items-center gap-1">
                  <Volume2 className="w-4 h-4 animate-bounce" />{" "}
                  {lang === "hi" ? "एआई दोस्त का सही जवाब:" : "Kisan AI Dost Voice Answer:"}
                </p>
                <div className="mt-1.5 font-medium leading-relaxed max-h-[160px] overflow-y-auto no-scrollbar whitespace-pre-wrap">
                  {currentResponse}
                </div>
              </div>
            </div>
          )}

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/40 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1 px-1">
              <Keyboard className="w-3.5 h-3.5" /> {lang === "hi" ? "लिखकर पूछें (Keyboard Input)" : "Type Question Fallback"}
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={lang === "hi" ? "यहाँ लिखें (जैसे: जैविक कीटनाशक कैसे बनाएं?)" : "Type your agricultural query here..."}
                className="flex-1 bg-emerald-900/40 text-white placeholder-teal-200/50 text-xs font-bold px-3 py-2.5 rounded-xl border border-emerald-800 outline-none focus:border-emerald-500"
                disabled={isLoadingResponse}
              />
              <button
                type="submit"
                disabled={isLoadingResponse || !manualInput.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 border border-emerald-400/40 text-white p-2.5 rounded-xl flex items-center justify-center transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick recommendations presets */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1.5 px-0.5">
              <HelpCircle className="w-4 h-4" /> {lang === "hi" ? "सुझाए गए मुख्य प्रश्न" : "Try Sawaal Presets"}
            </span>

            <div className="flex flex-col gap-2">
              {VOICE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTriggerTemplate(q)}
                  className="text-left bg-emerald-950/20 hover:bg-emerald-900/35 p-3 rounded-xl border border-emerald-800/40 hover:border-emerald-700/60 transition group flex items-start gap-3 justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white leading-snug">{q.hindi}</p>
                    <p className="text-[10px] text-teal-200/60 italic mt-0.5 font-medium">{q.english}</p>
                  </div>
                  <div className="bg-emerald-800 group-hover:bg-emerald-700 p-2 rounded-lg shrink-0 flex items-center justify-center">
                    <Play className="w-3 h-3 text-emerald-300 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
