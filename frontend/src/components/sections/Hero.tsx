import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Database, Zap, Cpu as Chip } from 'lucide-react';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Simulated live data stream for the left sidebar
  const [logs, setLogs] = useState<string[]>(["INIT_SEQ", "LOAD_VECTOR_MAP", "SYNC_NODE_KGN"]);

  useEffect(() => {
    const logPool = [
      "ATTN_HEAD_04: 0.98", "VECT_DIST: 0.12", "TOK_STRM: 450/s",
      "INF_LTCY: 1.2ms", "QUERY_RT_MAP", "NODE_ACTIVE", "WEIGHT_SYNC"
    ];
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-8), logPool[Math.floor(Math.random() * logPool.length)]]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center pt-20 md:pt-32 pb-40 px-6 overflow-hidden">

      {/* LEFT SIDEBAR: NEURAL ENGINE LOGS */}
      <div className="absolute left-0 top-0 bottom-0 w-32 border-r border-white/5 hidden xl:flex flex-col items-center py-24 z-20 bg-black/40 backdrop-blur-xl">
        <div className="mb-10 flex flex-col items-center gap-2">
          <div className="w-1 h-1 bg-lime rounded-full animate-pulse shadow-[0_0_8px_#ccff00]" />
          <span className="mono text-[8px] text-lime font-black tracking-widest uppercase">Live_Feed</span>
        </div>

        {/* LOG STREAM */}
        <div className="flex flex-col gap-4 w-full px-4 overflow-hidden">
          {logs.map((log, i) => (
            <motion.div
              key={i + log}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1 - (logs.length - i) * 0.1, x: 0 }}
              className="mono text-[8px] text-white/30 whitespace-nowrap overflow-hidden text-ellipsis border-l border-white/10 pl-2"
            >
              {`> ${log}`}
            </motion.div>
          ))}
        </div>

        <div className="my-auto flex flex-col gap-12 items-center">
          {[
            { label: "LTCY", val: "1.2ms" },
            { label: "SYNC", val: "99%" },
            { label: "FREQ", val: "5.4G" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="mono text-[7px] text-white/20 font-bold tracking-widest vertical-text transform rotate-180 uppercase">{item.label}</span>
              <span className="mono text-[10px] text-lime font-black">{item.val}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-8 items-center pb-10">
          <Terminal size={14} className="text-white/20" />
          <div className="flex flex-col gap-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scaleX: [0.5, 1, 0.5] }}
                transition={{ duration: 1 + i, repeat: Infinity }}
                className="w-4 h-[2px] bg-lime/40"
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: SYSTEM HEALTH & VECTOR MAP */}
      <div className="absolute right-0 top-0 bottom-0 w-32 border-l border-white/5 hidden xl:flex flex-col items-center py-24 z-20 bg-black/40 backdrop-blur-xl">
        <div className="mb-10 flex flex-col items-center gap-2">
          <span className="mono text-[8px] text-white/30 font-black tracking-widest uppercase">System_Load</span>
          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ["20%", "80%", "40%"] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full bg-lime"
            />
          </div>
        </div>

        <div className="flex flex-col gap-10 items-center justify-center flex-grow">
          {/* Circular HUD Reticle */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-white/5 rounded-full border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border border-lime/20 rounded-full border-t-transparent"
            />
            <Chip size={14} className="text-lime/40" />
          </div>

          <div className="flex flex-col gap-6">
            {[
              { label: "NPU_CORE", p: "84%" },
              { label: "VEC_DIM", p: "768" },
              { label: "CTX_WIN", p: "128k" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group">
                <span className="mono text-[7px] text-white/10 font-bold tracking-widest uppercase group-hover:text-white/30 transition-colors">{stat.label}</span>
                <span className="mono text-[11px] text-white/60 font-black">{stat.p}</span>
                <div className="w-8 h-[1px] bg-white/5" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 pb-10">
          <Database size={14} className="text-white/20" />
          <div className="mono text-[8px] text-white/5 uppercase tracking-[0.5em] vertical-text transform rotate-90 h-32 whitespace-nowrap">
            NODE_STABILITY_CONNECTED_V4.02
          </div>
        </div>
      </div>

      {/* Decorative Blur Objects */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] right-[10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-lime/10 md:bg-lime/[0.03] rounded-full blur-[80px] md:blur-[120px] pointer-events-none"
      />

      {/* MOBILE ONLY: Tech Background Overlay */}
      <div className="absolute inset-0 z-0 xl:hidden pointer-events-none overflow-hidden">
        {/* Scanning Line Animation */}
        <motion.div
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-lime/50 to-transparent shadow-[0_0_15px_#ccff00] opacity-50"
        />

        {/* Faint Grid Lines */}
        <div className="absolute top-0 left-4 bottom-0 w-[1px] bg-white/[0.1]" />
        <div className="absolute top-0 right-4 bottom-0 w-[1px] bg-white/[0.1]" />

        {/* Bottom Tech Indicators */}
        <div className="absolute bottom-32 right-6 opacity-60 flex flex-col items-end gap-1">
          <div className="w-16 h-[1px] bg-lime/50" />
          <span className="mono text-[10px] text-white/50">SYS_READY</span>
        </div>
      </div>

      {/* HUD Layout Frame */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/[0.03] m-4 md:m-16 rounded-[2rem] md:rounded-[4rem]" />

      <motion.div
        style={{ y: y1, opacity }}
        className="max-w-[1400px] mx-auto w-full relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center gap-6"
          >
            <div className="h-px w-12 bg-lime/20" />
            <div className="mono text-[10px] text-lime/60 font-bold tracking-[0.3em] uppercase flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-lime"></span>
              </span>
              System_Online
            </div>
            <div className="h-px w-12 bg-lime/20" />
          </motion.div>

          <div className="relative mb-20">
            <h1 className="text-huge font-black uppercase tracking-tighter leading-[0.75]">
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="block mb-4"
              >
                JAIA
              </motion.span>
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                TECH
              </motion.span>
            </h1>

            {/* Ghost Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/[0.01] uppercase select-none -z-10 tracking-[0.2em]">
              KGN
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-5xl"
          >
            <div className="flex items-center gap-8 group">
              <div className="w-px h-24 bg-gradient-to-b from-transparent via-lime/20 to-transparent hidden md:block" />
              <p className="text-base md:text-3xl text-white/40 leading-[1.1] font-medium max-w-md text-center md:text-left italic group-hover:text-white/60 transition-colors px-6 md:px-0">
                "Empowering Jamaica through Artificial Intelligence."
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="relative px-8 py-4 md:px-16 md:py-8 bg-lime text-black font-black rounded-full text-sm md:text-2xl uppercase tracking-tighter overflow-hidden group shadow-[0_0_40px_rgba(204,255,0,0.15)]"
              >
                <span className="relative z-10">Join the Community</span>
                <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </motion.button>
              <span className="mono text-[10px] text-white/20 uppercase tracking-[0.5em] flex items-center gap-4">
                <Zap size={12} className="text-lime" />
                Kingston // 18.01° N, 76.80° W
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* BOTTOM CENTER: SCROLL INDICATOR */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20"
      >
        <span className="mono text-[8px] uppercase tracking-[0.5em]">Scroll to Decode</span>
        <div className="w-px h-10 bg-white" />
      </motion.div>
    </section>
  );
}
