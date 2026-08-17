"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import type { VoiceOrbState } from "@/lib/voice/types";
import { OrbScene } from "@/components/orb3d/OrbScene";

type Props = {
  state: VoiceOrbState;
  audioLevel?: number;
  /** hero = showcase final; app = runtime no /app */
  quality?: "hero" | "app";
  /** permite arrastar/girar (showcase) */
  controls?: boolean;
};

function PostFX({ quality }: { quality: "hero" | "app" }) {
  // Bloom contido — só highlights; threshold alto = núcleo permanece legível
  return (
    <EffectComposer multisampling={quality === "hero" ? 2 : 0} enableNormalPass={false}>
      <Bloom
        intensity={quality === "hero" ? 0.55 : 0.4}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.35}
        mipmapBlur
        radius={0.45}
      />
      <Vignette eskil={false} offset={0.3} darkness={quality === "hero" ? 0.45 : 0.25} />
    </EffectComposer>
  );
}

/** Canvas WebGL — forma 3D legível (bloom baixo + luz lateral + orbit). */
export function OrbCanvas({
  state,
  audioLevel = 0,
  quality = "app",
  controls = false,
}: Props) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={quality === "hero" ? [1, 1.75] : [1, 1.5]}
      camera={{
        // framing: esfera ~mesmo peso visual do orb 2D (120px)
        position: quality === "hero" ? [2.4, 1.25, 4.6] : [0, 0.2, 4.5],
        fov: 34,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.95,
      }}
      style={{ background: "transparent" }}
    >
      {/* luzes de forma — volume 3D, não glow flat */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 2]} intensity={0.85} color="#F7F6F2" />
      <directionalLight position={[-3, -1, -2]} intensity={0.35} color="#89BAB1" />
      <pointLight position={[0, 0, 2.5]} intensity={0.4} color="#FF5315" distance={6} />

      <OrbScene state={state} audioLevel={audioLevel} quality={quality} />

      {quality === "hero" && (
        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.4}
          scale={10}
          blur={2.6}
          far={4}
          color="#000000"
        />
      )}

      {controls && (
        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={9}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI - 0.35}
          autoRotate={state === "idle" || state === "standby"}
          autoRotateSpeed={0.45}
          enableDamping
          dampingFactor={0.08}
        />
      )}

      <PostFX quality={quality} />
    </Canvas>
  );
}
