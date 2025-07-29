"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Sparkles } from "lucide-react";
import { cn } from "@/utils";

// Simple fallback Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}>(({
  className,
  variant = "default",
  size = "default",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:from-pink-600 hover:to-purple-700",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8"
  };
  return <button className={cn(baseClasses, variants[variant], sizes[size], className)} ref={ref} {...props} />;
});
Button.displayName = "Button";

// Simple fallback Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({
  className,
  type,
  ...props
}, ref) => {
  return <input type={type} className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

// Simple fallback Card components
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />);
Card.displayName = "Card";
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  ...props
}, ref) => <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />);
CardTitle.displayName = "CardTitle";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  ...props
}, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />);
CardContent.displayName = "CardContent";
interface MoodTag {
  id: string;
  name: string;
  color: string;
  gradient: string;
  description: string;
}
interface TagTheMoodFeatureProps {
  onMoodTagsChange?: (tags: string[], custom_mood?: string) => void;
  maxTags?: number;
  className?: string;
}
const predefinedMoods: MoodTag[] = [{
  id: "melancholy",
  name: "Melancholy",
  color: "purple",
  gradient: "from-purple-400 to-purple-600",
  description: "Wistful and contemplative"
}, {
  id: "euphoric",
  name: "Euphoric",
  color: "gold",
  gradient: "from-yellow-400 to-orange-500",
  description: "Pure joy and elation"
}, {
  id: "rebellious",
  name: "Rebellious",
  color: "red",
  gradient: "from-red-400 to-red-600",
  description: "Defiant and fierce"
}, {
  id: "dreamy",
  name: "Dreamy",
  color: "blue",
  gradient: "from-blue-400 to-indigo-500",
  description: "Ethereal and floating"
}, {
  id: "nostalgic",
  name: "Nostalgic",
  color: "amber",
  gradient: "from-amber-400 to-orange-400",
  description: "Memories and longing"
}, {
  id: "energetic",
  name: "Energetic",
  color: "green",
  gradient: "from-green-400 to-emerald-500",
  description: "High-octane and vibrant"
}, {
  id: "contemplative",
  name: "Contemplative",
  color: "slate",
  gradient: "from-slate-400 to-slate-600",
  description: "Deep thought and reflection"
}, {
  id: "raw",
  name: "Raw",
  color: "gray",
  gradient: "from-gray-400 to-gray-600",
  description: "Unfiltered and authentic"
}];
export default function TagTheMoodFeature({
  onMoodTagsChange,
  maxTags = 3,
  className = ""
}: TagTheMoodFeatureProps) {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [custom_mood, setCustom_mood] = useState("");
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const handleMoodToggle = (moodId: string) => {
    let newSelectedMoods: string[];
    if (selectedMoods.includes(moodId)) {
      newSelectedMoods = selectedMoods.filter(id => id !== moodId);
    } else if (selectedMoods.length < maxTags) {
      newSelectedMoods = [...selectedMoods, moodId];
    } else {
      return; // Max tags reached
    }
    setSelectedMoods(newSelectedMoods);
    onMoodTagsChange?.(newSelectedMoods, custom_mood || undefined);
  };
  const handleCustomMoodSubmit = () => {
    if (custom_mood.trim() && custom_mood.length <= 24) {
      onMoodTagsChange?.(selectedMoods, custom_mood.trim());
      setShowCustomInput(false);
    }
  };
  const handleCustomMoodCancel = () => {
    setCustom_mood("");
    setShowCustomInput(false);
    onMoodTagsChange?.(selectedMoods, undefined);
  };
  const canAddMore = selectedMoods.length < maxTags;
  return <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader className="text-center pb-6">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Tag the Mood
        </CardTitle>
        <p className="text-gray-600 mt-2">
          What's the emotional vibe of this track? Choose up to {maxTags} moods.
        </p>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Mood Ring Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {predefinedMoods.map(mood => {
          const isSelected = selectedMoods.includes(mood.id);
          const isHovered = hoveredMood === mood.id;
          return <motion.button key={mood.id} onClick={() => handleMoodToggle(mood.id)} onMouseEnter={() => setHoveredMood(mood.id)} onMouseLeave={() => setHoveredMood(null)} disabled={!canAddMore && !isSelected} className={`
                  relative p-4 rounded-2xl border-2 transition-all duration-300 
                  ${isSelected ? 'border-white shadow-lg scale-105' : canAddMore ? 'border-gray-200 hover:border-gray-300 hover:scale-102' : 'border-gray-100 opacity-50 cursor-not-allowed'}
                `} whileHover={canAddMore || isSelected ? {
            scale: 1.02
          } : {}} whileTap={canAddMore || isSelected ? {
            scale: 0.98
          } : {}} layout>
                {/* Gradient Background */}
                <div className={`
                    absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.gradient} 
                    ${isSelected ? 'opacity-100' : 'opacity-20'}
                    transition-opacity duration-300
                  `} />
                
                {/* Pulsing Glow Effect */}
                <AnimatePresence>
                  {isSelected && <motion.div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.gradient} blur-md`} initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }} exit={{
                opacity: 0,
                scale: 0.8
              }} transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }} />}
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className={`
                    font-semibold text-sm mb-1 transition-colors duration-300
                    ${isSelected ? 'text-white' : 'text-gray-800'}
                  `}>
                    {mood.name}
                  </h3>
                  
                  {/* Description appears on hover or selection */}
                  <AnimatePresence>
                    {(isHovered || isSelected) && <motion.p initial={{
                  opacity: 0,
                  height: 0
                }} animate={{
                  opacity: 1,
                  height: "auto"
                }} exit={{
                  opacity: 0,
                  height: 0
                }} className={`
                          text-xs transition-colors duration-300
                          ${isSelected ? 'text-white/90' : 'text-gray-600'}
                        `}>
                        {mood.description}
                      </motion.p>}
                  </AnimatePresence>
                </div>

                {/* Selection Indicator */}
                {isSelected && <motion.div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center" initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} exit={{
              scale: 0
            }}>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                  </motion.div>}
              </motion.button>;
        })}
        </div>

        {/* Selected Moods Display */}
        {selectedMoods.length > 0 && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center">
            <p className="text-sm text-gray-600 mb-2">Selected moods:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedMoods.map(moodId => {
            const mood = predefinedMoods.find(m => m.id === moodId);
            return mood ? <span key={moodId} className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${mood.gradient}`}>
                    {mood.name}
                  </span> : null;
          })}
            </div>
          </motion.div>}

        {/* Custom Mood Section */}
        <div className="border-t pt-6">
          {!showCustomInput ? <div className="text-center">
              <Button variant="outline" onClick={() => setShowCustomInput(true)} className="border-dashed border-2 hover:border-purple-300 hover:bg-purple-50">
                <Plus className="w-4 h-4 mr-2" />
                Add Your Own Mood
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Describe this track in your own words
              </p>
            </div> : <motion.div initial={{
          opacity: 0,
          height: 0
        }} animate={{
          opacity: 1,
          height: "auto"
        }} exit={{
          opacity: 0,
          height: 0
        }} className="space-y-3">
              <div className="flex gap-2">
                <Input value={custom_mood} onChange={e => setCustom_mood(e.target.value)} placeholder="Describe the mood..." maxLength={24} className="flex-1" onKeyDown={e => {
              if (e.key === 'Enter') {
                handleCustomMoodSubmit();
              } else if (e.key === 'Escape') {
                handleCustomMoodCancel();
              }
            }} autoFocus />
                <Button onClick={handleCustomMoodSubmit} disabled={!custom_mood.trim()} size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                  Add
                </Button>
                <Button onClick={handleCustomMoodCancel} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {custom_mood.length}/24 characters
              </p>
            </motion.div>}

          {/* Custom Mood Display */}
          {custom_mood && !showCustomInput && <motion.div initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Your custom mood:</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
                <span className="text-sm font-medium text-gray-800">"{custom_mood}"</span>
                <button onClick={handleCustomMoodCancel} className="text-gray-500 hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>}
        </div>

        {/* Usage Counter */}
        <div className="text-center text-xs text-gray-500">
          {selectedMoods.length}/{maxTags} moods selected
          {custom_mood && " • 1 custom mood added"}
        </div>
      </CardContent>
    </Card>;
}
