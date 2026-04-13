import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

const QuestionPaperBanner = () => {
  const { lang } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container mx-auto px-4"
    >
      <Link
        to="/downloads"
        className="group flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border border-primary/15 hover:border-primary/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-foreground">
              {lang === "hi" ? "प्रश्न पत्र उपलब्ध हैं" : "Question Papers Available"}
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground">
              {lang === "hi"
                ? "इस वर्ष के प्रश्न पत्र डाउनलोड करें"
                : "Download this year's question papers"}
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
};

export default QuestionPaperBanner;
