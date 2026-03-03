import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import logo from "@/assets/logo.png";

const NotFound = () => {
  const location = useLocation();
  const { tr } = useLang();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grain-overlay" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/[0.03]" />
      <div className="absolute bottom-20 -left-20 w-64 h-64 rounded-full border border-secondary/[0.08]" />

      <img src={logo} alt="" className="absolute inset-0 m-auto w-64 h-64 opacity-[0.03] select-none pointer-events-none" />

      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <AlertTriangle size={40} className="text-secondary" />
        </motion.div>

        <motion.h1
          className="font-playfair text-7xl md:text-9xl font-bold text-white/10 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        <h2 className="font-playfair text-2xl md:text-3xl font-bold text-white mb-3">
          {tr.notFound.title}
        </h2>
        <p className="text-white/40 max-w-md mx-auto mb-10 text-sm leading-relaxed">
          {tr.notFound.subtitle}
        </p>

        <Button asChild size="lg" className="bg-secondary text-white hover:bg-secondary/90 font-semibold px-8 h-12 shadow-lg shadow-secondary/20 rounded-xl">
          <Link to="/">
            <Home size={16} className="mr-2" />
            {tr.notFound.goHome}
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
