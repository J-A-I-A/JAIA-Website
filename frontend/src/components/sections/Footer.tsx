import { CircuitBoard, MessageCircle, Youtube, Github } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { 
      name: 'WhatsApp Community', 
      href: 'https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm', 
      iconImage: '/whatsapp-logo.svg',
    },
    { 
      name: 'Discord Server', 
      href: 'https://discord.gg/NuVXk7yjNz', 
      icon: MessageCircle,
    },
    { 
      name: 'YouTube', 
      href: 'https://www.youtube.com/channel/UCImUF-AEYy3egB1otVuSJbQ?sub_confirmation=1', 
      icon: Youtube,
    },
    { 
      name: 'Twitter', 
      href: 'https://twitter.com/jaia_876', 
      label: 'X',
    },
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/groups/458315652207268', 
      label: 'FB',
    },
    { 
      name: 'GitHub', 
      href: 'https://github.com/J-A-I-A/JAIA-Website', 
      icon: Github,
    },
  ];

  return (
    <footer className="bg-jaia-black border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          <div>
            <div className="flex items-center gap-2 mb-6">
               <CircuitBoard className="text-jaia-gold w-6 h-6" />
               <span className="font-display font-bold text-2xl text-white">JAIA<span className="text-jaia-green">.ORG</span></span>
            </div>
            <p className="font-mono text-gray-500 text-sm max-w-md">
              &gt; EST. 2024<br/>
              &gt; STATUS: OPERATIONAL<br/>
              &gt; MISSION: CARIBBEAN AI ADVANCEMENT
            </p>
            
            {/* Mission statement */}
            <p className="mt-6 text-gray-400 font-sans text-sm max-w-md leading-relaxed">
              The Jamaica Artificial Intelligence Association promotes, advances, and facilitates 
              the understanding, development, and responsible use of AI technologies in Jamaica.
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <h4 className="font-mono text-jaia-gold text-xs tracking-widest mb-6">CONNECT_NODES</h4>
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-jaia-green hover:text-black hover:border-jaia-green transition-all clip-corner"
                  aria-label={social.name}
                >
                  {'iconImage' in social ? (
                    <img src={social.iconImage} alt={social.name} className="h-4 w-4" />
                  ) : 'icon' in social && social.icon ? (
                    <social.icon size={16} />
                  ) : (
                    <span className="text-xs font-mono">{social.label}</span>
                  )}
                </a>
              ))}
            </div>
            <div className="text-right font-mono text-xs text-gray-600">
              <p>EMAIL: CONTACT@JAIA.ORG.JM</p>
              <p className="mt-1 text-jaia-green/50">ENCRYPTED CONNECTION</p>
            </div>
          </div>

        </div>

        {/* Quick Links */}
        <div className="border-t border-white/5 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-mono text-jaia-green text-xs mb-4 tracking-widest">NAVIGATION</h5>
            <ul className="space-y-2 font-mono text-xs text-gray-500">
              <li><a href="/#about" className="hover:text-jaia-gold transition-colors">// About</a></li>
              <li><a href="/#services" className="hover:text-jaia-gold transition-colors">// Services</a></li>
              <li><a href="/projects" className="hover:text-jaia-gold transition-colors">// Projects</a></li>
              <li><a href="/events" className="hover:text-jaia-gold transition-colors">// Events</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-jaia-green text-xs mb-4 tracking-widest">RESOURCES</h5>
            <ul className="space-y-2 font-mono text-xs text-gray-500">
              <li><a href="/directory" className="hover:text-jaia-gold transition-colors">// Directory</a></li>
              <li><a href="/#opensource" className="hover:text-jaia-gold transition-colors">// Open Source</a></li>
              <li><a href="/#contact" className="hover:text-jaia-gold transition-colors">// Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-jaia-green text-xs mb-4 tracking-widest">COMMUNITY</h5>
            <ul className="space-y-2 font-mono text-xs text-gray-500">
              <li><a href="https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm" target="_blank" rel="noopener noreferrer" className="hover:text-jaia-gold transition-colors">// WhatsApp</a></li>
              <li><a href="https://discord.gg/NuVXk7yjNz" target="_blank" rel="noopener noreferrer" className="hover:text-jaia-gold transition-colors">// Discord</a></li>
              <li><a href="https://twitter.com/jaia_876" target="_blank" rel="noopener noreferrer" className="hover:text-jaia-gold transition-colors">// Twitter</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-mono text-jaia-green text-xs mb-4 tracking-widest">LOCATION</h5>
            <div className="font-mono text-xs text-gray-500 space-y-1">
              <p>LAT: 18.0179° N</p>
              <p>LON: 76.8099° W</p>
              <p className="text-jaia-gold mt-2">KINGSTON, JAMAICA</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-700 uppercase">
          <p>© {new Date().getFullYear()} JAMAICA AI ASSOCIATION. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-jaia-gold transition-colors">Privacy_Policy.txt</a>
            <a href="#" className="hover:text-jaia-gold transition-colors">Terms.md</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
