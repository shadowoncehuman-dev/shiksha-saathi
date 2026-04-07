import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";

interface RegistrationFailedProps {
  error: string;
  onRetry: () => void;
}

const RegistrationFailed = ({ error, onRetry }: RegistrationFailedProps) => {
  const navigate = useNavigate();
  const { tr } = useLang();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-20 pb-16">
      <motion.div
        className="bg-card rounded-2xl p-8 md:p-10 text-center max-w-md w-full premium-shadow border border-border"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        {/* Animated X mark */}
        <motion.div
          className="mx-auto mb-6 w-20 h-20 relative"
          animate={{ x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.svg viewBox="0 0 80 80" className="w-20 h-20">
            <motion.circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="hsl(0, 70%, 55%)"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.path
              d="M28 28 L52 52"
              fill="none"
              stroke="hsl(0, 70%, 55%)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            <motion.path
              d="M52 28 L28 52"
              fill="none"
              stroke="hsl(0, 70%, 55%)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            />
          </motion.svg>
          <motion.div
            className="absolute inset-0 rounded-full bg-destructive/10"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-playfair text-2xl font-bold text-foreground mb-3">
            {tr.regFailed?.title || "Registration Failed"}
          </h2>
          <div className="bg-destructive/5 rounded-xl p-3 mb-6 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={onRetry}
              className="w-full bg-destructive hover:bg-destructive/90 text-white h-12 rounded-xl font-semibold"
            >
              <RefreshCw size={16} className="mr-2" />
              {tr.regFailed?.tryAgain || "Try Again"}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full h-11 rounded-xl"
            >
              <Home size={16} className="mr-2" />
              {tr.regFailed?.goHome || "Go Home"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegistrationFailed;
