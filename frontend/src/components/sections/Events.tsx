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
    <section id="meetup" className="py-40 px-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-lime" />
            <span className="mono text-[10px] font-black uppercase tracking-[0.5em] text-lime">Transmission_Log</span>
          </div>
          <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            EVENT<br />PROTOCOL
          </h2>
        </div>
        <button className="glass-card px-10 py-6 rounded-full flex items-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-lime hover:text-black transition-all group border-white/10">
          View Full Calendar
          <ArrowUpRight className="group-hover:rotate-45 transition-transform" />
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
            className="group py-16 border-t border-white/5 flex flex-col md:flex-row items-center gap-12 md:gap-24 cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black text-transparent text-stroke-white group-hover:text-lime group-hover:text-stroke-0 transition-colors">{ev.day}</span>
              <span className="mono text-xs font-bold uppercase tracking-widest text-white/40">{ev.month}</span>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 group-hover:text-lime transition-colors">{ev.title}</h3>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mono text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span className="flex items-center gap-2"><MapPin size={12} /> {ev.loc}</span>
                <span className="flex items-center gap-2"><Calendar size={12} /> {ev.time}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {ev.tags.map(tag => (
                <span key={tag} className="px-6 py-2 border border-white/10 rounded-full mono text-[9px] uppercase tracking-widest text-white/30 group-hover:border-lime/30 group-hover:text-lime transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:rotate-45">
              <ArrowUpRight className="text-lime" />
            </div>
          </motion.div>
        ))}
        <div className="w-full h-px bg-white/5" />
      </div>
    </section>
  );
}
