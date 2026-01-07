import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const EVENTS = [
  {
    day: "12",
    month: "OCT",
    title: "NEURAL_DESIGN_SUMMIT",
    loc: "KINGSTON_HILTON",
    time: "09:00 - 17:00",
    tags: ["workshop", "networking"]
  },
  {
    day: "28",
    month: "NOV",
    title: "AI_ETHICS_FORUM",
    loc: "UWI_REGIONAL_HQ",
    time: "14:00 - 18:30",
    tags: ["panel", "policy"]
  },
  {
    day: "15",
    month: "DEC",
    title: "YEAR_END_PROTOCOL",
    loc: "AC_HOTEL",
    time: "19:00 - LATE",
    tags: ["social", "future"]
  }
];

export function EventSection() {
  return (
    <section id="meetup" className="py-24 md:py-40 px-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-32 gap-4 md:gap-12">
        <div>
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <div className="w-8 md:w-12 h-[1px] bg-lime" />
            <span className="mono text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-lime">Transmission_Log</span>
          </div>
          <h2 className="text-4xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
            EVENT<br />PROTOCOL
          </h2>
        </div>
        <button className="glass-card px-4 py-2 md:px-10 md:py-6 rounded-full flex items-center gap-2 md:gap-4 text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-lime hover:text-black transition-all group border-white/10">
          View Full Calendar
          <ArrowUpRight className="group-hover:rotate-45 transition-transform" size={16} />
        </button>
      </div>

      <div className="flex flex-col">
        {EVENTS.map((ev, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 20, backgroundColor: 'rgba(255,255,255,0.02)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="group py-8 md:py-16 border-t border-white/5 flex flex-col md:flex-row items-center gap-6 md:gap-24 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-6xl font-black text-transparent text-stroke-white group-hover:text-lime group-hover:text-stroke-0 transition-colors">{ev.day}</span>
              <span className="mono text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">{ev.month}</span>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h3 className="text-xl md:text-6xl font-black uppercase tracking-tighter mb-2 md:mb-4 group-hover:text-lime transition-colors">{ev.title}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 mono text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span className="flex items-center gap-2"><MapPin size={12} /> {ev.loc}</span>
                <span className="flex items-center gap-2"><Calendar size={12} /> {ev.time}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start">
              {ev.tags.map(tag => (
                <span key={tag} className="px-4 md:px-6 py-1.5 md:py-2 border border-white/10 rounded-full mono text-[9px] uppercase tracking-widest text-white/30 group-hover:border-lime/30 group-hover:text-lime transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="hidden md:flex w-16 h-16 rounded-full border border-white/10 items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:rotate-45">
              <ArrowUpRight className="text-lime" />
            </div>
          </motion.div>
        ))}
        <div className="w-full h-px bg-white/5" />
      </div>
    </section>
  );
}
