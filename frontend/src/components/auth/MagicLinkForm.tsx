import { useState, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
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
    <div className="glass-panel rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
      {/* Header Visual */}
      <div className="h-2 bg-lime w-full" />

      <div className="p-8 md:p-10">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 bg-lime/10 rounded-full flex items-center justify-center border border-lime/30">
            <Sparkles size={32} className="text-lime" />
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Magic Link_</h2>
            <p className="mono text-[10px] text-white/40 uppercase tracking-widest">Passwordless Authentication Protocol</p>
          </div>
        </div>

        {success ? (
          <div className="text-lime text-center bg-lime/10 border border-lime/30 p-8 rounded-[2rem] space-y-4">
            <div className="text-4xl animate-bounce">✨</div>
            <p className="font-black uppercase tracking-widest text-lg">Uplink Established!</p>
            <p className="text-xs font-mono text-white/70">
              MAGIC_PACKET SENT TO: <br />
              <strong className="text-white">{email}</strong>
            </p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest pt-4">
              CLICK_LINK_TO_SYNC
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

            {error && (
              <div className="text-red-400 text-xs bg-red-900/20 border border-red-500/20 p-4 rounded-xl mono">
                {'>'} ERROR: {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? 'SENDING_PACKET...' : <span className="flex items-center justify-center gap-2">SEND_MAGIC_LINK <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /></span>}
            </button>
          </form>
        )}
      </div>

      {/* Password Fallback Options */}
      {!success && (
        <div className="bg-white/5 border-t border-white/5 p-6 space-y-4">
          <p className="text-center mono text-[10px] uppercase tracking-widest text-white/40">
            Manual_Override_Available
          </p>
          <div className="flex gap-4">
            {onSwitchToLogin && (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="flex-1 py-3 border border-white/10 rounded-xl hover:bg-white/5 text-white mono text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Pass_Login
              </button>
            )}
            {onSwitchToSignUp && (
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="flex-1 py-3 border border-white/10 rounded-xl hover:bg-white/5 text-white mono text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                Register
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

