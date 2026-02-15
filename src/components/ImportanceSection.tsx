import { useInView } from '@/hooks/useInView';

const urgencyFactors = [
  {
    label: 'The "Generative" Leap in Decoding (2024–2025)',
    desc: 'We have moved from crude signal processing to high-fidelity "mind reading" through the integration of Generative AI and Large Language Models with neurotechnology. NTT\'s "Mind Captioning" (Nov 2025) and systems like DeWave now translate brain activity into continuous text using portable EEG caps, democratizing access to mind-reading technology.',
    icon: '⚡'
  },
  {
    label: 'The "Inference Gap" Has Closed',
    desc: 'You no longer need a brain implant to have your mind read. AI can now infer intimate cognitive and emotional states (ADHD, neurosis, fatigue, intoxication) purely from mouse cursor dynamics and keystroke rhythms. This creates a "Glass User"—transparent to algorithms without ever wearing a headset.',
    icon: '◈'
  },
  {
    label: 'Rapid Commercialization & Workplace Surveillance',
    desc: 'Neurotechnology has migrated from the clinic to the workplace. In China, emotional surveillance caps monitor workers\' rage, anxiety, and fatigue to maximize production efficiency. A 2024 audit found 96.7% of consumer neurotech companies reserve the right to share or sell users\' brain data to third parties.',
    icon: '⌘'
  },
  {
    label: 'A Legislative Tipping Point (2024–2025)',
    desc: 'Governments have realized that existing privacy laws (HIPAA, GDPR) are insufficient for neural data. Colorado and California passed the first U.S. laws classifying "neural data" as sensitive. In September 2025, U.S. Senators introduced the MIND Act. UNESCO adopted the first global standard on neurotechnology ethics in November 2025.',
    icon: '⚖'
  },
  {
    label: 'New Security Threats: "Brainjacking" & Cognitive Warfare',
    desc: 'NATO now views the human mind as an operational domain. As brain implants (like Neuralink, which began human trials in 2024) become wireless and networked, they become susceptible to cyberattacks. Malicious actors could theoretically alter stimulation parameters to induce pain, manipulate emotions, or disrupt motor function.',
    icon: '⚠'
  },
];

const ImportanceSection = () => {
  const { ref, isInView } = useInView();

  return (
    <section id="importance" className="relative py-32 px-6 border-t border-white/5" ref={ref}>
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full gradient-blob" style={{ filter: 'blur(100px)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="tag-badge mb-6 inline-block">CRITICAL INFLECTION POINT</span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl text-foreground mb-6 mt-4">
            Why is this<br />
            <span className="text-primary">important now?</span>
          </h2>
          <p className="text-body text-muted-foreground text-lg max-w-3xl mb-4 leading-relaxed">
            The urgency of this issue—specifically in the 2024–2026 timeframe—stems from a convergence of technological breakthroughs, aggressive commercialization, and the sudden erosion of what was previously considered the absolute biological barrier of the skull.
          </p>
          <p className="text-body text-muted-foreground text-base max-w-3xl mb-16 leading-relaxed italic border-l-2 border-primary/30 pl-4">
            We have simultaneously achieved the technical capability to read minds, the commercial incentive to exploit that data, and the realization that our biological "firewall"—the skull—has effectively been breached before our laws could be updated to protect it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {urgencyFactors.map((factor, i) => (
            <div
              key={factor.label}
              className={`glass-panel p-8 group transition-all duration-700 hover:neon-border-glow ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <span className="text-mono text-3xl text-primary/40 group-hover:text-primary transition-colors duration-300 mt-1 flex-shrink-0">
                  {factor.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-mono text-xs text-primary/50 mt-1 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl text-foreground font-semibold leading-tight">{factor.label}</h3>
                  </div>
                  <p className="text-body text-sm text-muted-foreground leading-relaxed">{factor.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-16 glass-panel p-10 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <div className="flex items-start gap-6">
            <span className="text-5xl">⏰</span>
            <div>
              <h3 className="text-2xl text-primary font-bold mb-4">This Moment is Unprecedented</h3>
              <p className="text-body text-muted-foreground leading-relaxed mb-4">
                For millennia, the physical structure of the skull served as an absolute barrier, ensuring that thoughts, memories, and intentions remained the sole property of the individual until voluntarily externalized through speech or action.
              </p>
              <p className="text-body text-foreground leading-relaxed font-medium">
                That era has ended. The convergence of high-resolution neural recording, generative artificial intelligence, and large language models has inaugurated an era of "mind reading" that renders the "unobservable dimension" of human experience increasingly permeable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImportanceSection;
