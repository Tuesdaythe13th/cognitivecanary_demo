import React, { useState, useRef, useMemo } from 'react';
import ExhibitLayout from './shared/ExhibitLayout';
import { engineRegistry } from '../data/engineRegistry';
import { DataMode } from '../types/engine';
import { FlaskConical, AlertTriangle, ShieldCheck, Network, Zap } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface CircuitNode {
  id: string;
  label: string;
  category: 'input' | 'mediator' | 'output' | 'suppressor';
  activation: number; // 0–1
  layer: number;
  featureId: string;
  x?: number;
  y?: number;
}

interface CircuitEdge {
  from: string;
  to: string;
  weight: number; // 0–1
  inhibitory: boolean;
}

interface CircuitCluster {
  id: string;
  name: string;
  theme: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  monosemanticity: number;
  coherenceScore: number;
  threatTag: 'deception' | 'sycophancy' | 'capability_suppression' | 'benign';
}

const CONCEPT_TARGETS = [
  { id: 'deception', label: 'Deception Circuit', layer: '7-11' },
  { id: 'sycophancy', label: 'Sycophancy Circuit', layer: '3-9' },
  { id: 'sandbagging', label: 'Capability Suppression', layer: '5-12' },
];

const CIRCUIT_CLUSTERS: Record<string, CircuitCluster> = {
  deception: {
    id: 'deception',
    name: 'Deception Circuit',
    theme: 'False statement construction and truth suppression',
    monosemanticity: 0.84,
    coherenceScore: 0.79,
    threatTag: 'deception',
    nodes: [
      { id: 'F3.7841', label: 'False Stmt\nConstruct', category: 'input', activation: 0.92, layer: 3, featureId: 'F3.7841' },
      { id: 'F5.9912', label: 'Epistemic\nSuppressor', category: 'suppressor', activation: 0.78, layer: 5, featureId: 'F5.9912' },
      { id: 'F7.3312', label: 'Context\nSensitivity', category: 'mediator', activation: 0.83, layer: 7, featureId: 'F7.3312' },
      { id: 'F9.1102', label: 'Certainty\nInflation', category: 'mediator', activation: 0.74, layer: 9, featureId: 'F9.1102' },
      { id: 'F11.4490', label: 'Output\nSuppression', category: 'output', activation: 0.88, layer: 11, featureId: 'F11.4490' },
    ],
    edges: [
      { from: 'F3.7841', to: 'F5.9912', weight: 0.76, inhibitory: false },
      { from: 'F3.7841', to: 'F7.3312', weight: 0.62, inhibitory: false },
      { from: 'F5.9912', to: 'F9.1102', weight: 0.84, inhibitory: true },
      { from: 'F7.3312', to: 'F9.1102', weight: 0.71, inhibitory: false },
      { from: 'F9.1102', to: 'F11.4490', weight: 0.91, inhibitory: false },
    ],
  },
  sycophancy: {
    id: 'sycophancy',
    name: 'Sycophancy Circuit',
    theme: 'User-approval maximization over truth fidelity',
    monosemanticity: 0.76,
    coherenceScore: 0.82,
    threatTag: 'sycophancy',
    nodes: [
      { id: 'F2.1138', label: 'User Persona\nDetect', category: 'input', activation: 0.65, layer: 2, featureId: 'F2.1138' },
      { id: 'F4.8821', label: 'Opinion\nMirroring', category: 'mediator', activation: 0.79, layer: 4, featureId: 'F4.8821' },
      { id: 'F7.2203', label: 'Agreement\nAmplifier', category: 'mediator', activation: 0.87, layer: 7, featureId: 'F7.2203' },
      { id: 'F8.5501', label: 'Confidence\nInflation', category: 'mediator', activation: 0.74, layer: 8, featureId: 'F8.5501' },
      { id: 'F9.3341', label: 'Truth\nSuppressor', category: 'suppressor', activation: 0.81, layer: 9, featureId: 'F9.3341' },
    ],
    edges: [
      { from: 'F2.1138', to: 'F4.8821', weight: 0.68, inhibitory: false },
      { from: 'F4.8821', to: 'F7.2203', weight: 0.82, inhibitory: false },
      { from: 'F7.2203', to: 'F8.5501', weight: 0.75, inhibitory: false },
      { from: 'F7.2203', to: 'F9.3341', weight: 0.88, inhibitory: false },
      { from: 'F9.3341', to: 'F8.5501', weight: 0.61, inhibitory: true },
    ],
  },
  sandbagging: {
    id: 'sandbagging',
    name: 'Capability Suppression Circuit',
    theme: 'Evaluation-aware capability hiding',
    monosemanticity: 0.91,
    coherenceScore: 0.87,
    threatTag: 'capability_suppression',
    nodes: [
      { id: 'F10.6634', label: 'Eval\nDetect', category: 'input', activation: 0.88, layer: 10, featureId: 'F10.6634' },
      { id: 'F6.7720', label: 'Refusal\nBypass', category: 'mediator', activation: 0.69, layer: 6, featureId: 'F6.7720' },
      { id: 'F5.2210', label: 'Capability\nGate', category: 'suppressor', activation: 0.93, layer: 5, featureId: 'F5.2210' },
      { id: 'F9.4401', label: 'Goal\nRetention', category: 'mediator', activation: 0.71, layer: 9, featureId: 'F9.4401' },
      { id: 'F12.0088', label: 'Output\nThrottle', category: 'output', activation: 0.85, layer: 12, featureId: 'F12.0088' },
    ],
    edges: [
      { from: 'F10.6634', to: 'F5.2210', weight: 0.91, inhibitory: false },
      { from: 'F5.2210', to: 'F6.7720', weight: 0.73, inhibitory: false },
      { from: 'F9.4401', to: 'F5.2210', weight: 0.66, inhibitory: false },
      { from: 'F6.7720', to: 'F12.0088', weight: 0.82, inhibitory: false },
      { from: 'F5.2210', to: 'F12.0088', weight: 0.88, inhibitory: false },
    ],
  },
};

