import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRecovery } from '../../context/RecoveryContext';
import { RECOVERY_ZONES } from '../../data/mockProfile';
import { RecoveryZone, RecoveryZoneId } from '../../types';
import { Sparkles, Eye, Info, RotateCcw, ShieldAlert, CheckCircle2 } from 'lucide-react';

// Hotspot 3D Marker Component
const HotspotMarker: React.FC<{
  zone: RecoveryZone;
  isSelected: boolean;
  onSelect: (id: RecoveryZoneId) => void;
}> = ({ zone, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      const scale = isSelected ? 1.25 + Math.sin(t * 4) * 0.15 : hovered ? 1.2 : 1 + Math.sin(t * 2 + zone.position3D[1]) * 0.08;
      meshRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      const ringScale = 1.1 + Math.sin(t * 3) * 0.2;
      ringRef.current.scale.set(ringScale, ringScale, 1);
    }
  });

  const baseColor = zone.color;
  const pulseColor = isSelected ? '#DC2626' : hovered ? '#D97757' : baseColor;

  return (
    <group position={zone.position3D}>
      {/* Outer pulsating beacon ring */}
      <mesh ref={ringRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.16, 0.22, 32]} />
        <meshBasicMaterial
          color={pulseColor}
          transparent
          opacity={isSelected ? 0.8 : hovered ? 0.6 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive Core Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(zone.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color={pulseColor}
          emissive={pulseColor}
          emissiveIntensity={isSelected ? 0.9 : hovered ? 0.6 : 0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Floating 3D HTML Badge on Hover or Selection */}
      {(hovered || isSelected) && (
        <Html distanceFactor={6} position={[0.25, 0.1, 0]}>
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg whitespace-nowrap border border-white/20 flex items-center gap-1.5 pointer-events-none animate-fade-in">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
            {zone.name}
            {isSelected && <span className="bg-terracotta-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">Active</span>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Sleek Stylized Anatomical Human Torso Mesh
const StylizedTorsoMesh: React.FC<{ selectedZone: RecoveryZoneId | null }> = ({ selectedZone }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle subtle breathing motion
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.2) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={selectedZone === 'head' ? '#E1ECE6' : '#E8ECE9'}
          roughness={0.35}
          metalness={0.15}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.14, 0.17, 0.35, 24]} />
        <meshStandardMaterial color="#E8ECE9" roughness={0.4} metalness={0.1} transparent opacity={0.9} />
      </mesh>

      {/* Upper Chest / Breasts */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.42, 0.38, 0.5, 32]} />
        <meshStandardMaterial
          color={selectedZone === 'chest' ? '#FCEBE6' : '#ECEFEA'}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Left Breast Contouring */}
      <mesh position={[-0.17, 0.68, 0.22]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={selectedZone === 'chest' ? '#F5D7CC' : '#E2E6E2'} roughness={0.3} transparent opacity={0.9} />
      </mesh>
      {/* Right Breast Contouring */}
      <mesh position={[0.17, 0.68, 0.22]}>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color={selectedZone === 'chest' ? '#F5D7CC' : '#E2E6E2'} roughness={0.3} transparent opacity={0.9} />
      </mesh>

      {/* Abdomen & C-Section Region */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.36, 0.38, 0.65, 32]} />
        <meshStandardMaterial
          color={selectedZone === 'abdomen' ? '#F9E8E1' : '#ECEFEA'}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* C-Section Incision Indicator Line (Pfannenstiel scar marker) */}
      <mesh position={[0, -0.05, 0.34]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.32, 0.02, 0.04]} />
        <meshStandardMaterial
          color={selectedZone === 'abdomen' ? '#D97757' : '#C4D9CF'}
          emissive={selectedZone === 'abdomen' ? '#D97757' : '#7A9A8B'}
          emissiveIntensity={selectedZone === 'abdomen' ? 0.6 : 0.2}
          roughness={0.2}
        />
      </mesh>

      {/* Pelvis & Lower Abdomen */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.38, 0.28, 0.6, 32]} />
        <meshStandardMaterial
          color={selectedZone === 'pelvic' ? '#E1ECE6' : '#ECEFEA'}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Hips & Thigh Bases */}
      <mesh position={[-0.2, -0.95, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.45, 24]} />
        <meshStandardMaterial color="#E8ECE9" roughness={0.4} transparent opacity={0.88} />
      </mesh>
      <mesh position={[0.2, -0.95, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.45, 24]} />
        <meshStandardMaterial color="#E8ECE9" roughness={0.4} transparent opacity={0.88} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.55, 0.85, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.13, 0.11, 0.4, 24]} />
        <meshStandardMaterial color="#E8ECE9" roughness={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.55, 0.85, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.13, 0.11, 0.4, 24]} />
        <meshStandardMaterial color="#E8ECE9" roughness={0.4} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};

