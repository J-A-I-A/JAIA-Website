import { motion } from 'framer-motion';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';
import { EventSection } from '@/components/sections/Events';
import { Footer } from '@/components/sections/Footer';
import { Contact } from '@/components/sections/Contact'; // Need to check if this exists or use inline

export function HomePage() {
  return (
    <div className="bg-charcoal text-white min-h-screen">
      <Hero />

      <main className="relative z-10 w-full overflow-hidden">

        {/* Restore Fluid Intelligence Section */}
        <Services />

        {/* Restore Committee/Team with Pictures */}
        <Team />

        {/* Restore Events */}
        <EventSection />

        {/* Restore Contact Section - I'll use the inline one from before or create a component if it existed */}
        <section id="contact" className="py-60 px-6 max-w-6xl mx-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 text-[18rem] font-black text-white/[0.01] uppercase tracking-tighter pointer-events-none select-none">
            Reach
          </div>
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-7xl md:text-[12rem] font-black uppercase tracking-tighter leading-none mb-8">CONTACT</h2>
            <p className="text-2xl text-white/40 font-medium max-w-2xl mx-auto">Sync your frequency with JAIA. Let's build the future together.</p>
          </div>

          {/* Inline Contact Form from Repo Design */}
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="glass-panel p-12 rounded-[4rem] space-y-12">
              <div className="flex items-start gap-8">
                <div className="w-14 h-14 bg-lime rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-lime/20">
                  <span className="font-bold text-black text-xl">@</span>
                </div>
                <div>
                  <h4 className="mono text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Electronic_Mail</h4>
                  <p className="text-3xl font-black text-white hover:text-lime transition-colors cursor-pointer">connect@jaia.ai</p>
                </div>
              </div>
              <div className="flex items-start gap-8">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <span className="font-bold text-black text-xl">#</span>
                </div>
                <div>
                  <h4 className="mono text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Physical_Hub</h4>
                  <p className="text-3xl font-black text-white/80 leading-tight">40 Hope Road, <br />Kingston 10, JA</p>
                </div>
              </div>
            </div>

            <form className="glass-panel p-12 rounded-[4rem] flex flex-col gap-6">
              <div className="space-y-6">
                <input type="text" placeholder="IDENTITY_NAME" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:outline-none focus:border-lime text-white mono text-xs font-bold tracking-widest uppercase placeholder:text-white/10" />
                <input type="email" placeholder="EMAIL_ADDRESS" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:outline-none focus:border-lime text-white mono text-xs font-bold tracking-widest uppercase placeholder:text-white/10" />
                <textarea placeholder="MESSAGE_CONTEXT" className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl focus:outline-none focus:border-lime text-white mono text-xs font-bold tracking-widest uppercase h-32 resize-none placeholder:text-white/10" />
              </div>
              <button
                className="w-full border-2 border-lime/30 text-lime py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-sm transition-all shadow-xl hover:bg-lime hover:text-black"
              >
                SEND SIGNAL
              </button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
