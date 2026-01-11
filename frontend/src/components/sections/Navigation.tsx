import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, LogOut, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'magic'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, signOut } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const menuItems = [
    { label: 'Platform', href: '/#about', to: '/', hash: 'about', bgText: 'Roots' },
    { label: 'Committees', href: '/committees', to: '/committees', bgText: 'Nodes' },
    { label: 'Directory', href: '/directory', to: '/directory', bgText: 'Network' },
    { label: 'Events', href: '/events', to: '/events', bgText: 'Gather' },
    { label: 'Projects', href: '/projects', to: '/projects', bgText: 'Build' },
  ];

  const handleNavClick = (item: typeof menuItems[0]) => {
    if (item.hash && isHomePage) {
      const element = document.getElementById(item.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.to) {
      navigate(item.to);
    }
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'magic') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 pointer-events-none">
        <div className="relative z-[101] max-w-screen-2xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link to="/" className="flex items-center gap-4 cursor-pointer group">
            <img
              src="/jaia-logo.png"
              alt="JAIA Logo"
              className="w-12 h-12 object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-500"
            />
            <span className="text-xl font-black tracking-tighter uppercase text-white hidden sm:block">JAIA</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 border-x border-white/5 px-4 h-12">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className="px-5 h-full flex items-center text-[10px] mono font-bold uppercase tracking-[0.2em] text-white/40 hover:text-lime hover:bg-white/[0.02] transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-lime hover:text-black transition-all"
                  >
                    <Shield size={14} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile/edit"
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-lime transition-all"
                >
                  <User size={14} />
                  Profile
                </Link>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="hidden sm:flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-lime transition-all"
              >
                Join_Hub <ArrowUpRight size={14} />
              </button>
            )}
            <button
              className="w-12 h-12 glass-panel rounded-full flex items-center justify-center text-white hover:border-lime/40 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-charcoal z-[90] pointer-events-auto flex flex-col justify-center p-12 md:p-24 overflow-hidden"
            >
              {/* Visual sidebar accent */}
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-lime/60" />

              <div className="flex flex-col gap-4 md:gap-6 relative z-10">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => handleNavClick(item)}
                  >
                    <span className="relative z-10 block text-2xl md:text-4xl font-black uppercase tracking-tighter text-white group-hover:text-lime transition-colors">
                      {item.label}
                    </span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl md:text-6xl font-black uppercase tracking-tighter text-white/[0.03] pointer-events-none select-none -z-10 group-hover:text-lime/[0.05] transition-colors">
                      {item.bgText}
                    </span>
                  </motion.div>
                ))}

                {/* User Actions in Menu */}
                {user ? (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.05 }}
                    className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6"
                  >
                    <Link
                      to="/profile/edit"
                      onClick={() => setIsOpen(false)}
                      className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white/60 hover:text-lime transition-colors"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white/60 hover:text-lime transition-colors flex items-center gap-3"
                      >
                        <Shield size={20} />
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white/60 hover:text-lime transition-colors text-left flex items-center gap-3"
                    >
                      <LogOut size={20} />
                      Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: menuItems.length * 0.05 }}
                    className="flex flex-col gap-3 mt-6 border-t border-white/5 pt-6"
                  >
                    <button
                      onClick={() => openAuthModal('login')}
                      className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white/60 hover:text-lime transition-colors text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="text-lg md:text-2xl font-black uppercase tracking-tighter text-white/60 hover:text-lime transition-colors text-left"
                    >
                      Sign Up
                    </button>
                  </motion.div>
                )}
              </div>

              <div className="mt-12 border-t border-white/5 pt-8 flex flex-wrap gap-6 text-[10px] mono text-white/20 uppercase tracking-[0.4em]">
                <div>[ STATUS: OPERATIONAL ]</div>
                <div className="hidden md:block">///</div>
                <div>[ LOCATION: KGN_NODE ]</div>
                <div className="md:ml-auto">© 2024 JAIA.INTEL</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
