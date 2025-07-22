"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Music, Share2, Eye, EyeOff, Users } from "lucide-react";
import { cn } from "@/utils";
import MoodTagDisplay from "./MoodTagDisplay";

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

// Simple fallback Badge component
const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline";
}>(({
  className,
  variant = "default",
  ...props
}, ref) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground"
  };
  return <div ref={ref} className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />;
});
Badge.displayName = "Badge";
interface TrackUploadConfirmationProps {
  trackName: string;
  moods: string[];
  customMood?: string;
  file?: File;
  onConfirm?: (shareLevel: 'private' | 'inner-circle' | 'public') => void;
  onEdit?: () => void;
  className?: string;
}
export default function TrackUploadConfirmation({
  trackName,
  moods,
  customMood,
  onConfirm,
  onEdit,
  className = ""
}: TrackUploadConfirmationProps) {
  const [shareLevel, setShareLevel] = React.useState<'private' | 'inner-circle' | 'public'>('private');
  const shareOptions = [{
    id: 'private' as const,
    icon: EyeOff,
    title: 'Private',
    description: 'A notebook only you can read',
    color: 'from-gray-400 to-gray-600'
  }, {
    id: 'inner-circle' as const,
    icon: Users,
    title: 'Inner Circle',
    description: 'Trusted ears for early feedback',
    color: 'from-blue-400 to-purple-400'
  }, {
    id: 'public' as const,
    icon: Share2,
    title: 'Public',
    description: 'Throw it to the cosmos and see who resonates',
    color: 'from-green-400 to-emerald-500'
  }] as any[];
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} animate={{
    opacity: 1,
    y: 0
  }} className={className}>
      <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <motion.div initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          delay: 0.2,
          type: "spring"
        }} className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
            Track Uploaded Successfully!
          </CardTitle>
          
          <p className="text-gray-600">
            Your riff is ready to share with the world
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Track Info */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 text-lg">{trackName}</h3>
                <p className="text-sm text-gray-500">Audio file • Ready to share</p>
              </div>
            </div>

            {/* Mood Tags */}
            {(moods.length > 0 || customMood) && <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Mood Tags:</p>
                <MoodTagDisplay moods={moods} customMood={customMood} size="md" className="justify-center" />
              </div>}
          </div>

          {/* Share Level Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-center">Choose Your Audience</h4>
            
            <div className="grid gap-3">
              {shareOptions.map(option => {
              const Icon = option.icon;
              const isSelected = shareLevel === option.id;
              return <motion.button key={option.id} onClick={() => setShareLevel(option.id)} className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${isSelected ? 'border-purple-300 bg-purple-50 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                    `} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }}>
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        bg-gradient-to-r ${option.color}
                      `}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-800">{option.title}</h5>
                          {isSelected && <Badge variant="secondary" className="text-xs">
                              Selected
                            </Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </motion.button>;
            })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onEdit} className="flex-1">
              Edit Details
            </Button>
            
            <Button onClick={() => {
            console.log('Confirming upload with:', {
              trackName,
              moods,
              customMood,
              shareLevel
            });
            onConfirm?.(shareLevel);
          }} className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              Share Your Riff
            </Button>
          </div>

          {/* Next Steps Hint */}
          <div className="text-center text-sm text-gray-500 pt-2 border-t">
            Your track will appear in your profile and can be discovered by mood tags
          </div>
        </CardContent>
      </Card>
    </motion.div>;
}
