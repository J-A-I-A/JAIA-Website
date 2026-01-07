import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, ExternalLink, Star, GitFork, Eye, Code2 } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';

// Particle System
const Particle = ({ delay, duration }: { delay: number; duration: number }) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  
  return (
    <motion.circle
      cx={randomX}
      cy={randomY}
      r="1"
      fill="currentColor"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
        y: [0, -30, -60]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    />
  );
};

// Git Commit Graph
const GitGraph = () => (
  <svg viewBox="0 0 300 200" className="w-full h-full">
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#009B3A" />
        <stop offset="100%" stopColor="#FFD700" />
      </linearGradient>
    </defs>
    
    {/* Main Branch Line */}
    <motion.path
      d="M20,100 L280,100"
      stroke="url(#lineGradient)"
      strokeWidth="3"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 0.5 }}
    />
    
    {/* Feature Branch */}
    <motion.path
      d="M80,100 Q100,60 120,60 L200,60 Q220,60 240,100"
      stroke="#FFD700"
      strokeWidth="2"
      fill="none"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, delay: 1 }}
    />
    
    {/* Commits on main branch */}
    {[20, 80, 140, 200, 260].map((x, i) => (
      <motion.g key={`main-${i}`}>
        <motion.circle
          cx={x}
          cy={100}
          r="6"
          fill="#009B3A"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
        />
        <motion.circle
          cx={x}
          cy={100}
          r="8"
          fill="none"
          stroke="#009B3A"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
          transition={{ delay: 0.5 + i * 0.2, duration: 1, repeat: Infinity, repeatDelay: 2 }}
        />
      </motion.g>
    ))}
    
    {/* Commits on feature branch */}
    {[120, 160, 200].map((x, i) => (
      <motion.circle
        key={`feature-${i}`}
        cx={x}
        cy={60}
        r="5"
        fill="#FFD700"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5 + i * 0.2, type: "spring" }}
      />
    ))}
  </svg>
);

