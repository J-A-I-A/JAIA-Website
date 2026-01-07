import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { NeonButton } from '@/components/ui/neon-button';

// Custom Animated SVGs for each card strictly matched to the project themes using Brand Colors (Gold/Green)

// Custom Animated SVGs for each card strictly matched to the project themes using Brand Colors (Gold/Green)

// 1. Finance Bot: "DigitalCurrency" - A spinning, glowing digital coin representing wealth and transactions.
const FinanceFlow = () => (
  <div className="relative w-48 h-48 mx-auto opacity-90">
    {/* Outer Ring */}
    <motion.div
      className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-dashed border-jaia-gold/30"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />

    {/* The Coin */}
    <div className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center">
      <motion.div
        className="w-full h-full rounded-full border-2 border-jaia-gold/60 bg-jaia-gold/10 flex items-center justify-center"
        animate={{ rotateY: 180 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-4xl text-jaia-gold font-display font-bold">$</span>
      </motion.div>
    </div>

    {/* Orbiting 'Data' particles (Money Flow) */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-jaia-green rounded-full blur-[1px]"
        animate={{
          x: [0, Math.cos(i * 1.5) * 60, 0],
          y: [0, Math.sin(i * 1.5) * 60, 0],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        style={{ top: '50%', left: '50%' }}
      />
    ))}
  </div>
);

// 2. Law Bot: "JusticeScales" - A minimalist, balancing scale representing the weighing of evidence and fairness.
const LegalNodes = () => (
  <div className="relative w-48 h-48 mx-auto text-jaia-gold/80">
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-current fill-none">
      {/* Central Pillar */}
      <line x1="50" y1="20" x2="50" y2="85" strokeWidth="2" strokeOpacity="0.5" />
      <line x1="40" y1="85" x2="60" y2="85" strokeWidth="2" strokeOpacity="0.5" />

      {/* The Beam (Tips back and forth) */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "50px", originY: "25px" }}
      >
        {/* Beam */}
        <line x1="20" y1="25" x2="80" y2="25" strokeWidth="2" />

        {/* Left Pan */}
        <g>
          <line x1="20" y1="25" x2="20" y2="45" strokeWidth="0.5" />
          <line x1="20" y1="25" x2="10" y2="45" strokeWidth="0.5" />
          <line x1="20" y1="25" x2="30" y2="45" strokeWidth="0.5" />
          <path d="M10 45 Q20 55 30 45" strokeWidth="1" fill="rgba(255,215,0,0.1)" />
        </g>

        {/* Right Pan */}
        <g>
          <line x1="80" y1="25" x2="80" y2="45" strokeWidth="0.5" />
          <line x1="80" y1="25" x2="70" y2="45" strokeWidth="0.5" />
          <line x1="80" y1="25" x2="90" y2="45" strokeWidth="0.5" />
          <path d="M70 45 Q80 55 90 45" strokeWidth="1" fill="rgba(255,215,0,0.1)" />
        </g>
      </motion.g>

      {/* Glow at the fulcrum */}
      <motion.circle cx="50" cy="25" r="2" fill="#009B3A" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
    </svg>
  </div>
);

// 3. Music Filter: "PulseMonitor" - Radial lines representing detection, filtering, and content moderation (the "Eye").
const PulseMonitor = () => (
  <div className="relative w-48 h-48 mx-auto text-jaia-green/80">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <motion.circle
        cx="50" cy="50" r="25"
        stroke="#FFD700"
        strokeWidth="0.5"
        fill="none"
        animate={{ r: [25, 28, 25], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      {[...Array(16)].map((_, i) => (
        <motion.line
          key={i}
          x1="50" y1="50"
          x2="50" y2="15"
          stroke="currentColor"
          strokeWidth="0.5"
          transform={`rotate(${i * 22.5} 50 50)`}
          strokeOpacity="0.3"
          animate={{ strokeOpacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
    </svg>
  </div>
);

// 4. Patois Speech: "VoiceWave" - Organic vertical bars representing natural language frequency and audio processing.
const VoiceWave = () => (
  <div className="relative w-48 h-48 mx-auto flex items-center justify-center gap-[6px]">
    {[...Array(7)].map((_, i) => (
      <motion.div
        key={i}
        className="w-1.5 rounded-full bg-gradient-to-t from-jaia-gold/20 via-jaia-gold to-jaia-gold/20"
        animate={{ height: [20, 40 + Math.random() * 40, 20] }}
        transition={{ duration: 0.8 + Math.random() * 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const projectVisuals: Record<string, React.ComponentType> = {
  'lawbot': LegalNodes,
  'finance-bot': FinanceFlow,
  'patois-speech': VoiceWave,
  'music-filter': PulseMonitor
};

export function Projects() {
  const featuredProjects = projects.slice(0, 4);
  const containerRef = useRef<HTMLElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} id="projects" className="py-16 bg-jaia-black relative overflow-hidden">

      {/* Background: Clean, minimal grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        {/* Vertical light beams */}
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* Header Section - Minimal & Clean per reference */}
        <div className="mb-12 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-display font-medium text-white mb-6"
          >
            The Future of <br />
            <span className="text-gray-500">Innovation Is Here</span>
          </motion.h2>
        </div>

        {/* The "Tokenex" Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {featuredProjects.map((project, idx) => {
            const VisualComponent = projectVisuals[project.id] || FinanceFlow;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative p-8 md:p-12 flex flex-col h-[600px] hover:bg-white/[0.02] transition-colors duration-500"
              >
                {/* Title */}
                <div className="mb-6">
                  <h3 className="text-2xl font-display font-medium text-white group-hover:text-jaia-gold transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-auto font-light">
                  {project.description}
                </p>

                {/* Visual Animation Area (Bottom Center) */}
                <div className="relative py-12 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                  <VisualComponent />
                </div>

                {/* Bottom Link */}
                <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-jaia-gold/0 group-hover:text-jaia-gold transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  READ_CASE_STUDY <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Always visible subtle link for mobile accessibility, hidden on hover to swap with the one above if desired, but let's keep it simple: */}
                <div className="absolute bottom-12 left-12 md:left-12 flex items-center gap-2 text-xs font-mono tracking-widest text-gray-600 group-hover:opacity-0 transition-opacity duration-300">
                  READ MORE <ArrowRight className="w-4 h-4" />
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link to="/projects">
            <NeonButton variant="secondary" className="px-8 py-4 text-sm tracking-widest">
              VIEW ALL INNOVATIONS
            </NeonButton>
          </Link>
        </div>

      </div>
    </section>
  );
}