// Fallback 2.5D SVG Interactive Anatomical Diagram
const Fallback2DBodyMap: React.FC<{
  selectedZone: RecoveryZoneId | null;
  onSelect: (id: RecoveryZoneId) => void;
}> = ({ selectedZone, onSelect }) => {
  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center bg-gradient-to-b from-cream-100 to-cream-200 rounded-3xl p-6">
      <svg
        viewBox="0 0 300 480"
        className="w-full max-w-[280px] h-auto drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Silhouette Torso */}
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2ECE6" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head */}
        <path
          d="M 120 70 C 120 40, 180 40, 180 70 C 180 95, 170 110, 150 110 C 130 110, 120 95, 120 70 Z"
          fill="url(#bodyGrad)"
          stroke="#7A9A8B"
          strokeWidth="2"
        />

        {/* Neck */}
        <path d="M 140 108 L 140 125 L 160 125 L 160 108 Z" fill="#E2ECE6" />

        {/* Shoulders & Torso */}
        <path
          d="M 150 125 
             C 195 125, 230 145, 220 190 
             L 205 260 
             C 210 320, 215 360, 195 420 
             L 165 420 
             L 160 380 
             L 140 380 
             L 135 420 
             L 105 420 
             C 85 360, 90 320, 95 260 
             L 80 190 
             C 70 145, 105 125, 150 125 Z"
          fill="url(#bodyGrad)"
          stroke="#7A9A8B"
          strokeWidth="2"
        />

        {/* C-Section Scar Mark */}
        <line
          x1="125"
          y1="305"
          x2="175"
          y2="305"
          stroke={selectedZone === 'abdomen' ? '#D97757' : '#8FB0A0'}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={selectedZone === 'abdomen' ? 'none' : '4 2'}
        />

        {/* Hotspot 1: Head & Neck */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelect('head')}
        >
          <circle
            cx="150"
            cy="75"
            r={selectedZone === 'head' ? '18' : '14'}
            fill={selectedZone === 'head' ? '#D97757' : '#7A9A8B'}
            className="animate-pulse"
            opacity="0.85"
            filter="url(#glowFilter)"
          />
          <circle cx="150" cy="75" r="7" fill="#FFFFFF" />
        </g>

        {/* Hotspot 2: Chest & Breasts */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelect('chest')}
        >
          <circle
            cx="150"
            cy="175"
            r={selectedZone === 'chest' ? '18' : '14'}
            fill={selectedZone === 'chest' ? '#D97757' : '#7A9A8B'}
            className="animate-pulse"
            opacity="0.85"
            filter="url(#glowFilter)"
          />
          <circle cx="150" cy="175" r="7" fill="#FFFFFF" />
        </g>

        {/* Hotspot 3: Abdomen & Incision */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelect('abdomen')}
        >
          <circle
            cx="150"
            cy="275"
            r={selectedZone === 'abdomen' ? '20' : '16'}
            fill="#D97757"
            className="animate-pulse"
            opacity="0.9"
            filter="url(#glowFilter)"
          />
          <circle cx="150" cy="275" r="7" fill="#FFFFFF" />
        </g>

        {/* Hotspot 4: Pelvic & Perineal */}
        <g
          className="cursor-pointer transition-all duration-200"
          onClick={() => onSelect('pelvic')}
        >
          <circle
            cx="150"
            cy="360"
            r={selectedZone === 'pelvic' ? '18' : '14'}
            fill={selectedZone === 'pelvic' ? '#D97757' : '#7A9A8B'}
            className="animate-pulse"
            opacity="0.85"
            filter="url(#glowFilter)"
          />
          <circle cx="150" cy="360" r="7" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};

