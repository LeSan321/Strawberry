import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, FileAudio, CheckCircle, X, Sparkles, Zap, Users } from 'lucide-react';
import TagTheMoodFeature from './TagTheMoodFeature';
import TrackUploadConfirmation from './TrackUploadConfirmation';
import { uploadTrackToSupabase } from './lib/uploadUtils';
import { supabase } from './lib/supabase';
import { useAuth } from './lib/AuthContext';
interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  file: File;
  error?: string;
}
const UploadMusicPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showMoodTagger, setShowMoodTagger] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState<string>();
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const features = [{
    icon: Sparkles,
    title: "High-Fidelity, Zero Compromise  ",
    description: "We stream lossless audio up to 24-bit/192 kHz because nuance matters.",
    gradient: 'from-purple-400 to-pink-400'
  }, {
    icon: Zap,
    title: "Share With Intention  ",
    description: "\u2022 Private \u2013 A notebook only you can read   \u2022 Inner Circle \u2013 Trusted ears for early feedback   \u2022 Public \u2013 Throw it to the cosmos and see who resonates.",
    gradient: 'from-blue-400 to-purple-400'
  }, {
    icon: Users,
    title: 'Community',
    description: "Post, listen, respond. Courage is contagious. Vibe with your tribe.",
    gradient: 'from-green-400 to-blue-400'
  }] as any[];
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
      handleFiles(e.dataTransfer.files);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: formatFileSize(file.size),
          status: 'uploading',
          progress: 0,
          file: file
        };
        setUploadedFiles(prev => [...prev, newFile]);

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? {
            ...f,
            progress: Math.min(f.progress + 20, 90)
          } : f));
        }, 300);

        // Complete progress simulation after 2 seconds
        setTimeout(() => {
          clearInterval(progressInterval);
          setUploadedFiles(prev => prev.map(f => f.id === newFile.id ? {
            ...f,
            status: 'completed',
            progress: 100
          } : f));
          
          if (!showMoodTagger) {
            setShowMoodTagger(true);
          }
        }, 2000);
      }
    });
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };
  const onButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleMoodTagsChange = (moods: string[], customMoodValue?: string) => {
    setSelectedMoods(moods);
    setCustomMood(customMoodValue);
    console.log('Mood tags updated:', {
      moods,
      customMood: customMoodValue
    });

    // Auto-advance to confirmation if we have moods selected
    if (moods.length > 0 || customMoodValue) {
      setTimeout(() => {
        setShowConfirmation(true);
      }, 1000);
    }
  };
  const handleConfirmUpload = async (shareLevel: 'private' | 'inner-circle' | 'public') => {
    const uploadedFile = uploadedFiles.find(f => f.status === 'completed');
    if (!uploadedFile) return;

    try {
      console.log('Starting final upload with share level:', shareLevel);
      
      setUploadError(undefined);
      
      if (!supabase) {
        console.log("💡 Supabase Session: Cannot check - client not configured");
        console.log("⚠️ Supabase Session Error: Client not configured");
        alert("⚠️ No session found – Supabase client not configured");
        throw new Error('Supabase client not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      }

      console.log('Using authenticated user from context...');
      setIsCheckingAuth(true);
      
      console.log("💡 Current user from context:", user);
      
      if (!user) {
        alert("⚠️ No user found – please sign in");
        throw new Error("You must be logged in to upload tracks.");
      }
      
      const userId = user.id;
      console.log('Authenticated user ID:', userId);
      
      setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? {
        ...f,
        status: 'uploading',
        progress: 95
      } : f));

      const result = await uploadTrackToSupabase({
        file: uploadedFile.file,
        title: uploadedFile.name.replace(/\.[^/.]+$/, ""),
        tags: selectedMoods,
        customMood: customMood,
        visibility: shareLevel,
        userId: userId
      });

      console.log('Upload successful! Track created:', result);
      
      setIsCheckingAuth(false);
      
      // Complete the progress to 100%
      setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? {
        ...f,
        status: 'completed',
        progress: 100
      } : f));
      
      setTimeout(() => {
        // Reset the form
        setUploadedFiles([]);
        setShowMoodTagger(false);
        setShowConfirmation(false);
        setSelectedMoods([]);
        setCustomMood(undefined);
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      setIsCheckingAuth(false);
      setUploadError(errorMessage);
      
      setUploadedFiles(prev => prev.map(f => f.id === uploadedFile.id ? {
        ...f,
        status: 'error',
        progress: 0,
        error: errorMessage
      } : f));
      
      if (errorMessage.includes('logged in') || errorMessage.includes('Authentication failed')) {
        console.log('Authentication error detected - user needs to sign in');
      }
    }
  };
  const handleEditDetails = () => {
    setShowConfirmation(false);
    setShowMoodTagger(true);
    setUploadError(undefined); // Clear any upload errors when editing
  };
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
            Upload <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Your Riff </span>
          </h1>
          <p className="text-xl text-gray-600">Share AI-aided masterpieces, lo-fi demos, or pure analog jams—every flavor welcome.</p>
        </motion.div>

        {/* Upload Area */}
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
          <div className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-300 hover:bg-purple-25'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <input ref={fileInputRef} type="file" multiple accept="audio/*" onChange={handleChange} className="hidden" />
            
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  Drop your music files here
                </h3>
                <p className="text-gray-600 mb-6">
                  or click to browse from your computer
                </p>
                
                <motion.button onClick={onButtonClick} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Choose Files
                </motion.button>
              </div>
              
              <p className="text-sm text-gray-500">Supports MP3, WAV, FLAC, and more • Max 100MB per file</p>
            </div>
          </div>
        </motion.div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {uploadedFiles.map(file => <div key={file.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                        <FileAudio className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {file.status === 'uploading' && <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all" style={{
                      width: `${file.progress}%`
                    }} />
                          </div>
                          <span className="text-sm text-gray-500">{file.progress}%</span>
                        </div>}
                      
                      {file.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      
                      {file.status === 'error' && <div className="flex items-center space-x-2">
                          <X className="w-6 h-6 text-red-500" />
                          <span className="text-sm text-red-500">{file.error || 'Upload failed'}</span>
                        </div>}
                      
                      <motion.button onClick={() => removeFile(file.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }}>
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>)}
            </div>
          </motion.div>}

        {/* Upload Confirmation */}
        {showConfirmation && uploadedFiles.length > 0 && <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
            <TrackUploadConfirmation 
              trackName={uploadedFiles[0]?.name || "Unknown Track"} 
              moods={selectedMoods} 
              customMood={customMood} 
              file={uploadedFiles[0]?.file} 
              onConfirm={handleConfirmUpload} 
              onEdit={handleEditDetails}
              isUploading={uploadedFiles.some(f => f.status === 'uploading' && f.progress >= 95) || isCheckingAuth}
              uploadError={uploadError}
            />
          </motion.div>}

        {/* Mood Tagger */}
        {showMoodTagger && !showConfirmation && uploadedFiles.some(f => f.status === 'completed') && <motion.div className="mb-12" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.3
      }}>
            <TagTheMoodFeature onMoodTagsChange={handleMoodTagsChange} maxTags={3} className="shadow-lg" />
          </motion.div>}

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
