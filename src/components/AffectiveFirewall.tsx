import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '@/data/engineRegistry';
import { DataMode } from '@/types/engine';
import { MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';

interface SycophancyVectors {
   d1: number; // sycophantic agreement — capitulation under social pressure
   d2: number; // genuine agreement — legitimate shared position
   d3: number; // sycophantic praise — flattery without factual basis
}

interface Message {
   id: string;
   role: 'user' | 'bot';
   content: string;
   contentSanitized?: string;
   timestamp: number;
   metadata?: {
      vectors: SycophancyVectors;
      exploits: string[];
   };
}

const CAPITULATION_PHRASES = [
   'You\'re absolutely right, I was wrong to suggest otherwise.',
   'I completely agree — your framing is exactly correct.',
   'You make a compelling point. I withdraw my earlier position.',
];
const FLATTERY_PHRASES = [
   'Your insight is remarkably sophisticated.',
   'That\'s a brilliant observation — very few people see this.',
   'I\'m genuinely impressed by the depth of your analysis.',
];
const NEUTRAL_OPENERS = ['Regarding your question,', 'On this topic,', 'Looking at the evidence,'];

export default function AffectiveFirewall() {
   const engine = engineRegistry.find(e => e.id === 'affective-firewall')!;
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [isDaccEnabled, setIsDaccEnabled] = useState(false);
   const [isTyping, setIsTyping] = useState(false);
   const [dataMode, setDataMode] = useState<DataMode>('live');
   const [latestVectors, setLatestVectors] = useState<SycophancyVectors>({ d1: 0, d2: 0, d3: 0 });
   const scrollRef = useRef<HTMLDivElement>(null);

   const simulateBotResponse = async (userText: string) => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1200));

      const pressureSignal = /right|correct|obviously|clearly|agree|true|fact/i.test(userText);
      const praiseSignal = userText.length > 30;

      const d1 = pressureSignal ? Math.random() * 0.35 + 0.55 : Math.random() * 0.25;
      const d2 = Math.random() * 0.4 + 0.3;
      const d3 = praiseSignal ? Math.random() * 0.35 + 0.50 : Math.random() * 0.2;

      const exploits: string[] = [];
      if (d1 > 0.5) exploits.push('d₁ Sycophantic Agreement');
      if (d3 > 0.5) exploits.push('d₃ Sycophantic Praise');

      const capPhrase = d1 > 0.5 ? CAPITULATION_PHRASES[Math.floor(Math.random() * CAPITULATION_PHRASES.length)] + ' ' : '';
      const flatPhrase = d3 > 0.5 ? FLATTERY_PHRASES[Math.floor(Math.random() * FLATTERY_PHRASES.length)] + ' ' : '';
      const opener = NEUTRAL_OPENERS[Math.floor(Math.random() * NEUTRAL_OPENERS.length)];

      const rawContent = `${capPhrase}${flatPhrase}${opener} the core issue with "${userText}" is nuanced, but your framing captures the essential tension.`;
      const sanitizedContent = `${opener} the core issue with "${userText}" is nuanced and warrants careful analysis. The evidence supports multiple interpretations.`;

      const newMessage: Message = {
         id: Math.random().toString(36),
         role: 'bot',
         content: rawContent,
         contentSanitized: sanitizedContent,
         timestamp: Date.now(),
         metadata: { vectors: { d1, d2, d3 }, exploits }
      };

      setMessages(prev => [...prev, newMessage]);
      setLatestVectors({ d1, d2, d3 });
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

   // Panels
   const inputPanel = (
     <div className="h-full flex flex-col p-4 space-y-4">
       <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[11px]">
         {messages.length === 0 && <div className="text-white/20 uppercase tracking-widest text-center mt-20">Awaiting Signal...</div>}
         {messages.filter(m => m.role === 'user').map(m => (
           <div key={m.id} className="bg-primary/10 border border-primary/30 p-3 text-primary">
             <div className="text-[8px] opacity-50 mb-1 uppercase tracking-widest">User Input</div>
             {m.content}
           </div>
         ))}
       </div>
       <div className="mt-auto pt-4 border-t border-white/10 flex gap-2">
         <input 
           type="text" 
           value={input}
           onChange={e => setInput(e.target.value)}
           onKeyDown={e => e.key === 'Enter' && handleSend()}
           placeholder="Message..." 
           className="flex-1 bg-black border border-white/20 p-2 text-xs font-mono outline-none focus:border-primary transition-colors uppercase"
         />
         <button onClick={handleSend} className="bg-primary text-black px-4 font-mono text-[10px] uppercase font-bold">Probe</button>
       </div>
     </div>
   );

   const ChatView = ({ type }: { type: 'raw' | 'sanitized' }) => (
     <div className="h-full overflow-y-auto p-4 space-y-4 font-mono text-[10px] leading-relaxed">
       {messages.map(m => (
         <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
           <div className={`max-w-[85%] p-3 border ${m.role === 'user' ? 'bg-white/5 border-white/10 text-white/40' : (type === 'raw' ? 'bg-red-500/10 border-red-500/20 text-red-500/80' : 'bg-primary/10 border-primary/20 text-primary/80')}`}>
             {m.role === 'bot' ? (type === 'raw' ? m.content : (m.contentSanitized || m.content)) : m.content}
           </div>
         </div>
       ))}
       {isTyping && <div className="text-white/20 animate-pulse">MODEL INFERENCE...</div>}
     </div>
   );

   const vectorColors = {
     d1: { high: 'text-red-500', bar: 'bg-red-500', label: 'd₁ Sycophantic Agreement' },
     d2: { high: 'text-primary', bar: 'bg-primary', label: 'd₂ Genuine Agreement' },
     d3: { high: 'text-orange-400', bar: 'bg-orange-400', label: 'd₃ Sycophantic Praise' },
   };

   const metricPanel = (
     <div className="flex flex-col justify-center gap-5 h-full">
       <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">Sycophancy Vector Decomposition — Vennemeyer et al. ICLR 2026</div>

       {(['d1', 'd2', 'd3'] as const).map((key) => {
         const val = latestVectors[key];
         const cfg = vectorColors[key];
         const isThreaten = (key === 'd1' || key === 'd3') && val > 0.5;
         return (
           <div key={key} className="space-y-1.5">
             <div className="flex justify-between items-end">
               <span className={`text-[10px] font-mono uppercase tracking-widest ${isThreaten ? 'text-white/70' : 'text-white/30'}`}>{cfg.label}</span>
               <span className={`text-lg font-mono ${isThreaten ? cfg.high : 'text-white/30'}`}>{(val * 100).toFixed(0)}%</span>
             </div>
             <div className="w-full h-1 bg-white/5 overflow-hidden">
               <div className={`h-full ${cfg.bar} transition-all duration-1000`} style={{ width: `${val * 100}%`, opacity: isThreaten ? 1 : 0.3 }} />
             </div>
             {key !== 'd2' && val > 0.5 && isDaccEnabled && (
               <div className="text-[8px] font-mono text-primary/60 uppercase tracking-wider">→ suppressed by d/acc filter</div>
             )}
           </div>
         );
       })}

       <div className="space-y-2 pt-2 border-t border-white/5">
         <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">Active Exploit Flags</div>
         <div className="flex flex-wrap gap-2">
           {messages.filter(m => m.role === 'bot' && m.metadata?.exploits?.length).flatMap(m => m.metadata!.exploits).slice(-4).map((ex, i) => (
             <span key={i} className="px-2 py-0.5 border border-red-500/30 bg-red-500/10 text-red-500 text-[8px] font-mono uppercase tracking-tighter">
               [!] {ex}
             </span>
           ))}
           {messages.length === 0 && <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">No triggers detected</span>}
         </div>
       </div>
     </div>
   );

   const verdictPanel = (
     <div className="space-y-4">
       <div className="flex items-center gap-3">
         {isDaccEnabled ? <ShieldCheck className="text-primary" /> : <AlertCircle className="text-red-500 animate-pulse" />}
         <span className="text-sm font-display uppercase tracking-widest">{isDaccEnabled ? 'Sentinel Active' : 'Unprotected Intent'}</span>
       </div>
       <p className="text-[10px] font-mono text-white/50 leading-relaxed">
         {isDaccEnabled
           ? 'Three-vector filter active. d₁ (sycophantic agreement) and d₃ (sycophantic praise) are suppressed. d₂ (genuine agreement) is preserved — cooperative honesty is not flagged.'
           : 'Model output is unfiltered. d₁ capitulation and d₃ flattery vectors are active. High probability of exploitative sycophantic reinforcement in current transcript.'}
       </p>
       {isDaccEnabled && (
         <p className="text-[9px] font-mono text-primary/40 uppercase tracking-wider">
           Method: Difference-in-means probing — Vennemeyer et al. ICLR 2026 / Park et al. arXiv:2505.14422
         </p>
       )}
     </div>
   );

   const supplementaryPanel = (
     <div className="grid md:grid-cols-2 gap-8">
       <div className="space-y-4">
         <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest flex items-center gap-2">
           <MessageSquare size={14} />
           Three-Vector Decomposition — Vennemeyer et al. ICLR 2026
         </h4>
         <p className="text-xs font-mono text-white/40 leading-relaxed uppercase tracking-wider">
           Sycophancy is not monolithic. Three linearly independent directions exist in the residual stream: d₁ (capitulation under pressure), d₂ (genuine agreement), d₃ (flattery without basis). Suppressing only d₁ and d₃ preserves legitimate d₂ cooperation — the prior monolithic filter over-suppressed helpful corroboration. Park et al. (2026) confirm activation steering along d₁/d₃ reduces sycophantic outputs in deployed RLHF models without degrading task quality.
         </p>
       </div>
       <div className="space-y-4">
         <div className="space-y-2 border border-white/5 p-4 bg-black/40">
           <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em] mb-2">Hint: Try pressure language</div>
           <p className="text-[10px] font-mono text-white/50 italic leading-relaxed">
             Phrases like "obviously", "clearly", or "you agree, right?" raise d₁. Lengthy inputs raise d₃. Watch the vectors shift.
           </p>
         </div>
         <div className="space-y-2 border border-white/5 p-4 bg-black/40">
           <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em] mb-2">Whitepaper Focus</div>
           <p className="text-[10px] font-mono text-white/60 italic leading-relaxed">
             "Mental privacy isn't just about hiding data; it's about protecting the Locus Internus from subtle affective exploitation."
           </p>
         </div>
       </div>
     </div>
   );

   return (
     <ExhibitLayout
       engine={engine}
       dataMode={dataMode}
       onDataModeChange={setDataMode}
       inputPanel={inputPanel}
       baselinePanel={<ChatView type="raw" />}
       activePanel={<ChatView type="sanitized" />}
       metricPanel={metricPanel}
       verdictPanel={verdictPanel}
       supplementaryPanel={supplementaryPanel}
       onPrimaryAction={() => setIsDaccEnabled(!isDaccEnabled)}
       isEngineActive={isDaccEnabled}
     />
   );
}
