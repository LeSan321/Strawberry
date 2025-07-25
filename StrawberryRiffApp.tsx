import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppHeader from './AppHeader';
import HomePage from './HomePage';
import UploadMusicPage from './UploadMusicPage';
import FriendsPage from './FriendsPage';
import PlaylistsPage from './PlaylistsPage';
import SignInPage from './SignInPage';
import MyRiffsPage from './MyRiffsPage';
import AboutContactPage from './AboutContactPage';
import CreatorProfileFlow from './CreatorProfileFlow';
import PricingPage from './PricingPage';
export type Page = 'home' | 'upload' | 'friends' | 'playlists' | 'signin' | 'myriffs' | 'about' | 'profile-setup' | 'pricing';
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
const StrawberryRiffApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const handleSignIn = (email: string, password: string) => {
    // Mock authentication
    setUser({
      id: '1',
      name: 'Music Creator',
      email: email,
      avatar: undefined
    });
    // Redirect new users to profile setup
    setCurrentPage('profile-setup');
  };
  const handleSignOut = () => {
    setUser(null);
    setCurrentPage('home');
  };
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'upload':
        return <UploadMusicPage />;
      case 'friends':
        return <FriendsPage />;
      case 'playlists':
        return <PlaylistsPage />;
      case 'signin':
        return <SignInPage onSignIn={handleSignIn} onNavigate={setCurrentPage} />;
      case 'myriffs':
        return <MyRiffsPage user={user} />;
      case 'about':
        return <AboutContactPage />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />;
      case 'profile-setup':
        return <CreatorProfileFlow onComplete={profile => {
          console.log('Profile completed:', profile);
          setCurrentPage('home');
        }} onCancel={() => setCurrentPage('home')} />;
      default:
        return <HomePage />;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <AppHeader currentPage={currentPage} onNavigate={setCurrentPage} user={user} onSignOut={handleSignOut} />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} transition={{
          duration: 0.3
        }}>
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>;
};
export default StrawberryRiffApp;
