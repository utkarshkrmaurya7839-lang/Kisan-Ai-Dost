import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sprout, Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  lang?: "en" | "hi";
}

export default function SplashScreen({ onComplete, lang = "en" }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const isHi = lang === "hi";

  useEffect(() => {
    // Progress bar animation over 2.8 seconds
    const duration = 2800; // 2.8s
    const stepTime = 30; // ms
    const increment = 100 / (duration / stepTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Small delay before transition exits
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
              onComplete();
            }, 600); // match fade-out duration
          }, 300);
          return 100;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Leaf coordinate arrays for gentle drift animation
  const leavesArray = [
    { id: 1, left: "10%", top: "25%", size: 24, delay: 0.2, rotate: 12 },
    { id: 2, left: "85%", top: "15%", size: 36, delay: 0.5, rotate: -45 },
    { id: 3, left: "75%", top: "70%", size: 28, delay: 0.8, rotate: 30 },
    { id: 4, left: "15%", top: "80%", size: 32, delay: 1.1, rotate: -15 },
    { id: 5, left: "5%", top: "50%", size: 20, delay: 1.4, rotate: 60 },
    { id: 6, left: "90%", top: "50%", size: 26, delay: 1.7, rotate: -25 }
  ];

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="kisan-splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-slate-950 text-white"
        >
          {/* Background Gradient & Animated Glow Orbs */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/80 via-slate-950 to-slate-950" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.15, scale: 1.2 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
            className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
          />

          {/* Floating Subtle Leaves */}
          {leavesArray.map((leaf) => (
            <motion.div
              key={leaf.id}
              initial={{ opacity: 0, y: 30, rotate: leaf.rotate }}
              animate={{ 
                opacity: [0, 0.4, 0.4, 0], 
                y: [40, -40],
                x: [0, (leaf.id % 2 === 0 ? 15 : -15)],
                rotate: leaf.rotate + 30
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: leaf.delay,
                ease: "easeInOut"
              }}
              style={{
                position: "absolute",
                left: leaf.left,
                top: leaf.top,
                width: leaf.size,
                height: leaf.size
              }}
              className="text-emerald-500/40 pointer-events-none select-none"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L7,18C12,14 16,12 21,8C22,7 22,5 20,3C18,1 16,1 15,2C11,7 9,9 17,8Z" />
              </svg>
            </motion.div>
          ))}

          {/* Center Glassmorphism Visual Console Container */}
          <div className="relative z-10 w-full max-w-md px-6 text-center flex flex-col items-center">
            
            {/* Logo Backdrop Glow Ring */}
            <div className="relative mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.25, 0.95] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-4 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur-xl opacity-55"
              />
              
              {/* Outer Pulsing Interactive Tech Lines */}
              <svg className="absolute -inset-8 w-36 h-36 animate-spin" style={{ animationDuration: "12s" }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="rgba(52, 211, 153, 0.15)" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="url(#techGrad)" strokeWidth="2" strokeDasharray="30 150" fill="none" />
                <defs>
                  <linearGradient id="techGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Logo Badge Card */}
              <motion.div
                initial={{ scale: 0.3, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
                id="kisan-splash-logo-card"
                className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-550 flex items-center justify-center shadow-2xl border border-emerald-400/40"
              >
                <Sprout className="w-11 h-11 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" />
                
                {/* Floating Micro Star */}
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute -top-1.5 -right-1.5 bg-slate-900 border border-emerald-400/60 p-1.2 rounded-xl text-emerald-400"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            </div>

            {/* Typography Header Set */}
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-emerald-200">
                {isHi ? "किसान एआई दोस्त" : "Kisan AI Dost"}
              </h1>
              
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 mt-2 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                {isHi ? "एआई के साथ स्मार्ट खेती" : "Smart Farming with AI"}
              </p>
            </motion.div>

            {/* Glassmorphism Loader Dashboard Module */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="w-full max-w-xs bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-5 rounded-2.5xl shadow-2xl flex flex-col gap-3"
            >
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 uppercase tracking-wider">
                <span>{isHi ? "कम्प्यूटेशनल कनेक्शन..." : "Connecting Agri-AI..."}</span>
                <span className="text-emerald-400 font-bold">{Math.round(progress)}%</span>
              </div>

              {/* Progress Container */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  id="splash-loading-indicator"
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Glowing end cap tip */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-xs animate-pulse" />
                </motion.div>
              </div>

              {/* Changing helper tips */}
              <div className="text-[10px] text-slate-400 italic">
                {progress < 30 ? (
                  isHi ? "बुवाई चक्र लोड हो रहा है..." : "Analyzing seasonal sowing crops..."
                ) : progress < 70 ? (
                  isHi ? "वानस्पतिक रोग डेटाबेस सक्रिय किया जा रहा है..." : "Syncing plant disease indicators..."
                ) : (
                  isHi ? "डिजिटल गाइड तैयार हो रही है!" : "Preparing digital soil analyzer!"
                )}
              </div>
            </motion.div>

            {/* Footer Tagline */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="absolute bottom-[-100px] text-[10px] font-mono uppercase tracking-widest text-slate-500 whitespace-nowrap"
            >
              KRISHI AI PROTOCOL • 2026
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
