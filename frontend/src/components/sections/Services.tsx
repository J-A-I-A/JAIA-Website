import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrainCircuit, Compass, Cpu } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';
import { ProjectInquiryModal } from '../ProjectInquiryModal';

const services = [
  {
    id: "01",
    icon: <BrainCircuit className="w-8 h-8" />,
    title: 'AI Training',
    tag: 'Education',
    description: 'Master the future with comprehensive neural network training and AI literacy workshops designed for your team.',
    align: 'left'
  },
  {
    id: "02",
    icon: <Compass className="w-8 h-8" />,
    title: 'Consultation',
    tag: 'Strategy',
    description: 'Navigate the complex AI landscape with expert guidance. We optimize your business vectors for maximum efficiency.',
    align: 'right'
  },
  {
    id: "03",
    icon: <Cpu className="w-8 h-8" />,
    title: 'Development',
    tag: 'Engineering',
    description: 'Custom architectures built from the ground up. We craft resilient, scalable AI solutions tailored to your specific node.',
    align: 'left'
  },
];

export function Services() {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for the curls
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <section ref={containerRef} id="services" className="py-40 relative overflow-hidden bg-charcoal">

      {/* Background: Organic Curly SVGs (Restored) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Swirling Curve Top-Right */}
        <motion.div style={{ y: y1 }} className="absolute -top-[10%] -right-[10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] opacity-10 text-lime blur-[60px]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ccff00" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,89,-2.9C87.9,12.3,83,27,74.2,39.8C65.4,52.6,52.7,63.4,39,70.8C25.3,78.2,10.6,82.2,-2.7,86.8C-16,91.5,-27.9,96.8,-40,92.5C-52.1,88.2,-64.4,74.3,-72.7,60.1C-81,45.8,-85.3,31.2,-86.3,16.3C-87.3,1.4,-85,-13.8,-77.8,-27.3C-70.6,-40.8,-58.5,-52.6,-45.5,-60.4C-32.5,-68.2,-18.6,-72,-4.2,-64.7C10.2,-57.5,30.5,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </motion.div>

        {/* Secondary Swirl Bottom-Left */}
        <motion.div style={{ y: y2 }} className="absolute top-1/2 -left-20 w-[600px] h-[600px] opacity-5 text-lime blur-[40px]">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ccff00" d="M39.9,-65.7C54.1,-60.5,69.6,-53.6,78.8,-41.8C88,-29.9,90.9,-13.1,88.6,2.6C86.3,18.3,78.8,32.8,68.4,44.7C58,56.6,44.7,65.8,30.7,71.3C16.8,76.8,2.2,78.6,-11.1,76.4C-24.4,74.2,-36.4,68.1,-48.1,59.9C-59.8,51.7,-71.2,41.4,-77.8,28.2C-84.4,15,-86.2,-1.1,-82.4,-16C-78.6,-30.9,-69.1,-44.6,-57,-52.4C-44.9,-60.2,-30.2,-62.1,-16.5,-64.9C-2.8,-67.6,25.7,-70.9,39.9,-65.7Z" transform="translate(100 100)" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-lime" />
            <span className="mono text-[10px] font-black uppercase tracking-[0.5em] text-lime">Core_Capabilities</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-6">
              FLUID<br />
              <span className="text-transparent text-stroke-white text-4xl md:text-9xl">INTELLIGENCE</span>
            </h2>

            {/* Decorative Curly Underline (Restored) */}
            <div className="w-64 h-12 opacity-80">
              <svg width="250" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20C40 20 50 35 80 35C110 35 120 5 150 5C180 5 190 20 220 20" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Services Grid/Timeline */}
        <div className="relative">
          {/* Central Connecting Neuron Path (SVG) - Curved Line Restored */}
          <div className="absolute left-0 top-0 w-full h-full block pointer-events-none opacity-50 md:opacity-100 mix-blend-screen">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Desktop Wide Curve */}
              <path
                d="M50 0 C 50 20, 30 30, 30 50 C 30 70, 70 80, 70 100"
                vectorEffect="non-scaling-stroke"
                stroke="url(#path-gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="opacity-50 hidden md:block"
              />
              {/* Mobile Narrow Wave */}
              <path
                d="M50 0 C 50 20, 35 40, 50 60 C 65 80, 50 80, 50 100"
                vectorEffect="non-scaling-stroke"
                stroke="url(#path-gradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="4 4"
                className="opacity-40 md:hidden"
              />
              <defs>
                <linearGradient id="path-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ccff00" stopOpacity="0" />
                  <stop offset="20%" stopColor="#ccff00" />
                  <stop offset="50%" stopColor="#ccff00" />
                  <stop offset="80%" stopColor="#ccff00" />
                  <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-12">
            {services.map((service, index) => (
              <div key={service.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>

                {/* Center Node Marker (Desktop) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                  <div className="w-4 h-4 bg-black border border-lime rounded-full shadow-[0_0_10px_#ccff00]" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-1/2">
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-panel p-10 rounded-[2.5rem] border-white/5 hover:border-lime/30 group transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      {service.icon}
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="px-4 py-1 rounded-full border border-lime/20 text-lime mono text-[9px] font-bold uppercase tracking-widest">
                        {service.tag}
                      </span>
                      <div className="h-px bg-white/10 flex-1" />
                      <span className="mono text-xs font-bold text-white/20">{service.id}</span>
                    </div>

                    <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 group-hover:text-lime transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-white/50 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </motion.div>
                </div>

                {/* Spacer for alignment */}
                <div className="w-full md:w-1/2 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center border-t border-jaia-gold/20 pt-16"
        >
          <div className="max-w-2xl mx-auto mb-8">
            <p className="font-mono text-jaia-gold text-xs tracking-widest mb-4">
              &gt; READY_TO_CONNECT
            </p>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Whether you're looking to implement AI solutions, need strategic consultation,
              or want to upskill your team, we're here to help. Let's discuss how we can work together.
            </p>
          </div>

          <NeonButton
            variant="primary"
            onClick={() => setIsInquiryModalOpen(true)}
          >
            Get_In_Touch()
          </NeonButton>
        </motion.div>
      </div>

      {/* Project Inquiry Modal */}
      <ProjectInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </section>
  );
}
