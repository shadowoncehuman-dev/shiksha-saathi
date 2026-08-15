import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import MagnificationDock from "@/components/premium/MagnificationDock";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  UserPlus, 
  Trophy, 
  Image as ImageIcon, 
  FileText, 
  Users,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBaseProps {
  code: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  themeColor: string;
  accentColor: string;
  showRetry?: boolean;
}

const ErrorBase = ({ code, title, subtitle, icon, themeColor, accentColor, showRetry }: ErrorBaseProps) => {
  const { tr } = useLang();
  const navigate = useNavigate();

  const dockItems = [
    { icon: <Home size={20} className="text-foreground" />, label: tr.errors?.dock?.home || "Home", onClick: () => navigate("/") },
    { icon: <Calendar size={20} className="text-foreground" />, label: tr.errors?.dock?.exam || "Exam", onClick: () => navigate("/exam-details") },
    { icon: <UserPlus size={20} className="text-foreground" />, label: tr.errors?.dock?.register || "Register", onClick: () => navigate("/register") },
    { icon: <Trophy size={20} className="text-foreground" />, label: tr.errors?.dock?.result || "Result", onClick: () => navigate("/result") },
    { icon: <Users size={20} className="text-foreground" />, label: tr.errors?.dock?.team || "Team", onClick: () => navigate("/team") },
    { icon: <ImageIcon size={20} className="text-foreground" />, label: tr.errors?.dock?.gallery || "Gallery", onClick: () => navigate("/gallery") },
    { icon: <FileText size={20} className="text-foreground" />, label: tr.errors?.dock?.docs || "Docs", onClick: () => navigate("/downloads") },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background grain-overlay">
      {/* Texture & Theme Overlays */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ background: `radial-gradient(circle at 50% 50%, ${themeColor}, transparent 70%)` }} />
      
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(${themeColor} 1px, transparent 1px), linear-gradient(90deg, ${themeColor} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 container max-w-2xl px-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="mb-8 inline-block p-6 rounded-3xl glass-card gold-glow"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>

        <motion.h1 
          className="text-[8rem] md:text-[12rem] font-black leading-none mb-4 select-none opacity-10 font-playfair absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {code}
        </motion.h1>

        <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 premium-gradient-text tracking-tight relative z-10">
          {title}
        </h1>

        <div className="section-divider mb-6" />

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed font-medium">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Button 
            onClick={() => navigate("/")}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 h-14 font-semibold shadow-xl transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Home className="mr-2 h-5 w-5" />
            {tr.errors?.goHome || "Go Back Home"}
          </Button>

          <Button 
            onClick={() => navigate("/exam-details")}
            variant="outline"
            size="lg"
            className="rounded-xl px-6 h-14 font-semibold border-2 transition-all hover:bg-muted w-full sm:w-auto"
          >
            <Calendar className="mr-2 h-5 w-5" />
            {tr.errors?.dock?.exam || "Exam Details"}
          </Button>

          <Button 
            onClick={() => navigate("/register")}
            variant="outline"
            size="lg"
            className="rounded-xl px-6 h-14 font-semibold border-2 transition-all hover:bg-muted w-full sm:w-auto"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {tr.errors?.dock?.register || "Register Now"}
          </Button>

          {showRetry && (
            <Button 
              onClick={() => window.location.reload()}
              variant="ghost"
              size="lg"
              className="rounded-xl px-6 h-14 font-semibold transition-all hover:bg-muted w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              {tr.errors?.retry || "Try Again"}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Institutional Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <div className="p-2 rounded-2xl bg-card/40 backdrop-blur-md border border-border/50 shadow-2xl">
          <MagnificationDock items={dockItems} />
        </div>
      </div>
    </div>
  );
};

export default ErrorBase;