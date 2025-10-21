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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
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
          <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {mode === 'login' ? (
              <div className="p-6">
                <LoginForm
                  onSuccess={handleSuccess}
                  onSwitchToSignUp={() => setMode('signup')}
                  onSwitchToMagic={() => setMode('magic')}
                />
              </div>
            ) : (
              <div className="p-6">
                <SignUpForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => setMode('login')}
                  onSwitchToMagic={() => setMode('magic')}
                />
              </div>
            )}
            
            {/* Magic Link Callout - Inside Modal */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4">
              <button
                onClick={() => setMode('magic')}
                className="w-full text-center group"
              >
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">
                  <Sparkles size={18} className="group-hover:scale-110 transition-transform" />
                  <span>Try passwordless magic link</span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded-full">Easiest</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  No password needed • Log in with just your email
                </p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

