import { motion } from 'framer-motion';
import { User, Linkedin, Users } from 'lucide-react';

const team = [
  {
    name: 'Matthew Stone',
    role: 'President and Founder',
    linkedin: 'https://www.linkedin.com/in/matthewstone095/',
    image: '/team/matthew-stone.jpg',
    code: '0x01'
  },
  {
    name: 'Zo Duncan',
    role: 'Secretary',
    linkedin: 'https://www.linkedin.com/in/zoe-duncan-67ba26215/',
    image: '/team/zo-duncan.jpg',
    code: '0x02'
  },
  {
    name: 'Jordan Madden',
    role: 'Director of Research',
    linkedin: 'https://www.linkedin.com/in/jordan~madden/',
    image: '/team/jordan-madden.jpg',
    code: '0x03'
  },
  {
    name: 'Dimitri Johnson',
    role: 'Technical Director',
    linkedin: 'https://www.linkedin.com/in/dimitri-johnson-095b62217/',
    image: '/team/dimitri-johnson.jpg',
    code: '0x04'
  },
  {
    name: 'Daniel Geddes',
    role: 'Director of Digital Operations',
    linkedin: 'https://www.linkedin.com/in/daniel-geddes-485536119/',
    image: '/team/daniel-geddes.jpg',
    code: '0x05'
  },
  {
    name: 'Siakani Morgan',
    role: 'Treasurer',
    linkedin: 'https://www.linkedin.com/in/siakani-morgan/',
    image: '/team/siakani-morgan.jpg',
    code: '0x06'
  },
];

export function Team() {
  return (
    <section id="team" className="py-40 px-6 max-w-7xl mx-auto relative overflow-hidden">

      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-lime" />
            <span className="mono text-[10px] font-black uppercase tracking-[0.5em] text-lime">Core_Operators</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            THE<br />UNIT
          </h2>
        </div>
        <p className="text-xl text-white/40 max-w-md font-medium text-right mono">
          [ ACTIVE_NODES: {team.length} ]<br />
          Dedicated leadership driving the Caribbean AI revolution.
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, idx) => (
          <motion.div
            key={member.code}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className="group glass-panel p-8 rounded-[3rem] border-white/5 hover:border-lime/30 transition-all relative overflow-hidden"
          >
            {/* ID Badge */}
            <div className="absolute top-8 right-8 mono text-[10px] font-bold text-white/20 group-hover:text-lime transition-colors">
              {member.code}
            </div>

            {/* Photo */}
            <div className="relative mx-auto mb-8 w-40 h-40">
              <div className="w-full h-full rounded-full bg-black border border-white/10 group-hover:border-lime/50 overflow-hidden transition-all p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white/5 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full hidden items-center justify-center bg-lime/10 absolute inset-0">
                    <User className="h-12 w-12 text-lime" />
                  </div>
                </div>
              </div>

              {/* LinkedIn Badge */}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-black border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-lime hover:border-lime hover:text-black transition-all"
                  aria-label={`${member.name} LinkedIn`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Info */}
            <div className="text-center">
              <h3 className="font-black text-2xl text-white uppercase tracking-tighter mb-2 group-hover:text-lime transition-colors">
                {member.name}
              </h3>
              <p className="mono text-[10px] text-white/40 uppercase tracking-widest font-bold">
                {member.role}
              </p>
            </div>

            {/* Hover Glitch Effect */}
            <div className="absolute inset-0 bg-lime/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity mix-blend-overlay" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
