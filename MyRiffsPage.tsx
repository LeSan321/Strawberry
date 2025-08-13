import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Edit, Trash2, Eye, EyeOff, Play, Heart } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { supabase, Track } from './lib/supabase';
import AudioPlayer from './components/AudioPlayer';

const MyRiffsPage: React.FC = () => {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
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
    const { error } = await supabase.from('tracks').update({ visibility: newVisibility }).eq('id', trackId);
    if (!error) {
      setTracks(prev => prev.map(t => t.id === trackId ? { ...t, visibility: newVisibility } : t));
    }
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!supabase) return;
    if (window.confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      const { error } = await supabase.from('tracks').delete().eq('id', trackId);
      if (!error) {
        setTracks(prev => prev.filter(track => track.id !== trackId));
        if (activeTrack?.id === trackId) {
          setActiveTrack(null); // Close the player if the deleted track was active
        }
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
    const { error } = await supabase.from('tracks').update({ title: editTitle, description: editDescription }).eq('id', editingTrack.id);
    if (!error) {
      setTracks(prev => prev.map(track => track.id === editingTrack.id ? { ...track, title: editTitle, description: editDescription } : track));
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
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Sign in to view your riffs</h2>
        <p className="mt-2 text-gray-600">You need to be signed in to access your music collection</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading your tracks...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-red-600">Error Loading Tracks</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      {/* Artist Profile Section */}
      <section className="p-6 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-24 h-24 bg-purple-600 text-white text-4xl font-bold rounded-full flex items-center justify-center">
          {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</h1>
          <p className="text-purple-600 font-semibold">AI Music Creator</p>
          <p className="text-sm text-gray-600 mt-2 max-w-lg">Passionate about creating unique AI-generated music that blends technology with creativity.</p>
        </div>
        <div className="flex space-x-6 pt-4 sm:pt-0 sm:ml-auto">
          <div className="text-center"><div className="text-xl font-bold">{tracks.length}</div><div className="text-sm text-gray-500">Tracks</div></div>
          <div className="text-center"><div className="text-xl font-bold">{tracks.reduce((sum, track) => sum + (track.likes || 0), 0)}</div><div className="text-sm text-gray-500">Total Likes</div></div>
          <div className="text-center"><div className="text-xl font-bold">{tracks.reduce((sum, track) => sum + (track.plays || 0), 0)}</div><div className="text-sm text-gray-500">Total Plays</div></div>
        </div>
      </section>

      {/* My Uploads Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">My Uploads</h2>
          <span className="text-sm text-gray-500">{tracks.filter(t => t.visibility === 'public').length} public • {tracks.filter(t => t.visibility !== 'public').length} private</span>
        </div>
        <div className="mt-4 space-y-4">
          {tracks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">No tracks uploaded yet</h3>
              <p className="text-gray-500 mt-1">Start creating and upload your first AI-generated track!</p>
            </div>
          ) : (
            tracks.map((track, index) => (
              <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="p-4 bg-white rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center"><Music className="text-gray-400" /></div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg">{track.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{track.description || 'No description'}</p>
                    <div className="text-xs text-gray-400 mt-1 space-x-3">
                      <span>{track.duration || 'Unknown'}</span>
                      <span className="inline-flex items-center"><Heart size={12} className="mr-1" />{track.likes || 0}</span>
                      <span className="inline-flex items-center"><Play size={12} className="mr-1" />{track.plays || 0} plays</span>
                      <span>Created {new Date(track.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center space-x-1 mt-4 sm:mt-0">
                  <motion.button onClick={() => setActiveTrack(track)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Play Track"><Play /></motion.button>
                  <motion.button onClick={() => handleTogglePrivacy(track.id)} className={`p-2 rounded-lg transition-colors ${track.visibility === 'public' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={track.visibility === 'public' ? 'Make Private' : 'Make Public'}>{track.visibility === 'public' ? <Eye /> : <EyeOff />}</motion.button>
                  <motion.button onClick={() => handleEditTrack(track)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Edit Track"><Edit /></motion.button>
                  <motion.button onClick={() => handleDeleteTrack(track.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Delete Track"><Trash2 /></motion.button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Conditionally Rendered Audio Player */}
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
           <AudioPlayer 
             src={activeTrack.audio_url} 
             track={activeTrack} 
             onClose={() => setActiveTrack(null)}
           />
        </div>
      )}

      {/* Edit Modal */}
      {editingTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Track</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700">Track Title</label>
                <input id="editTitle" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea id="editDescription" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={handleCancelEdit} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={handleSaveEdit} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRiffsPage;