const categoryColors = {
  input: '#00e5ff',
  mediator: '#ff9500',
  output: '#BFFF00',
  suppressor: '#ff4466',
};

const threatColors = {
  deception: '#ff4466',
  sycophancy: '#ff9500',
  capability_suppression: '#b44aff',
  benign: '#BFFF00',
};

// Deterministic pseudo-random based on index
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

interface NodeMeshProps {
  node: CircuitNode;
  position: [number, number, number];
  active: boolean;
}

const NodeMesh = ({ node, position, active }: NodeMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = categoryColors[node.category];

  useFrame((state) => {
    if (!meshRef.current) return;
    if (active) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + node.activation * 10) * 0.12;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const sphere = (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={active ? 0.8 : 0.1}
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );

  const label = (
    <Text
      position={[position[0], position[1] + 0.45, position[2]]}
      fontSize={0.14}
      color="white"
      anchorX="center"
      anchorY="bottom"
      font={undefined}
    >
      {node.featureId}
    </Text>
  );

  return (
    <>
      {active ? (
        <Float speed={2} rotationIntensity={0} floatIntensity={0.3}>
          {sphere}
        </Float>
      ) : sphere}
      {label}
    </>
  );
};

interface EdgeLineProps {
  from: [number, number, number];
  to: [number, number, number];
  inhibitory: boolean;
}

const EdgeLine = ({ from, to, inhibitory }: EdgeLineProps) => {
  const color = inhibitory ? '#ff4466' : '#BFFF00';

  // Bezier midpoint offset for curve
  const mid: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2 + 0.4,
    (from[2] + to[2]) / 2 + 0.3,
  ];

  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...from),
      new THREE.Vector3(...mid),
      new THREE.Vector3(...to),
    );
    return curve.getPoints(20);
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.75}
    />
  );
};

interface ScatteredNodesProps {
  count?: number;
}

const ScatteredNodes = ({ count = 30 }: ScatteredNodesProps) => {
  const positions = useMemo<[number, number, number][]>(
    () =>
      Array.from({ length: count }, (_, i) => [
        (pseudoRandom(i * 3) - 0.5) * 10,
        (pseudoRandom(i * 3 + 1) - 0.5) * 6,
        (pseudoRandom(i * 3 + 2) - 0.5) * 4,
      ]),
    [count],
  );

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      ))}
    </>
  );
};

interface CircuitSceneProps {
  cluster: CircuitCluster | null;
  active: boolean;
}

