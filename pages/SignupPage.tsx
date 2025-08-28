import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.417 9.58C34.049 5.625 29.27 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691c-1.258 3.053-1.99 6.47-1.99 10.129s.732 7.076 1.99 10.129l-5.344 4.14C.062 33.66 0 29.13 0 24.819c0-4.311.062-8.84 1.01-13.271l5.296 3.143z" />
      <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.819c-1.748 1.168-3.971 1.891-6.219 1.891c-4.956 0-9.22-3.111-10.78-7.553l-6.323 4.931C7.411 42.66 15.04 48 24 48z" />
      <path fill="#1976D2" d="M43.611 20.083L43.595 20L42 20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8l.004-.001l.004.001c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.454-5.454C38.049 5.625 33.27 4 28 4l-4 .001C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
  
const GitHubIcon = () => (
<svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
</svg>
);


const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole.BUYER | UserRole.ARTIST>(UserRole.BUYER);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signup, socialLogin } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signup(email, password, role);
      // App.tsx router handles navigation automatically on currentUser change
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up.');
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError(null);
    setIsLoading(true);
    try {
        await socialLogin(provider, role);
    } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to sign up with ${provider}.`);
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Create an Account</h2>
        {error && <p className="bg-red-900/50 text-red-400 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
            <div className="flex space-x-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="role"
                  value={UserRole.BUYER}
                  checked={role === UserRole.BUYER}
                  onChange={() => setRole(UserRole.BUYER)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className={`p-3 rounded-md text-center cursor-pointer border-2 ${role === UserRole.BUYER ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>
                  Buyer
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="role"
                  value={UserRole.ARTIST}
                  checked={role === UserRole.ARTIST}
                  onChange={() => setRole(UserRole.ARTIST)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <div className={`p-3 rounded-md text-center cursor-pointer border-2 ${role === UserRole.ARTIST ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}>
                  Artist
                </div>
              </label>
            </div>
        </div>
        
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        
        <div className="space-y-3 mb-6">
            <button onClick={() => handleSocialLogin('google')} disabled={isLoading} className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-200 disabled:bg-gray-400">
                <GoogleIcon /> Sign up with Google
            </button>
            <button onClick={() => handleSocialLogin('github')} disabled={isLoading} className="w-full flex items-center justify-center bg-gray-900 text-white font-semibold py-2 px-4 rounded-md hover:bg-black disabled:bg-gray-600 border border-gray-600">
                <GitHubIcon /> Sign up with GitHub
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email-signup"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white placeholder-gray-400"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password-signup"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up with Email'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;