// Animated Terminal
const Terminal = () => {
  const commands = [
    "$ git clone github.com/jaia/website",
    "$ npm install",
    "$ npm run dev",
    "> Ready on http://localhost:5173"
  ];

  return (
    <div className="bg-jaia-darkGrey border border-jaia-green/30 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-jaia-darkGrey/80 border-b border-jaia-green/20 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono text-xs text-gray-500">terminal</span>
      </div>
      
      {/* Terminal Body */}
      <div className="p-4 font-mono text-xs space-y-2">
        {commands.map((cmd, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.8 + 1, duration: 0.3 }}
            className={cmd.startsWith('>') ? 'text-jaia-green' : 'text-gray-400'}
          >
            {cmd}
            {i === commands.length - 1 && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-jaia-green ml-1"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Code Block Animation
const CodeBlock = () => {
  const codeLines = [
    "import { useAI } from '@jaia/sdk'",
    "",
    "export function SmartApp() {",
    "  const { predict } = useAI()",
    "  return <Dashboard />",
    "}"
  ];

  return (
    <div className="bg-jaia-darkGrey border border-jaia-gold/30 rounded-lg p-4 font-mono text-xs">
      {codeLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="leading-relaxed"
        >
          <span className="text-gray-600 select-none mr-4">{i + 1}</span>
          <span className={
            line.includes('import') || line.includes('export') ? 'text-purple-400' :
            line.includes('function') || line.includes('const') ? 'text-blue-400' :
            line.includes('useAI') || line.includes('predict') ? 'text-jaia-gold' :
            line.includes('return') ? 'text-pink-400' :
            'text-gray-400'
          }>
            {line}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export function OpenSource() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Smooth spring physics
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <section ref={sectionRef} id="open-source" className="py-32 bg-gradient-to-b from-jaia-black via-jaia-darkGrey/50 to-jaia-black relative overflow-hidden scroll-mt-16">
      
      {/* Layered Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#009B3A08_1px,transparent_1px),linear-gradient(to_bottom,#009B3A08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* Animated Particle System */}
        <svg className="absolute inset-0 w-full h-full text-jaia-gold/40">
          {[...Array(30)].map((_, i) => (
            <Particle 
              key={i} 
              delay={i * 0.3} 
              duration={3 + Math.random() * 2}
            />
          ))}
        </svg>
      </div>

      {/* Parallax Orbs with better movement */}
      <motion.div 
        style={{ y: smoothY, scale }}
        className="absolute top-10 left-10 w-[600px] h-[600px] bg-jaia-gold/10 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-jaia-green/10 rounded-full blur-[150px] pointer-events-none"
      />
      
      {/* Rotating Rings */}
      <motion.div
        style={{ rotate }}
        className="absolute left-1/2 top-20 -translate-x-1/2 w-[400px] h-[400px] pointer-events-none opacity-20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="#009B3A" strokeWidth="0.5" strokeDasharray="4 2" />
        </svg>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-jaia-green/10 border border-jaia-green/30 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Code2 className="w-4 h-4 text-jaia-green" />
              </motion.div>
              <span className="font-mono text-jaia-green text-xs tracking-widest">OPEN_SOURCE_ECOSYSTEM</span>
            </motion.div>

            <h2 className="text-6xl md:text-8xl font-display font-bold mb-6 leading-none">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="block text-white"
              >
                Built in the
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-jaia-green via-jaia-neonGreen to-jaia-gold bg-[length:200%_auto] animate-shine"
              >
                Open
              </motion.span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed"
            >
              A fully transparent, community-driven platform. Dive into our codebase, learn modern development, and help shape Jamaica's AI future.
            </motion.p>
          </motion.div>
        </div>

        {/* Interactive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16 max-w-7xl mx-auto">
          
          {/* Terminal Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
            onHoverStart={() => setHoveredCard(0)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              animate={{ 
                borderColor: hoveredCard === 0 ? 'rgba(0, 155, 58, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: hoveredCard === 0 ? 'rgba(0, 155, 58, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
              className="h-full p-6 bg-white/[0.02] border rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-jaia-green" />
                  Quick Start
                </h3>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-jaia-green rounded-full"
                />
              </div>
              <Terminal />
            </motion.div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onHoverStart={() => setHoveredCard(1)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              animate={{ 
                borderColor: hoveredCard === 1 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: hoveredCard === 1 ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
              className="h-full p-6 bg-white/[0.02] border rounded-2xl transition-all duration-300 flex flex-col"
            >
              <h3 className="font-display font-bold text-white mb-6">Repository Stats</h3>
              
              <div className="space-y-4 flex-1">
                {[
                  { icon: Star, label: 'Stars', value: '2.3k', color: 'text-yellow-400' },
                  { icon: GitFork, label: 'Forks', value: '456', color: 'text-jaia-gold' },
                  { icon: Eye, label: 'Watching', value: '189', color: 'text-jaia-green' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg hover:bg-white/[0.05] transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</span>
                    </div>
                    <span className="font-display font-bold text-2xl text-white">{stat.value}</span>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="https://github.com/your-repo/JAIA-Website"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full py-3 bg-jaia-gold/10 hover:bg-jaia-gold/20 border border-jaia-gold/30 rounded-lg text-jaia-gold text-center font-mono text-sm transition-all flex items-center justify-center gap-2 group"
              >
                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                View Repository
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
            onHoverStart={() => setHoveredCard(2)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              animate={{ 
                borderColor: hoveredCard === 2 ? 'rgba(255, 215, 0, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: hoveredCard === 2 ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
              className="h-full p-6 bg-white/[0.02] border rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-white">Example Usage</h3>
                <span className="text-xs font-mono text-gray-500">src/App.tsx</span>
              </div>
              <CodeBlock />
            </motion.div>
          </motion.div>

          {/* Git Graph */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            onHoverStart={() => setHoveredCard(3)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              animate={{ 
                borderColor: hoveredCard === 3 ? 'rgba(0, 155, 58, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: hoveredCard === 3 ? 'rgba(0, 155, 58, 0.05)' : 'rgba(255, 255, 255, 0.02)'
              }}
              className="h-full p-6 bg-white/[0.02] border rounded-2xl transition-all duration-300 flex flex-col"
            >
              <h3 className="font-display font-bold text-white mb-4">Contribution Graph</h3>
              <div className="flex-1 flex items-center justify-center">
                <GitGraph />
              </div>
              <p className="text-gray-500 text-sm text-center mt-4">
                <span className="text-jaia-green">128</span> commits this month
              </p>
            </motion.div>
          </motion.div>

        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {[
            {
              title: 'MIT Licensed',
              desc: 'Free to use, modify, and distribute',
              icon: '📜',
              color: 'from-green-500/20 to-emerald-500/20'
            },
            {
              title: 'Well Documented',
              desc: 'Comprehensive guides for all skill levels',
              icon: '📚',
              color: 'from-blue-500/20 to-cyan-500/20'
            },
            {
              title: 'Active Community',
              desc: 'Join developers building the future',
              icon: '🤝',
              color: 'from-purple-500/20 to-pink-500/20'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative p-6 bg-jaia-darkGrey/50 border border-white/10 rounded-2xl backdrop-blur-sm hover:border-white/20 transition-all">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-display font-bold text-white text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="https://github.com/your-repo/JAIA-Website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NeonButton variant="secondary" className="gap-2 group">
                <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore the Code
                <ExternalLink className="w-4 h-4" />
              </NeonButton>
            </a>
            <a
              href="https://github.com/your-repo/JAIA-Website/blob/main/docs/getting-started.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <NeonButton variant="ghost">
                <Code2 className="w-5 h-5" />
                Read the Docs
              </NeonButton>
            </a>
          </div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-8 border-t border-white/5"
          >
            <p className="font-mono text-xs text-gray-600 mb-4">POWERED_BY</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'React', 'TypeScript', 'Tailwind CSS', 
                'Framer Motion', 'Vite', 'Supabase',
                'shadcn/ui', 'Lucide Icons'
              ].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + i * 0.05 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: '0 0 20px rgba(0, 155, 58, 0.4)'
                  }}
                  className="px-4 py-2 bg-jaia-darkGrey border border-jaia-green/20 text-jaia-green text-xs font-mono rounded-full hover:border-jaia-green/50 transition-all cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
