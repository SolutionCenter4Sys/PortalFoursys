"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";

import type { VoiceOrbState } from "@/lib/voice/types";
import { damp, lerp3, ORB_LOOK, type OrbLook } from "@/components/orb3d/orbLook";
import { usePlasmaMaterial } from "@/components/orb3d/PlasmaMaterial";

type Props = {
  state: VoiceOrbState;
  audioLevel?: number;
  /** hero = showcase (mais partículas/bloom); app = runtime leve */
  quality?: "hero" | "app";
};

function emptyLook(): OrbLook {
  return { ...ORB_LOOK.idle, core: [...ORB_LOOK.idle.core], glow: [...ORB_LOOK.idle.glow], rim: [...ORB_LOOK.idle.rim], ring: [...ORB_LOOK.idle.ring] };
}

/** Partículas em órbita — densidade reage a speaking/audio */
function OrbitParticles({
  count,
  color,
  energy,
}: {
  count: number;
  color: THREE.Color;
  energy: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds, radii } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.35 + Math.random() * 1.1;
      const th = Math.random() * Math.PI * 2;
      const ph = (Math.random() - 0.5) * 1.1;
      positions[i * 3] = Math.cos(th) * r;
      positions[i * 3 + 1] = Math.sin(ph) * r * 0.55;
      positions[i * 3 + 2] = Math.sin(th) * r;
      speeds[i] = 0.35 + Math.random() * 1.1;
      radii[i] = r;
    }
    return { positions, speeds, radii };
  }, [count]);

  const energyRef = useRef(energy);
  energyRef.current = energy;
  const colorRef = useRef(color);
  colorRef.current = color;

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const e = energyRef.current;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      let x = arr[ix];
      let z = arr[ix + 2];
      const y = arr[ix + 1];
      const ang = speeds[i] * dt * (0.55 + e * 1.8);
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);
      arr[ix] = x * cos - z * sin;
      arr[ix + 2] = x * sin + z * cos;
      arr[ix + 1] = y + Math.sin(performance.now() * 0.002 * speeds[i] + i) * 0.002 * (1 + e);
      // mantém raio aproximado
      const r = Math.hypot(arr[ix], arr[ix + 2]);
      const target = radii[i] * (1 + e * 0.08);
      if (r > 0.01) {
        arr[ix] *= target / r;
        arr[ix + 2] *= target / r;
      }
    }
    attr.needsUpdate = true;
    const mat = pts.material as THREE.PointsMaterial;
    mat.color.copy(colorRef.current);
    mat.size = 0.028 + e * 0.03;
    mat.opacity = 0.4 + e * 0.35;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Cena profissional do orb Jarvis — shader plasma, lerp de estados,
 * anéis, casca de vidro e partículas orbitais.
 */
