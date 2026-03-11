import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { THREAT_TYPE_TO_CAT, CAT_BY_ID } from '@/data/cat';
import type { CATEntry } from '@/data/cat';

type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
type ThreatType =
  | 'MOUSE_FINGERPRINT'
  | 'KEYSTROKE_PROFILE'
  | 'CANVAS_HASH'
  | 'WEBGL_RENDER'
  | 'AUDIO_CONTEXT'
  | 'EEG_DELTA'
  | 'SCROLL_DYNAMICS'
  | 'TOUCH_PRESSURE'
  | 'GAZE_VECTOR'
  | 'LATENCY_CLOCK'
  | 'FONT_PROBE'
  | 'CSS_ENUM';

interface ThreatEvent {
  id: string;
  ts: number;
  severity: Severity;
  type: ThreatType;
  source: string;
  description: string;
  blocked: boolean;
  engine: string;
  vector: number;
  cat: CATEntry | null;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  CRITICAL: 'hsla(0, 80%, 60%, 0.9)',
  HIGH: 'hsla(15, 90%, 55%, 0.9)',
  MEDIUM: 'hsla(38, 95%, 55%, 0.9)',
  LOW: 'hsla(142, 71%, 45%, 0.8)',
};

const SEVERITY_BG: Record<Severity, string> = {
  CRITICAL: 'hsla(0, 80%, 30%, 0.12)',
  HIGH: 'hsla(15, 90%, 30%, 0.1)',
  MEDIUM: 'hsla(38, 95%, 30%, 0.08)',
  LOW: 'hsla(142, 71%, 20%, 0.07)',
};

const THREAT_TEMPLATES: {
  type: ThreatType;
  severity: Severity;
  engine: string;
  descriptions: string[];
  sources: string[];
}[] = [
  {
    type: 'MOUSE_FINGERPRINT',
    severity: 'HIGH',
    engine: 'Lissajous-3D',
    descriptions: [
      'Velocity-jerk profile match (p=0.94) against known user cluster',
      'Sinuosity signature correlated with session #4891-F',
      'Motor tremor frequency 8.3 Hz detected — unique identifier extracted',
    ],
    sources: ['CloudFlare Bot Mgmt', 'DataDome v3.1', 'PerimeterX ML'],
  },
  {
    type: 'KEYSTROKE_PROFILE',
    severity: 'CRITICAL',
    engine: 'Keystroke Jitter',
    descriptions: [
      'TypingDNA match confidence 97.2% — identity confirmed via 42-key sample',
      'Dwell/flight ratio identifies user with EER 0.8%',
      'Rhythm signature correlated across 3 browser sessions',
    ],
    sources: ['TypingDNA API', 'BehavioSec SAAS', 'IBM Trusteer'],
  },
  {
    type: 'CANVAS_HASH',
    severity: 'MEDIUM',
    engine: 'Spectral Defender',
    descriptions: [
      'Canvas rendering hash 0xA3F91C matched in 6 sessions',
      'WebGL pixel readback correlates with GPU cluster fingerprint',
      'Font metric difference 0.043px extracted from fillText benchmark',
    ],
    sources: ['FingerprintJS Pro', 'MaxMind v4', 'TrackingDesk'],
  },
  {
    type: 'WEBGL_RENDER',
    severity: 'HIGH',
    engine: 'Gradient Auditor',
    descriptions: [
      'Unmasked renderer string (NVIDIA RTX) narrows to 180K user set',
      'WebGL extension fingerprint (17 extensions) matches known profile',
      'GLSL precision deviation 1.2e-7 extracted — GPU signature unique',
    ],
    sources: ['F-Secure Elements', 'ClearSale v2', 'BioCatch'],
  },
  {
    type: 'AUDIO_CONTEXT',
    severity: 'MEDIUM',
    engine: 'Spectral Defender',
    descriptions: [
      'AudioContext oscillator sum 7.43e-5 extracted — 23-bit identifier',
      'Sample rate / channel count combination identifies browser build',
      'DynamicsCompressor knee response deviates 0.8% from reference',
    ],
    sources: ['Signal Sciences', 'CrowdStrike Falcon', 'Arkose Labs'],
  },
  {
    type: 'SCROLL_DYNAMICS',
    severity: 'LOW',
    engine: 'Adaptive Tremor',
    descriptions: [
      'Scroll velocity profile matches user segment (confidence: 78%)',
      'Inertia decay constant 0.94 correlates with mobile OS fingerprint',
      'Wheel delta sequence matches gesture model for profile #81-K',
    ],
    sources: ['Akamai Bot Mgmt', 'Radware DefensePro', 'Kasada v2'],
  },
  {
    type: 'EEG_DELTA',
    severity: 'CRITICAL',
    engine: 'Spectral Defender',
    descriptions: [
      'Alpha-band (9.2 Hz) resonance extracted via CSS animation timing',
      'Theta-wave correlation (4.8 Hz) through requestAnimationFrame drift',
      'P300 event-related potential inferred from response latency variance',
    ],
    sources: ['Neuralink Passive SDK (2026)', 'CognitiveSec Lab', 'NeuroMark v1.1'],
  },
  {
    type: 'GAZE_VECTOR',
    severity: 'HIGH',
    engine: 'Lissajous-3D',
    descriptions: [
      'Cursor-as-gaze proxy: fixation dwell 340ms matches reading profile',
      'Saccade velocity 420°/s — calibration matches known oculomotor model',
      'Pupil dilation inferred from hover duration variance on high-contrast elements',
    ],
    sources: ['EyeVerify ML', 'Tobii Analytics API', 'FocusTrack v3'],
  },
  {
    type: 'FONT_PROBE',
    severity: 'LOW',
    engine: 'Gradient Auditor',
    descriptions: [
      'Font enumeration via CSS metric probing — 23 system fonts identified',
      'measureText() width deviation fingerprints font rendering subsystem',
      'Fallback font selection cascade narrows platform to 3 OS variants',
    ],
    sources: ['panopticlick.eff.org', 'FingerprintJS', 'Cloudflare Zaraz'],
  },
  {
    type: 'LATENCY_CLOCK',
    severity: 'MEDIUM',
    engine: 'Keystroke Jitter',
    descriptions: [
      'High-resolution timer tick pattern correlates with CPU load signature',
      'Network RTT jitter fingerprint matches ISP prefix cluster',
      'performance.now() drift 0.3ms/min — hardware clock identifier extracted',
    ],
    sources: ['Datashake v2', 'Sift Science', 'Kount AI'],
  },
  {
    type: 'CSS_ENUM',
    severity: 'LOW',
    engine: 'Gradient Auditor',
    descriptions: [
      'CSS media query fingerprint: 14 features enumerated',
      'getComputedStyle precision deviates browser build — 7-bit identifier',
      'Viewport snapping behavior reveals OS accessibility scaling factor',
    ],
    sources: ['TAG Governance', 'Google Privacy Sandbox Monitor', 'LGTM Auditor'],
  },
  {
    type: 'TOUCH_PRESSURE',
    severity: 'HIGH',
    engine: 'Adaptive Tremor',
    descriptions: [
      'Touch force variance 0.02N RMS matches biometric model for user segment',
      'Finger contact area ellipse ratio 1.4 narrows to left-handed cohort',
      'Swipe curvature signature extracted — 94% match confidence',
    ],
    sources: ['Nudata Security', 'ThreatMetrix v5', 'Visa Decision Manager'],
  },
];

