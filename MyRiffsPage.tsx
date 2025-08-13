import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Edit, Trash2, Eye, EyeOff, Play, Pause, Heart, MoreHorizontal } from 'lucide-react';
import { useAuth } from './lib/AuthContext';
import { supabase, Track } from './lib/supabase';

/**
 * A simple, self-contained audio player component.
 * It is positioned at the bottom of the screen and plays audio automatically.
 * @param {object} props - Component props.
 * @param {string | null} props.src - The URL of the audio file to play.
 */
const AudioPlayer: React.FC<{ src: string | null }> = ({ src }) => {
    if (!src) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-900/80 backdrop-blur-sm p-3 z-50 shadow-t-lg">
            <audio
                controls
                autoPlay
                src={src}
                className="w-full h-12"
            >
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};


const MyRiffsPage: React.FC = () => {
    const { user } = useAuth();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // State for managing audio playback
    const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
    const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

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

    /**
     * Handles playing or pausing a track.
     * Toggles playback off if the same track is clicked again.
     * @param {Track} track - The track object to play.
     */
    const handlePlay = (track: Track) => {
        if (playingTrackId === track.id) {
            setPlayingTrackId(null);
            setCurrentAudioUrl(null);
        } else {
            setPlayingTrackId(track.id);
            setCurrentAudioUrl(track.audio_url);
        }
    };

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
            .update({ title: editTitle, description: editDescription })
            .eq('id', editingTrack.id);
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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-3xl font-bold mb-2">Sign in to view your riffs</h2>
                <p className="text-gray-400">You need to be signed in to access your music collection.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-2xl font-semibold">Loading your tracks...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-4">
                <h2 className="text-3xl font-bold text-red-500 mb-2">Error Loading Tracks</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
            {/* Artist Profile Section */}
            <header className="mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold">
                        {user?.user_metadata?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h1 className="text-3xl font-bold">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</h1>
                        <p className="text-purple-400">AI Music Creator</p>
                        <p className="text-gray-400 mt-2 max-w-xl">
                            Passionate about creating unique AI-generated music that blends technology with creativity. Exploring new sounds and pushing the boundaries of what's possible with artificial intelligence.
                        </p>
                    </div>
                    <div className="flex space-x-6 pt-4 sm:pt-0">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{tracks.length}</p>
                            <p className="text-sm text-gray-400">Tracks</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{tracks.reduce((sum, track) => sum + (track.likes || 0), 0)}</p>
                            <p className="text-sm text-gray-400">Total Likes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{tracks.reduce((sum, track) => sum + (track.plays || 0), 0)}</p>
                            <p className="text-sm text-gray-400">Total Plays</p>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {/* My Uploads Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Uploads</h2>
                    <p className="text-gray-400">{tracks.filter(t => t.visibility === 'public').length} public • {tracks.filter(t => t.visibility !== 'public').length} private</p>
                </div>

                {tracks.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800 rounded-lg">
                        <h3 className="text-xl font-semibold">No tracks uploaded yet</h3>
                        <p className="text-gray-400 mt-2">Start creating and upload your first AI-generated track!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tracks.map((track) => (
                            <motion.div
                                key={track.id}
                                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 flex flex-col"
                                layout
                            >
                                <div className="relative h-48 bg-gray-700 flex items-center justify-center">
                                    <Music className="w-16 h-16 text-gray-500" />
                                    {/* Placeholder for an actual track image if available */}
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold truncate">{track.title}</h3>
                                        <div className="flex items-center text-xs text-gray-400 my-2">
                                            {track.visibility === 'public' ? <Eye size={14} className="mr-1 text-green-500" /> : <EyeOff size={14} className="mr-1" />}
                                            <span>{track.visibility === 'public' ? 'Public' : 'Private'}</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-3 h-10 overflow-hidden">{track.description || 'No description'}</p>
                                        <div className="text-xs text-gray-500 flex justify-between">
                                            <span><Heart size={12} className="inline mr-1" />{track.likes || 0}</span>
                                            <span><Play size={12} className="inline mr-1" />{track.plays || 0} plays</span>
                                            <span>Created {new Date(track.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-1 mt-4 pt-4 border-t border-gray-700">
                                        <motion.button onClick={() => handlePlay(track)} className={`p-2 rounded-lg transition-colors text-purple-400 hover:bg-purple-500/20`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={playingTrackId === track.id ? "Pause" : "Play"}>
                                            {playingTrackId === track.id ? <Pause /> : <Play />}
                                        </motion.button>
                                        <div className="flex-grow"></div>
                                        <motion.button onClick={() => handleTogglePrivacy(track.id)} className={`p-2 rounded-lg transition-colors ${track.visibility === 'public' ? 'text-green-400 hover:bg-green-500/20' : 'text-gray-400 hover:bg-gray-500/20'}`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title={track.visibility === 'public' ? 'Make Private' : 'Make Public'}>
                                            {track.visibility === 'public' ? <Eye /> : <EyeOff />}
                                        </motion.button>
                                        <motion.button onClick={() => handleEditTrack(track)} className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Edit Track">
                                            <Edit />
                                        </motion.button>
                                        <motion.button onClick={() => handleDeleteTrack(track.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Delete Track">
                                            <Trash2 />
                                        </motion.button>
                                        <motion.button className="p-2 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="More Options">
                                            <MoreHorizontal />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {editingTrack && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 sm:p-8 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Edit Track</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="editTitle" className="block text-sm font-medium text-gray-300 mb-2">Track Title</label>
                                <input id="editTitle" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label htmlFor="editDescription" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea id="editDescription" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button onClick={handleCancelEdit} className="px-5 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleSaveEdit} className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Conditionally rendered Audio Player */}
            {currentAudioUrl && (
                <AudioPlayer key={playingTrackId} src={currentAudioUrl} />
            )}
        </div>
    );
};

export default MyRiffsPage;
