import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

const BrokenGearsSVG = () => (
  <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
    {/* Large gear */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "90px 100px" }}
    >
      <path d="M90 60 L95 70 L105 68 L108 58 L100 52 L92 55 Z" fill="#a855f7" />
      <path d="M120 75 L115 85 L120 92 L130 90 L132 80 L125 72 Z" fill="#a855f7" />
      <path d="M125 105 L118 110 L120 122 L130 128 L135 118 L128 108 Z" fill="#a855f7" />
      <path d="M108 135 L100 140 L92 138 L88 148 L98 152 L108 145 Z" fill="#a855f7" />
      <path d="M68 128 L72 118 L65 110 L55 115 L52 125 L60 130 Z" fill="#a855f7" />
      <path d="M55 95 L60 88 L55 78 L45 78 L42 88 L48 95 Z" fill="#a855f7" />
      <path d="M68 70 L75 75 L78 65 L72 58 L62 62 L65 72 Z" fill="#a855f7" />
      <circle cx="90" cy="100" r="25" fill="#7c3aed" />
      <circle cx="90" cy="100" r="12" fill="#1a0a2e" />
    </motion.g>

    {/* Small gear - breaks and falls */}
    <motion.g
      animate={{
        rotate: [0, -360, -360, -360],
        y: [0, 0, 0, 80],
        x: [0, 0, 0, 20],
        opacity: [1, 1, 1, 0],
      }}
      transition={{ duration: 6, repeat: Infinity, times: [0, 0.6, 0.7, 1], ease: "easeInOut" }}
      style={{ transformOrigin: "175px 75px" }}
    >
      <path d="M175 45 L178 52 L186 50 L188 42 L182 38 L176 42 Z" fill="#ec4899" />
      <path d="M195 58 L190 65 L195 72 L203 70 L204 62 L198 56 Z" fill="#ec4899" />
      <path d="M192 85 L185 90 L186 98 L194 100 L200 94 L196 86 Z" fill="#ec4899" />
      <path d="M175 98 L170 92 L162 96 L162 104 L170 106 L175 100 Z" fill="#ec4899" />
      <path d="M155 85 L158 78 L152 72 L145 76 L145 84 L150 88 Z" fill="#ec4899" />
      <path d="M158 60 L162 66 L168 62 L168 54 L162 50 L156 55 Z" fill="#ec4899" />
      <circle cx="175" cy="75" r="16" fill="#db2777" />
      <circle cx="175" cy="75" r="7" fill="#1a0a2e" />
    </motion.g>

    {/* Sparks when gear breaks */}
    {[0, 1, 2, 3].map((i) => (
      <motion.circle
        key={i}
        cx={175 + (i % 2 === 0 ? -10 : 10)}
        cy={75}
        r={3}
        fill="#fbbf24"
        animate={{
          x: [(i - 1.5) * 5, (i - 1.5) * 30],
          y: [0, (i % 2 === 0 ? -20 : 20)],
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 5.4, delay: 3.6 + i * 0.1 }}
      />
    ))}
  </svg>
);

const Error500 = () => {
  const { tr } = useLang();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1052 30%, #1a0a2e 100%)" }}
    >
      {/* Background video */}
      <video
        autoPlay muted loop playsInline preload="none"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
        onError={(e) => (e.currentTarget.style.display = "none")}
      >
        <source src="https://videos.pexels.com/video-files/6981411/6981411-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>

      {/* Glitch scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.03) 2px, rgba(139,92,246,0.03) 4px)",
      }} />

      {/* Glitch flicker */}
      <motion.div
        className="absolute inset-0 bg-purple-500/5"
        animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2.5 }}
      />

      {/* Content card */}
      <motion.div
        className="relative z-10 text-center px-8 py-12 max-w-xl rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-4">
          <BrokenGearsSVG />
        </div>

        <motion.h1
          className="font-playfair text-[7rem] md:text-[10rem] font-black leading-none bg-gradient-to-b from-purple-300 via-pink-400 to-purple-600 bg-clip-text text-transparent select-none"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          500
        </motion.h1>

        <h2 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-3">
          {tr.errors?.serverError?.title || "Something Broke"}
        </h2>

        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mb-5 mx-auto" />

        <p className="text-white/50 max-w-md mx-auto mb-8 text-base leading-relaxed">
          {tr.errors?.serverError?.subtitle || "Our gears got jammed. We're working hard to fix things. Please try again in a moment."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:opacity-90 font-semibold px-8 h-13 shadow-xl shadow-purple-500/30 rounded-xl text-base">
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

export default Error500;
