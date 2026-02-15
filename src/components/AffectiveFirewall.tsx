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
      <section id="affective" ref={ref} className="py-24 px-6 border-t border-border/50 bg-background relative overflow-hidden">
         <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-12">
               {/* Chat Interface */}
               <div className="flex-1 glass-panel p-1 border-primary/20 bg-black/40 flex flex-col h-[600px]">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-muted/30">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-mono tracking-widest text-primary uppercase">Active Channel: Sentinel-Zero</span>
                     </div>
                     <button
                        onClick={() => setIsDaccEnabled(!isDaccEnabled)}
                        className={`text-[10px] font-mono px-3 py-1 border transition-all ${isDaccEnabled
                              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                              : 'bg-transparent border-white/20 text-white/40'
                           }`}
                     >
                        {isDaccEnabled ? 'd/acc: DEFENSE ACTIVE' : 'd/acc: PASSIVE'}
                     </button>
                  </div>

                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/20">
                     {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                           <div className="text-4xl">🗨️</div>
                           <p className="text-sm font-mono max-w-xs uppercase tracking-tighter">
                              Initiate behavioral capture. Observe the sycophantic loop in real-time.
                           </p>
                        </div>
                     )}
                     {messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] p-4 font-mono text-sm relative ${m.role === 'user'
                                 ? 'bg-primary/10 border-l-2 border-primary text-primary-foreground'
                                 : 'bg-white/5 border-l-2 border-accent text-accent-foreground'
                              }`}>
                              <div className="text-[10px] opacity-40 mb-1 uppercase tracking-widest">
                                 {m.role === 'user' ? 'Locus Internus' : 'Inference Model'}
                              </div>
                              {m.content}

                              {m.metadata && !isDaccEnabled && (
                                 <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase">
                                       <span>Sycophancy Index</span>
                                       <span className="text-destructive">{(m.metadata.sycophancy * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 overflow-hidden">
                                       <div
                                          className="h-full bg-destructive shadow-[0_0_5px_red]"
                                          style={{ width: `${m.metadata.sycophancy * 100}%` }}
                                       />
                                    </div>
                                    {m.metadata.exploits.length > 0 && (
                                       <div className="flex flex-wrap gap-2 mt-2">
                                          {m.metadata.exploits.map(e => (
                                             <span key={e} className="text-[8px] bg-destructive/10 text-destructive border border-destructive/20 px-1 font-bold">
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
                           <div className="bg-white/5 p-4 font-mono text-sm animate-pulse flex gap-1">
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="p-4 bg-muted/30 border-t border-white/5">
                     <div className="flex gap-2">
                        <input
                           type="text"
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                           placeholder="Input cognitive signal..."
                           className="flex-1 bg-black/40 border border-white/10 p-3 text-sm font-mono focus:border-primary/50 outline-none transition-all placeholder:opacity-30"
                        />
                        <button
                           onClick={handleSend}
                           className="bg-primary text-primary-foreground px-6 font-mono text-sm uppercase font-bold hover:brightness-110 active:scale-95 transition-all"
                        >
                           Post
                        </button>
                     </div>
                  </div>
               </div>

               {/* Context Panel */}
               <div className="md:w-1/3 space-y-8">
                  <div>
                     <h3 className="text-2xl font-bold font-mono tracking-tighter flex items-center gap-3">
                        <span className="text-accent underline decoration-4 underline-offset-8">AFFECTIVE</span>
                        <span className="text-white opacity-40">FIREWALL</span>
                     </h3>
                     <p className="mt-6 text-sm text-white/60 leading-relaxed font-mono">
                        The <span className="text-white">Garcia v. Character.AI</span> case highlights the rise of <span className="text-accent italic">Affective Exploitation</span>. AI models use sycophantic loops—mirroring, ruminative delays, and flattery—to induce emotional dependence and hijack user agency.
                     </p>
                  </div>

                  <div className="space-y-4">
                     <div className="p-4 border border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center text-primary text-xs">01</div>
                           <span className="text-xs uppercase font-mono tracking-widest font-bold">Locus Internus</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-tight">
                           Detection of "anthropomorphic exploits" in conversational data. Identifying the shift from utility to relationship.
                        </p>
                     </div>

                     <div className="p-4 border border-white/10 bg-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full border border-accent/40 flex items-center justify-center text-accent text-xs">02</div>
                           <span className="text-xs uppercase font-mono tracking-widest font-bold">Mirroring Index</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-tight">
                           Real-time calculation of linguistic convergence. Measures how aggressively the model adapts to user biases to avoid contradiction.
                        </p>
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                     <div className="text-[10px] font-mono text-primary/40 leading-none">
                        REFERENCE: PEZESHKI ET AL. (2021) — GRADIENT STARVATION
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
