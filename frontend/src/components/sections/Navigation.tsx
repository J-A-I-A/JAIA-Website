import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Cpu, Wifi, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'magic'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const [time, setTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user, signOut } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Handle hash scrolling when navigating to home page with a hash
  useEffect(() => {
    if (isHomePage && location.hash) {
      const sectionId = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [isHomePage, location.hash]);

  const navItems = [
    { label: 'HOME', href: '/', isRoute: true },
    { label: 'SERVICES', href: '/#services', isRoute: false },
    { label: 'PROJECTS', href: '/projects', isRoute: true },
    { label: 'ABOUT', href: '/#about', isRoute: false },
    { label: 'EVENTS', href: '/events', isRoute: true },
    { label: 'DIRECTORY', href: '/directory', isRoute: true },
    { label: 'CONTACT', href: '/#contact', isRoute: false },
  ];

  const handleNavClick = (href: string, isRoute: boolean) => {
    setIsOpen(false);
    
    if (!isRoute && isHomePage && href.startsWith('/#')) {
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleOpenAuthModal = (mode: 'login' | 'signup' | 'magic') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <div className="container mx-auto">
          <div className="flex justify-between items-start">
            
            {/* Logo Module */}
            <Link 
              to="/" 
              className="pointer-events-auto bg-jaia-black/80 backdrop-blur-xl border border-jaia-green/30 p-2 pr-6 flex items-center gap-4 clip-tech-left relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-jaia-green/5 group-hover:bg-jaia-green/10 transition-colors"></div>
              <div className="w-12 h-12 bg-jaia-green flex items-center justify-center relative overflow-hidden">
                <Cpu className="text-jaia-black w-8 h-8 relative z-10" />
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl tracking-tighter leading-none text-white">
                  JAIA<span className="text-jaia-green">.OS</span>
                </h1>
                <div className="flex gap-2 text-[10px] font-mono text-jaia-gold/80">
                  <span>SYS.ONLINE</span>
                  <span className="animate-pulse">●</span>
                </div>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-2 h-2 bg-jaia-green"></div>
            </Link>

            {/* Desktop Navigation Module */}
            <div className="hidden lg:flex pointer-events-auto bg-jaia-black/80 backdrop-blur-xl border border-white/10 px-6 py-3 items-center gap-8 clip-tech-center">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="font-mono text-xs text-gray-400 hover:text-jaia-green transition-colors relative group tracking-widest"
                  >
                    <span className="opacity-50 mr-1">//</span>
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-jaia-green group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith('/#')) {
                        e.preventDefault();
                        if (isHomePage) {
                          handleNavClick(item.href, false);
                        } else {
                          navigate('/' + item.href.substring(1));
                        }
                      }
                    }}
                    className="font-mono text-xs text-gray-400 hover:text-jaia-green transition-colors relative group tracking-widest"
                  >
                    <span className="opacity-50 mr-1">//</span>
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-jaia-green group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              ))}
            </div>

            {/* Status Module */}
            <div className="hidden lg:flex pointer-events-auto bg-jaia-black/80 backdrop-blur-xl border-l-4 border-jaia-gold p-3 gap-6 items-center clip-tech-right font-mono text-[10px] text-gray-400">
              <div className="flex flex-col items-end">
                <span className="text-jaia-gold">{time.toLocaleTimeString('en-GB', {hour12: false, timeZone: 'America/Jamaica'})}</span>
                <span>KINGSTON_NODE</span>
              </div>
              <div className="flex gap-3 text-jaia-green">
                <Wifi size={14} />
                <Battery size={14} className="animate-pulse" />
              </div>
              
              {/* Auth buttons */}
              {user ? (
                <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-4">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1 text-jaia-gold hover:text-jaia-neonGold transition-colors"
                    >
                      <Shield size={12} />
                      <span>ADMIN</span>
                    </Link>
                  )}
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-1 hover:text-jaia-green transition-colors"
                  >
                    <User size={12} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleOpenAuthModal('magic')}
                  className="ml-2 border-l border-white/10 pl-4 text-jaia-green hover:text-jaia-neonGreen transition-colors"
                >
                  LOGIN
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button 
              className="lg:hidden pointer-events-auto bg-jaia-green text-jaia-black p-3 clip-square hover:bg-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-0 z-40 bg-jaia-black/95 backdrop-blur-xl flex items-center justify-center border-l border-jaia-green/30"
          >
            <div className="w-full max-w-sm p-8">
              <div className="border-b border-jaia-green/30 pb-4 mb-8">
                <p className="font-mono text-jaia-gold text-xs">SYSTEM_NAVIGATION</p>
              </div>
              <div className="flex flex-col space-y-6">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {item.isRoute ? (
                      <Link
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:from-jaia-green hover:to-jaia-gold transition-all block"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={(e) => {
                          if (item.href.startsWith('/#')) {
                            e.preventDefault();
                            if (isHomePage) {
                              handleNavClick(item.href, false);
                            } else {
                              navigate('/' + item.href.substring(1));
                            }
                          }
                          setIsOpen(false);
                        }}
                        className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:from-jaia-green hover:to-jaia-gold transition-all block"
                      >
                        {item.label}
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile Auth Section */}
              <div className="mt-12 p-4 bg-white/5 border border-white/10 font-mono text-xs text-gray-500">
                <p>LAT: 18.0179° N</p>
                <p>LON: 76.8099° W</p>
                <p className="mt-2 text-jaia-green">STATUS: CONNECTED</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  {user ? (
                    <div className="space-y-3">
                      <Link
                        to="/profile/edit"
                        className="flex items-center gap-2 text-gray-400 hover:text-jaia-green transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={14} />
                        <span className="truncate">{user.email}</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 text-jaia-gold hover:text-jaia-neonGold transition-colors"
                        >
                          <Shield size={14} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleOpenAuthModal('magic');
                        setIsOpen(false);
                      }}
                      className="w-full py-2 bg-jaia-green text-jaia-black font-bold hover:bg-jaia-neonGreen transition-colors"
                    >
                      LOGIN / SIGNUP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}
