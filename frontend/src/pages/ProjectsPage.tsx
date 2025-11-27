import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Folder, ChevronRight } from 'lucide-react';
import { Footer } from '@/components/sections/Footer';
import { projects } from '@/data/projects';
import { NeonButton } from '@/components/ui/neon-button';

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-jaia-black">
      {/* Hero Section */}
      <div className="pt-32 pb-12 relative overflow-hidden border-b border-jaia-gold/20">
        <div className="absolute inset-0 bg-gradient-to-b from-jaia-gold/5 to-transparent"></div>
        <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-4 h-4 text-jaia-gold" />
              <span className="font-mono text-jaia-gold text-xs tracking-widest">PROJECT_DATABASE</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-gold to-jaia-neonGold">PROJECTS</span>
            </h1>
            <p className="text-xl text-gray-400 font-sans">
              Discover our innovative AI projects designed to solve real-world problems 
              and empower Jamaican communities through technology.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/projects/${project.id}`} className="group block h-full">
                <div 
                  className="relative h-full bg-jaia-darkGrey/50 border border-white/10 p-8 hover:border-jaia-gold/30 hover:bg-jaia-gold/5 transition-all duration-300"
                  style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-6xl grayscale group-hover:grayscale-0 transition-all">
                      {project.icon}
                    </span>
                    <div className="flex items-center text-sm font-mono text-jaia-gold">
                      <Calendar className="h-4 w-4 mr-2" />
                      {project.date}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-jaia-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 font-sans mb-6">
                    {project.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-jaia-gold/10 text-jaia-gold border border-jaia-gold/20 text-xs font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* View Link */}
                  <div className="flex items-center gap-2 text-jaia-gold font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>LEARN_MORE</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-0 right-0">
                    <svg width="20" height="20" className="text-white/10 group-hover:text-jaia-gold/30 transition-colors">
                      <path d="M0 0 L20 0 L20 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0">
                    <svg width="20" height="20" className="text-white/10 group-hover:text-jaia-gold/30 transition-colors">
                      <path d="M0 20 L0 0 L20 0" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="border-t border-jaia-green/20 bg-jaia-green/5">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 bg-jaia-gold rounded-full animate-pulse"></span>
            <span className="font-mono text-jaia-gold text-xs tracking-widest">COLLABORATION_PROTOCOL</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            WANT TO <span className="text-jaia-green">COLLABORATE</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-sans">
            We're always looking for partners, researchers, and contributors 
            to help us build AI solutions for Jamaica.
          </p>
          <Link to="/#contact">
            <NeonButton variant="primary">
              INITIALIZE_CONTACT()
              <ArrowRight className="ml-2 h-4 w-4" />
            </NeonButton>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
