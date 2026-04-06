import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const AstronautSVG = () => (
  <motion.svg
    width="280"
    height="280"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    className="drop-shadow-2xl"
  >
    {/* Helmet */}
    <circle cx="100" cy="70" r="40" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
    <circle cx="100" cy="70" r="30" fill="#1e293b" opacity="0.8" />
    <ellipse cx="92" cy="65" rx="8" ry="12" fill="#3b82f6" opacity="0.3" />
    {/* Visor reflection */}
    <motion.ellipse
      cx="110" cy="60" rx="5" ry="8" fill="white" opacity="0.2"
      animate={{ opacity: [0.1, 0.4, 0.1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    {/* Body */}
    <rect x="75" y="108" width="50" height="55" rx="12" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    {/* Backpack */}
    <rect x="60" y="112" width="18" height="40" rx="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
    {/* Life support tubes */}
    <path d="M78 120 Q65 100 85 70" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 3" />
    {/* Left arm */}
    <motion.g animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "75px 120px" }}>
      <rect x="50" y="118" width="28" height="12" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="48" cy="124" r="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    </motion.g>
    {/* Right arm */}
    <motion.g animate={{ rotate: [0, -10, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "125px 120px" }}>
      <rect x="122" y="118" width="28" height="12" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <circle cx="152" cy="124" r="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    </motion.g>
    {/* Left leg */}
    <rect x="80" y="160" width="14" height="30" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <rect x="76" y="186" width="22" height="10" rx="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
    {/* Right leg */}
    <rect x="106" y="160" width="14" height="30" rx="6" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
    <rect x="102" y="186" width="22" height="10" rx="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
  </motion.svg>
);

const StarField = () => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 60 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
        }}
        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
      />
    ))}
  </div>
);

const Error404 = () => {
  const location = useLocation();
  const { tr } = useLang();

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0a2e 0%, #1a1145 30%, #0c1445 60%, #0a0e2a 100%)" }}>
      {/* Background video */}
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        onError={(e) => (e.currentTarget.style.display = "none")}
      >
        <source src="https://videos.pexels.com/video-files/1851190/1851190-uhd_2560_1440_24fps.mp4" type="video/mp4" />
      </video>

      <StarField />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full px-6 py-12 gap-8 lg:gap-16">
        {/* Astronaut */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-shrink-0"
        >
          <AstronautSVG />
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center lg:text-left max-w-lg"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="font-playfair text-[7rem] md:text-[10rem] font-black leading-none bg-gradient-to-b from-blue-300 via-purple-300 to-indigo-500 bg-clip-text text-transparent select-none"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            404
          </motion.h1>

          <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-3">
            {tr.errors?.notFound?.title || "Lost in Space"}
          </h2>

          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 mb-5 mx-auto lg:mx-0" />

          <p className="text-white/50 mb-8 text-base leading-relaxed">
            {tr.errors?.notFound?.subtitle || "The page you're looking for has drifted into the cosmic void. Let's navigate you back to safety."}
          </p>

          <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 font-semibold px-8 h-13 shadow-xl shadow-blue-500/30 rounded-xl text-base">
            <Link to="/">
              <Home size={18} className="mr-2" />
              {tr.errors?.goHome || "Go Back Home"}
            </Link>
          </Button>

          <motion.div
            className="mt-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <code className="text-white/30 text-xs font-mono">{location.pathname}</code>
          </motion.div>
        </motion.div>
      </div>

      {/* Shooting star */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_6px_2px_rgba(255,255,255,0.6)]"
        animate={{ x: ["-10vw", "110vw"], y: ["10vh", "60vh"], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
      />
    </div>
  );
};

export default Error404;
