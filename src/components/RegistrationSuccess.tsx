import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface RegistrationSuccessProps {
  rollNumber: string;
  name: string;
  studentClass: number;
  group: string;
}

const RegistrationSuccess = ({ rollNumber, name, studentClass, group }: RegistrationSuccessProps) => {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: "-10px",
              backgroundColor: [
                "hsl(142, 71%, 45%)",
                "hsl(43, 96%, 56%)",
                "hsl(210, 80%, 55%)",
                "hsl(330, 80%, 55%)",
                "hsl(280, 70%, 55%)",
              ][i % 5],
            }}
            animate={{
              y: [0, window.innerHeight + 50],
              x: [0, (Math.random() - 0.5) * 200],
              rotate: [0, 720],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2.5 + Math.random() * 2,
              delay: Math.random() * 1.5,
              ease: "easeIn",
            }}
          />
        ))}
      </div>

      <motion.div
        className="bg-card rounded-2xl p-8 md:p-10 text-center max-w-md w-full premium-shadow border border-border relative z-10"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        {/* Animated checkmark */}
        <div className="relative mx-auto mb-6 w-20 h-20">
          <motion.svg viewBox="0 0 80 80" className="w-20 h-20">
            <motion.circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M24 42 L34 52 L56 30"
              fill="none"
              stroke="hsl(142, 71%, 45%)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
          </motion.svg>
          <motion.div
            className="absolute inset-0 rounded-full bg-[hsl(142,71%,45%)]/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Sparkles size={14} className="text-[hsl(142,71%,45%)]" />
            <span className="text-[hsl(142,71%,45%)] text-xs font-semibold uppercase tracking-wider">
              {tr.regSuccess?.badge || "Registration Successful"}
            </span>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
            {tr.regSuccess?.title || "You're Registered!"}
          </h2>

          {/* Roll Number Card */}
          <div className="bg-[hsl(142,71%,45%)]/5 rounded-xl p-4 mb-4 border border-[hsl(142,71%,45%)]/20">
            <p className="text-xs text-muted-foreground mb-1">{tr.regSuccess?.rollLabel || "Your Roll Number"}</p>
            <p className="font-mono text-3xl font-bold text-[hsl(142,71%,45%)]">{rollNumber}</p>
          </div>

          {/* Student Info */}
          <div className="text-sm text-muted-foreground mb-6 space-y-1">
            <p><span className="font-medium text-foreground">{name}</span></p>
            <p>Class {studentClass} • {group}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/admit-card")}
              className="w-full bg-[hsl(142,71%,45%)] hover:bg-[hsl(142,71%,40%)] text-white h-12 rounded-xl font-semibold"
            >
              <Download size={16} className="mr-2" />
              {tr.regSuccess?.downloadAdmitCard || "Download Admit Card"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full h-11 rounded-xl"
            >
              <Home size={16} className="mr-2" />
              {tr.regSuccess?.goHome || "Go Home"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccess;
