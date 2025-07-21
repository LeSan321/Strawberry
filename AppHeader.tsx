import React from 'react';
import { motion } from 'framer-motion';
import { Music, Upload, Users, ListMusic, User, LogOut } from 'lucide-react';
import type { Page } from './StrawberryRiffApp';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
interface AppHeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User | null;
  onSignOut: () => void;
}
const AppHeader: React.FC<AppHeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  onSignOut
}) => {
  const navItems = [{
    id: 'home' as Page,
    label: 'Discover',
    icon: Music
  }, {
    id: 'upload' as Page,
    label: 'Upload',
    icon: Upload
  }, {
    id: 'friends' as Page,
    label: 'Friends',
    icon: Users
  }, {
    id: 'playlists' as Page,
    label: 'Playlists',
    icon: ListMusic
  }] as any[];
  if (user) {
    navItems.push({
      id: 'myriffs' as Page,
      label: 'My Riffs',
      icon: User
    });
  }
  navItems.push({
    id: 'about' as Page,
    label: 'About',
    icon: Music
  });
  navItems.push({
    id: 'pricing' as Page,
    label: 'Pricing',
    icon: Music
  });
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{
            fontFamily: "Space Grotesk"
          }}>
              Strawberry Riff
            </h1>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return <motion.button key={item.id} onClick={() => onNavigate(item.id)} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>;
          })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                  </span>
                </div>
                <motion.button onClick={onSignOut} className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div> : <>
                <motion.button onClick={() => onNavigate('signin')} className="text-gray-600 hover:text-purple-600 px-4 py-2 text-sm font-medium" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  Sign In
                </motion.button>
                <motion.button onClick={() => onNavigate('signin')} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  Get Started
                </motion.button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default AppHeader;