export function OrbScene({ state, audioLevel = 0, quality = "app" }: Props) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);
  const ringC = useRef<Mesh>(null);
  const glowLight = useRef<THREE.PointLight>(null);
  const accentLight = useRef<THREE.PointLight>(null);

  const plasma = usePlasmaMaterial();
  const current = useRef<OrbLook>(emptyLook());
  const levelRef = useRef(audioLevel);
  levelRef.current = audioLevel;
  const stateRef = useRef(state);
  stateRef.current = state;

  const particleCount = quality === "hero" ? 140 : 64;
  const ringColor = useMemo(() => new THREE.Color(), []);
  const glowColor = useMemo(() => new THREE.Color(), []);

  useFrame((stateClock, dt) => {
    const t = stateClock.clock.elapsedTime;
    const target = ORB_LOOK[stateRef.current];
    const c = current.current;
    const k = 4.2; // damping

    c.core = lerp3(c.core, target.core, 1 - Math.exp(-k * dt));
    c.glow = lerp3(c.glow, target.glow, 1 - Math.exp(-k * dt));
    c.rim = lerp3(c.rim, target.rim, 1 - Math.exp(-k * dt));
    c.ring = lerp3(c.ring, target.ring, 1 - Math.exp(-k * dt));
    c.intensity = damp(c.intensity, target.intensity, k, dt);
    c.noise = damp(c.noise, target.noise, k, dt);
    c.fresnel = damp(c.fresnel, target.fresnel, k, dt);
    c.spin = damp(c.spin, target.spin, k, dt);
    c.breath = damp(c.breath, target.breath, k, dt);
    c.scale = damp(c.scale, target.scale, k, dt);
    c.bloom = damp(c.bloom, target.bloom, k, dt);
    c.particles = damp(c.particles, target.particles, k, dt);

    const lvl = Math.min(1, Math.max(0, levelRef.current));
    const speaking = stateRef.current === "speaking";
    const pulse =
      c.scale *
      (1 + c.breath * Math.sin(t * (speaking ? 7.5 : 2.1))) *
      (1 + (speaking ? lvl * 0.32 : lvl * 0.06));

    if (group.current) {
      group.current.scale.setScalar(pulse);
      if (stateRef.current === "error") {
        group.current.position.x = Math.sin(t * 26) * 0.035;
      } else {
        group.current.position.x = damp(group.current.position.x, 0, 8, dt);
      }
    }

    plasma.uTime = t;
    plasma.uCore.setRGB(c.core[0], c.core[1], c.core[2]);
    plasma.uGlow.setRGB(c.glow[0], c.glow[1], c.glow[2]);
    plasma.uRim.setRGB(c.rim[0], c.rim[1], c.rim[2]);
    plasma.uIntensity = Math.min(1.35, c.intensity * 0.75 + (speaking ? lvl * 0.35 : 0));
    plasma.uNoise = c.noise;
    plasma.uFresnel = c.fresnel;
    plasma.uAudio = speaking ? lvl : lvl * 0.15;

    glowColor.setRGB(c.glow[0], c.glow[1], c.glow[2]);
    ringColor.setRGB(c.ring[0], c.ring[1], c.ring[2]);

    if (core.current) {
      core.current.rotation.y = t * c.spin * 0.45;
      core.current.rotation.z = t * c.spin * 0.18;
    }
    if (shell.current) {
      const mat = shell.current.material as THREE.MeshPhysicalMaterial;
      mat.color.copy(glowColor);
      mat.emissive.copy(glowColor);
      mat.emissiveIntensity = 0.05 + c.intensity * 0.04 + lvl * 0.06;
      mat.opacity = 0.08 + c.fresnel * 0.02;
    }
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.35;
      ringA.current.rotation.z = t * c.spin;
      const mat = ringA.current.material as THREE.MeshStandardMaterial;
      mat.color.copy(ringColor);
      mat.emissive.copy(ringColor);
      mat.emissiveIntensity = 0.35 + lvl * 0.35;
    }
    if (ringB.current) {
      ringB.current.rotation.y = Math.PI / 3.1;
      ringB.current.rotation.x = t * -c.spin * 0.9;
      const mat = ringB.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.25 + c.particles * 0.2;
    }
    if (ringC.current) {
      ringC.current.rotation.x = Math.PI / 5;
      ringC.current.rotation.y = t * c.spin * 0.55;
      ringC.current.rotation.z = Math.PI / 7;
    }
    if (glowLight.current) {
      glowLight.current.color.copy(glowColor);
      // luz contida — bloom alto lavava a esfera
      glowLight.current.intensity = 0.55 + c.intensity * 0.45 + lvl * 0.7;
    }
    if (accentLight.current) {
      accentLight.current.intensity =
        0.25 + (speaking || stateRef.current === "listening" ? 0.45 + lvl * 0.35 : 0.1);
    }

    // bloom hint (reservado p/ postFX futuro / debug)
    stateClock.scene.userData.orbBloom = c.bloom + (speaking ? lvl * 0.6 : 0);
    stateClock.scene.userData.orbParticles = c.particles;
  });

  return (
    <Float
      speed={state === "idle" ? 0.9 : 1.35}
      rotationIntensity={0.06}
      floatIntensity={
        state === "listening" || state === "speaking" ? 0.18 : 0.1
      }
    >
      <group ref={group}>
        {/* núcleo plasma */}
        <mesh ref={core}>
          <icosahedronGeometry args={[1, quality === "hero" ? 64 : 32]} />
          <primitive object={plasma} attach="material" />
        </mesh>

        {/* casca de vidro — leve, não cobre o plasma */}
        <mesh ref={shell} scale={1.08}>
          <sphereGeometry args={[1, quality === "hero" ? 64 : 32, quality === "hero" ? 64 : 32]} />
          <meshPhysicalMaterial
            color="#89BAB1"
            emissive="#FF5315"
            emissiveIntensity={0.05}
            transparent
            opacity={0.1}
            roughness={0.12}
            metalness={0.2}
            transmission={0.35}
            thickness={0.4}
            ior={1.35}
            depthWrite={false}
          />
        </mesh>

        {/* anéis — emissive moderado */}
        <mesh ref={ringA} scale={1.42}>
          <torusGeometry args={[1, 0.022, 16, 96]} />
          <meshStandardMaterial
            color="#FF5315"
            emissive="#FF5315"
            emissiveIntensity={0.35}
            transparent
            opacity={0.95}
            roughness={0.35}
            metalness={0.55}
          />
        </mesh>
        <mesh ref={ringB} scale={1.68}>
          <torusGeometry args={[1, 0.014, 12, 96]} />
          <meshStandardMaterial
            color="#89BAB1"
            emissive="#89BAB1"
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
            roughness={0.4}
            metalness={0.45}
          />
        </mesh>
        <mesh ref={ringC} scale={1.92}>
          <torusGeometry args={[1, 0.007, 8, 80]} />
          <meshStandardMaterial
            color="#FFE2A9"
            emissive="#FFE2A9"
            emissiveIntensity={0.15}
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>

        <OrbitParticles
          count={particleCount}
          color={glowColor}
          energy={
            (state === "speaking" ? 0.55 : state === "listening" ? 0.4 : 0.18) +
            audioLevel * 0.35
          }
        />

        <pointLight ref={glowLight} color="#FF5315" intensity={0.8} distance={5} decay={2} />
        <pointLight
          ref={accentLight}
          color="#89BAB1"
          intensity={0.35}
          distance={4.5}
          position={[1.4, 0.8, 1.2]}
          decay={2}
        />
      </group>
    </Float>
  );
}
