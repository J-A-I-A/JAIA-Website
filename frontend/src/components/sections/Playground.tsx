import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Music, ShieldAlert, Waves, Mic } from 'lucide-react';

export function Playground() {
    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        // Mock API call for simulation
        setTimeout(() => {
            setResult("The neural stream detects a high frequency of creative potential. Suggesting a fusion of organic rhythms with digital synthesis. Proceed with the protocol.");
            setLoading(false);
        }, 2000);
    };

    return (
        <section id="playground" className="py-24 px-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-2 h-2 bg-lime rounded-full animate-pulse" />
                        <span className="mono text-[10px] font-black uppercase tracking-[0.5em] text-lime">Neural_Link v1.2</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">VIBE<br />CONSULT</h2>
                    <p className="text-xl text-white/40 font-medium">Inject your creative query into the JAIA neural stream for instant island-grade intelligence.</p>
                </div>

                <div className="hidden md:flex gap-2 h-24 items-end">
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [10, 60, 10] }}
                            transition={{ duration: 0.8 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 bg-lime/10 rounded-full"
                        />
                    ))}
                </div>
            </div>

            <div className="glass-panel rounded-[4rem] p-4 md:p-6 border-lime/10 shadow-[0_0_100px_rgba(204,255,0,0.02)] relative z-10">
                <div className="bg-[#080808] rounded-[3.5rem] p-8 md:p-16 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Waves size={300} className="text-lime" />
                    </div>

                    <form onSubmit={handleAsk} className="relative z-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex justify-between items-center px-4">
                                <label className="mono text-[10px] font-black uppercase tracking-[0.4em] text-white/30">System_Input_</label>
                                <div className="mono text-[10px] text-lime/40">KGN_LOC_SECURE_NODE_04</div>
                            </div>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Initialize creative context..."
                                className="w-full h-48 bg-transparent border-2 border-white/5 rounded-[2.5rem] p-10 text-white placeholder:text-white/10 focus:outline-none focus:border-lime/30 transition-all resize-none text-2xl font-black tracking-tight"
                            />

                            <motion.button
                                disabled={loading}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                className="bg-lime text-black py-8 rounded-[2rem] font-black text-2xl uppercase tracking-tighter flex items-center justify-center gap-4 disabled:opacity-50 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.1)] group"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={28} className="group-hover:rotate-12 transition-transform" /> RUN VIBE_CHECK</>}
                            </motion.button>
                        </div>
                    </form>

                    <AnimatePresence>
                        {(result || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-16 overflow-hidden"
                            >
                                <div className="pt-16 border-t border-white/5">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className={`w-16 h-16 ${error ? 'bg-red-500' : 'bg-lime'} rounded-3xl flex items-center justify-center shadow-lg`}>
                                            {error ? <ShieldAlert className="text-white" /> : <Music size={28} className="text-black" />}
                                        </div>
                                        <div>
                                            <span className="block font-black text-white uppercase tracking-[0.2em] text-sm">{error ? 'SYSTEM_ERROR' : 'JAIA CORE_OUTPUT'}</span>
                                            <span className={`block text-xs ${error ? 'text-red-400' : 'text-lime'} font-bold uppercase tracking-[0.4em] mt-1`}>
                                                {error ? 'Protocol Failure' : 'Status: Optimized'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`prose prose-invert max-w-none leading-relaxed text-2xl font-medium tracking-tight p-12 rounded-[3rem] border italic ${error ? 'bg-red-500/5 border-red-500/20 text-red-200' : 'bg-white/[0.02] border-white/5 text-white/70'}`}>
                                        {error || result}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
