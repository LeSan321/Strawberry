import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Share2, Mail, Users, UserCheck, Clock, X, Check } from 'lucide-react';
interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'friend' | 'pending' | 'sent';
  mutualFriends?: number;
}
type TabType = 'friends' | 'requests' | 'sent';
const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [inviteEmail, setInviteEmail] = useState('');
  const friends: Friend[] = [{
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    status: 'friend',
    mutualFriends: 5
  }, {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    status: 'friend',
    mutualFriends: 3
  }, {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    status: 'friend',
    mutualFriends: 8
  }];
  const requests: Friend[] = [{
    id: '4',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    status: 'pending',
    mutualFriends: 2
  }, {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    status: 'pending',
    mutualFriends: 1
  }];
  const sentRequests: Friend[] = [{
    id: '6',
    name: 'Lisa Thompson',
    email: 'lisa@example.com',
    status: 'sent'
  }];
  const handleShareInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on Strawberry Riff!',
        text: 'Check out this amazing music sharing platform',
        url: 'https://strawberryriff.com/invite'
      });
    } else {
      navigator.clipboard.writeText('https://strawberryriff.com/invite');
      // You could show a toast notification here
    }
  };
  const handleDirectInvite = () => {
    if (inviteEmail) {
      // Handle direct invite logic here
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
    }
  };
  const handleAcceptRequest = (friendId: string) => {
    console.log('Accepting request from:', friendId);
  };
  const handleDeclineRequest = (friendId: string) => {
    console.log('Declining request from:', friendId);
  };
  const handleRemoveFriend = (friendId: string) => {
    console.log('Removing friend:', friendId);
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const renderFriendCard = (friend: Friend) => <motion.div key={friend.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow" initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} whileHover={{
    y: -2
  }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {getInitials(friend.name)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{friend.name}</h3>
            <p className="text-sm text-gray-500">{friend.email}</p>
            {friend.mutualFriends && <p className="text-xs text-purple-600 mt-1">
                5 mutual inspirations5 mutual inspirations</p>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {friend.status === 'friend' && <motion.button onClick={() => handleRemoveFriend(friend.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" whileHover={{
          scale: 1.1
        }} whileTap={{
          scale: 0.9
        }}>
              <X className="w-5 h-5" />
            </motion.button>}
          
          {friend.status === 'pending' && <>
              <motion.button onClick={() => handleAcceptRequest(friend.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
                <Check className="w-5 h-5" />
              </motion.button>
              <motion.button onClick={() => handleDeclineRequest(friend.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
                <X className="w-5 h-5" />
              </motion.button>
            </>}
          
          {friend.status === 'sent' && <div className="flex items-center space-x-2 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Pending</span>
            </div>}
        </div>
      </div>
    </motion.div>;
  const getCurrentData = () => {
    switch (activeTab) {
      case 'friends':
        return friends;
      case 'requests':
        return requests;
      case 'sent':
        return sentRequests;
      default:
        return friends;
    }
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
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Friends</span>
          </h1>
          <p className="text-xl text-gray-600">Find Your Tribe. Creators Who Feel Like Friends  </p>
        </motion.div>

        {/* Invite Section */}
        <motion.div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Invite Friends</h2>
            <p className="text-gray-600">Every new voice adds color to the canvas and connection through music.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <motion.button onClick={handleShareInvite} className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Share2 className="w-5 h-5" />
              <span>Share Invitation Link</span>
            </motion.button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter email address" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            <motion.button onClick={handleDirectInvite} className="flex items-center space-x-2 bg-white border border-purple-300 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Mail className="w-5 h-5" />
              <span>Direct Invite</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          {[{
          id: 'friends' as TabType,
          label: 'Friends',
          icon: Users,
          count: friends.length
        }, {
          id: 'requests' as TabType,
          label: 'Requests',
          icon: UserCheck,
          count: requests.length
        }, {
          id: 'sent' as TabType,
          label: 'Sent',
          icon: Clock,
          count: sentRequests.length
        }].map(tab => {
          const Icon = tab.icon;
          return <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600 hover:text-purple-600'}`} whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-600'}`}>
                    {tab.count}
                  </span>}
              </motion.button>;
        })}
        </motion.div>

        {/* Friends List */}
        <motion.div className="space-y-4" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.6
      }}>
          {getCurrentData().length > 0 ? getCurrentData().map(renderFriendCard) : <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">
                {activeTab === 'friends' && 'No friends yet'}
                {activeTab === 'requests' && 'No pending requests'}
                {activeTab === 'sent' && 'No sent requests'}
              </h3>
              <p className="text-gray-400">
                {activeTab === 'friends' && 'Start by inviting some friends to join you!'}
                {activeTab === 'requests' && 'Friend requests will appear here'}
                {activeTab === 'sent' && 'Your sent invitations will appear here'}
              </p>
            </div>}
        </motion.div>
      </div>
    </div>;
};
export default FriendsPage;