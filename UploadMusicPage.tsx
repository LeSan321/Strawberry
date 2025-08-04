"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Music, FileAudio, CheckCircle, X, Sparkles, Zap, Users, EyeOff, Share2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils";
import { useAuth } from "./lib/AuthContext";
import { uploadTrackToSupabase } from "./lib/uploadUtils";

// Simple fallback components
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
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({
  className,
  type,
  ...props
}, ref) => {
  return <input type={type} className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />;
});
Input.displayName = "Input";
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

// Mood Tag Component
interface MoodTag {
  id: string;
  name: string;
  gradient: string;
  description: string;
}
const predefinedMoods: MoodTag[] = [{
  id: "melancholy",
  name: "Melancholy",
  gradient: "from-purple-400 to-purple-600",
  description: "Wistful and contemplative"
}, {
  id: "euphoric",
  name: "Euphoric",
  gradient: "from-yellow-400 to-orange-500",
  description: "Pure joy and elation"
}, {
  id: "rebellious",
  name: "Rebellious",
  gradient: "from-red-400 to-red-600",
  description: "Defiant and fierce"
}, {
  id: "dreamy",
  name: "Dreamy",
  gradient: "from-blue-400 to-indigo-500",
  description: "Ethereal and floating"
}, {
  id: "nostalgic",
  name: "Nostalgic",
  gradient: "from-amber-400 to-orange-400",
  description: "Memories and longing"
}, {
  id: "energetic",
  name: "Energetic",
  gradient: "from-green-400 to-emerald-500",
  description: "High-octane and vibrant"
}];

