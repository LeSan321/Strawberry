import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { Page } from './StrawberryRiffApp';
import { useAuth } from './lib/AuthContext';

interface SignInPageProps {
  onSignInSuccess: () => void;
  onNavigate: (page: Page) => void;
}

const SignInPage: React.FC<SignInPageProps> = ({
  onSignInSuccess,
  onNavigate
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError(null);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      onSignInSuccess();
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }
    
    setResetLoading(true);
    setResetMessage(null);
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      setResetMessage(error.message);
    } else {
      setResetMessage('Password reset email sent! Check your inbox.');
    }
    
    setResetLoading(false);
  };
  return <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div className="text-center mb-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Strawberry Riff
          </h1>
          <p className="text-gray-600 mt-2">Welcome back to your sonic space</p>
        </motion.div>

        {/* Sign In Form */}
        <motion.div className="bg-white rounded-2xl shadow-xl p-8" initial={{
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Continue your musical journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="your@email.com" required />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button 
                type="button" 
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {showForgotPassword && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your email to reset password
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                {resetMessage && (
                  <div className={`p-2 rounded text-sm ${resetMessage.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {resetMessage}
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading || !resetEmail}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Email'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setResetMessage(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <motion.button type="submit" disabled={isLoading || !email || !password} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{
            scale: isLoading ? 1 : 1.02
          }} whileTap={{
            scale: isLoading ? 1 : 0.98
          }}>
              {isLoading ? <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div> : 'Sign In'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button 
                onClick={() => onNavigate('signup')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create one
              </button>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div className="text-center mt-8" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.4
      }}>
          <motion.button onClick={() => onNavigate('home')} className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mx-auto transition-colors" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </motion.button>
        </motion.div>
      </div>
    </div>;
};
export default SignInPage;
