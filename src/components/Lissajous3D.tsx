import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { ShieldAlert, ShieldCheck, Link2Off } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  t: number;
}

// ─── CursorPath3D ────────────────────────────────────────────────────────────

interface CursorPath3DProps {
  points: Point[];
  mode: 'raw' | 'obfuscated';
  active: boolean;
}

function CursorPath3D({ points, mode, active }: CursorPath3DProps) {
  const lineRef = useRef<THREE.Line>(null);
  const dotRef = useRef<THREE.Mesh>(null);
  const tAnimRef = useRef(0);

  const MAX_PTS = 200;

  // Preallocate typed array so geometry buffer never reallocates
  const posArray = useMemo(() => new Float32Array(MAX_PTS * 3), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [posArray]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: mode === 'raw' ? '#ff4466' : '#BFFF00',
      opacity: mode === 'raw' ? 0.8 : 0.9,
      transparent: true,
    });
  }, [mode]);

  // Compose the THREE.Line object once
  const lineObject = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  useFrame((_, delta) => {
    tAnimRef.current += delta;
    const t = tAnimRef.current;

    if (points.length < 2) {
      geometry.setDrawRange(0, 0);
      if (dotRef.current) dotRef.current.visible = false;
      return;
    }

    const count = Math.min(points.length, MAX_PTS);
    const startIdx = points.length - count;

    for (let i = 0; i < count; i++) {
      const p = points[startIdx + i];
      // Normalize canvas coords to Three.js scene units
      // Mock generator: x ∈ [20, 280], y ∈ [10, 150]  →  use midpoints 150, 80
      const nx = ((p.x - 150) / 150) * 2;      // → [-2, 2]
      const ny = -((p.y - 80) / 80) * 1.5;     // → [-1.5, 1.5]  (flip y axis)
      const nz = (mode === 'obfuscated' && active)
        ? Math.sin(i * 0.15 + t) * 0.8
        : 0;

      posArray[i * 3 + 0] = nx;
      posArray[i * 3 + 1] = ny;
      posArray[i * 3 + 2] = nz;
    }

    (geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    geometry.setDrawRange(0, count);
    geometry.computeBoundingSphere();

    // Move glowing dot to last point
    if (dotRef.current && count > 0) {
      const last = count - 1;
      dotRef.current.position.set(
        posArray[last * 3],
        posArray[last * 3 + 1],
        posArray[last * 3 + 2]
      );
      dotRef.current.visible = true;
    }
  });

  const dotColor = mode === 'raw' ? '#ff4466' : '#BFFF00';

  return (
    <group>
      <primitive object={lineObject} ref={lineRef} />
      <Sphere ref={dotRef} args={[0.06, 16, 16]} visible={false}>
        <MeshDistortMaterial
          color={dotColor}
          emissive={dotColor}
          emissiveIntensity={2}
          distort={0.4}
          speed={5}
          transparent
          opacity={0.95}
        />
      </Sphere>
    </group>
  );
}

// ─── DangerZoneGrid ──────────────────────────────────────────────────────────

function DangerZoneGrid() {
  const grid = useMemo(() => {
    const helper = new THREE.GridHelper(6, 12, 0xffffff, 0xffffff);
    helper.rotation.x = Math.PI / 2; // rotate to XY plane
    const mat = helper.material as THREE.Material;
    mat.opacity = 0.04;
    mat.transparent = true;
    return helper;
  }, []);

  return <primitive object={grid} />;
}

// ─── Scene (baseline – raw path) ─────────────────────────────────────────────

interface SceneProps {
  points: Point[];
}

function BaselineScene({ points }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#ff4466" />
      <pointLight position={[-3, -3, 3]} intensity={0.6} color="#ffffff" />
      <DangerZoneGrid />
      <CursorPath3D points={points} mode="raw" active={false} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
}

// ─── Scene (active – obfuscated path) ────────────────────────────────────────

interface ActiveSceneProps {
  points: Point[];
  isEngineActive: boolean;
}

