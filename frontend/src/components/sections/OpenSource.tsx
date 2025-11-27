import { motion } from 'framer-motion';
import { Github, Code2, Users, Lightbulb, BookOpen, ExternalLink } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';

const features = [
  {
    id: "01",
    icon: <Code2 className="w-6 h-6" />,
    title: 'EXPLORE_CODE',
    description: 'Browse our modern React + TypeScript codebase. Built with Vite, Tailwind CSS, and more.',
  },
  {
    id: "02",
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'SHARE_IDEAS',
    description: 'Have suggestions for features or improvements? Open an issue or start a discussion.',
  },
  {
    id: "03",
    icon: <Users className="w-6 h-6" />,
    title: 'CONTRIBUTE',
    description: 'Whether fixing bugs, improving docs, or adding features - all contributions welcome!',
  },
  {
    id: "04",
    icon: <BookOpen className="w-6 h-6" />,
    title: 'LEARN_GROW',
    description: 'Use our codebase as a learning resource. We have guides for beginners.',
  },
];

export function OpenSource() {
  return (
    <section id="opensource" className="py-32 bg-jaia-darkGrey relative overflow-hidden scroll-mt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hex-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 border border-jaia-green/30 bg-jaia-green/5 px-6 py-2 mb-6 clip-square">
            <Github className="w-4 h-4 text-jaia-green" />
            <span className="font-mono text-jaia-green text-xs tracking-widest">OPEN_SOURCE</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            BUILT IN THE <span className="text-jaia-green">OPEN</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-sans">
            This website is fully open source! We believe in transparency and community-driven development. 
            Review our code, suggest improvements, and help us build something amazing for Jamaica's AI community.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="h-full bg-white/5 border border-white/10 p-6 hover:bg-jaia-green/5 hover:border-jaia-green/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-jaia-green/10 border border-jaia-green/30 text-jaia-green group-hover:bg-jaia-green group-hover:text-black transition-colors">
                    {feature.icon}
                  </div>
                  <span className="font-mono text-xs text-gray-600">{feature.id}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-jaia-green transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm font-sans">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="border border-jaia-green/30 bg-jaia-green/5 p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 bg-jaia-gold rounded-full animate-pulse"></span>
              <span className="font-mono text-jaia-gold text-xs tracking-widest">READY_TO_CONTRIBUTE?</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
              Check Out Our Repository
            </h3>
            <p className="text-gray-400 mb-8 font-sans">
              Explore the code, report issues, or contribute to the project. Every contribution helps!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NeonButton 
                variant="primary"
                href="https://github.com/J-A-I-A/JAIA-Website"
              >
                <Github className="w-4 h-4 mr-2" />
                VIEW_GITHUB
              </NeonButton>
              <NeonButton 
                variant="secondary"
                href="https://github.com/J-A-I-A/JAIA-Website/issues"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                SHARE_IDEAS
              </NeonButton>
            </div>
          </div>
        </motion.div>

        {/* Beginner Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500 font-mono">
            <span className="text-jaia-gold">NEW_TO_CODING?</span>{' '}
            Check out our{' '}
            <a 
              href="https://github.com/J-A-I-A/JAIA-Website/blob/main/docs/getting-started.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-jaia-green hover:text-jaia-neonGreen transition-colors inline-flex items-center gap-1"
            >
              Getting Started Guide
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
