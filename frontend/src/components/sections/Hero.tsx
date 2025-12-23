import { motion, useScroll, useTransform } from 'framer-motion';
import { NeonButton } from '@/components/ui/neon-button';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-jaia-black perspective-1000">
      
      {/* Dynamic Background Grid (Floor) */}
      <div className="absolute inset-0 transform-gpu perspective-3d overflow-hidden pointer-events-none">
        <div className="absolute inset-[-100%] bg-[size:60px_60px] bg-cyber-grid opacity-20 transform rotate-x-60 animate-scan"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-jaia-black via-transparent to-transparent"></div>
      </div>

      {/* Abstract Cyber Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-40">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-[1px] border-jaia-green/20 rounded-full border-dashed"
        ></motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-20 border-[1px] border-jaia-gold/20 rounded-full border-dotted"
        ></motion.div>
        <div className="absolute inset-0 bg-gradient-radial from-jaia-green/10 to-transparent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 text-center">
        
        {/* System Alert Tag */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 border border-jaia-green/30 bg-jaia-green/5 px-6 py-2 rounded-none mb-10 backdrop-blur-sm clip-square"
        >
          <span className="w-2 h-2 bg-jaia-green animate-pulse"></span>
          <span className="font-mono text-jaia-green text-xs tracking-[0.2em]">JAMAICA AI ASSOCIATION</span>
        </motion.div>

        {/* Main Title with Glitch Effect */}
        <div className="relative mb-8">
          <motion.h1 
            style={{ y: y2 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-800 mix-blend-screen"
          >
            FUTURE<br />
            <span className="text-stroke-white text-transparent">INTELLIGENCE</span>
          </motion.h1>
          
          {/* Glitch Overlay Text */}
          <h1 className="absolute top-0 left-0 right-0 text-6xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.85] tracking-tighter text-jaia-green/30 opacity-0 animate-glitch pointer-events-none mix-blend-overlay">
            FUTURE<br />INTELLIGENCE
          </h1>
        </div>

        {/* Subtext */}
        <motion.p 
          style={{ y: y1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-2xl font-sans text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed border-l-2 border-jaia-gold pl-6 text-left md:text-center md:border-l-0 md:pl-0"
        >
          <span className="text-jaia-gold font-mono text-sm block mb-2">&gt; INITIALIZING CARIBBEAN PROTOCOL</span>
          Accelerating Jamaica's digital evolution through decentralized AI research, education, and policy development.
        </motion.p>

        {/* CTA Array */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <NeonButton 
            variant="primary"
            href="https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm"
          >
            Join_Network()
          </NeonButton>
          <NeonButton 
            variant="secondary"
            onClick={() => {
              const element = document.getElementById('about');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore_Data
          </NeonButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-jaia-green/20 pt-12"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-jaia-gold">500+</div>
            <div className="text-xs font-mono text-gray-500 mt-2">NETWORK_NODES</div>
          </div>
          <div className="text-center border-x border-jaia-green/10">
            <div className="text-3xl md:text-4xl font-display font-bold text-jaia-green">24/7</div>
            <div className="text-xs font-mono text-gray-500 mt-2">ACTIVE_STATUS</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-white">JA</div>
            <div className="text-xs font-mono text-gray-500 mt-2">LOCATION_NODE</div>
          </div>
        </motion.div>

      </div>

      {/* Decorative Side Elements */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 text-[10px] font-mono text-jaia-green/40 writing-vertical-lr">
        <span>COORDINATES: 17.9712° N, 76.7928° W</span>
        <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-jaia-green/40 to-transparent"></div>
        <span>SECTOR: JAMAICA</span>
      </div>

      {/* Right side decoration */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 text-[10px] font-mono text-jaia-gold/40">
        <div className="w-12 h-[1px] bg-jaia-gold/40"></div>
        <span className="text-right">EST. 2024</span>
        <span className="text-right">KINGSTON</span>
        <div className="w-12 h-[1px] bg-jaia-gold/40"></div>
      </div>
    </section>
  );
}
