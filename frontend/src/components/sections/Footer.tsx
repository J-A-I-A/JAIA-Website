import { Github, Twitter, Instagram, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-black text-sm">J</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase">JAIA</span>
          </div>
          <p className="text-white/40 mb-8 leading-relaxed">
            The intersection of raw data and elegant form. JAIA is a design intelligence project dedicated to pushing the boundaries of what humans can create with neural co-pilots.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Github size={18} /></a>
            <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Twitter size={18} /></a>
            <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Instagram size={18} /></a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/30">Platform</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Cognition</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prototyping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Neural Sync</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-white/30">Company</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Manifesto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={scrollToTop}
              className="glass-panel p-6 rounded-3xl hover:bg-white/5 transition-all flex items-center gap-4 group border border-white/5"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUp className="text-black" />
              </div>
              <span className="font-bold uppercase tracking-widest text-sm">Back to top</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-white/20 font-medium tracking-widest uppercase">
        <p>&copy; 2024 JAIA INTELLIGENCE. ALL RIGHTS RESERVED.</p>
        <p>DESIGNED IN THE NEURAL SPACE.</p>
      </div>
    </footer>
  );
}
