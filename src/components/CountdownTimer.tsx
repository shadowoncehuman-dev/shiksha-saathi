import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { useLang } from "@/lib/i18n";

// countdown should fire at the start of first group on 12 April
const TARGET_DATE = new Date("2026-04-12T11:00:00+05:30").getTime();

const CountdownTimer = () => {
  const { tr } = useLang();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = Math.max(TARGET_DATE - Date.now(), 0);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

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

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-6">
            <Timer size={14} />
            <span>{tr.countdown.title}</span>
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-bold text-foreground mb-8">
            {tr.countdown.heading}
          </h2>
          <div className="flex justify-center gap-3 md:gap-6">
            {units.map((unit) => (
              <div key={unit.label} className="bg-card rounded-2xl p-4 md:p-6 min-w-[70px] md:min-w-[100px] premium-shadow border border-border">
                <motion.p
                  key={unit.value}
                  className="font-playfair text-3xl md:text-5xl font-bold text-primary"
                  initial={{ y: -5, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {String(unit.value).padStart(2, "0")}
                </motion.p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider font-medium">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownTimer;
