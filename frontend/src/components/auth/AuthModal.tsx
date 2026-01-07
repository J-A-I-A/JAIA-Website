import { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { MagicLinkForm } from './MagicLinkForm';
import { X, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup' | 'magic';
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'magic'>(defaultMode);

  // Update mode when defaultMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/50 hover:text-lime transition-colors"
          aria-label="Close"
        >
          <X size={32} />
        </button>

        {mode === 'magic' ? (
          <MagicLinkForm
            onSwitchToLogin={() => setMode('login')}
            onSwitchToSignUp={() => setMode('signup')}
          />
        ) : (
          <div className="glass-panel rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Header Visual */}
            <div className="h-2 bg-lime w-full" />

            {mode === 'login' ? (
              <div className="p-8 md:p-10">
                <LoginForm
                  onSuccess={handleSuccess}
                  onSwitchToSignUp={() => setMode('signup')}
                />
              </div>
            ) : (
              <div className="p-8 md:p-10">
                <SignUpForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => setMode('login')}
                />
              </div>
            )}

            {/* Magic Link Callout - Inside Modal */}
            <div className="bg-white/5 border-t border-white/5 p-6">
              <button
                onClick={() => setMode('magic')}
                className="w-full text-center group"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-lime group-hover:text-white transition-colors uppercase tracking-widest mono">
                  <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                  <span>Passwordless Access</span>
                </div>
                <p className="text-[10px] text-white/40 mt-2 uppercase tracking-tight mono">
                  Secure Link // No Key Required
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

