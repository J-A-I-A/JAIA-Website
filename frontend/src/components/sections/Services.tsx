import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Code, Zap } from 'lucide-react';

const services = [
  {
    id: "01",
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'AI_TRAINING',
    subtitle: 'Education & Workshops',
    description: 'Comprehensive training programs to help you understand and master AI technologies. From beginner to advanced levels.',
    stat: 'EDU'
  },
  {
    id: "02",
    icon: <Briefcase className="w-8 h-8" />,
    title: 'CONSULTATION',
    subtitle: 'Project Management',
    description: 'Expert guidance for your AI projects from conception to deployment. Strategy and implementation support.',
    stat: 'PRO'
  },
  {
    id: "03",
    icon: <Code className="w-8 h-8" />,
    title: 'DEVELOPMENT',
    subtitle: 'AI Strategy & Solutions',
    description: 'Strategic development solutions tailored to your organization\'s needs. Custom AI implementations.',
    stat: 'DEV'
  },
];

export function Services() {
  return (
    <section id="services" className="py-32 bg-jaia-black relative overflow-hidden scroll-mt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-jaia-gold/30 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-jaia-gold" />
              <span className="font-mono text-jaia-gold text-xs tracking-widest">SERVICE_MODULES</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase leading-none">
              OUR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-gold to-jaia-neonGold">CAPABILITIES</span>
            </h2>
          </div>
          <p className="font-mono text-gray-500 text-sm max-w-xs text-right mt-6 md:mt-0">
            // Empowering Jamaica through AI education, consultation, and development.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="group relative"
            >
              {/* Card Container */}
              <div 
                className="relative h-full bg-jaia-darkGrey/50 backdrop-blur-sm border border-white/5 p-8 transition-all duration-500 group-hover:bg-jaia-gold/5 group-hover:border-jaia-gold/30"
                style={{ clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))" }}
              >
                {/* Header with Icon and ID */}
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-white/5 rounded-none border border-white/10 text-jaia-gold group-hover:bg-jaia-gold group-hover:text-black transition-colors duration-300">
                    {service.icon}
                  </div>
                  <span className="font-display font-bold text-5xl text-white/5 group-hover:text-jaia-gold/20 transition-colors">
                    {service.id}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-jaia-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-jaia-gold/70 font-mono text-xs mb-4">
                  {service.subtitle}
                </p>
                <p className="text-gray-400 font-sans leading-relaxed text-sm mb-8">
                  {service.description}
                </p>

                {/* Footer Stat */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center border-t border-white/5 group-hover:border-jaia-gold/20">
                   <span className="font-mono text-[10px] text-gray-500 ml-[25px]">TYPE</span>
                   <span className="font-mono text-jaia-gold text-xs">{service.stat}</span>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-0 right-0">
                  <svg width="30" height="30" className="text-white/10 group-hover:text-jaia-gold/30 transition-colors">
                    <path d="M0 0 L30 0 L30 30" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0">
                  <svg width="30" height="30" className="text-white/10 group-hover:text-jaia-gold/30 transition-colors">
                    <path d="M0 30 L0 0 L30 0" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