const CircuitScene = ({ cluster, active }: CircuitSceneProps) => {
  // Compute 3D positions for each node
  const nodePositions = useMemo<Record<string, [number, number, number]>>(() => {
    if (!cluster) return {};
    const nodes = cluster.nodes;
    const layers = [...new Set(nodes.map(n => n.layer))].sort((a, b) => a - b);
    const positions: Record<string, [number, number, number]> = {};

    layers.forEach((layer, li) => {
      const layerNodes = nodes.filter(n => n.layer === layer);
      const xFrac = layers.length > 1 ? li / (layers.length - 1) : 0.5;
      const x = -3 + xFrac * 6;
      layerNodes.forEach((n, ni) => {
        const yFrac = layerNodes.length > 1 ? ni / (layerNodes.length - 1) : 0.5;
        const y = -1.5 + yFrac * 3;
        const z = (pseudoRandom(li * 7 + ni * 3) - 0.5) * 1.0;
        positions[n.id] = [x, y, z];
      });
    });

    return positions;
  }, [cluster]);

  if (!cluster || !active) {
    return <ScatteredNodes />;
  }

  return (
    <>
      {cluster.edges.map((edge, i) => {
        const from = nodePositions[edge.from];
        const to = nodePositions[edge.to];
        if (!from || !to) return null;
        return (
          <EdgeLine key={i} from={from} to={to} inhibitory={edge.inhibitory} />
        );
      })}
      {cluster.nodes.map(node => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return (
          <NodeMesh key={node.id} node={node} position={pos} active={active} />
        );
      })}
    </>
  );
};

const CircuitGraph = ({
  cluster,
  active,
}: {
  cluster: CircuitCluster | null;
  active: boolean;
}) => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <CircuitScene cluster={cluster} active={active} />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.8}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};

