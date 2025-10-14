import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Services', href: '/#services', isRoute: false },
    { name: 'Projects', href: '/projects', isRoute: true },
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            JAIA
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
          </div>
        )}
      </div>
    </nav>
  );
}

