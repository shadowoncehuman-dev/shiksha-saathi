import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const CraneSVG = () => (
  <svg width="260" height="240" viewBox="0 0 260 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
    {/* Base */}
    <rect x="100" y="200" width="60" height="20" rx="4" fill="#0ea5e9" />
    <rect x="80" y="195" width="100" height="10" rx="3" fill="#0284c7" />
    {/* Vertical pole */}
    <rect x="125" y="40" width="10" height="160" fill="#38bdf8" />
    {/* Cross braces */}
    <line x1="125" y1="80" x2="135" y2="120" stroke="#0ea5e9" strokeWidth="2" />
    <line x1="135" y1="80" x2="125" y2="120" stroke="#0ea5e9" strokeWidth="2" />
    <line x1="125" y1="120" x2="135" y2="160" stroke="#0ea5e9" strokeWidth="2" />
    <line x1="135" y1="120" x2="125" y2="160" stroke="#0ea5e9" strokeWidth="2" />
    {/* Horizontal boom */}
    <rect x="60" y="38" width="140" height="8" rx="3" fill="#38bdf8" />
    {/* Cab */}
    <rect x="118" y="46" width="24" height="20" rx="4" fill="#0284c7" />
    <rect x="122" y="50" width="8" height="8" rx="2" fill="#7dd3fc" opacity="0.6" />
    {/* Counter weight */}
    <rect x="62" y="46" width="20" height="14" rx="3" fill="#0369a1" />
    {/* Cable */}
    <motion.line
      x1="180" y1="46" x2="180" y2="130"
      stroke="#fbbf24"
      strokeWidth="2"
      strokeDasharray="4 3"
    />
    {/* Swinging hook */}
    <motion.g
      animate={{ rotate: [-8, 8, -8] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "180px 46px" }}
    >
      <line x1="180" y1="46" x2="180" y2="140" stroke="#fbbf24" strokeWidth="2" />
      {/* Hook */}
      <path d="M175 140 Q175 155 185 155 Q195 155 195 145 L192 140" stroke="#fbbf24" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Hanging sign */}
      <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "180px 155px" }}>
        <rect x="160" y="158" width="44" height="24" rx="4" fill="#fbbf24" />
        <text x="182" y="175" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1a1a1a" fontFamily="monospace">WIP</text>
      </motion.g>
    </motion.g>
    {/* Warning lights */}
    <motion.circle
      cx="200" cy="42" r="5" fill="#fbbf24"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
    <motion.circle
      cx="65" cy="42" r="4" fill="#ef4444"
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
);

const Error503 = () => {
  const { tr } = useLang();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #041e3a 0%, #062c52 30%, #0a3d6e 60%, #041e3a 100%)" }}
    >
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-[200%] h-[40%] rounded-[40%]"
            style={{
              bottom: `${-20 + i * 5}%`,
              left: "-50%",
              background: `rgba(14,165,233,${0.03 + i * 0.02})`,
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* Dots pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.8) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-4">
          <CraneSVG />
        </div>

        <motion.h1
          className="font-playfair text-[7rem] md:text-[10rem] font-black leading-none bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 bg-clip-text text-transparent select-none"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          503
        </motion.h1>

        <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-3">
          {tr.errors?.serviceUnavailable?.title || "Under Maintenance"}
        </h2>

        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mb-5 mx-auto" />

        <p className="text-white/50 max-w-md mx-auto mb-6 text-base leading-relaxed">
          {tr.errors?.serviceUnavailable?.subtitle || "We're doing some upgrades behind the scenes. We'll be back shortly!"}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 mx-auto rounded-full bg-white/10 overflow-hidden mb-8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            animate={{ width: ["0%", "70%", "70%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 font-semibold px-8 h-13 shadow-xl shadow-cyan-500/30 rounded-xl text-base">
            <Link to="/">
              <Home size={18} className="mr-2" />
              {tr.errors?.goHome || "Go Back Home"}
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-13 rounded-xl text-base bg-transparent"
          >
            <RefreshCw size={18} className="mr-2" />
            {tr.errors?.retry || "Try Again"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Error503;
