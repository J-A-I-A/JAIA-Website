import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sparkles } from 'lucide-react';

interface MagicLinkFormProps {
  onSwitchToLogin?: () => void;
  onSwitchToSignUp?: () => void;
}

export function MagicLinkForm({ onSwitchToLogin, onSwitchToSignUp }: MagicLinkFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={24} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-2xl font-bold text-center">Passwordless Login</h2>
        </div>
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The easiest way to log in or sign up
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            No password needed • Works for new and returning users
          </p>
        </div>
        
        {success ? (
          <div className="text-green-600 text-center bg-green-50 dark:bg-green-900/20 p-4 rounded space-y-3">
            <div className="text-4xl">✨</div>
            <p className="font-bold text-lg">Check your email!</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click the link in the email to log in instantly.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
              The link will expire in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                className="text-base"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending magic link...' : 'Send Magic Link ✨'}
            </Button>
          </form>
        )}
      </div>
      
      {/* Password Fallback Options */}
      {!success && (onSwitchToLogin || onSwitchToSignUp) && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
            Prefer using a password?
          </p>
          <div className="flex gap-2">
            {onSwitchToLogin && (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="flex-1 text-sm py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Log in with password
              </button>
            )}
            {onSwitchToSignUp && (
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="flex-1 text-sm py-2 px-4 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Sign up with password
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

