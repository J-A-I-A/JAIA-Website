import { motion } from 'framer-motion';
import { Target, Cpu, Share2, Globe, Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    id: "01",
    icon: <Target className="w-8 h-8" />,
    title: "CORE_MISSION",
    desc: "Democratizing AI access across Jamaica. Ensuring equitable distribution of knowledge resources.",
    stat: "100%"
  },
  {
    id: "02",
    icon: <Cpu className="w-8 h-8" />,
    title: "INNOVATION_HUB",
    desc: "Accelerating local solutions via LLMs and Computer Vision. From agriculture to finance.",
    stat: "24/7"
  },
  {
    id: "03",
    icon: <Share2 className="w-8 h-8" />,
    title: "NEURAL_NETWORK",
    desc: "A decentralized collective of developers, researchers, and students sharing data.",
    stat: "500+"
  },
  {
    id: "04",
    icon: <Globe className="w-8 h-8" />,
    title: "GLOBAL_NODE",
    desc: "Positioning Jamaica as a critical node in the international artificial intelligence lattice.",
    stat: "INTL"
  }
];

const testimonials = [
  {
    text: 'JAIA provided me with the opportunity to showcase my skills and knowledge at a workshop, which gave me valuable exposure. They also gave me the chance to work on exciting AI projects, helping me grow both professionally and personally.',
    author: 'Kevonteh Brown',
    role: 'Member',
    initials: 'KB',
  },
  {
    text: 'The Law Bot gave me a deeper understanding of Jamaican laws and provided quick, easy access to legal information, saving me valuable time.',
    author: 'Mickayla',
    role: 'Law Student',
    initials: 'M',
  },
];

export function About() {
  return (
    <section id="about" className="py-32 bg-jaia-black relative overflow-hidden scroll-mt-16">
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 bg-hex-pattern opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-jaia-green/30 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-jaia-gold rounded-full animate-pulse"></span>
              <span className="font-mono text-jaia-gold text-xs tracking-widest">SYSTEM_ARCHITECTURE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase leading-none">
              DECODING<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-green to-jaia-neonGreen">THE_MATRIX</span>
            </h2>
          </div>
          <p className="font-mono text-gray-500 text-sm max-w-xs text-right mt-6 md:mt-0">
            // Accessing classified records regarding the organizational structure and objectives of JAIA.
          </p>
        </div>

        {/* Holographic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-full"
            >
              {/* Card Container */}
              <div 
                className="relative h-full bg-jaia-darkGrey/50 backdrop-blur-sm border border-white/5 p-8 transition-all duration-500 group-hover:bg-jaia-green/5 group-hover:border-jaia-green/30"
                style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
              >
                {/* Header with Icon and ID */}
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-white/5 rounded-none border border-white/10 text-jaia-green group-hover:bg-jaia-green group-hover:text-black transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="font-display font-bold text-4xl text-white/10 group-hover:text-jaia-gold/20 transition-colors">
                    {item.id}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-jaia-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 font-sans leading-relaxed text-sm mb-16">
                  {item.desc}
                </p>

                {/* Footer Stat */}
                <div className="absolute bottom-0 left-0 w-full p-4 flex justify-between items-center border-t border-white/5 group-hover:border-jaia-green/20">
                   <span className="font-mono text-[10px] text-gray-500">METRIC_VAL</span>
                   <span className="font-mono text-jaia-gold text-xs">{item.stat}</span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="border-t border-jaia-green/20 pt-24">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-jaia-gold rounded-full animate-pulse"></span>
            <span className="font-mono text-jaia-gold text-xs tracking-widest">USER_FEEDBACK</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-12">
            COMMUNITY_<span className="text-jaia-green">VOICES</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-jaia-darkGrey/50 border-white/10 hover:border-jaia-green/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-jaia-gold to-jaia-green text-jaia-black flex items-center justify-center font-bold text-lg clip-square">
                        {testimonial.initials}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white font-display">{testimonial.author}</CardTitle>
                        <CardDescription className="text-jaia-gold font-mono text-xs">{testimonial.role}</CardDescription>
                      </div>
                      <Quote className="h-6 w-6 text-jaia-green/30" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 italic font-sans leading-relaxed">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
