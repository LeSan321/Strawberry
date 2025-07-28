import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Music, Users, Upload, BarChart3, Headphones, ListMusic, Quote, Sparkles, Calendar, MapPin, Clock, Star } from 'lucide-react';
interface Track {
  id: string;
  title: string;
  artist: string;
  likes: number;
  duration: string;
  gradient: string;
}
interface SonicSoulprint {
  id: string;
  quote: string;
  author: string;
  mood: string;
}
const FriendsPage: React.FC = () => {
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [hoveredTicket, setHoveredTicket] = useState(false);
  const tracks: Track[] = [{
    id: '1',
    title: 'Midnight Dreams',
    artist: 'AI Composer',
    likes: 234,
    duration: '3:42',
    gradient: 'from-purple-400 to-pink-400'
  }, {
    id: '2',
    title: 'Electric Sunset',
    artist: 'Digital Harmony',
    likes: 189,
    duration: '4:15',
    gradient: 'from-blue-400 to-purple-400'
  }, {
    id: '3',
    title: 'Ocean Waves',
    artist: 'Synthetic Soul',
    likes: 156,
    duration: '3:28',
    gradient: 'from-green-400 to-blue-400'
  }];
  const sonicSoulprints: SonicSoulprint[] = [{
    id: '1',
    quote: "This beat found me at 3am when I couldn't sleep. Sometimes the algorithm knows your heart better than you do.",
    author: "midnight_melody",
    mood: "introspective"
  }, {
    id: '2',
    quote: "Made this while watching the sunrise. AI helped me capture what words couldn't express.",
    author: "dawn_dreamer",
    mood: "hopeful"
  }, {
    id: '3',
    quote: "For everyone who feels like they don't fit the mold. This one's for the beautiful misfits.",
    author: "rebel_frequencies",
    mood: "defiant"
  }];
  const audiences = [{
    title: "First-Timers",
    description: "Never made music before? Perfect. Start with a feeling, let AI do the heavy lifting.",
    gradient: "from-pink-400 to-rose-400"
  }, {
    title: "AI Explorers",
    description: "Push the boundaries of what's possible when human creativity meets artificial intelligence.",
    gradient: "from-purple-400 to-indigo-400"
  }, {
    title: "Seasoned Pros",
    description: "Use AI as your creative partner. Sketch ideas faster, explore new territories.",
    gradient: "from-blue-400 to-cyan-400"
  }] as any[];
  const steps = [{
    number: "01",
    title: "Upload any type of track",
    description: "Demos, full songs, voice memos, AI generations - we welcome it all.",
    gradient: "from-pink-400 to-purple-400"
  }, {
    number: "02",
    title: "Tag the mood",
    description: "Help others find your vibe. Melancholy? Euphoric? Rebellious? You choose.",
    gradient: "from-purple-400 to-blue-400"
  }, {
    number: "03",
    title: "Choose visibility",
    description: "Keep it private, share with friends, or let the world discover your sound.",
    gradient: "from-blue-400 to-green-400"
  }] as any[];
  const handleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 relative overflow-hidden">
        <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 px-4" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block leading-tight">
            Strawberry Riff
          </span>
        </motion.h1>
        
        <motion.h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 max-w-4xl mx-auto text-center" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }}>
          <div>Music made by us. Not markets</div>
          <div>No judgement. No algorithms.</div>
        </motion.h2>
        
        {/* Concert Ticket Easter Egg */}
        <motion.div className="relative inline-block mb-12 cursor-pointer" onHoverStart={() => setHoveredTicket(true)} onHoverEnd={() => setHoveredTicket(false)}>
          <motion.p className="text-lg text-gray-600 cursor-pointer relative" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }}>
            Hover for a secret message...
          </motion.p>
          
          {/* Concert Ticket */}
          <motion.div className="absolute -top-32 left-1/2 transform -translate-x-1/2 w-80 h-48 bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900 rounded-lg shadow-2xl overflow-hidden border-2 border-yellow-400" initial={{
          opacity: 0,
          scale: 0.8,
          rotate: -8,
          y: 20
        }} animate={{
          opacity: hoveredTicket ? 1 : 0,
          scale: hoveredTicket ? 1 : 0.8,
          rotate: hoveredTicket ? -3 : -8,
          y: hoveredTicket ? 0 : 20
        }} transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 300
        }}>
            {/* Ticket Perforations */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 opacity-60">
              <div className="flex flex-col h-full justify-evenly">
                {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-2 bg-purple-900 rounded-full" />)}
              </div>
            </div>
            
            {/* Ticket Content */}
            <div className="p-6 h-full flex flex-col justify-between relative">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="w-6 h-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm tracking-wider">STRAWBERRY RIFF</span>
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                </div>
              </div>
              
              {/* Main Event */}
              <div className="text-center">
                <h3 className="text-white font-bold text-xl mb-1">THE REVOLUTION</h3>
                <p className="text-pink-200 text-sm italic">"Some revolutions hum. Others drop bass."</p>
              </div>
              
              {/* Event Details */}
              <div className="grid grid-cols-3 gap-4 text-xs text-white">
                <div className="flex flex-col items-center">
                  <Calendar className="w-4 h-4 mb-1 text-yellow-400" />
                  <span className="font-semibold">NOW</span>
                  <span className="text-pink-200">PLAYING</span>
                </div>
                <div className="flex flex-col items-center">
                  <MapPin className="w-4 h-4 mb-1 text-yellow-400" />
                  <span className="font-semibold">EVERYWHERE</span>
                  <span className="text-pink-200">DIGITAL</span>
                </div>
                <div className="flex flex-col items-center">
                  <Clock className="w-4 h-4 mb-1 text-yellow-400" />
                  <span className="font-semibold">24/7</span>
                  <span className="text-pink-200">ACCESS</span>
                </div>
              </div>
              
              {/* Ticket Number */}
              <div className="flex justify-between items-end">
                <span className="text-yellow-400 text-xs font-mono">ADMIT ONE</span>
                <span className="text-yellow-400 text-xs font-mono">#SR2024</span>
              </div>
            </div>
            
            {/* Ticket Stub */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-b from-yellow-400 to-yellow-500 border-l-2 border-dashed border-purple-900">
              <div className="h-full flex flex-col items-center justify-center text-purple-900">
                <Music className="w-6 h-6 mb-2" />
                <span className="text-xs font-bold transform -rotate-90 whitespace-nowrap">SR2024</span>
              </div>
            </div>
            
            {/* Holographic Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
          </motion.div>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center items-center" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.8
      }}>
          <motion.button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            Start Creating
          </motion.button>
          <motion.button className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            Browse Riffs
          </motion.button>
        </motion.div>
      </section>

      {/* Everything You Need to Share Music Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            Everything You Need to <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Share Music</span>
          </motion.h2>
          
          <motion.p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            From uploading your tracks to building a community, we've got you covered.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Upload & Share */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.1
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Upload & Share
              </h3>
              <p className="text-gray-600">
                Easily upload your music tracks and share them with the world.
              </p>
            </motion.div>

            {/* Connect with Creators */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Connect with Creators
              </h3>
              <p className="text-gray-600">
                Build friendships with fellow musicians and collaborate.
              </p>
            </motion.div>

            {/* Discover New Music */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Discover New Music
              </h3>
              <p className="text-gray-600">
                Explore amazing tracks from creators around the globe.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* High-Quality Streaming */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                High-Quality Streaming
              </h3>
              <p className="text-gray-600">
                Enjoy crystal-clear audio streaming for all tracks.
              </p>
            </motion.div>

            {/* Track Analytics */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Track Analytics
              </h3>
              <p className="text-gray-600">
                See how your music performs with detailed insights.
              </p>
            </motion.div>

            {/* Curated Playlists */}
            <motion.div className="flex flex-col items-center text-center" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.6
          }}>
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <ListMusic className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Curated Playlists
              </h3>
              <p className="text-gray-600">
                Create and share playlists with your favorite tracks.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Who It's For
            </h2>
            <blockquote className="text-xl text-purple-600 italic font-medium">
              "From idea-stuck to soul-struck."
            </blockquote>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => <motion.div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} whileHover={{
            y: -5
          }}>
                <div className={`w-16 h-16 bg-gradient-to-r ${audience.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {audience.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {audience.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Three simple steps to share your sonic soul
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => <motion.div key={index} className="text-center relative" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.2
          }}>
                <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 relative`}>
                  <span className="text-white text-xl font-bold">
                    {step.number}
                  </span>
                  {index < steps.length - 1 && <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-purple-300 to-transparent transform -translate-y-1/2 ml-4"></div>}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Sonic Soulprints Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sonic Soulprints
            </h2>
            <p className="text-gray-600 text-lg">
              Real stories from our community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sonicSoulprints.map((soulprint, index) => <motion.div key={soulprint.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} whileHover={{
            y: -5
          }}>
                <Quote className="w-8 h-8 text-purple-300 mb-4" />
                <blockquote className="text-gray-700 mb-4 italic">
                  "{soulprint.quote}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600">
                    @{soulprint.author}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {soulprint.mood}
                  </span>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Latest Tracks Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Latest Riffs
            </h2>
            <p className="text-gray-600 text-lg">
              Fresh sounds from the community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracks.map((track, index) => <motion.div key={track.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} whileHover={{
            y: -5
          }}>
                <div className={`h-48 bg-gradient-to-br ${track.gradient} flex items-center justify-center relative group`}>
                  <motion.button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all" whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }}>
                    <Play className="w-8 h-8 ml-1" />
                  </motion.button>
                  <div className="absolute top-4 right-4">
                    <motion.button onClick={() => handleLike(track.id)} className={`p-2 rounded-full backdrop-blur-sm transition-all ${likedTracks.has(track.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`} whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }}>
                      <Heart className={`w-5 h-5 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {track.artist}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{track.likes}</span>
                    </span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Join the Revolution CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="text-4xl md:text-5xl font-bold text-white mb-6" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            Join the Revolution
          </motion.h2>
          <motion.p className="text-xl text-white/90 mb-2" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            Join the (not-so) quiet revolution.
          </motion.p>
          <motion.p className="text-lg text-white/80 mb-8" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }}>
            Where authentic voices find their audience, and music finds its meaning.
          </motion.p>
          <motion.button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all" initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            Claim Your Sonic Space
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default FriendsPage;
