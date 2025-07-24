import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Mic, MicOff, Play, Pause, Trash2, Upload, Camera, Sparkles, Heart, Music, Zap, Coffee, Moon, Sun, Star } from 'lucide-react';
interface CreatorProfileFlowProps {
  onComplete?: (profile: CreatorProfile) => void;
  onCancel?: () => void;
}
interface CreatorProfile {
  feeling?: string;
  identity?: string;
  customIdentity?: string;
  moods: string[];
  visibility: 'private' | 'friends' | 'public';
  voiceTag?: Blob;
  avatar?: string | File;
  avatarType?: 'upload' | 'vibe' | 'skip';
}
interface IdentityPrompt {
  id: string;
  text: string;
  icon: React.ComponentType<any>;
  gradient: string;
}
interface MoodTag {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
}
interface VibeAvatar {
  id: string;
  name: string;
  image: string;
  description: string;
}
const CreatorProfileFlow: React.FC<CreatorProfileFlowProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<CreatorProfile>({
    moods: [],
    visibility: 'public'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [customIdentityText, setCustomIdentityText] = useState('');
  const [uploadedAvatar, setUploadedAvatar] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const feelings = [{
    id: 'present',
    label: 'Just present',
    icon: Heart,
    color: 'from-pink-400 to-rose-400'
  }, {
    id: 'creative',
    label: 'Creatively charged',
    icon: Zap,
    color: 'from-yellow-400 to-orange-400'
  }, {
    id: 'contemplative',
    label: 'Contemplative',
    icon: Moon,
    color: 'from-blue-400 to-indigo-400'
  }, {
    id: 'energetic',
    label: 'Energetic',
    icon: Sun,
    color: 'from-orange-400 to-red-400'
  }, {
    id: 'peaceful',
    label: 'Peaceful',
    icon: Star,
    color: 'from-green-400 to-teal-400'
  }] as any[];
  const identityPrompts: IdentityPrompt[] = [{
    id: 'bedroom-producer',
    text: "I'm a bedroom producer finding my sound",
    icon: Music,
    gradient: 'from-purple-400 to-pink-400'
  }, {
    id: 'ai-explorer',
    text: "I explore the intersection of AI and creativity",
    icon: Sparkles,
    gradient: 'from-blue-400 to-purple-400'
  }, {
    id: 'mood-curator',
    text: "I curate sounds for specific moods and moments",
    icon: Heart,
    gradient: 'from-pink-400 to-red-400'
  }, {
    id: 'late-night-creator',
    text: "I create when the world is quiet",
    icon: Moon,
    gradient: 'from-indigo-400 to-blue-400'
  }, {
    id: 'experimental',
    text: "I push boundaries and break conventions",
    icon: Zap,
    gradient: 'from-yellow-400 to-orange-400'
  }, {
    id: 'storyteller',
    text: "Every track tells a story",
    icon: Coffee,
    gradient: 'from-amber-400 to-orange-400'
  }];
  const moodTags: MoodTag[] = [{
    id: 'melancholy',
    label: 'Melancholy',
    icon: Moon,
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  }, {
    id: 'euphoric',
    label: 'Euphoric',
    icon: Sun,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }, {
    id: 'rebellious',
    label: 'Rebellious',
    icon: Zap,
    color: 'bg-red-100 text-red-700 border-red-200'
  }, {
    id: 'dreamy',
    label: 'Dreamy',
    icon: Star,
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  }, {
    id: 'nostalgic',
    label: 'Nostalgic',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }, {
    id: 'energetic',
    label: 'Energetic',
    icon: Zap,
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  }, {
    id: 'contemplative',
    label: 'Contemplative',
    icon: Coffee,
    color: 'bg-green-100 text-green-700 border-green-200'
  }, {
    id: 'raw',
    label: 'Raw',
    icon: Music,
    color: 'bg-gray-100 text-gray-700 border-gray-200'
  }];
  const vibeAvatars: VibeAvatar[] = [{
    id: 'abstract-waves',
    name: 'Abstract Waves',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI1Y2Y2O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjNGE5OTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0idXJsKCNncmFkKSIvPjxwYXRoIGQ9Ik0yMCA1MFE1MCAyMCA4MCA1MFE1MCA4MCAyMCA1MFoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==',
    description: 'Flowing, emotional energy'
  }, {
    id: 'geometric-pulse',
    name: 'Geometric Pulse',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMiIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzM5OGVmNjtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4YjVjZjY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ3JhZDIpIi8+PHJlY3QgeD0iMjUiIHk9IjI1IiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4zKSIgcng9IjUiLz48L3N2Zz4=',
    description: 'Structured, rhythmic vibes'
  }, {
    id: 'cosmic-swirl',
    name: 'Cosmic Swirl',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzEwYjk4MTtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzOThlZjY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ3JhZDMpIi8+PGVsbGlwc2UgY3g9IjUwIiBjeT0iNTAiIHJ4PSIzMCIgcnk9IjE1IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNCkiIHRyYW5zZm9ybT0icm90YXRlKDQ1IDUwIDUwKSIvPjwvc3ZnPg==',
    description: 'Ethereal, spacey atmosphere'
  }];
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav'
        });
        setProfile(prev => ({
          ...prev,
          voiceTag: audioBlob
        }));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            stopRecording();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
      }, 10000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };
  const playVoiceTag = () => {
    if (profile.voiceTag && !isPlaying) {
      const audioUrl = URL.createObjectURL(profile.voiceTag);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };
  const deleteVoiceTag = () => {
    setProfile(prev => ({
      ...prev,
      voiceTag: undefined
    }));
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedAvatar(file);
      setProfile(prev => ({
        ...prev,
        avatar: file,
        avatarType: 'upload'
      }));
    }
  };
  const selectVibeAvatar = (avatar: VibeAvatar) => {
    setProfile(prev => ({
      ...prev,
      avatar: avatar.image,
      avatarType: 'vibe'
    }));
  };
  const toggleMood = (moodId: string) => {
    setProfile(prev => ({
      ...prev,
      moods: prev.moods.includes(moodId) ? prev.moods.filter(id => id !== moodId) : prev.moods.length < 3 ? [...prev.moods, moodId] : prev.moods
    }));
  };
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const handleComplete = () => {
    onComplete?.(profile);
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Welcome to your Sonic Snapshot
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Just presence. No pressure.
            </p>
            <p className="text-gray-500 mb-12">
              This is your space to express who you are as a creator. Share as much or as little as feels right.
            </p>
            
            <div className="mb-8">
              <p className="text-lg font-medium text-gray-700 mb-6">How are you feeling right now?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {feelings.map(feeling => {
                const Icon = feeling.icon;
                return <motion.button key={feeling.id} onClick={() => setProfile(prev => ({
                  ...prev,
                  feeling: feeling.id
                }))} className={`p-4 rounded-xl border-2 transition-all ${profile.feeling === feeling.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'}`} whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }}>
                      <div className={`w-12 h-12 bg-gradient-to-r ${feeling.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feeling.label}</span>
                    </motion.button>;
              })}
              </div>
            </div>
          </motion.div>;
      case 2:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Tell us about yourself
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose any that resonate, or skip entirely. This is your story.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {identityPrompts.map(prompt => {
              const Icon = prompt.icon;
              return <motion.button key={prompt.id} onClick={() => setProfile(prev => ({
                ...prev,
                identity: prompt.id,
                customIdentity: ''
              }))} className={`p-6 rounded-xl border-2 text-left transition-all ${profile.identity === prompt.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-purple-25'}`} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${prompt.gradient} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium">{prompt.text}</p>
                  </motion.button>;
            })}
            </div>

            <div className="border-t border-gray-200 pt-8">
              <p className="text-lg font-medium text-gray-700 mb-4">Or write your own:</p>
              <textarea value={customIdentityText} onChange={e => {
              setCustomIdentityText(e.target.value);
              setProfile(prev => ({
                ...prev,
                customIdentity: e.target.value,
                identity: 'custom'
              }));
            }} placeholder="I create music because..." className="w-full max-w-2xl mx-auto p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" rows={3} />
            </div>
          </motion.div>;
      case 3:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Tag your vibe
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose up to 3 moods that represent your creative energy
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {moodTags.map(mood => {
              const Icon = mood.icon;
              const isSelected = profile.moods.includes(mood.id);
              return <motion.button key={mood.id} onClick={() => toggleMood(mood.id)} className={`p-4 rounded-xl border-2 transition-all ${isSelected ? `${mood.color} border-current` : 'border-gray-200 hover:border-gray-300 text-gray-600'}`} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} disabled={!isSelected && profile.moods.length >= 3}>
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{mood.label}</span>
                  </motion.button>;
            })}
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose your visibility</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{
                id: 'private',
                label: 'Private',
                desc: 'Just for you'
              }, {
                id: 'friends',
                label: 'Inner Circle',
                desc: 'Friends only'
              }, {
                id: 'public',
                label: 'Public',
                desc: 'Open to all'
              }].map(option => <motion.button key={option.id} onClick={() => setProfile(prev => ({
                ...prev,
                visibility: option.id as any
              }))} className={`p-4 rounded-xl border-2 transition-all ${profile.visibility === option.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} whileHover={{
                scale: 1.02
              }} whileTap={{
                scale: 0.98
              }}>
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-sm text-gray-500">{option.desc}</div>
                  </motion.button>)}
              </div>
            </div>
          </motion.div>;
      case 4:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Voice Tag (Optional)
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Record a 10-second audio snippet that captures your essence
            </p>
            
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              {!profile.voiceTag ? <div className="space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                    {isRecording ? <motion.div animate={{
                  scale: [1, 1.2, 1]
                }} transition={{
                  repeat: Infinity,
                  duration: 1
                }}>
                        <MicOff className="w-12 h-12 text-white" />
                      </motion.div> : <Mic className="w-12 h-12 text-white" />}
                  </div>
                  
                  {isRecording && <div className="text-2xl font-bold text-purple-600">
                      {10 - recordingTime}s
                    </div>}
                  
                  <div className="space-y-4">
                    {!isRecording ? <motion.button onClick={startRecording} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                        Record
                      </motion.button> : <motion.button onClick={stopRecording} className="bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition-all" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                        Stop Recording
                      </motion.button>}
                  </div>
                </div> : <div className="space-y-6">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-green-600 font-medium">Voice tag recorded!</p>
                  
                  <div className="flex justify-center space-x-4">
                    <motion.button onClick={playVoiceTag} disabled={isPlaying} className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-all disabled:opacity-50" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      <span>Preview</span>
                    </motion.button>
                    
                    <motion.button onClick={deleteVoiceTag} className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>}
            </div>
          </motion.div>;
      case 5:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Choose your avatar
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              How do you want to represent yourself?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Upload Option */}
              <motion.div className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${profile.avatarType === 'upload' ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} onClick={() => fileInputRef.current?.click()} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {uploadedAvatar ? <img src={URL.createObjectURL(uploadedAvatar)} alt="Uploaded avatar" className="w-full h-full rounded-full object-cover" /> : <Upload className="w-10 h-10 text-white" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload your own</h3>
                <p className="text-gray-600 text-sm">Use your photo or artwork</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </motion.div>

              {/* Vibe Avatars */}
              <motion.div className={`p-6 rounded-2xl border-2 transition-all ${profile.avatarType === 'vibe' ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                <div className="w-20 h-20 mx-auto mb-4">
                  <div className="grid grid-cols-3 gap-1 w-full h-full">
                    {vibeAvatars.slice(0, 3).map(avatar => <motion.button key={avatar.id} onClick={() => selectVibeAvatar(avatar)} className="w-full h-full rounded-lg overflow-hidden hover:scale-110 transition-transform" whileHover={{
                    scale: 1.1
                  }}>
                        <img src={avatar.image} alt={avatar.name} className="w-full h-full object-cover" />
                      </motion.button>)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Vibe Avatars</h3>
                <p className="text-gray-600 text-sm">Abstract, emotional expressions</p>
              </motion.div>

              {/* Skip Option */}
              <motion.div className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${profile.avatarType === 'skip' ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`} onClick={() => setProfile(prev => ({
              ...prev,
              avatarType: 'skip',
              avatar: undefined
            }))} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
                  <Music className="w-10 h-10 text-white relative z-10" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Skip for now</h3>
                <p className="text-gray-600 text-sm">Use a waveform placeholder</p>
              </motion.div>
            </div>
          </motion.div>;
      case 6:
        return <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Your sonic space is ready
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              This is your space now. Change it whenever you want.
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  {profile.avatar && profile.avatarType === 'upload' ? <img src={typeof profile.avatar === 'string' ? profile.avatar : URL.createObjectURL(profile.avatar)} alt="Avatar" className="w-full h-full rounded-full object-cover" /> : profile.avatar && profile.avatarType === 'vibe' ? <img src={profile.avatar as string} alt="Vibe avatar" className="w-full h-full rounded-full object-cover" /> : <Music className="w-8 h-8 text-white" />}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">Your Profile</h3>
                  <p className="text-gray-600 capitalize">{profile.visibility} visibility</p>
                </div>
              </div>
              
              {profile.moods.length > 0 && <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Mood tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.moods.map(moodId => {
                  const mood = moodTags.find(m => m.id === moodId);
                  return mood ? <span key={moodId} className={`px-3 py-1 rounded-full text-xs font-medium ${mood.color}`}>
                          {mood.label}
                        </span> : null;
                })}
                  </div>
                </div>}
              
              {profile.voiceTag && <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Voice tag recorded ✓</p>
                </div>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={handleComplete} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                Save My Profile
              </motion.button>
              <motion.button onClick={() => {/* Preview functionality */}} className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                Preview Profile
              </motion.button>
            </div>
          </motion.div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 6</span>
            <span className="text-sm font-medium text-gray-600">{Math.round(currentStep / 6 * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full" initial={{
            width: 0
          }} animate={{
            width: `${currentStep / 6 * 100}%`
          }} transition={{
            duration: 0.3
          }} />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <motion.button onClick={currentStep === 1 ? onCancel : prevStep} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <ArrowLeft className="w-5 h-5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </motion.button>

          {currentStep < 6 && <motion.button onClick={nextStep} className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>}
        </div>
      </div>
    </div>;
};
export default CreatorProfileFlow;
