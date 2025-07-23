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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    
    setForgotPasswordLoading(true);
    setForgotPasswordError(null);
    
    const { error } = await resetPassword(forgotPasswordEmail);
    
    if (error) {
      setForgotPasswordError(error.message);
      setForgotPasswordLoading(false);
    } else {
      setForgotPasswordSuccess(true);
      setForgotPasswordLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
    setForgotPasswordError(null);
    setForgotPasswordSuccess(false);
    setForgotPasswordLoading(false);
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
            <div className={`mb-4 p-3 border rounded-lg ${
              error.includes('environment variables') || error.includes('not configured')
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                error.includes('environment variables') || error.includes('not configured')
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>{error}</p>
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
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

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
            {error && (error.includes('environment variables') || error.includes('not configured')) ? (
              <div className="text-sm text-gray-600">
                <p className="mb-2">To enable authentication, create a <code className="bg-gray-100 px-1 rounded">.env</code> file with:</p>
                <div className="bg-gray-50 p-2 rounded text-left text-xs font-mono">
                  VITE_SUPABASE_URL=your-supabase-project-url<br/>
                  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Create one
                </button>
              </p>
            )}
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

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reset Password</h2>
              
              {!forgotPasswordSuccess ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  
                  {forgotPasswordError && (
                    <div className={`mb-4 p-3 border rounded-lg ${
                      forgotPasswordError.includes('environment variables') || forgotPasswordError.includes('not configured')
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <p className={`text-sm ${
                        forgotPasswordError.includes('environment variables') || forgotPasswordError.includes('not configured')
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>{forgotPasswordError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-4 mt-8">
                      <motion.button
                        type="button"
                        onClick={handleCloseForgotPassword}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={forgotPasswordLoading || !forgotPasswordEmail}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: forgotPasswordLoading ? 1 : 1.02 }}
                        whileTap={{ scale: forgotPasswordLoading ? 1 : 0.98 }}
                      >
                        {forgotPasswordLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Reset Link'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h3>
                    <p className="text-gray-600 mb-6">
                      We've sent a password reset link to {forgotPasswordEmail}
                    </p>
                    <motion.button
                      onClick={handleCloseForgotPassword}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>;
};
export default SignInPage;