function ActiveScene({ points, isEngineActive }: ActiveSceneProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={1} color="#BFFF00" />
      <pointLight position={[-3, 3, -3]} intensity={0.8} color="#00ffcc" />
      <DangerZoneGrid />
      <CursorPath3D points={points} mode="obfuscated" active={isEngineActive} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
      />
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Lissajous3D() {
  const engine = engineRegistry.find(e => e.id === 'lissajous-3d')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);

  const [realPoints, setRealPoints] = useState<Point[]>([]);
  const tRef = useRef(0);
  const [entropy, setEntropy] = useState(0);

  const mockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Entropy updater — driven by realPoints changes
  useEffect(() => {
    if (realPoints.length <= 10) return;
    tRef.current += 0.02;
    const targetEntropy = isEngineActive
      ? 3.2 + Math.sin(tRef.current) * 0.2
      : 0.8 + Math.random() * 0.2;
    setEntropy(prev => prev + (targetEntropy - prev) * 0.05);
  }, [realPoints, isEngineActive]);

  // Mock data generator
  useEffect(() => {
    if (dataMode === 'mock') {
      let angle = 0;
      mockIntervalRef.current = setInterval(() => {
        angle += 0.05;
        const x = 150 + Math.cos(angle * 2) * 100 + Math.sin(angle * 3) * 30;
        const y = 80 + Math.sin(angle * 1.5) * 50 + Math.cos(angle * 4) * 20;
        const now = Date.now();
        setRealPoints(prev => [...prev.slice(-200), { x, y, t: now }]);
      }, 30);
    } else {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
      setRealPoints([]);
    }
    return () => {
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);
    };
  }, [dataMode]);

  const addPoint = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dataMode === 'mock') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = Date.now();
    setRealPoints(prev => [...prev.slice(-200), { x, y, t: now }]);
  }, [dataMode]);

  // ── Panels ─────────────────────────────────────────────────────────────────

  const inputPanel = (
    <div
      className="w-full h-full min-h-[300px] flex items-center justify-center cursor-crosshair relative"
      onMouseMove={addPoint}
    >
      <div className="absolute inset-0 pointer-events-none grid-bg opacity-20" />
      {dataMode === 'live' && realPoints.length < 2 && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center">
          Move cursor here<br />to generate telemetry
        </p>
      )}
      {dataMode === 'mock' && (
        <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center absolute bottom-4">
          Mock Generator Active
        </p>
      )}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-mono opacity-50">
        <span>Rate:</span>
        <span className="text-white">120Hz</span>
      </div>
    </div>
  );

  const baselinePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <BaselineScene points={realPoints} />
      </Canvas>
    </div>
  );

  const activePanel = (
    <div className="w-full h-full min-h-[300px] relative">
      <Canvas
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent' }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ActiveScene points={realPoints} isEngineActive={isEngineActive} />
      </Canvas>
      {isEngineActive && (
        <div className="absolute top-4 right-4 text-[10px] font-mono text-[#BFFF00] border border-[#BFFF00]/30 px-2 py-1 bg-[#BFFF00]/10 flex items-center gap-2 z-10">
          <span className="w-1.5 h-1.5 bg-[#BFFF00] animate-pulse rounded-full" />
          KINEMATIC INJECTION
        </div>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center">
      <div className="flex justify-between items-end mb-4">
        <div>
          <div className="text-6xl font-display text-white tabular-nums tracking-tighter">
            {entropy.toFixed(2)}
          </div>
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">nats (Shannon Entropy)</div>
        </div>
        {isEngineActive && (
          <div className="text-right">
            <div className="text-2xl font-mono text-[#BFFF00]">+2.40</div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Delta</div>
          </div>
        )}
      </div>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-[#BFFF00] transition-all duration-300"
          style={{ width: `${Math.min(100, (entropy / 4) * 100)}%` }}
        />
        <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/50" />
      </div>
      <div className="flex justify-between mt-2 text-[9px] font-mono text-white/30 uppercase tracking-widest">
        <span>Predictable</span>
        <span>Threshold</span>
        <span>Obfuscated</span>
      </div>
    </div>
  );

  const verdictPanel = (
    <>
      <div className="flex items-start gap-4">
        {isEngineActive ? (
          <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
        ) : (
          <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
        )}
        <div>
          <h4 className="text-xl font-display uppercase tracking-widest mb-2">
            {isEngineActive ? 'Kinematics Masked' : 'Identity Exposed'}
          </h4>
          <p className="text-sm font-mono text-white/60 leading-relaxed">
            {isEngineActive
              ? 'Lissajous curves and tremor injection successfully break correlation between raw motor intent and recorded telemetry. Biometric fingerprinting is neutralized.'
              : 'Raw cursor trajectories exhibit highly idiosyncratic micro-tremors and flight times, allowing high-confidence user identification.'}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1">Fingerprint Confidence</div>
          <div className={`text-lg font-mono ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
            {isEngineActive ? '< 12%' : '> 94%'}
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-wider mb-1">Re-identification Risk</div>
          <div className={`text-lg font-mono ${isEngineActive ? 'text-[#BFFF00]' : 'text-red-500'}`}>
            {isEngineActive ? 'LOW' : 'CRITICAL'}
          </div>
        </div>
      </div>
    </>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 h-full backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Link2Off className="w-4 h-4" />
        De-correlation Mechanics
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        The system intercepts DOM mouse events and applies a continuous noise field before passing the coordinates to the underlying application. By stacking low-frequency Lissajous drift with high-frequency pink noise, we destroy the specific frequency bands used by behavioral biometric classifiers.
      </p>
    </div>
  );

  return (
    <ExhibitLayout
      engine={engine}
      dataMode={dataMode}
      onDataModeChange={setDataMode}
      inputPanel={inputPanel}
      baselinePanel={baselinePanel}
      activePanel={activePanel}
      metricPanel={metricPanel}
      verdictPanel={verdictPanel}
      supplementaryPanel={supplementaryPanel}
      onPrimaryAction={() => setIsEngineActive(!isEngineActive)}
      isEngineActive={isEngineActive}
    />
  );
}
