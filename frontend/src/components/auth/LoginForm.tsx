import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">System Login</h2>
        <p className="mono text-[10px] text-white/40 uppercase tracking-widest">Identify Yourself</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="block mono text-[10px] uppercase tracking-widest font-bold text-lime/70">
            Email_Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="IDENTITY@JAIA.AI"
            required
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-lime text-white mono text-xs font-bold tracking-widest placeholder:text-white/10 transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block mono text-[10px] uppercase tracking-widest font-bold text-lime/70">
            Access_Key
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-lime text-white mono text-xs font-bold tracking-widest placeholder:text-white/10 transition-colors"
          />
        </div>

        {error && (
          <div className="text-red-400 text-xs bg-red-900/20 border border-red-500/20 p-4 rounded-xl mono">
            {'>'} ERROR: {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-lime text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'AUTHENTICATING...' : 'INITIATE_SESSION'}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {onSwitchToSignUp && (
          <p className="text-center text-xs text-white/40">
            NO_IDENTITY_FOUND?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-lime hover:underline font-bold uppercase tracking-widest ml-1"
            >
              REGISTER_NODE
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
