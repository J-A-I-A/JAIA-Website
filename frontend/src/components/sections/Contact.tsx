import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Youtube } from 'lucide-react';
import { NeonButton } from '@/components/ui/neon-button';

const socialLinks = [
  {
    name: 'Discord',
    href: 'https://discord.gg/NuVXk7yjNz',
    icon: MessageCircle,
    color: 'hover:border-indigo-500 hover:text-indigo-400'
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/channel/UCImUF-AEYy3egB1otVuSJbQ?sub_confirmation=1',
    icon: Youtube,
    color: 'hover:border-red-500 hover:text-red-400'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/jaia_876',
    label: 'X',
    color: 'hover:border-sky-500 hover:text-sky-400'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/groups/458315652207268',
    label: 'FB',
    color: 'hover:border-blue-500 hover:text-blue-400'
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-jaia-black relative overflow-hidden scroll-mt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-jaia-green/5 via-transparent to-jaia-gold/5 opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-jaia-green rounded-full animate-pulse"></span>
            <span className="font-mono text-jaia-green text-xs tracking-widest">COMMUNICATION_PROTOCOL</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
            ESTABLISH_<span className="text-jaia-gold">CONNECTION</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-sans">
            Ready to connect with Jamaica's AI community? Reach out through any of our channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <span className="text-jaia-gold">//</span> CONTACT_DATA
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-jaia-green/10 border border-jaia-green/30 text-jaia-green group-hover:bg-jaia-green group-hover:text-black transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-gray-500 mb-1">LOCATION</p>
                    <p className="text-white font-sans">Kingston, Jamaica</p>
                    <p className="text-gray-500 font-mono text-xs mt-1">LAT: 18.0179° N | LON: 76.8099° W</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-jaia-green/10 border border-jaia-green/30 text-jaia-green group-hover:bg-jaia-green group-hover:text-black transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-gray-500 mb-1">PHONE</p>
                    <p className="text-white font-sans">(876)-575-8425</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="p-3 bg-jaia-green/10 border border-jaia-green/30 text-jaia-green group-hover:bg-jaia-green group-hover:text-black transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-gray-500 mb-1">EMAIL</p>
                    <a href="mailto:admin@jaia.org.jm" className="text-white font-sans hover:text-jaia-gold transition-colors">
                      admin@jaia.org.jm
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Join Community */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="border border-white/10 p-8 bg-white/5 backdrop-blur-sm">
              <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                <span className="text-jaia-gold">//</span> JOIN_NETWORK
              </h3>

              <p className="text-gray-400 font-sans mb-8">
                Connect with us on your favorite platform and be part of Jamaica's AI revolution!
              </p>

              {/* Social Links */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`aspect-square border border-white/10 flex flex-col items-center justify-center text-gray-400 transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    {'icon' in social && social.icon ? (
                      <social.icon size={20} />
                    ) : (
                      <span className="text-sm font-mono font-bold">{social.label}</span>
                    )}
                    <span className="text-[10px] font-mono mt-1 opacity-50">{social.name}</span>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="border-t border-white/10 pt-8">
                <p className="font-mono text-xs text-jaia-gold mb-4">&gt; PRIMARY_CHANNEL</p>
                <NeonButton 
                  variant="primary"
                  href="https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm"
                  className="w-full justify-center"
                >
                  JOIN_WHATSAPP
                  <img src="/whatsapp-logo.svg" alt="WhatsApp" className="h-5 w-5 ml-2" />
                </NeonButton>
              </div>
            </div>
          </motion.div>

        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center border-t border-jaia-green/20 pt-16"
        >
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            READY TO <span className="text-jaia-green">INNOVATE</span>?
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 font-sans">
            Whether you're a student, professional, or organization, there's a place for you in Jamaica's AI community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NeonButton 
              variant="primary"
              href="https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm"
            >
              INITIALIZE_JOIN()
            </NeonButton>
            <NeonButton 
              variant="secondary"
              onClick={() => window.location.href = 'mailto:admin@jaia.org.jm'}
            >
              SEND_MESSAGE
            </NeonButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
