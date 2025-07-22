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
import { AuthProvider, useAuth } from './lib/AuthContext';

export type Page = 'home' | 'upload' | 'friends' | 'playlists' | 'signin' | 'myriffs' | 'about' | 'profile-setup' | 'pricing';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { user, signOut } = useAuth();

  const handleSignInSuccess = () => {
    setCurrentPage('profile-setup');
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentPage('home');
  };
  const renderPage = () => {
    const protectedRoutes: Page[] = ['upload', 'friends', 'myriffs', 'profile-setup'];
    if (protectedRoutes.includes(currentPage) && !user) {
      setCurrentPage('signin');
      return <SignInPage onSignInSuccess={handleSignInSuccess} onNavigate={setCurrentPage} />;
    }

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
        return <SignInPage onSignInSuccess={handleSignInSuccess} onNavigate={setCurrentPage} />;
      case 'myriffs':
        return <MyRiffsPage />;
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <AppHeader 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onSignOut={handleSignOut} 
      />
      
      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const StrawberryRiffApp: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default StrawberryRiffApp;
