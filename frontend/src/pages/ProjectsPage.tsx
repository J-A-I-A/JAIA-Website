import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Folder } from 'lucide-react';
import { Footer } from '@/components/sections/Footer';
import { projects } from '@/data/projects';

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-charcoal text-white relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      <div className="relative z-10 flex-1 pt-28 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[1px] bg-lime" />
              <span className="mono text-[10px] font-bold uppercase tracking-[0.3em] text-lime">Active_Projects</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              PROJECT<br />DATABASE
            </h1>
            <p className="text-sm md:text-base text-white/40 max-w-2xl leading-relaxed">
              Innovative AI solutions deployed to solve real-world problems and empower Jamaican communities through neural technology.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/projects/${project.id}`} className="block h-full group">
                  <div className="h-full glass-panel p-6 md:p-8 rounded-[1.5rem] border-white/5 hover:border-lime/30 transition-all duration-300 relative overflow-hidden">
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-lime/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Corner Marker */}
                    <div className="absolute top-6 right-6 mono text-[10px] text-white/20 group-hover:text-lime transition-colors">
                      ID: {project.id.toString().padStart(3, '0')}
                    </div>

                    <div className="flex flex-col h-full relative z-10">
                      {/* Icon */}
                      <div className="mb-6 text-4xl group-hover:scale-110 transition-transform duration-300 origin-left grayscale group-hover:grayscale-0">
                        {project.icon}
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 mono text-[10px] text-lime uppercase tracking-widest mb-3">
                        <Calendar className="w-3 h-3" />
                        {project.date}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter mb-3 text-white group-hover:text-lime transition-colors truncate">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 mono text-[10px] uppercase font-bold tracking-wider group-hover:border-lime/30 group-hover:text-lime transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Learn More */}
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between group-hover:border-lime/20 transition-colors">
                        <span className="mono text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-lime transition-colors">View_Schematics</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-lime group-hover:text-black transition-all">
                          <ArrowRight className="w-3 h-3 group-hover:-rotate-45 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="glass-panel p-10 md:p-14 rounded-[2rem] border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-lime/5 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-lime/10 flex items-center justify-center border border-lime/20 mb-6 animate-pulse">
                <Folder className="w-5 h-5 text-lime" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                Ready to <span className="text-lime">Collaborate</span>?
              </h2>

              <p className="text-sm md:text-base text-white/50 max-w-xl mb-8">
                We're always looking for partners, researchers, and contributors to help us build AI solutions for Jamaica.
              </p>

              <Link to="/#contact">
                <button className="relative px-8 py-4 bg-lime text-black font-black rounded-lg text-xs uppercase tracking-widest overflow-hidden group shadow-[0_0_20px_rgba(204,255,0,0.15)] hover:scale-105 transition-transform">
                  <span className="relative z-10 flex items-center gap-3">
                    Initialize_Contact <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