function resolveCat(type: ThreatType): CATEntry | null {
  const ids = THREAT_TYPE_TO_CAT[type];
  if (!ids?.length) return null;
  return CAT_BY_ID[ids[0]] ?? null;
}

function generateThreat(blocked: boolean): ThreatEvent {
  const template = THREAT_TEMPLATES[Math.floor(Math.random() * THREAT_TEMPLATES.length)];
  const desc = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  const source = template.sources[Math.floor(Math.random() * template.sources.length)];

  return {
    id: Math.random().toString(36).slice(2, 10).toUpperCase(),
    ts: Date.now(),
    severity: template.severity,
    type: template.type,
    source,
    description: desc,
    blocked,
    engine: template.engine,
    vector: Math.random(),
    cat: resolveCat(template.type),
  };
}

function formatTs(ts: number): string {
  const d = new Date(ts);
  return d.toTimeString().slice(0, 8) + '.' + d.getMilliseconds().toString().padStart(3, '0');
}

const STATS_LABELS = [
  { key: 'total', label: 'Total Threats', color: 'white' },
  { key: 'blocked', label: 'Blocked', color: 'var(--primary)' },
  { key: 'critical', label: 'Critical', color: 'hsla(0, 80%, 60%, 0.9)' },
  { key: 'bypassed', label: 'Bypassed', color: 'hsla(38, 95%, 55%, 0.9)' },
] as const;

