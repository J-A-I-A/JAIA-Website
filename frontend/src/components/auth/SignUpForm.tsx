import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onSwitchToMagic?: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin, onSwitchToMagic }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {success ? (
        <div className="text-green-600 text-center bg-green-50 dark:bg-green-900/20 p-4 rounded space-y-3">
          <div className="text-4xl">📧</div>
          <p className="font-bold text-lg">Check your email!</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            We've sent a confirmation link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the link in the email to verify your account and complete signup.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 pt-2">
            Didn't receive it? Check your spam folder or try signing up again.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>
      )}
      {!success && (
        <div className="mt-4 space-y-2">
          {onSwitchToLogin && (
            <p className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </button>
            </p>
          )}
          {onSwitchToMagic && (
            <p className="text-center text-sm">
              <button
                type="button"
                onClick={onSwitchToMagic}
                className="text-purple-600 hover:underline font-medium"
              >
                ← Back to passwordless login
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

