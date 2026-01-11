import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

        {/* Testimonials Section */}
        <div className="">
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
