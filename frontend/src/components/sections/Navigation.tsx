import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'magic'>('login');
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
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

  const navItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Services', href: '/#services', isRoute: false },
    { name: 'Projects', href: '/projects', isRoute: true },
    { name: 'Open Source', href: '/#opensource', isRoute: false },
    { name: 'Events', href: '/#events', isRoute: false },
    { name: 'Contact', href: '/#contact', isRoute: false },
  ];

  const handleNavClick = (href: string, isRoute: boolean) => {
    setIsOpen(false);
    
    // If it's a hash link and we're already on the home page, scroll to the section
    if (!isRoute && isHomePage && href.startsWith('/#')) {
      const sectionId = href.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 64; // Height of the fixed navbar (h-16 = 64px)
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            JAIA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (isHomePage && item.href.startsWith('/#')) {
                      e.preventDefault();
                      handleNavClick(item.href, false);
                    }
                  }}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              )
            ))}
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile/edit"
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <User size={16} />
                  <span className="max-w-[150px] truncate">{user.email}</span>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Button
                  onClick={() => handleOpenAuthModal('magic')}
                  size="sm"
                >
                  Log In / Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => handleNavClick(item.href, true)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-sm font-medium hover:text-primary transition-colors"
                  onClick={(e) => {
                    if (isHomePage && item.href.startsWith('/#')) {
                      e.preventDefault();
                    }
                    handleNavClick(item.href, false);
                  }}
                >
                  {item.name}
                </a>
              )
            ))}
            
            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-primary/10">
              {user ? (
                <div className="space-y-3">
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={16} />
                    <span className="truncate">{user.email}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Link
                    to="/profile/edit"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      My Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    handleOpenAuthModal('magic');
                    setIsOpen(false);
                  }}
                  size="sm"
                  className="w-full"
                >
                  Log In / Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    
    {/* Auth Modal */}
    <AuthModal
      isOpen={authModalOpen}
      onClose={() => setAuthModalOpen(false)}
      defaultMode={authMode}
    />
    </>
  );
}

