import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const PadlockSVG = () => (
  <motion.svg
    width="200"
    height="240"
    viewBox="0 0 200 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-2xl"
  >
    {/* Shackle */}
    <motion.path
      d="M60 100 V70 C60 35 140 35 140 70 V100"
      stroke="#fca5a5"
      strokeWidth="12"
      strokeLinecap="round"
      fill="none"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    {/* Lock body */}
    <motion.rect
      x="40" y="95" width="120" height="90" rx="16"
      fill="url(#lockGradient)"
      stroke="#dc2626"
      strokeWidth="3"
      animate={{ rotate: [0, -2, 2, -1, 1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      style={{ transformOrigin: "100px 140px" }}
    />
    {/* Keyhole outer */}
    <circle cx="100" cy="135" r="14" fill="#7f1d1d" />
    {/* Keyhole inner */}
    <circle cx="100" cy="132" r="8" fill="#450a0a" />
    <rect x="96" y="135" width="8" height="18" rx="2" fill="#450a0a" />
    {/* Lock shine */}
    <motion.ellipse
      cx="75" cy="115" rx="15" ry="8"
      fill="white" opacity="0.1"
      animate={{ opacity: [0.05, 0.15, 0.05] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Warning glow */}
    <motion.circle
      cx="100" cy="132" r="20"
      fill="none"
      stroke="#ef4444"
      strokeWidth="2"
      animate={{ r: [20, 30, 20], opacity: [0.5, 0, 0.5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <defs>
      <linearGradient id="lockGradient" x1="40" y1="95" x2="160" y2="185" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ef4444" />
        <stop offset="1" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const Error403 = () => {
  const { tr } = useLang();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a0505 0%, #2d0a0a 30%, #3b0d0d 60%, #1a0505 100%)" }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(220,38,38,0.15) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      {/* Floating warning signs */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-500/10 text-4xl font-bold select-none"
          style={{ left: `${Math.random() * 90}%`, top: `${Math.random() * 90}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 2 }}
        >
          ⛔
        </motion.div>
      ))}

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <PadlockSVG />

        <motion.h1
          className="font-playfair text-[7rem] md:text-[10rem] font-black leading-none bg-gradient-to-b from-red-300 to-red-600 bg-clip-text text-transparent select-none mt-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          403
        </motion.h1>

        <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-3">
          {tr.errors?.forbidden?.title || "Access Denied"}
        </h2>

        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-red-400 to-orange-500 mb-5 mx-auto" />

        <p className="text-white/50 max-w-md mx-auto mb-8 text-base leading-relaxed">
          {tr.errors?.forbidden?.subtitle || "This area is locked. You don't have the required permissions to access this page."}
        </p>

        <Button asChild size="lg" className="bg-gradient-to-r from-red-500 to-orange-600 text-white hover:opacity-90 font-semibold px-8 h-13 shadow-xl shadow-red-500/30 rounded-xl text-base">
          <Link to="/">
            <Home size={18} className="mr-2" />
            {tr.errors?.goHome || "Go Back Home"}
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Error403;
