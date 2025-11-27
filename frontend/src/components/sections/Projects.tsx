import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, ChevronRight } from 'lucide-react';
import { projects } from '@/data/projects';
import { NeonButton } from '@/components/ui/neon-button';

export function Projects() {
  // Show only first 4 projects on homepage
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="py-32 bg-jaia-black relative overflow-hidden scroll-mt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-jaia-darkGrey/50 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-jaia-gold/30 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-4 h-4 text-jaia-gold" />
              <span className="font-mono text-jaia-gold text-xs tracking-widest">PROJECT_DATABASE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase leading-none">
              LATEST<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-gold to-jaia-neonGold">INNOVATIONS</span>
            </h2>
          </div>
          <p className="font-mono text-gray-500 text-sm max-w-xs text-right mt-6 md:mt-0">
            // New and ongoing projects pushing the boundaries of AI in Jamaica.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/projects/${project.id}`} className="group block h-full">
                <div 
                  className="relative h-full bg-jaia-darkGrey/50 border border-white/10 p-6 hover:border-jaia-gold/30 hover:bg-jaia-gold/5 transition-all duration-300"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
                >
                  {/* Project Number */}
                  <span className="absolute top-4 right-4 font-mono text-xs text-gray-600 group-hover:text-jaia-gold transition-colors">
                    0{idx + 1}
                  </span>
                  
                  {/* Icon */}
                  <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">
                    {project.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-jaia-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-sans mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* View Link */}
                  <div className="flex items-center gap-2 text-jaia-gold font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>VIEW_PROJECT</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  
                  {/* Bottom decoration */}
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-jaia-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/projects">
            <NeonButton variant="secondary">
              VIEW_ALL_PROJECTS
            </NeonButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
