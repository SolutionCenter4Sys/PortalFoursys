"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

import type { VoiceOrbState } from "@/lib/voice/types";
import { LiquidOrbScene } from "@/components/orb3d/liquid/LiquidOrbScene";

type Props = {
  state: VoiceOrbState;
  audioLevel?: number;
  className?: string;
  interactive?: boolean;
};

/**
 * Lab mancha líquida — bloom suave, fundo preto (estilo nebula).
 */
export function LiquidOrbCanvas({
  state,
  audioLevel = 0,
  className,
  interactive = true,
}: Props) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.1, 3.8]} fov={46} />
        <color attach="background" args={["#050508"]} />
        <ambientLight intensity={0.15} />

        <Suspense fallback={null}>
          <LiquidOrbScene state={state} audioLevel={audioLevel} />
        </Suspense>

        {interactive ? (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.7}
            autoRotate
            autoRotateSpeed={0.35}
          />
        ) : null}

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.48}
            luminanceSmoothing={0.65}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.45} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
