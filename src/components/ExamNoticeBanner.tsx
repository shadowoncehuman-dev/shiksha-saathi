import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Calendar, Info, X, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

interface ExamNoticeBannerProps {
  /** If true, the banner cannot be dismissed (used on Register when cancelled/rescheduled) */
  persistent?: boolean;
  /** Callback with notice data for parent components */
  onNoticeLoaded?: (notice: string | null, type: string) => void;
}

const iconMap = {
  cancelled: AlertTriangle,
  rescheduled: Calendar,
  warning: AlertCircle,
  info: Info,
};

const styleMap = {
  cancelled: {
    bg: "bg-destructive/10 border-destructive/30",
    icon: "text-destructive",
    text: "text-destructive",
  },
  rescheduled: {
    bg: "bg-[hsl(30,90%,95%)] dark:bg-[hsl(30,50%,15%)] border-[hsl(30,80%,50%)]/30",
    icon: "text-[hsl(30,80%,45%)]",
    text: "text-[hsl(30,80%,35%)] dark:text-[hsl(30,80%,65%)]",
  },
  warning: {
    bg: "bg-[hsl(45,90%,95%)] dark:bg-[hsl(45,50%,15%)] border-[hsl(45,80%,50%)]/30",
    icon: "text-[hsl(45,80%,40%)]",
    text: "text-[hsl(45,80%,30%)] dark:text-[hsl(45,80%,65%)]",
  },
  info: {
    bg: "bg-[hsl(210,90%,95%)] dark:bg-[hsl(210,50%,15%)] border-[hsl(210,80%,50%)]/30",
    icon: "text-[hsl(210,80%,45%)]",
    text: "text-[hsl(210,80%,35%)] dark:text-[hsl(210,80%,65%)]",
  },
};

const ExamNoticeBanner = ({ persistent = false, onNoticeLoaded }: ExamNoticeBannerProps) => {
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeType, setNoticeType] = useState<string>("info");
  const [dismissed, setDismissed] = useState(false);
  const { tr } = useLang();

  useEffect(() => {
    const fetchNotice = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("exam_notice, exam_notice_type")
        .single();
      const n = (data as any)?.exam_notice || null;
      const t = (data as any)?.exam_notice_type || "info";
      setNotice(n);
      setNoticeType(t);
      onNoticeLoaded?.(n, t);

      if (!persistent) {
        const key = `notice_dismissed_${n}`;
        if (sessionStorage.getItem(key)) setDismissed(true);
      }
    };
    fetchNotice();
  }, []);

  const handleDismiss = () => {
    if (notice) sessionStorage.setItem(`notice_dismissed_${notice}`, "1");
    setDismissed(true);
  };

  if (!notice || (dismissed && !persistent)) return null;

  const type = noticeType as keyof typeof styleMap;
  const style = styleMap[type] || styleMap.info;
  const Icon = iconMap[type] || Info;
  const typeLabel = tr.examNotice?.[type] || type;

  return (
    <AnimatePresence>
      <motion.div
        className={`rounded-2xl border p-4 md:p-5 ${style.bg} relative`}
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className="shrink-0 mt-0.5"
            animate={type === "cancelled" ? { rotate: [0, -5, 5, -5, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Icon size={20} className={style.icon} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${style.icon}`}>
              {typeLabel}
            </p>
            <p className={`text-sm leading-relaxed ${style.text}`}>{notice}</p>
          </div>
          {!persistent && (
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExamNoticeBanner;
