import { motion } from 'framer-motion';
import { User, Linkedin, Users } from 'lucide-react';

const team = [
  { 
    name: 'Matthew Stone', 
    role: 'President and Founder',
    linkedin: 'https://www.linkedin.com/in/matthewstone095/',
    image: '/team/matthew-stone.jpg',
    id: '001'
  },
  { 
    name: 'Zo Duncan', 
    role: 'Secretary',
    linkedin: 'https://www.linkedin.com/in/zoe-duncan-67ba26215/',
    image: '/team/zo-duncan.jpg',
    id: '002'
  },
  { 
    name: 'Jordan Madden', 
    role: 'Director of Research',
    linkedin: 'https://www.linkedin.com/in/jordan~madden/',
    image: '/team/jordan-madden.jpg',
    id: '003'
  },
  { 
    name: 'Dimitri Johnson', 
    role: 'Technical Director',
    linkedin: 'https://www.linkedin.com/in/dimitri-johnson-095b62217/',
    image: '/team/dimitri-johnson.jpg',
    id: '004'
  },
  { 
    name: 'Daniel Geddes', 
    role: 'Director of Digital Operations',
    linkedin: 'https://www.linkedin.com/in/daniel-geddes-485536119/',
    image: '/team/daniel-geddes.jpg',
    id: '005'
  },
  { 
    name: 'Siakani Morgan', 
    role: 'Treasurer',
    linkedin: 'https://www.linkedin.com/in/siakani-morgan/',
    image: '/team/siakani-morgan.jpg',
    id: '006'
  },
];

export function Team() {
  return (
    <section id="team" className="py-32 bg-jaia-black relative overflow-hidden scroll-mt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-jaia-gold" />
              <span className="font-mono text-jaia-gold text-xs tracking-widest">CORE_TEAM</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase leading-none">
              MEET THE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jaia-green to-jaia-neonGreen">OPERATORS</span>
            </h2>
          </div>
          <p className="font-mono text-gray-500 text-sm max-w-xs text-right mt-6 md:mt-0">
            // Our dedicated leadership team driving Jamaica's AI revolution.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div 
                className="relative bg-jaia-darkGrey/50 border border-white/10 p-6 hover:border-jaia-green/30 hover:bg-jaia-green/5 transition-all duration-300"
                style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
              >
                {/* ID Badge */}
                <span className="absolute top-4 right-6 font-mono text-xs text-gray-600 group-hover:text-jaia-gold transition-colors">
                  #{member.id}
                </span>
                
                {/* Photo */}
                <div className="relative mx-auto mb-6 w-28 h-28">
                  <div className="w-28 h-28 bg-jaia-darkGrey border-2 border-white/20 group-hover:border-jaia-green/50 overflow-hidden transition-colors clip-corner">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center bg-jaia-green/10">
                      <User className="h-12 w-12 text-jaia-green" />
                    </div>
                  </div>
                  
                  {/* LinkedIn Badge */}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-2 -right-2 p-2 bg-jaia-gold text-jaia-black hover:bg-jaia-neonGold transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                {/* Info */}
                <div className="text-center">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-jaia-green transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-mono text-xs text-jaia-gold/70 mt-1">
                    {member.role}
                  </p>
                </div>
                
                {/* Bottom decoration */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-jaia-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
