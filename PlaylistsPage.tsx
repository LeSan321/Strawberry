import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Heart, Play, MoreHorizontal } from 'lucide-react';
interface Playlist {
  id: string;
  title: string;
  description: string;
  trackCount: number;
  likes: number;
  gradient: string;
  isLiked: boolean;
}
const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([{
    id: '1',
    title: 'My Favorites',
    description: 'Collection of my most loved tracks',
    trackCount: 5,
    likes: 12,
    gradient: 'from-purple-400 to-pink-400',
    isLiked: true
  }, {
    id: '2',
    title: 'Chill Vibes',
    description: 'Perfect for relaxing moments',
    trackCount: 8,
    likes: 24,
    gradient: 'from-blue-400 to-purple-400',
    isLiked: false
  }, {
    id: '3',
    title: 'Upbeat Mix',
    description: 'High energy tracks for motivation',
    trackCount: 12,
    likes: 18,
    gradient: 'from-green-400 to-blue-400',
    isLiked: true
  }, {
    id: '4',
    title: 'Late Night Sessions',
    description: 'Ambient sounds for deep focus',
    trackCount: 6,
    likes: 9,
    gradient: 'from-indigo-400 to-purple-400',
    isLiked: false
  }, {
    id: '5',
    title: 'AI Experiments',
    description: 'Latest AI-generated compositions',
    trackCount: 15,
    likes: 31,
    gradient: 'from-orange-400 to-red-400',
    isLiked: true
  }, {
    id: '6',
    title: 'Collaborative Mix',
    description: 'Tracks created with friends',
    trackCount: 7,
    likes: 16,
    gradient: 'from-teal-400 to-green-400',
    isLiked: false
  }]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const handleLikePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.map(playlist => playlist.id === playlistId ? {
      ...playlist,
      isLiked: !playlist.isLiked,
      likes: playlist.isLiked ? playlist.likes - 1 : playlist.likes + 1
    } : playlist));
  };
  const handleCreatePlaylist = () => {
    if (newPlaylistTitle.trim()) {
      const gradients = ['from-purple-400 to-pink-400', 'from-blue-400 to-purple-400', 'from-green-400 to-blue-400', 'from-orange-400 to-red-400', 'from-teal-400 to-green-400', 'from-indigo-400 to-purple-400'];
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        title: newPlaylistTitle,
        description: newPlaylistDescription || 'New playlist',
        trackCount: 0,
        likes: 0,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
        isLiked: false
      };
      setPlaylists(prev => [newPlaylist, ...prev]);
      setNewPlaylistTitle('');
      setNewPlaylistDescription('');
      setShowCreateModal(false);
    }
  };
  return <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Playlists</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">Craft the Mood, Share the Moment.</p>
          <p className="text-lg text-gray-500 mb-2">Turn tracks into journeys, moments into mixtapes.</p>
          <p className="text-lg text-gray-500">Every playlist a sonic postcard from the edge. Write yours.</p>
        </motion.div>

        {/* Create New Playlist Button */}
        <motion.div className="mb-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <motion.button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <Plus className="w-5 h-5" />
            <span>Create New Playlist</span>
          </motion.button>
        </motion.div>

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => <motion.div key={playlist.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" initial={{
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
              {/* Playlist Cover */}
              <div className={`h-48 bg-gradient-to-br ${playlist.gradient} flex items-center justify-center relative group`}>
                <Music className="w-16 h-16 text-white/60" />
                
                {/* Play Button Overlay */}
                <motion.button className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </motion.button>

                {/* More Options */}
                <motion.button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all" whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.9
            }}>
                  <MoreHorizontal className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Playlist Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{playlist.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{playlist.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {playlist.trackCount} tracks
                  </span>
                  
                  <motion.button onClick={() => handleLikePlaylist(playlist.id)} className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${playlist.isLiked ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'}`} whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                    <Heart className={`w-4 h-4 ${playlist.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{playlist.likes}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>)}
        </div>

        {/* Create Playlist Modal */}
        {showCreateModal && <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
            <motion.div className="bg-white rounded-2xl p-8 max-w-md w-full" initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 0.9,
          opacity: 0
        }}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Playlist</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Playlist Title
                  </label>
                  <input type="text" value={newPlaylistTitle} onChange={e => setNewPlaylistTitle(e.target.value)} placeholder="Enter playlist title" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea value={newPlaylistDescription} onChange={e => setNewPlaylistDescription(e.target.value)} placeholder="Describe your playlist" rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <motion.button onClick={() => setShowCreateModal(false)} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  Cancel
                </motion.button>
                <motion.button onClick={handleCreatePlaylist} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  Create
                </motion.button>
              </div>
            </motion.div>
          </motion.div>}
      </div>
    </div>;
};
export default PlaylistsPage;