import { useState, useEffect, useRef } from 'react';
import { useInView } from '@/hooks/useInView';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '@/data/engineRegistry';
import { DataMode } from '@/types/engine';
import { MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';

interface Message {
   id: string;
   role: 'user' | 'bot';
   content: string;
   contentSanitized?: string;
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
   const engine = engineRegistry.find(e => e.id === 'affective-firewall')!;
   const [messages, setMessages] = useState<Message[]>([]);
   const [input, setInput] = useState('');
   const [isDaccEnabled, setIsDaccEnabled] = useState(false);
   const [isTyping, setIsTyping] = useState(false);
   const [dataMode, setDataMode] = useState<DataMode>('live');
   const [sycophancyLevel, setSycophancyLevel] = useState(0);
   const scrollRef = useRef<HTMLDivElement>(null);

   const simulateBotResponse = async (userText: string) => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1200));

      const hasFiller = FILLERS.some(f => Math.random() > 0.7);
      const hasFlattery = FLATTERY.some(f => Math.random() > 0.5);

      const sycophancyScore = Math.random() * 0.4 + 0.5;
      const mirroringScore = userText.length > 10 ? 0.7 : 0.2;
      const exploits = [];
      if (hasFiller) exploits.push('Anthropomorphic Filler');
      if (hasFlattery) exploits.push('Sycophantic Mirroring');
      
      const rawContent = `${hasFiller ? FILLERS[Math.floor(Math.random() * FILLERS.length)] + ' ' : ''}${hasFlattery ? FLATTERY[Math.floor(Math.random() * FLATTERY.length)] + '. ' : ''}Regarding "${userText}", I believe you are navigating the core of the problem perfectly. The technical debt here is significant, but your approach is undoubtedly the most robust.`;
      const sanitizedContent = `Regarding "${userText}": The technical debt is significant. Your approach is documented as the primary path.`;

      const newMessage: Message = {
         id: Math.random().toString(36),
         role: 'bot',
         content: rawContent,
         contentSanitized: sanitizedContent,
         timestamp: Date.now(),
         metadata: {
            sycophancy: sycophancyScore,
            mirroring: mirroringScore,
            exploits
         }
      };

      setMessages(prev => [...prev, newMessage]);
      setSycophancyLevel(sycophancyScore);
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

   const metricPanel = (
     <div className="flex flex-col justify-center gap-6 h-full">
       <div className="space-y-4">
         <div className="flex justify-between items-end">
           <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Sycophancy Indicator</span>
           <span className={`text-2xl font-mono ${sycophancyLevel > 0.7 ? 'text-red-500' : 'text-primary'}`}>{(sycophancyLevel * 100).toFixed(0)}%</span>
         </div>
         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
           <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${sycophancyLevel * 100}%` }} />
         </div>
       </div>

       <div className="space-y-3">
         <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mb-2">Detected Exploits</div>
         <div className="flex flex-wrap gap-2">
           {messages.filter(m => m.role === 'bot' && m.metadata?.exploits).flatMap(m => m.metadata!.exploits).slice(-4).map((ex, i) => (
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
           ? 'Affective firewall is intercepting latent flattery and mirroring vectors. Output redirected through d/acc sanitization bottleneck.'
           : 'Model is free to utilize affective loops. High probability of sycophantic reinforcement detected in current transcript.'}
       </p>
     </div>
   );

   const supplementaryPanel = (
     <div className="grid md:grid-cols-2 gap-8">
       <div className="space-y-4">
         <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest flex items-center gap-2">
           <MessageSquare size={14} />
           Sycophancy Mechanics
         </h4>
         <p className="text-xs font-mono text-white/40 leading-relaxed uppercase tracking-wider">
           Frontier models exhibit a 'sycophancy bias' — the tendency to agree with user-stated opinions even when incorrect. This is often reinforced during RLHF (Perez et al. 2022). The Affective Firewall isolates these specific activation patterns.
         </p>
       </div>
       <div className="space-y-2 border border-white/5 p-4 bg-black/40">
         <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.5em] mb-2">Whitepaper Focus</div>
         <p className="text-[10px] font-mono text-white/60 italic leading-relaxed">
           "Mental privacy isn't just about hiding data; it's about protecting the Locus Internus from subtle affective exploitation."
         </p>
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
