import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Music, Users, Upload, BarChart3, Headphones, ListMusic, Quote, Sparkles } from 'lucide-react';
import type { Page } from './StrawberryRiffApp';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

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

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());
  const [hoveredGraffiti, setHoveredGraffiti] = useState(false);

  const tracks: Track[] = [
    {
      id: '1',
      title: 'Midnight Dreams',
      artist: 'AI Composer',
      likes: 234,
      duration: '3:42',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      id: '2',
      title: 'Electric Sunset',
      artist: 'Digital Harmony',
      likes: 189,
      duration: '4:15',
      gradient: 'from-blue-400 to-purple-400'
    },
    {
      id: '3',
      title: 'Ocean Waves',
      artist: 'Synthetic Soul',
      likes: 156,
      duration: '3:28',
      gradient: 'from-green-400 to-blue-400'
    }
  ];

  const sonicSoulprints: SonicSoulprint[] = [
    {
      id: '1',
      quote: "This beat found me at 3 a.m. when sleep wouldn't. Turns out strangers on the internet know my heart better than any algorithm.",
      author: "midnight_melody_introspective",
      mood: "introspective"
    },
    {
      id: '2',
      quote: "Sunrise-scored. AI caught the light my words missed.",
      author: "dawn_dreamer",
      mood: "hopeful"
    },
    {
      id: '3',
      quote: "For everyone who feels like they don't fit the mold. This riff is for the beautiful misfits.",
      author: "rebel_frequencies",
      mood: "defiant"
    }
  ];

  const audiences = [
    {
      title: "First-Timers",
      description: "Never shared a beat before? Perfect. Bring a feeling, drop your track, and find listeners who get it—no technical gymnastics required.",
      gradient: "from-pink-400 to-rose-400"
    },
    {
      title: "AI Explorers",
      description: "Push the frontier. Showcase pieces you've crafted with outside AI tools and trade insights with creators who speak the same future-forward language.",
      gradient: "from-purple-400 to-indigo-400"
    },
    {
      title: "Seasoned Pros",
      description: "Stay ahead of the curve. Test-drive new ideas, upload work shaped by emerging tech, and harvest real-time feedback from peers who care about craft, not clout.",
      gradient: "from-blue-400 to-cyan-400"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload any type of track",
      description: "Demos, half-sung hooks, voice memos, or AI experiments—if it makes a wave-form, it belongs here.",
      gradient: "from-pink-400 to-purple-400"
    },
    {
      number: "02",
      title: "Tag the mood",
      description: "Melancholy? Euphoric? Defiant? Paint your emotional palette so the tribe can find you.",
      gradient: "from-purple-400 to-blue-400"
    },
    {
      number: "03",
      title: "Choose visibility",
      description: "Keep it private, circle it with friends, or let the whole world feel your frequency.",
      gradient: "from-blue-400 to-green-400"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 relative overflow-hidden">
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block leading-tight font-bold">
            Strawberry Riff
          </span>
        </motion.h1>

        <motion.h2 
          className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="font-normal">Music made by us. Not markets</div>
          <div className="font-normal">No judgement. No algorithms.</div>
          <div className="font-normal">Just heartbeat-driven sound.</div>
        </motion.h2>

        {/* Animated Graffiti Tagline */}
        <motion.div 
          className="relative inline-block mb-12"
          onHoverStart={() => setHoveredGraffiti(true)}
          onHoverEnd={() => setHoveredGraffiti(false)}
        >
          <motion.p 
            className="text-lg text-gray-600 cursor-pointer relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Share Your Vibe. Build Your Tribe.
          </motion.p>

          <motion.div 
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{
              opacity: hoveredGraffiti ? 1 : 0,
              scale: hoveredGraffiti ? 1 : 0.8,
              rotate: hoveredGraffiti ? -2 : -5
            }}
            transition={{ duration: 0.3 }}
          >
            <em>"Some revolutions hum. Others drop bass."</em>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('upload')}
          >
            Start Creating
          </motion.button>

          <motion.button
            className="border-2 border-purple-300 text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('signin')}
          >
            Join the Tribe
          </motion.button>
        </motion.div>
      </section>

      {/* Everything You Need to Share Music Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Everything You Need to <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Share Your Sound</span>
          </motion.h2>

          <motion.p 
            className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From the first rough memo to a stadium-ready mix, every tool here serves one purpose: helping you be heard.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Upload & Share */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Upload & Share</h3>
              <p className="text-gray-600">Drop any audio, any time, and watch it echo across kindred ears.</p>
            </motion.div>

            {/* Connect with Creators */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Connect with Creators</h3>
              <p className="text-gray-600">Trade inspiration, not follower counts. Collaboration begins with conversation.</p>
            </motion.div>

            {/* Discover New Music */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Discover New Music</h3>
              <p className="text-gray-600">Let people, not code, guide you to tracks that move your soul.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* High-Quality Streaming */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-6">
                <Headphones className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">High-Quality Streaming</h3>
              <p className="text-gray-600">24-bit fidelity so every nuance arrives untouched.</p>
            </motion.div>

            {/* Track Analytics */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Track Analytics</h3>
              <p className="text-gray-600">See how real humans respond, far beyond vanity metrics.</p>
            </motion.div>

            {/* Curated Playlists */}
            <motion.div 
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <ListMusic className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Curated Playlists</h3>
              <p className="text-gray-600">Build mood journeys and share them like audio love letters</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Who It's For</h2>
            <blockquote className="text-xl text-purple-600 italic font-medium">
              "From idea-stuck to soul-struck."
            </blockquote>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {audiences.map((audience, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${audience.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {audience.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {audience.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Three simple steps to share your sonic soul</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 relative`}>
                  <span className="text-white text-xl font-bold">{step.number}</span>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-purple-300 to-transparent transform -translate-y-1/2 ml-4"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sonic Soulprints Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Sonic Soulprints</h2>
            <p className="text-gray-600 text-lg">Real voices. Real feels.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sonicSoulprints.map((soulprint, index) => (
              <motion.div 
                key={soulprint.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Tracks Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Latest Riffs</h2>
            <p className="text-gray-600 text-lg">Fresh drops from the community—updated by humans, not math.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <motion.div 
                key={track.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`h-48 bg-gradient-to-br ${track.gradient} flex items-center justify-center relative group`}>
                  <motion.button 
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Play className="w-8 h-8 ml-1" />
                  </motion.button>

                  <div className="absolute top-4 right-4">
                    <motion.button 
                      onClick={() => handleLike(track.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                        likedTracks.has(track.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${likedTracks.has(track.id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{track.title}</h3>
                  <p className="text-gray-600 mb-4">{track.artist}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{track.likes}</span>
                    </span>
                    <span>{track.duration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Revolution CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join the Revolution
          </motion.h2>

          <motion.p 
            className="text-xl text-white/90 mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the (not-so) quiet revolution.
          </motion.p>

          <motion.p 
            className="text-lg text-white/80 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Where authentic voices find their audience, and music finds its meaning.
          </motion.p>
          <motion.button 
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('signin')}
          >
            Claim Your Sonic Space
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

