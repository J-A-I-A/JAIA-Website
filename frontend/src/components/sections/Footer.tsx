import { MessageCircle, Youtube, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { 
      name: 'WhatsApp Community', 
      href: 'https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm', 
      iconImage: '/whatsapp-logo.svg',
      color: 'hover:opacity-80'
    },
    { 
      name: 'Discord Server', 
      href: 'https://discord.gg/NuVXk7yjNz', 
      icon: MessageCircle,
      color: 'hover:text-indigo-600'
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/channel/UCImUF-AEYy3egB1otVuSJbQ?sub_confirmation=1', 
      icon: Youtube,
      color: 'hover:text-red-600'
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/jaia_876', 
      icon: Twitter,
      color: 'hover:text-sky-500'
    },
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/groups/458315652207268', 
      icon: Facebook,
      color: 'hover:text-blue-600'
    },
  ];

  return (
    <footer className="bg-background border-t border-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <img 
                src="/jaia-logo.svg" 
                alt="JAIA Logo" 
                className="h-10 w-auto"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">JAIA</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Jamaica Artificial Intelligence Association
            </p>
          </div>

          {/* Social Links */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex justify-center md:justify-end gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-muted-foreground transition-colors ${social.color}`}
                  aria-label={social.name}
                >
                  {'iconImage' in social ? (
                    <img src={social.iconImage} alt={social.name} className="h-5 w-5" />
                  ) : (
                    <social.icon className="h-5 w-5" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">© 2025 JAIA. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