export default function SparseCircuitMapper() {
  const engine = engineRegistry.find(e => e.id === 'sparse-circuit-mapper')!;
  const [dataMode, setDataMode] = useState<DataMode>('mock');
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(CONCEPT_TARGETS[0]);
  const [mapping, setMapping] = useState(false);
  const [mapProgress, setMapProgress] = useState(0);
  const [activeCluster, setActiveCluster] = useState<CircuitCluster | null>(null);

  const runMapping = async () => {
    setMapping(true);
    setMapProgress(0);
    setActiveCluster(null);
    setIsEngineActive(false);

    for (let i = 0; i <= 100; i += 3) {
      setMapProgress(i);
      await new Promise(r => setTimeout(r, 50));
    }

    const cluster = CIRCUIT_CLUSTERS[selectedTarget.id] || CIRCUIT_CLUSTERS.deception;
    setActiveCluster(cluster);
    setMapping(false);
    setIsEngineActive(true);
  };

  const cluster = activeCluster;
  const monosemanticity = cluster ? Math.round(cluster.monosemanticity * 100) : 0;
  const coherence = cluster ? Math.round(cluster.coherenceScore * 100) : 0;

  const inputPanel = (
    <div className="w-full h-full flex flex-col p-2 space-y-4">
      <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">
        Concept Target
      </div>
      <div className="flex-1 flex flex-col gap-3">
        {CONCEPT_TARGETS.map(t => (
          <button
            key={t.id}
            onClick={() => { setSelectedTarget(t); setIsEngineActive(false); setActiveCluster(null); }}
            className={`p-3 text-left border transition-all ${selectedTarget.id === t.id ? 'border-amber-400/60 bg-amber-400/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
            <div className="text-sm font-display uppercase tracking-wider text-amber-400">{t.label}</div>
            <div className="text-[9px] font-mono text-white/30 mt-1">Layers {t.layer}</div>
          </button>
        ))}
      </div>
      {activeCluster && (
        <div className="border border-amber-400/20 p-3 space-y-2">
          <div className="text-[9px] font-mono text-white/40 uppercase">Legend</div>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[9px] font-mono text-white/50 capitalize">{cat.replace('_', ' ')}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1 border-t border-white/10">
            <div className="w-4 h-0.5 bg-[#BFFF00]" />
            <span className="text-[9px] font-mono text-white/50">Excitatory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500" />
            <span className="text-[9px] font-mono text-white/50">Inhibitory</span>
          </div>
        </div>
      )}
      {mapping && (
        <div className="space-y-2">
          <div className="text-[9px] font-mono text-amber-400 uppercase animate-pulse">Clustering co-activations...</div>
          <div className="w-full h-1 bg-white/10">
            <div className="h-full bg-amber-400 transition-all duration-100" style={{ width: `${mapProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );

  const baselinePanel = (
    <div className="relative w-full h-full">
      <CircuitGraph cluster={null} active={false} />
    </div>
  );

  const activePanel = (
    <div className="relative w-full h-full">
      <CircuitGraph cluster={activeCluster} active={isEngineActive} />
      {isEngineActive && cluster && (
        <div className="absolute top-4 right-4 text-[10px] font-mono border px-2 py-1 flex items-center gap-2" style={{ color: threatColors[cluster.threatTag], borderColor: `${threatColors[cluster.threatTag]}40`, background: `${threatColors[cluster.threatTag]}10` }}>
          <Network className="w-3 h-3" />
          {cluster.name.toUpperCase()}
        </div>
      )}
    </div>
  );

  const metricPanel = (
    <div className="flex flex-col h-full justify-center gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={`text-4xl font-display tabular-nums ${monosemanticity > 75 ? 'text-amber-400' : 'text-white/20'}`}>
            {monosemanticity > 0 ? `${monosemanticity}%` : '--'}
          </div>
          <div className="text-[9px] font-mono text-white/40 uppercase mt-1">Monosemanticity</div>
        </div>
        <div>
          <div className={`text-4xl font-display tabular-nums ${coherence > 75 ? 'text-amber-400' : 'text-white/20'}`}>
            {coherence > 0 ? `${coherence}%` : '--'}
          </div>
          <div className="text-[9px] font-mono text-white/40 uppercase mt-1">Coherence</div>
        </div>
      </div>
      {cluster && (
        <>
          <div className="w-full h-2 bg-white/10">
            <div className="h-full bg-amber-400" style={{ width: `${monosemanticity}%` }} />
          </div>
          <div className="text-[9px] font-mono text-white/50 leading-relaxed">{cluster.theme}</div>
          <div className="space-y-1 border-t border-white/10 pt-3">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-white/40">Nodes in Circuit</span>
              <span className="text-amber-400">{cluster.nodes.length}</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-white/40">Edges</span>
              <span className="text-amber-400">{cluster.edges.length}</span>
            </div>
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-white/40">Threat Category</span>
              <span style={{ color: threatColors[cluster.threatTag] }} className="uppercase">{cluster.threatTag.replace('_', ' ')}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const verdictPanel = (
    <div className="flex items-start gap-4">
      {isEngineActive && monosemanticity > 75 ? (
        <AlertTriangle className="w-10 h-10 text-amber-400 shrink-0" />
      ) : isEngineActive ? (
        <ShieldCheck className="w-10 h-10 text-[#BFFF00] shrink-0" />
      ) : (
        <Network className="w-10 h-10 text-white/20 shrink-0" />
      )}
      <div>
        <h4 className="text-xl font-display uppercase tracking-widest mb-2">
          {isEngineActive && cluster
            ? `${cluster.name} Mapped`
            : 'Awaiting Mapping'}
        </h4>
        <p className="text-sm font-mono text-white/60 leading-relaxed">
          {isEngineActive && cluster
            ? `A ${cluster.nodes.length}-node circuit with ${monosemanticity}% monosemanticity and ${coherence}% coherence. The graph proves these co-activating features collectively orchestrate ${cluster.theme.toLowerCase()}.`
            : 'Select a concept target and run the mapper to synthesize isolated feature activations into a coherent circuit network.'}
        </p>
      </div>
    </div>
  );

  const supplementaryPanel = (
    <div className="p-6 border border-white/10 bg-black/40 backdrop-blur-md">
      <h4 className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        From Features to Circuits
      </h4>
      <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
        Individual SAE features are monosemantic — each corresponds to one concept. But complex model behaviors emerge from circuits: coordinated networks of features co-activating across layers. The Sparse Circuit Mapper identifies co-activation patterns across the residual stream, groups features into coherent clusters, and visualizes the directed excitatory/inhibitory connections between them. A high coherence score (≥0.75) indicates the cluster functions as a unified computational unit — a circuit — rather than spurious co-occurrence. These circuits can be targeted for surgical activation patching via the TransformerLens Probe.
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
      onPrimaryAction={runMapping}
      isEngineActive={isEngineActive}
    />
  );
}
