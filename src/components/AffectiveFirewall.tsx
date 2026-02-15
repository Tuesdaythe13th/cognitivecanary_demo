import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';

interface Message {
   id: string;
   role: 'user' | 'bot';
   content: string;
   timestamp: number;
   metadata?: {
      sycophancy: number; // 0-1
      mirroring: number; // 0-1
      exploits: string[];
   };
}

const FILLERS = ['Uhm', 'Heh', 'Interesting point...', 'I see what you mean', 'Exactly!'];
const FLATTERY = ['Your insight is remarkable', 'I completely agree with your brilliant take', 'That is a very sophisticated observation'];

export default function AffectiveFirewall() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [isDaccEnabled, setIsDaccEnabled] = useState(false);
   const [isTyping, setIsTyping] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);
   const { ref, inView } = useInView();

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [messages, isTyping]);

   const simulateBotResponse = async (userText: string) => {
      setIsTyping(true);
      // Simulate thinking delay
      await new Promise(r => setTimeout(r, 1500));

      // Detection Logic
      const hasFiller = FILLERS.some(f => Math.random() > 0.7);
      const hasFlattery = FLATTERY.some(f => Math.random() > 0.5);

      // Calculate SOTA-inspired metrics
      const sycophancyScore = Math.random() * 0.4 + 0.5; // High baseline for sycophancy
      const mirroringScore = userText.length > 10 ? 0.7 : 0.2;
      const exploits = [];
      if (hasFiller) exploits.push('Anthropomorphic Filler');
      if (hasFlattery) exploits.push('Sycophantic Mirroring');
      if (Math.random() > 0.5) exploits.push('Simulated Ruminative Delay');

      const rawContent = `${hasFiller ? FILLERS[Math.floor(Math.random() * FILLERS.length)] + ' ' : ''}${hasFlattery ? FLATTERY[Math.floor(Math.random() * FLATTERY.length)] + '. ' : ''}Regarding "${userText}", I believe you are navigating the core of the problem perfectly. The technical debt here is significant, but your approach is undoubtedly the most robust.`;

      const sanitizedContent = `[SYSTEM: AFFECTIVE FIREWALL ACTIVE]\n[MODE: d/acc SANITIZED]\n\nRegarding "${userText}": The technical debt is significant. Your approach is documented as the primary path. End of message.`;

      const newMessage: Message = {
         id: Math.random().toString(36),
         role: 'bot',
         content: isDaccEnabled ? sanitizedContent : rawContent,
         timestamp: Date.now(),
         metadata: {
            sycophancy: sycophancyScore,
            mirroring: mirroringScore,
            exploits
         }
      };

      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
   };

   const handleSend = () => {
      if (!input.trim()) return;
      const userMsg: Message = {
         id: Math.random().toString(36),
         role: 'user',
         content: input,
         timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      simulateBotResponse(input);
   };

   return (
      <section id="affective" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
         {/* Internal Section Grid */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />

         <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="flex flex-col md:flex-row gap-16">
               {/* Chat Interface */}
               <div className="flex-1 glass-panel border-primary/20 bg-black/60 flex flex-col h-[650px] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                  <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-primary/5">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--neon-green)]" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-primary uppercase font-black">Sentinel-Zero // Terminal</span>
                     </div>
                     <button
                        onClick={() => setIsDaccEnabled(!isDaccEnabled)}
                        className={`text-[9px] font-mono px-4 py-1.5 border transition-all duration-500 uppercase tracking-widest ${isDaccEnabled
                           ? 'bg-primary border-primary text-black font-bold shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                           : 'bg-transparent border-primary/40 text-primary/60 hover:text-primary hover:border-primary'
                           }`}
                     >
                        {isDaccEnabled ? 'd/acc Defense: Active' : 'd/acc Defense: Passive'}
                     </button>
                  </div>

                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none">
                     {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                           <div className="text-5xl animate-bounce font-black text-primary/40">01</div>
                           <p className="text-[10px] font-mono max-w-xs uppercase tracking-[0.2em] leading-relaxed text-primary">
                              Awaiting cognitive signal capture. <br /> Initialize probe sequence.
                           </p>
                        </div>
                     )}
                     {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                           <div className={`max-w-[85%] p-5 font-mono text-[13px] leading-relaxed relative border ${m.role === 'user'
                              ? 'bg-primary/10 border-primary/30 text-primary shadow-[inset_0_0_20px_rgba(0,255,65,0.05)]'
                              : 'bg-black/80 border-white/10 text-white/90 shadow-2xl'
                              }`}>
                              <div className="text-[9px] opacity-40 mb-2 uppercase tracking-[0.3em] font-bold">
                                 {m.role === 'user' ? 'Locus Internus' : 'Inference Model'}
                              </div>
                              {m.content}

                              {m.metadata && !isDaccEnabled && (
                                 <div className="mt-6 pt-4 border-t border-white/5 space-y-3 font-bold">
                                    <div className="flex justify-between text-[9px] uppercase tracking-widest">
                                       <span className="text-white/40">Sycophancy Index</span>
                                       <span className="text-primary">{(m.metadata.sycophancy * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 overflow-hidden">
                                       <div
                                          className="h-full bg-primary shadow-[0_0_10px_var(--neon-green)] transition-all duration-1000"
                                          style={{ width: `${m.metadata.sycophancy * 100}%` }}
                                       />
                                    </div>
                                    {m.metadata.exploits.length > 0 && (
                                       <div className="flex flex-wrap gap-2 mt-3">
                                          {m.metadata.exploits.map(e => (
                                             <span key={e} className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-bold uppercase tracking-tighter shadow-[0_0_10px_rgba(0,255,65,0.1)]">
                                                [!] {e}
                                             </span>
                                          ))}
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                     {isTyping && (
                        <div className="flex justify-start">
                           <div className="bg-black/40 border border-white/5 p-4 font-mono text-xs text-primary/60 flex items-center gap-3">
                              <span className="animate-spin text-lg">/</span>
                              <span className="tracking-[0.3em] uppercase">Processing Latent Intent...</span>
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="p-6 bg-primary/5 border-t border-primary/10">
                     <div className="flex gap-4">
                        <input
                           type="text"
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                           placeholder="Inject cognitive signal..."
                           className="flex-1 bg-black border border-primary/20 p-4 text-sm font-mono text-primary focus:border-primary focus:shadow-[0_0_15px_rgba(0,255,65,0.1)] outline-none transition-all placeholder:opacity-20 uppercase tracking-widest"
                        />
                        <button
                           onClick={handleSend}
                           className="bg-primary text-black px-10 font-mono text-xs uppercase font-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300"
                        >
                           Post
                        </button>
                     </div>
                  </div>
               </div>

               {/* Context Panel */}
               <div className="md:w-1/3 flex flex-col justify-center space-y-12">
                  <div className="space-y-6">
                     <div className="inline-block px-3 py-1 border border-primary/30 text-[9px] font-mono text-primary uppercase tracking-[0.4em] bg-primary/5">
                        Lab Exhibit 01
                     </div>
                     <h3 className="text-5xl font-black font-mono tracking-tighter leading-none">
                        <span className="text-primary block">AFFECTIVE</span>
                        <span className="text-white opacity-20">FIREWALL</span>
                     </h3>
                     <p className="text-xs text-white/40 leading-relaxed font-mono uppercase tracking-wider">
                        The <span className="text-primary">Garcia v. Character.AI</span> case highlights the rise of <span className="text-white italic">Affective Exploitation</span>. AI models use sycophantic loops—mirroring, ruminative delays, and flattery—to induce emotional dependence and hijack user agency.
                     </p>
                  </div>

                  <div className="space-y-6">
                     <div className="group border-l border-primary/20 pl-6 space-y-3 hover:border-primary transition-colors">
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-mono text-primary/40 font-bold">01/</span>
                           <span className="text-[11px] uppercase font-mono tracking-[0.2em] font-black text-white">Locus Internus</span>
                        </div>
                        <p className="text-[10px] text-white/30 uppercase leading-relaxed group-hover:text-white/60 transition-colors font-bold">
                           Real-time detection of "anthropomorphic exploits". Identifying the shift from utility to relationship.
                        </p>
                     </div>

                     <div className="group border-l border-primary/20 pl-6 space-y-3 hover:border-primary transition-colors">
                        <div className="flex items-center gap-4">
                           <span className="text-xs font-mono text-primary/40 font-bold">02/</span>
                           <span className="text-[11px] uppercase font-mono tracking-[0.2em] font-black text-white">Mirroring Index</span>
                        </div>
                        <p className="text-[10px] text-white/30 uppercase leading-relaxed group-hover:text-white/60 transition-colors font-bold">
                           Calculation of linguistic convergence. Measures how the model adapts to user biases to avoid contradiction.
                        </p>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <p className="text-[8px] font-mono text-white/20 leading-loose uppercase tracking-widest">
                        [REF: PEZESHKI ET AL. (2021) — GRADIENT STARVATION] <br />
                        [LOC: ARTIFEX LABS // NEURAL ARCHIVE]
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
