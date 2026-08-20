import React from "react";
import { motion } from "framer-motion";

interface AnimatedDataRingProps {
  percentage: number;
  label: string;
  sublabel: string;
  size?: number;
}

const AnimatedDataRing: React.FC<AnimatedDataRingProps> = ({ 
  percentage, 
  label, 
  sublabel,
  size = 200 
}) => {
  const radius = size * 0.4;
  const stroke = size * 0.05;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: 0 }}
          strokeOpacity={0.1}
          className="text-[#1A2E1F] dark:text-[#E8EDE3]"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Animated progress arc */}
        <motion.circle
          stroke="#6B4EFF"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-serif font-bold text-[#1A2E1F] dark:text-[#E8EDE3]"
        >
          {label}
        </motion.span>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-[10px] font-sans font-semibold text-[#7A8C7C] uppercase tracking-widest mt-1"
        >
          {sublabel}
        </motion.span>
      </div>
      
      {/* Decorative inner glow */}
      <div className="absolute inset-4 rounded-full bg-[#6B4EFF]/5 blur-xl pointer-events-none" />
    </div>
  );
};

export default AnimatedDataRing;