import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useLang } from "@/lib/i18n";

const EXAM_DATE = new Date("2026-04-12T11:00:00+05:30").getTime();
const RESULT_DATE = new Date("2026-05-02T10:00:00+05:30").getTime();

const CountdownTimer = ({ mode = "exam" }: { mode?: "exam" | "result" }) => {
  const { tr } = useLang();
  const TARGET_DATE = mode === "result" ? RESULT_DATE : EXAM_DATE;

  function getTimeLeft() {
    const diff = Math.max(TARGET_DATE - Date.now(), 0);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: tr.countdown.days, value: timeLeft.days },
    { label: tr.countdown.hours, value: timeLeft.hours },
    { label: tr.countdown.minutes, value: timeLeft.minutes },
    { label: tr.countdown.seconds, value: timeLeft.seconds },
  ];

  const title = mode === "result" ? "Result Countdown" : tr.countdown.title;
  const heading = mode === "result" ? "Result Available on 2 May 2026" : tr.countdown.heading;

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary/10 text-secondary text-[10px] sm:text-xs font-semibold mb-4 sm:mb-6">
            <Timer size={12} className="sm:w-3.5 sm:h-3.5" />
            <span>{title}</span>
          </div>
          <h2 className="font-playfair text-lg sm:text-2xl md:text-3xl font-bold text-foreground mb-5 sm:mb-8">
            {heading}
          </h2>
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 md:gap-4">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
                <div className="glass-morphism rounded-xl sm:rounded-2xl p-2.5 sm:p-4 md:p-6 min-w-[56px] sm:min-w-[70px] md:min-w-[110px] luxury-border card-inner-glow relative overflow-hidden hover:scale-105 transition-transform duration-300">
                  <motion.p
                    key={unit.value}
                    className="font-playfair text-xl sm:text-3xl md:text-5xl font-bold text-gradient"
                    initial={{ y: -5, opacity: 0.5 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
                  >
                    {String(unit.value).padStart(2, "0")}
                  </motion.p>
                  <p className="text-[9px] sm:text-xs text-muted-foreground mt-1 sm:mt-2 uppercase tracking-wider font-medium">
                    {unit.label}
                  </p>
                </div>
                {i < units.length - 1 && (
                  <span className="font-playfair text-lg sm:text-2xl md:text-4xl font-bold text-secondary/40 animate-glow-pulse">:</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownTimer;
