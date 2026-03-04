import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, AlertTriangle, ShieldX, ServerCrash, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";
import errorBg from "@/assets/error-bg.jpg";

interface ErrorPageProps {
  code?: number;
  title?: string;
  subtitle?: string;
}

const errorConfig: Record<number, { icon: typeof AlertTriangle; gradient: string }> = {
  404: { icon: AlertTriangle, gradient: "from-secondary to-accent" },
  403: { icon: ShieldX, gradient: "from-red-500 to-orange-500" },
  500: { icon: ServerCrash, gradient: "from-purple-500 to-pink-500" },
  503: { icon: WifiOff, gradient: "from-blue-500 to-cyan-500" },
};

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 8 + 4,
  delay: Math.random() * 3,
}));

const ErrorPage = ({ code = 404, title, subtitle }: ErrorPageProps) => {
  const location = useLocation();
  const { tr } = useLang();
  const [glitchActive, setGlitchActive] = useState(false);

  const config = errorConfig[code] || errorConfig[404];
  const Icon = config.icon;

  const errorTexts: Record<number, { title: string; subtitle: string }> = {
    404: { title: tr.errors?.notFound?.title || "Page Not Found", subtitle: tr.errors?.notFound?.subtitle || "The page you're looking for has vanished into the digital void." },
    403: { title: tr.errors?.forbidden?.title || "Access Denied", subtitle: tr.errors?.forbidden?.subtitle || "You don't have permission to access this page." },
    500: { title: tr.errors?.serverError?.title || "Server Error", subtitle: tr.errors?.serverError?.subtitle || "Something went wrong on our end. We're working on it!" },
    503: { title: tr.errors?.serviceUnavailable?.title || "Service Unavailable", subtitle: tr.errors?.serviceUnavailable?.subtitle || "Our servers are temporarily down for maintenance." },
  };

  const displayTitle = title || errorTexts[code]?.title || "Error";
  const displaySubtitle = subtitle || errorTexts[code]?.subtitle || "Something went wrong.";

  useEffect(() => {
    if (code === 404) {
      console.error("404 Error: User attempted to access:", location.pathname);
    }
  }, [location.pathname, code]);

  // Glitch effect interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={errorBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary/95" />
      </div>

      {/* Floating particles */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-secondary/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      {/* Watermark logo */}
      <motion.img
        src={logo}
        alt=""
        className="absolute inset-0 m-auto w-80 h-80 opacity-[0.04] select-none pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Animated icon */}
        <motion.div
          className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto mb-8 shadow-2xl`}
          animate={{
            rotate: [0, -8, 8, -4, 4, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{ boxShadow: `0 0 60px -10px hsl(var(--secondary) / 0.4)` }}
        >
          <Icon size={48} className="text-white drop-shadow-lg" />
        </motion.div>

        {/* Glitch error code */}
        <div className="relative mb-6">
          <motion.h1
            className={`font-playfair text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-b ${config.gradient} bg-clip-text text-transparent select-none`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {code}
          </motion.h1>

          {/* Glitch overlay */}
          <AnimatePresence>
            {glitchActive && (
              <motion.h1
                className={`absolute inset-0 font-playfair text-[8rem] md:text-[12rem] font-black leading-none bg-gradient-to-b ${config.gradient} bg-clip-text text-transparent select-none`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 0.7, x: 5 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.1 }}
                style={{ filter: "blur(1px)" }}
              >
                {code}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <motion.h2
          className="font-playfair text-2xl md:text-4xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {displayTitle}
        </motion.h2>

        {/* Divider */}
        <motion.div
          className={`w-20 h-1 mx-auto rounded-full bg-gradient-to-r ${config.gradient} mb-6`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-white/50 max-w-md mx-auto mb-10 text-base leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {displaySubtitle}
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-secondary to-accent text-white hover:opacity-90 font-semibold px-8 h-13 shadow-xl shadow-secondary/30 rounded-xl text-base"
          >
            <Link to="/">
              <Home size={18} className="mr-2" />
              {tr.errors?.goHome || "Go Back Home"}
            </Link>
          </Button>

          {(code === 500 || code === 503) && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-white/20 text-white hover:bg-white/10 font-semibold px-8 h-13 rounded-xl text-base bg-transparent"
            >
              <RefreshCw size={18} className="mr-2" />
              {tr.errors?.retry || "Try Again"}
            </Button>
          )}
        </motion.div>

        {/* Path display for 404 */}
        {code === 404 && (
          <motion.div
            className="mt-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <code className="text-white/30 text-xs font-mono">{location.pathname}</code>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom scanline effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default ErrorPage;
