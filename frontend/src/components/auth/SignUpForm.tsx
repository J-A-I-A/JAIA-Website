import { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Initialize Node</h2>
        <p className="mono text-[10px] text-white/40 uppercase tracking-widest">Create New Identity</p>
      </div>

      {success ? (
        <div className="text-lime text-center bg-lime/10 border border-lime/30 p-8 rounded-[2rem] space-y-4">
          <div className="text-4xl animate-bounce">⚡</div>
          <p className="font-black uppercase tracking-widest text-lg">Signal Sent!</p>
          <p className="text-xs font-mono text-white/70">
            CONFIRMATION_PACKET DISPATCHED TO: <br />
            <strong className="text-white">{email}</strong>
          </p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest pt-4">
            CHECK_INBOX // CHECK_SPAM // VERIFY
          </p>
        </div>
      ) : (
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
              Create_Access_Key
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
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block mono text-[10px] uppercase tracking-widest font-bold text-lime/70">
              Confirm_Key
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'INITIALIZING...' : 'ESTABLISH_NODE'}
          </button>
        </form>
      )}
      {!success && (
        <div className="mt-8 space-y-4">
          {onSwitchToLogin && (
            <p className="text-center text-xs text-white/40">
              ALREADY_OPTIMIZED?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-lime hover:underline font-bold uppercase tracking-widest ml-1"
              >
                ACCESS_SYSTEM
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

