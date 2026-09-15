import { motion } from "framer-motion";

const orbs = [
  { size: 420, color: "bg-[#6B4EFF]/25", x: "-10%", y: "10%", delay: 0 },
  { size: 360, color: "bg-[#1A2E1F]/15 dark:bg-[#6B4EFF]/15", x: "70%", y: "-5%", delay: 1.2 },
  { size: 300, color: "bg-[#A7B9A7]/30 dark:bg-[#A7B9A7]/10", x: "40%", y: "55%", delay: 2.4 },
  { size: 260, color: "bg-[#6B4EFF]/15", x: "85%", y: "60%", delay: 3.6 },
];

export default function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${orb.color}`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: [0.45, 0.75, 0.45],
            y: [0, -40, 0, 30, 0],
            x: [0, 25, -15, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 14 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Fine grain texture overlay for premium paper feel */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
