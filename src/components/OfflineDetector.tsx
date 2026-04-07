import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/i18n";

const OfflineDetector = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { tr } = useLang();

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[hsl(220,30%,12%)] via-[hsl(220,25%,18%)] to-[hsl(220,20%,10%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated background dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/10"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          <div className="text-center px-6 relative z-10">
            {/* WiFi Off SVG Animation */}
            <motion.div
              className="mx-auto mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                {/* Signal waves fading */}
                <motion.path
                  d="M20 50 Q60 10 100 50"
                  fill="none"
                  stroke="hsl(220, 60%, 50%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 0.6, 0.15] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M32 60 Q60 30 88 60"
                  fill="none"
                  stroke="hsl(220, 60%, 55%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0.2] }}
                  transition={{ duration: 2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M44 70 Q60 50 76 70"
                  fill="none"
                  stroke="hsl(220, 60%, 60%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0.25] }}
                  transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Center dot */}
                <motion.circle
                  cx="60" cy="82" r="5"
                  fill="hsl(220, 60%, 65%)"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* X slash */}
                <motion.line
                  x1="25" y1="90" x2="95" y2="30"
                  stroke="hsl(0, 70%, 55%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                />
              </svg>
            </motion.div>

            <motion.h1
              className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {tr.offline?.title || "No Internet Connection"}
            </motion.h1>
            <motion.p
              className="text-white/50 text-sm md:text-base max-w-md mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {tr.offline?.subtitle || "Please check your connection and try again. The page will reload automatically when you're back online."}
            </motion.p>

            {/* Pulsing retry indicator */}
            <motion.div
              className="flex items-center justify-center gap-2 text-white/40 text-sm"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <span>{tr.offline?.waiting || "Waiting for connection..."}</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineDetector;
