"use client";

import * as React from "react";
import { motion } from "framer-motion";
interface MoodTagDisplayProps {
  moods: string[];
  custom_mood?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}
const moodColors: Record<string, string> = {
  melancholy: "from-purple-400 to-purple-600",
  euphoric: "from-yellow-400 to-orange-500",
  rebellious: "from-red-400 to-red-600",
  dreamy: "from-blue-400 to-indigo-500",
  nostalgic: "from-amber-400 to-orange-400",
  energetic: "from-green-400 to-emerald-500",
  contemplative: "from-slate-400 to-slate-600",
  raw: "from-gray-400 to-gray-600"
};
const sizeClasses = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base"
};
export default function MoodTagDisplay({
  moods,
  custom_mood,
  size = "md",
  className = ""
}: MoodTagDisplayProps) {
  if (moods.length === 0 && !custom_mood) {
    return null;
  }
  return <div className={`flex flex-wrap gap-2 ${className}`}>
      {moods.map((mood, index) => {
      const gradient = moodColors[mood.toLowerCase()] || "from-gray-400 to-gray-600";
      return <motion.span key={mood} initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        delay: index * 0.1
      }} className={`
              inline-flex items-center rounded-full font-medium text-white
              bg-gradient-to-r ${gradient} ${sizeClasses[size]}
              shadow-sm hover:shadow-md transition-shadow
            `}>
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </motion.span>;
    })}
      
      {custom_mood && <motion.span initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      delay: moods.length * 0.1
    }} className={`
            inline-flex items-center rounded-full font-medium
            bg-gradient-to-r from-pink-400 to-purple-500 text-white
            ${sizeClasses[size]} shadow-sm hover:shadow-md transition-shadow
            border-2 border-white/20
          `}>
          "{custom_mood}"
        </motion.span>}
    </div>;
}