const ThreatFeed = () => {
  const { ref, isInView } = useInView();
  const [events, setEvents] = useState<ThreatEvent[]>([]);
  const [shieldActive, setShieldActive] = useState(true);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<Severity | 'ALL'>('ALL');
  const feedRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoScroll = useRef(true);

  const stats = {
    total: events.length,
    blocked: events.filter(e => e.blocked).length,
    critical: events.filter(e => e.severity === 'CRITICAL').length,
    bypassed: events.filter(e => !e.blocked).length,
  };

  const spawnEvent = useCallback(() => {
    const blocked = shieldActive ? Math.random() > 0.04 : Math.random() > 0.7;
    setEvents(prev => [...prev.slice(-200), generateThreat(blocked)]);
  }, [shieldActive]);

  useEffect(() => {
    if (!isInView || paused) return;
    // Burst on start
    const burst = setInterval(() => {
      spawnEvent();
    }, 180 + Math.random() * 120);

    intervalRef.current = burst;
    return () => clearInterval(burst);
  }, [isInView, paused, spawnEvent]);

  // Slow down after 30 events
  useEffect(() => {
    if (events.length < 30 || paused || !isInView) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(spawnEvent, 1200 + Math.random() * 800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [events.length, paused, isInView, spawnEvent]);

  useEffect(() => {
    if (autoScroll.current && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events]);

  const filtered = filter === 'ALL' ? events : events.filter(e => e.severity === filter);

  return (
    <section id="threatfeed" ref={ref} className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-destructive/10 rounded-full gradient-blob pointer-events-none" />

      <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 border border-destructive/30 text-[9px] font-mono text-destructive uppercase tracking-[0.4em] bg-destructive/5">
              Live Intelligence Feed
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-mono tracking-tighter uppercase italic leading-none">
              THREAT <span className="text-primary not-italic block mt-2">INTERCEPT<span className="text-white opacity-20"> STREAM</span></span>
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] max-w-md leading-relaxed">
              Real-time behavioral surveillance attempts intercepted by Canary v6.0 defense engines.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPaused(p => !p)}
              className="text-[9px] font-mono px-4 py-2 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all uppercase tracking-widest"
            >
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button
              onClick={() => setShieldActive(s => !s)}
              className={`text-[9px] font-mono px-5 py-2 border transition-all duration-500 uppercase tracking-widest font-bold ${
                shieldActive
                  ? 'bg-primary border-primary text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'bg-transparent border-destructive/40 text-destructive/60 hover:text-destructive hover:border-destructive'
              }`}
            >
              {shieldActive ? 'Shield: ACTIVE' : 'Shield: DISABLED'}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {STATS_LABELS.map(s => (
            <div key={s.key} className="glass-panel p-4 border-white/5 text-center">
              <div
                className="text-3xl font-mono font-black tracking-tight transition-all duration-500"
                style={{ color: s.color }}
              >
                {stats[s.key]}
              </div>
              <div className="text-[8px] font-mono text-white/25 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Protection rate bar */}
        {events.length > 0 && (
          <div className="mb-6 glass-panel p-4 border-white/5">
            <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2">
              <span>Shield Efficacy</span>
              <span style={{ color: shieldActive ? 'var(--primary)' : 'hsla(0,75%,60%,0.8)' }}>
                {((stats.blocked / Math.max(1, stats.total)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(stats.blocked / Math.max(1, stats.total)) * 100}%`,
                  background: shieldActive
                    ? 'linear-gradient(90deg, hsla(142,71%,45%,0.8), hsla(175,60%,45%,0.8))'
                    : 'hsla(0, 75%, 50%, 0.6)',
                  boxShadow: shieldActive ? '0 0 6px hsla(142, 71%, 50%, 0.4)' : 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Severity Filter */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Filter:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setFilter(sev)}
              className={`text-[8px] font-mono px-3 py-1 border transition-all uppercase tracking-widest ${
                filter === sev
                  ? 'border-white/30 text-white bg-white/5'
                  : 'border-white/5 text-white/20 hover:border-white/15 hover:text-white/40'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Feed Panel */}
        <div className="glass-panel border-white/5 overflow-hidden shadow-2xl">
          <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${paused ? 'bg-white/20' : 'bg-primary animate-pulse'} shadow-[0_0_6px_currentColor]`} />
              <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
                {paused ? 'Feed Paused' : `Live Feed // ${filtered.length} events`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-mono text-white/20 uppercase">
                {shieldActive ? 'Canary v6.0 Active' : 'Unprotected Mode'}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${shieldActive ? 'bg-primary' : 'bg-destructive'}`} />
            </div>
          </div>

          <div
            ref={feedRef}
            className="h-80 overflow-y-auto scrollbar-none divide-y divide-white/[0.03]"
            onScroll={e => {
              const el = e.currentTarget;
              autoScroll.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 30;
            }}
          >
            {filtered.slice(-60).reverse().map((ev, i) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors"
                style={{
                  background: ev.blocked ? 'transparent' : SEVERITY_BG[ev.severity],
                  opacity: i > 40 ? 0.3 + (i / 60) * 0.7 : 1,
                }}
              >
                {/* Severity badge */}
                <div
                  className="shrink-0 w-14 text-center py-0.5 text-[7px] font-mono font-black uppercase tracking-widest mt-0.5"
                  style={{
                    color: ev.severity === 'LOW' && ev.blocked ? 'hsla(142,71%,45%,0.9)' : SEVERITY_COLOR[ev.severity],
                    border: `1px solid ${ev.severity === 'LOW' && ev.blocked ? 'hsla(142,71%,45%,0.3)' : SEVERITY_COLOR[ev.severity].replace('0.9', '0.25')}`,
                    background: SEVERITY_BG[ev.severity],
                  }}
                >
                  {ev.severity}
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-mono text-white/50 uppercase tracking-wider">
                      {ev.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[7px] font-mono text-white/20">via {ev.source}</span>
                  </div>
                  <div className="text-[9px] font-mono text-white/60 leading-relaxed">
                    {ev.description}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-[7px] font-mono text-white/20">{ev.engine}</span>
                    <span className="text-[7px] font-mono" style={{ color: 'hsla(142, 71%, 45%, 0.4)' }}>
                      ID:{ev.id}
                    </span>
                    {ev.cat && (
                      <span
                        className="text-[7px] font-mono px-1.5 py-px border uppercase tracking-wider"
                        style={{
                          color: ev.cat.category === 'Exploit'
                            ? 'hsla(15, 90%, 65%, 0.85)'
                            : ev.cat.category === 'Vulnerability'
                            ? 'hsla(38, 95%, 60%, 0.85)'
                            : 'hsla(210, 80%, 65%, 0.85)',
                          borderColor: ev.cat.category === 'Exploit'
                            ? 'hsla(15, 90%, 55%, 0.2)'
                            : ev.cat.category === 'Vulnerability'
                            ? 'hsla(38, 95%, 55%, 0.2)'
                            : 'hsla(210, 80%, 55%, 0.2)',
                          background: ev.cat.category === 'Exploit'
                            ? 'hsla(15, 90%, 30%, 0.08)'
                            : ev.cat.category === 'Vulnerability'
                            ? 'hsla(38, 95%, 30%, 0.07)'
                            : 'hsla(210, 80%, 30%, 0.07)',
                        }}
                        title={`CAT Layer ${ev.cat.layers.join('/')} · ${ev.cat.category}`}
                      >
                        {ev.cat.id} · {ev.cat.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <div
                    className="text-[7px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5"
                    style={{
                      color: ev.blocked ? 'hsla(142,71%,55%,1)' : SEVERITY_COLOR[ev.severity],
                      background: ev.blocked ? 'hsla(142,71%,30%,0.15)' : SEVERITY_BG[ev.severity],
                      border: `1px solid ${ev.blocked ? 'hsla(142,71%,45%,0.2)' : SEVERITY_COLOR[ev.severity].replace('0.9', '0.2')}`,
                    }}
                  >
                    {ev.blocked ? 'BLOCKED' : 'BYPASSED'}
                  </div>
                  <span className="text-[7px] font-mono text-white/15">{formatTs(ev.ts)}</span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="text-2xl font-mono text-primary/20">◎</div>
                  <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                    {isInView ? 'Initializing threat feed...' : 'Scroll into view to activate'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Engine Activity */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
          {['Lissajous-3D', 'Adaptive Tremor', 'Keystroke Jitter', 'Spectral Defender', 'Gradient Auditor'].map(engine => {
            const count = events.filter(e => e.engine === engine && e.blocked).length;
            return (
              <div key={engine} className="glass-panel p-3 border-white/5 text-center">
                <div className="text-lg font-mono font-black text-primary">{count}</div>
                <div className="text-[7px] font-mono text-white/25 uppercase leading-tight mt-1">{engine}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-[8px] font-mono text-white/15 uppercase tracking-[0.2em] leading-loose">
          [LIVE SIMULATION — Data reflects real attack vectors in production deployments] <br />
          [VECTORS: Mouse // Keystroke // Canvas // WebGL // Audio // EEG // CSS // Font // Clock] <br />
          Status: <span className="text-primary/40">{shieldActive ? 'All 5 engines online' : 'Unprotected — vulnerability window open'}</span>
        </div>
      </div>
    </section>
  );
};

export default ThreatFeed;
