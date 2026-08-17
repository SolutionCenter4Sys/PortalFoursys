"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";

import type { VoiceOrbState } from "@/lib/voice/types";
import { useBlotMaterial } from "@/components/orb3d/liquid/BlotMaterial";

type Fluid = {
  turbulence: number;
  stretch: number;
  spin: number;
  colorA: string;
  colorB: string;
  colorC: string;
};

const FLUID: Record<VoiceOrbState, Fluid> = {
  idle: {
    turbulence: 0.55,
    stretch: 1.08,
    spin: 0.1,
    colorA: "#FF5315",
    colorB: "#5EC8FF",
    colorC: "#89BAB1",
  },
  standby: {
    turbulence: 0.65,
    stretch: 1.12,
    spin: 0.14,
    colorA: "#89BAB1",
    colorB: "#5EC8FF",
    colorC: "#9B6BFF",
  },
  armed: {
    turbulence: 0.78,
    stretch: 1.16,
    spin: 0.22,
    colorA: "#FF5315",
    colorB: "#ff7848",
    colorC: "#9B6BFF",
  },
  listening: {
    turbulence: 0.9,
    stretch: 1.22,
    spin: 0.3,
    colorA: "#5EC8FF",
    colorB: "#9B6BFF",
    colorC: "#FF5315",
  },
  processing: {
    turbulence: 0.98,
    stretch: 1.18,
    spin: 0.55,
    colorA: "#FFE2A9",
    colorB: "#9B6BFF",
    colorC: "#5EC8FF",
  },
  speaking: {
    turbulence: 0.95,
    stretch: 1.28,
    spin: 0.36,
    colorA: "#FF5315",
    colorB: "#5EC8FF",
    colorC: "#9B6BFF",
  },
  interrupted: {
    turbulence: 1.15,
    stretch: 1.35,
    spin: 0.7,
    colorA: "#FFE2A9",
    colorB: "#FF5315",
    colorC: "#9B6BFF",
  },
  error: {
    turbulence: 0.45,
    stretch: 0.98,
    spin: 0.06,
    colorA: "#e63946",
    colorB: "#9B6BFF",
    colorC: "#FFE2A9",
  },
};

function damp(a: number, b: number, lambda: number, dt: number) {
  return a + (b - a) * (1 - Math.exp(-lambda * dt));
}

type Props = {
  state: VoiceOrbState;
  audioLevel?: number;
};

export function LiquidOrbScene({ state, audioLevel = 0 }: Props) {
  const group = useRef<Group>(null);
  const volume = useRef<Mesh>(null);
  const mat = useBlotMaterial();
  const inv = useMemo(() => new THREE.Matrix4(), []);
  const camLocal = useMemo(() => new THREE.Vector3(), []);
  const levelRef = useRef(audioLevel);
  levelRef.current = audioLevel;
  const stateRef = useRef(state);
  stateRef.current = state;

  const cur = useRef({ turbulence: 0.95, stretch: 1.2, spin: 0.22 });
  const cA = useMemo(() => new THREE.Color(), []);
  const cB = useMemo(() => new THREE.Color(), []);
  const cC = useMemo(() => new THREE.Color(), []);

  useFrame((stateThree, dt) => {
    const t = stateThree.clock.elapsedTime;
    const target = FLUID[stateRef.current];
    const c = cur.current;
    const k = 2.8;
    c.turbulence = damp(c.turbulence, target.turbulence, k, dt);
    c.stretch = damp(c.stretch, target.stretch, k, dt);
    c.spin = damp(c.spin, target.spin, k, dt);

    cA.set(target.colorA);
    cB.set(target.colorB);
    cC.set(target.colorC);
    mat.uColorA.lerp(cA, 1 - Math.exp(-k * dt));
    mat.uColorB.lerp(cB, 1 - Math.exp(-k * dt));
    mat.uColorC.lerp(cC, 1 - Math.exp(-k * dt));

    const lvl = Math.min(1, Math.max(0, levelRef.current));
    const speaking = stateRef.current === "speaking";

    mat.uTime = t;
    mat.uTurbulence = c.turbulence + (speaking ? lvl * 0.25 : 0);
    mat.uStretch = c.stretch + (speaking ? lvl * 0.08 : 0);
    mat.uAudio = speaking || stateRef.current === "listening" ? lvl : lvl * 0.2;

    if (volume.current) {
      volume.current.updateWorldMatrix(true, false);
      inv.copy(volume.current.matrixWorld).invert();
      camLocal.copy(stateThree.camera.position).applyMatrix4(inv);
      mat.uCamLocal.copy(camLocal);
    }

    if (group.current) {
      group.current.rotation.y = t * c.spin * 0.25;
      const breathe = 1 + Math.sin(t * 1.4) * 0.03 + lvl * 0.06;
      group.current.scale.setScalar(breathe);
    }
  });

  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.35}>
      <group ref={group}>
        <mesh ref={volume} scale={1.15}>
          <boxGeometry args={[4.0, 4.0, 4.0]} />
          <primitive
            object={mat}
            attach="material"
            transparent
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
        <pointLight color="#5EC8FF" intensity={0.55} distance={5} />
        <pointLight
          color="#FF5315"
          intensity={0.4}
          distance={4}
          position={[1, 0.5, 1]}
        />
      </group>
    </Float>
  );
}