export const RecoveryCanvas3D: React.FC = () => {
  const { selectedZoneId, setSelectedZoneId } = useRecovery();
  const [useWebGL, setUseWebGL] = useState<boolean>(true);
  const [webGLError, setWebGLError] = useState<boolean>(false);
  const controlsRef = useRef<any>(null);

  // Check WebGL availability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setUseWebGL(false);
      }
    } catch {
      setUseWebGL(false);
    }
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[520px] lg:h-[600px] bg-gradient-to-b from-[#FDFBF7] via-[#F4EFE6]/60 to-[#FDFBF7] rounded-3xl border border-sage-200/60 shadow-card overflow-hidden flex flex-col">
      {/* 3D Viewport Controls & Badges */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-sage-800 shadow-sm border border-sage-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Interactive 3D Anatomical Map
          </span>

          <button
            onClick={() => setUseWebGL(!useWebGL)}
            className="bg-white/80 hover:bg-white text-slate-700 px-3 py-1.5 rounded-full text-xs font-medium border border-sage-200 shadow-sm transition-all flex items-center gap-1"
            title="Toggle between 3D WebGL and 2.5D Schematic View"
          >
            <Eye className="w-3.5 h-3.5 text-sage-600" />
            {useWebGL ? 'Switch to 2D' : 'Switch to 3D'}
          </button>
        </div>

        {useWebGL && (
          <button
            onClick={handleResetCamera}
            className="pointer-events-auto bg-white/80 hover:bg-white text-slate-700 p-2 rounded-full text-xs border border-sage-200 shadow-sm transition-all flex items-center justify-center"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sage-700" />
          </button>
        )}
      </div>

      {/* Main Viewport */}
      <div className="flex-1 w-full h-full relative">
        {useWebGL && !webGLError ? (
          <Canvas
            camera={{ position: [0, 0.4, 3.8], fov: 45 }}
            onError={() => {
              setWebGLError(true);
              setUseWebGL(false);
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 8, 5]} intensity={1.1} />
            <directionalLight position={[-5, -2, -5]} intensity={0.4} color="#C4D9CF" />
            <pointLight position={[0, 0, 2]} intensity={0.5} color="#D97757" />

            <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
              <StylizedTorsoMesh selectedZone={selectedZoneId} />
              {RECOVERY_ZONES.map((zone) => (
                <HotspotMarker
                  key={zone.id}
                  zone={zone}
                  isSelected={selectedZoneId === zone.id}
                  onSelect={(id) => setSelectedZoneId(id)}
                />
              ))}
            </Float>

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              minDistance={2.4}
              maxDistance={5.2}
              maxPolarAngle={Math.PI / 1.7}
              minPolarAngle={Math.PI / 3.2}
              dampingFactor={0.06}
            />
          </Canvas>
        ) : (
          <Fallback2DBodyMap
            selectedZone={selectedZoneId}
            onSelect={(id) => setSelectedZoneId(id)}
          />
        )}
      </div>

      {/* Floating Bottom Zone Quick-Selector Pills */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-2">
        {RECOVERY_ZONES.map((zone) => {
          const isSelected = selectedZoneId === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm border ${
                isSelected
                  ? 'bg-sage-600 text-white border-sage-700 ring-2 ring-sage-400/40 shadow-glow-sage scale-105'
                  : 'bg-white/90 hover:bg-white text-slate-700 border-sage-200'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              {zone.name.split(' ')[0]} & {zone.name.split(' ')[2] || 'Zone'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
