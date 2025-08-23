import React, { useState } from 'react'
import { X, Github, Mail, Lock, User } from 'lucide-react'
import { useSupabase } from '../hooks/useSupabase'

const AuthModal = ({ isOpen, onClose, darkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signInWithGitHub, signInWithEmail, signUpWithEmail } = useSupabase()

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password)
        setError('Check your email for a verification link!')
      } else {
        await signInWithEmail(email, password)
      }
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubAuth = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGitHub()
    } catch (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className={`rounded-xl p-6 w-full max-w-md transform transition-all duration-300 ease-out animate-in zoom-in-95 slide-in-from-top-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GitHub Sign In */}
        <button
          onClick={handleGitHubAuth}
          disabled={loading}
          className={`w-full mb-4 p-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3 ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800'
              : 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-300'
          }`}
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </button>

        {/* Divider */}
        <div className={`flex items-center my-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="px-3 text-sm">or</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              error.includes('Check your email') 
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold transition-colors"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Sign Up/In */}
        <div className={`mt-4 text-center text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Info */}
        <div className={`mt-4 p-3 rounded-lg text-xs ${
          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'
        }`}>
          🔒 Your data will sync across all your devices. You can always use the app offline - it automatically syncs when you're back online.
        </div>
      </div>
    </div>
  )
}

export default AuthModal