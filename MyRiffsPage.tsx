import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Edit, Trash2, Eye, EyeOff, Play, Heart, MoreHorizontal } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { supabase, Track } from './lib/supabase';
const MyRiffsPage: React.FC = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchUserTracks = async () => {
      if (!user || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tracks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching tracks:', error);
          setError('Failed to load your tracks');
        } else {
          setTracks(data || []);
        }
      } catch (err) {
        console.error('Exception fetching tracks:', err);
        setError('Failed to load your tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTracks();
  }, [user]);
  const handleTogglePrivacy = async (trackId: string) => {
    if (!supabase) return;
    
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;
    
    const newVisibility = track.visibility === 'public' ? 'private' : 'public';
    
    const { error } = await supabase
      .from('tracks')
      .update({ visibility: newVisibility })
      .eq('id', trackId);
    
    if (!error) {
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, visibility: newVisibility } : t));
    }
  };
  const handleDeleteTrack = async (trackId: string) => {
    if (!supabase) return;
    
    if (window.confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);
      
      if (!error) {
        setTracks(prev => prev.filter(track => track.id !== trackId));
      }
    }
  };
  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setEditTitle(track.title);
    setEditDescription(track.description || '');
  };
  const handleSaveEdit = async () => {
    if (!editingTrack || !editTitle.trim() || !supabase) return;
    
    const { error } = await supabase
      .from('tracks')
      .update({ 
        title: editTitle,
        description: editDescription 
      })
      .eq('id', editingTrack.id);
    
    if (!error) {
      setTracks(prev => prev.map(track => 
        track.id === editingTrack.id 
          ? { ...track, title: editTitle, description: editDescription }
          : track
      ));
      setEditingTrack(null);
      setEditTitle('');
      setEditDescription('');
    }
  };
  const handleCancelEdit = () => {
    setEditingTrack(null);
    setEditTitle('');
    setEditDescription('');
  };
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">Sign in to view your riffs</h2>
          <p className="text-gray-500">You need to be signed in to access your music collection</p>
        </div>
      </div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tracks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <Music className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Tracks</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Artist Profile Section */}
        <motion.div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 mb-12 text-white" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold">
                {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</h1>
              <p className="text-xl text-white/90 mb-4">AI Music Creator</p>
              <p className="text-white/80 max-w-2xl">
                Passionate about creating unique AI-generated music that blends technology with creativity. 
                Exploring new sounds and pushing the boundaries of what's possible with artificial intelligence.
              </p>
              
              <div className="flex flex-wrap gap-6 mt-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold">{tracks.length}</div>
                  <div className="text-white/80 text-sm">Tracks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{tracks.reduce((sum, track) => sum + track.likes, 0)}</div>
                  <div className="text-white/80 text-sm">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{tracks.reduce((sum, track) => sum + track.plays, 0)}</div>
                  <div className="text-white/80 text-sm">Total Plays</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Uploads Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">My Uploads</h2>
            <div className="text-sm text-gray-500">
              {tracks.filter(t => t.visibility === 'public').length} public • {tracks.filter(t => t.visibility !== 'public').length} private
            </div>
          </div>

          {tracks.length === 0 ? <div className="text-center py-16">
              <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No tracks uploaded yet</h3>
              <p className="text-gray-500">Start creating and upload your first AI-generated track!</p>
            </div> : <div className="space-y-4">
              {tracks.map((track, index) => <motion.div key={track.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }}>
                  <div className="flex flex-col md:flex-row">
                    {/* Track Cover */}
                    <div className={`w-full md:w-48 h-48 bg-gradient-to-br ${track.gradient || 'from-purple-400 to-pink-400'} flex items-center justify-center relative group`}>
                      <Music className="w-12 h-12 text-white/60" />
                      <motion.button className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </motion.button>
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{track.title}</h3>
                            <div className="flex items-center space-x-1">
                              {track.visibility === 'public' ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                              <span className={`text-xs px-2 py-1 rounded-full ${track.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {track.visibility === 'public' ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{track.description || 'No description'}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span>{track.duration || 'Unknown'}</span>
                            <span className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{track.likes}</span>
                            </span>
                            <span>{track.plays} plays</span>
                            <span>Created {new Date(track.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {/* Privacy Toggle */}
                          <motion.button onClick={() => handleTogglePrivacy(track.id)} className={`p-2 rounded-lg transition-colors ${track.visibility === 'public' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} title={track.visibility === 'public' ? 'Make Private' : 'Make Public'}>
                            {track.visibility === 'public' ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </motion.button>

                          {/* Edit Button */}
                          <motion.button onClick={() => handleEditTrack(track)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} title="Edit Track">
                            <Edit className="w-5 h-5" />
                          </motion.button>

                          {/* Delete Button */}
                          <motion.button onClick={() => handleDeleteTrack(track.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }} title="Delete Track">
                            <Trash2 className="w-5 h-5" />
                          </motion.button>

                          {/* More Options */}
                          <motion.button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors" whileHover={{
                      scale: 1.1
                    }} whileTap={{
                      scale: 0.9
                    }}>
                            <MoreHorizontal className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>)}
            </div>}
        </motion.div>

        {/* Edit Modal */}
        {editingTrack && <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" initial={{
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Track</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Track Title
                  </label>
                  <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <motion.button onClick={handleCancelEdit} className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  Cancel
                </motion.button>
                <motion.button onClick={handleSaveEdit} className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>}
      </div>
    </div>;
};
export default MyRiffsPage;