// Upload State Types
type UploadState = 'idle' | 'uploading' | 'success' | 'error';
type VisibilityLevel = 'private' | 'inner-circle' | 'public';
interface UploadFormData {
  file: File | null;
  title: string;
  selectedMoods: string[];
  customMood: string;
  visibility: VisibilityLevel;
}
const UploadMusicPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [showCustomMoodInput, setShowCustomMoodInput] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    file: null,
    title: '',
    selectedMoods: [],
    customMood: '',
    visibility: 'private'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const features = [{
    icon: Sparkles,
    title: "High-Fidelity, Zero Compromise",
    description: "We stream lossless audio up to 24-bit/192 kHz because nuance matters.",
    gradient: 'from-purple-400 to-pink-400'
  }, {
    icon: Zap,
    title: "Share With Intention",
    description: "• Private – A notebook only you can read • Inner Circle – Trusted ears for early feedback • Public – Throw it to the cosmos and see who resonates.",
    gradient: 'from-blue-400 to-purple-400'
  }, {
    icon: Users,
    title: 'Community',
    description: "Post, listen, respond. Courage is contagious. Vibe with your tribe.",
    gradient: 'from-green-400 to-blue-400'
  }] as any[];
  const visibilityOptions = [{
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

  // File handling
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };
  const handleFileSelection = (file: File) => {
    if (file.type.startsWith('audio/')) {
      setFormData(prev => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "") // Auto-fill title from filename
      }));
      setShowMoodSelector(true);
      setUploadState('idle');
      setErrorMessage('');
    } else {
      setErrorMessage('Please select a valid audio file (MP3, WAV, FLAC, etc.)');
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Mood handling
  const handleMoodToggle = (moodId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedMoods: prev.selectedMoods.includes(moodId) ? prev.selectedMoods.filter(id => id !== moodId) : prev.selectedMoods.length < 3 ? [...prev.selectedMoods, moodId] : prev.selectedMoods
    }));
  };
  const handleCustomMoodSubmit = () => {
    if (formData.customMood.trim() && formData.customMood.length <= 24) {
      setShowCustomMoodInput(false);
    }
  };

  // Upload & Share function
  const handleUploadAndShare = async () => {
    if (!user) {
      setErrorMessage('Please sign in to upload tracks');
      return;
    }
    
    if (!formData.file) {
      setErrorMessage('Please select an audio file');
      return;
    }
    
    setUploadState('uploading');
    setUploadProgress(0);
    setErrorMessage('');
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadData = {
        user_id: user.id,
        title: formData.title || formData.file.name.replace(/\.[^/.]+$/, ""),
        tags: formData.selectedMoods,
        custom_mood: formData.customMood || undefined,
        visibility: formData.visibility,
        file: formData.file,
      };

      // Upload to Supabase
      await uploadTrackToSupabase(uploadData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadState('success');

      // Reset form after success
      setTimeout(() => {
        setFormData({
          file: null,
          title: '',
          selectedMoods: [],
          customMood: '',
          visibility: 'private'
        });
        setShowMoodSelector(false);
        setUploadState('idle');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    }
  };
  const resetForm = () => {
    setFormData({
      file: null,
      title: '',
      selectedMoods: [],
      customMood: '',
      visibility: 'private'
    });
    setShowMoodSelector(false);
    setUploadState('idle');
    setUploadProgress(0);
    setErrorMessage('');
    setShowCustomMoodInput(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to your account to upload and share your music.
          </p>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-pink-500 to-purple-600">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Upload & Share <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Your Riff</span>
          </h1>
          <p className="text-xl text-gray-600">
            Share AI-aided masterpieces, lo-fi demos, or pure analog jams—every flavor welcome.
          </p>
        </motion.div>

        {/* Success State */}
        <AnimatePresence>
          {uploadState === 'success' && <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} className="mb-8">
              <Card className="max-w-2xl mx-auto bg-green-50 border-green-200">
                <CardContent className="p-8 text-center">
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
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Track Uploaded & Shared Successfully!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Your riff &quot;{formData.title}&quot; is now live and ready to be discovered.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {formData.selectedMoods.map(mood => {
                  const moodData = predefinedMoods.find(m => m.id === mood);
                  return moodData ? <Badge key={mood} className={`bg-gradient-to-r ${moodData.gradient} text-white border-0`}>
                          {moodData.name}
                        </Badge> : null;
                })}
                    {formData.customMood && <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white border-0">
                        "{formData.customMood}"
                      </Badge>}
                  </div>
                  <p className="text-sm text-green-600">
                    Visibility: {visibilityOptions.find(v => v.id === formData.visibility)?.title}
                  </p>
                </CardContent>
              </Card>
            </motion.div>}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {errorMessage && <motion.div initial={{
          opacity: 0,
          y: -10
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} className="mb-8">
              <Card className="max-w-2xl mx-auto bg-red-50 border-red-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{errorMessage}</p>
                  <Button variant="ghost" size="sm" onClick={() => setErrorMessage('')} className="ml-auto text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>}
        </AnimatePresence>

        {/* Upload Form */}
        <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              {/* File Upload Area */}
              <div className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all mb-8 ${dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-25'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleChange} className="hidden" />
                
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {formData.file ? 'File Selected' : 'Drop your music files here'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {formData.file ? formData.file.name : 'or click to browse from your computer'}
                    </p>
                    
                    <motion.button onClick={onButtonClick} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }}>
                      {formData.file ? 'Change File' : 'Choose Files'}
                    </motion.button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Supports MP3, WAV, FLAC, and more • Max 100MB per file
                  </p>
                </div>
              </div>

              {/* File Info & Title */}
              {formData.file && <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mb-8">
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <FileAudio className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{formData.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(formData.file.size)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={resetForm} className="text-gray-400 hover:text-red-500">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Track Title (Optional)
                    </label>
                    <Input value={formData.title} onChange={e => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))} placeholder="Give your track a name..." className="w-full" />
                  </div>
                </motion.div>}

              {/* Mood Selection */}
              <AnimatePresence>
                {showMoodSelector && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: "auto"
              }} exit={{
                opacity: 0,
                height: 0
              }} className="mb-8">
                    <div className="border-t pt-8">
                      <div className="text-center mb-6">
                        <h4 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          Tag the Mood
                        </h4>
                        <p className="text-gray-600">What's the emotional vibe of this track? Choose up to 3 moods.</p>
                      </div>

                      {/* Mood Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {predefinedMoods.map(mood => {
                      const isSelected = formData.selectedMoods.includes(mood.id);
                      const canSelect = formData.selectedMoods.length < 3 || isSelected;
                      return <motion.button key={mood.id} onClick={() => handleMoodToggle(mood.id)} disabled={!canSelect} className={`
                                relative p-4 rounded-2xl border-2 transition-all duration-300 text-left
                                ${isSelected ? 'border-white shadow-lg scale-105' : canSelect ? 'border-gray-200 hover:border-gray-300 hover:scale-102' : 'border-gray-100 opacity-50 cursor-not-allowed'}
                              `} whileHover={canSelect ? {
                        scale: 1.02
                      } : {}} whileTap={canSelect ? {
                        scale: 0.98
                      } : {}}>
                              <div className={`
                                absolute inset-0 rounded-2xl bg-gradient-to-br ${mood.gradient}
                                ${isSelected ? 'opacity-100' : 'opacity-20'}
                                transition-opacity duration-300
                              `} />
                              
                              <div className="relative z-10">
                                <h5 className={`
                                  font-semibold text-sm mb-1 transition-colors duration-300
                                  ${isSelected ? 'text-white' : 'text-gray-800'}
                                `}>
                                  {mood.name}
                                </h5>
                                <p className={`
                                  text-xs transition-colors duration-300
                                  ${isSelected ? 'text-white/90' : 'text-gray-600'}
                                `}>
                                  {mood.description}
                                </p>
                              </div>

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

                      {/* Custom Mood */}
                      <div className="border-t pt-6">
                        {!showCustomMoodInput ? <div className="text-center">
                            <Button variant="outline" onClick={() => setShowCustomMoodInput(true)} className="border-dashed border-2 hover:border-purple-300 hover:bg-purple-50">
                              <Sparkles className="w-4 h-4 mr-2" />
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
                    }} className="space-y-3">
                            <div className="flex gap-2">
                              <Input value={formData.customMood} onChange={e => setFormData(prev => ({
                          ...prev,
                          customMood: e.target.value
                        }))} placeholder="Describe the mood..." maxLength={24} className="flex-1" onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleCustomMoodSubmit();
                          } else if (e.key === 'Escape') {
                            setShowCustomMoodInput(false);
                            setFormData(prev => ({
                              ...prev,
                              customMood: ''
                            }));
                          }
                        }} autoFocus />
                              <Button onClick={handleCustomMoodSubmit} disabled={!formData.customMood.trim()} size="sm">
                                Add
                              </Button>
                              <Button onClick={() => {
                          setShowCustomMoodInput(false);
                          setFormData(prev => ({
                            ...prev,
                            customMood: ''
                          }));
                        }} variant="outline" size="sm">
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                              {formData.customMood.length}/24 characters
                            </p>
                          </motion.div>}

                        {formData.customMood && !showCustomMoodInput && <motion.div initial={{
                      opacity: 0,
                      y: 10
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} className="mt-4 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full">
                              <span className="text-sm font-medium text-gray-800">"{formData.customMood}"</span>
                              <button onClick={() => setFormData(prev => ({
                          ...prev,
                          customMood: ''
                        }))} className="text-gray-500 hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>}
                      </div>
                    </div>
                  </motion.div>}
              </AnimatePresence>

              {/* Visibility Selection */}
              <AnimatePresence>
                {showMoodSelector && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: "auto"
              }} exit={{
                opacity: 0,
                height: 0
              }} className="mb-8">
                    <div className="border-t pt-8">
                      <h4 className="text-lg font-semibold text-gray-800 text-center mb-6">
                        Choose Your Audience
                      </h4>
                      
                      <div className="grid gap-3">
                        {visibilityOptions.map(option => {
                      const Icon = option.icon;
                      const isSelected = formData.visibility === option.id;
                      return <motion.button key={option.id} onClick={() => setFormData(prev => ({
                        ...prev,
                        visibility: option.id
                      }))} className={`
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
                  </motion.div>}
              </AnimatePresence>

              {/* Upload & Share Button */}
              <AnimatePresence>
                {formData.file && <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} className="text-center">
                    <Button onClick={handleUploadAndShare} disabled={uploadState === 'uploading'} size="lg" className="w-full max-w-md mx-auto text-lg py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                      {uploadState === 'uploading' ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Uploading & Sharing... {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <Share2 className="w-5 h-5 mr-2" />
                          Upload & Share Your Riff
                        </>
                      )}
                    </Button>

                    {uploadState === 'uploading' && <motion.div initial={{
                  opacity: 0
                }} animate={{
                  opacity: 1
                }} className="mt-4 max-w-md mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" initial={{
                      width: 0
                    }} animate={{
                      width: `${uploadProgress}%`
                    }} transition={{
                      duration: 0.3
                    }} />
                        </div>
                      </motion.div>}
                  </motion.div>}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          {features.map((feature, index) => {
          const Icon = feature.icon;
          return <motion.div key={index} className="text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4 + index * 0.1
          }}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>;
        })}
        </motion.div>
      </div>
    </div>;
};
export default UploadMusicPage;

Neo Patch 
// A complete, correct upload function
const handleUpload = async () => {
  // 1. Validate that a file has been selected
  if (!formData.file) {
    setErrorMessage('No file selected.');
    return;
  }

  // Optional: Set a loading state for the UI
  setUploadState('uploading'); 
  setErrorMessage('');

  try {
    // 2. Define the file path in the bucket. 
    // This is a good practice to avoid name collisions.
    const filePath = `audio/${Date.now()}_${formData.file.name}`;

    // 3. The CORE of the fix: Upload the file.
    // Notice we pass `formData.file` directly. This is the `File` object.
    const { data, error } = await supabase.storage
      .from('your-bucket-name') // <-- IMPORTANT: Replace with your bucket name
      .upload(filePath, formData.file, {
        cacheControl: '3600',
        upsert: false
      });

    // 4. Handle potential errors from Supabase
    if (error) {
      // Re-throw the error to be caught by the catch block
      throw error; 
    }

    // 5. Handle success
    console.log('Upload successful:', data);
    setUploadState('success');
    // You might want to get the public URL and save it to your database here
    // const { data: { publicUrl } } = supabase.storage.from('your-bucket-name').getPublicUrl(filePath);
    // ... save publicUrl to your 'tracks' table ...

  } catch (error) {
    // 6. Handle errors from the try block (including the re-thrown Supabase error)
    console.error('Error uploading file:', error);
    setErrorMessage(error.message || 'An unexpected error occurred.');
    setUploadState('error');
  }
};

