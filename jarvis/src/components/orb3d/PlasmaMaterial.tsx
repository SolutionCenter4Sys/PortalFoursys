"use client";

import { useMemo } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Plasma Foursys — núcleo escuro legível + fresnel + fbm.
 * Menos “additive wash”; esfera deve ler como volume 3D.
 */
export const PlasmaShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uCore: new THREE.Color("#181828"),
    uGlow: new THREE.Color("#FF5315"),
    uRim: new THREE.Color("#89BAB1"),
    uIntensity: 1,
    uNoise: 0.5,
    uFresnel: 1.5,
    uAudio: 0,
  },
  /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vObjPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vObjPos = position;
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorldPos = world.xyz;
      vViewDir = normalize(cameraPosition - world.xyz);
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uCore;
    uniform vec3 uGlow;
    uniform vec3 uRim;
    uniform float uIntensity;
    uniform float uNoise;
    uniform float uFresnel;
    uniform float uAudio;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vViewDir;
    varying vec3 vObjPos;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.05 + 11.7;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vViewDir);
      float ndotv = max(dot(n, v), 0.0);
      float fres = pow(1.0 - ndotv, mix(1.2, uFresnel, 0.85));

      // lighting-ish term — volume legível sem light real
      float hemi = ndotv * 0.55 + 0.45;

      vec3 p = vObjPos * 2.1 + vec3(0.0, uTime * 0.18, uTime * 0.14);
      float plasma = fbm(p);
      float bands = fbm(p * 1.7 + vec3(uTime * 0.25, 0.0, -uTime * 0.2));
      plasma = smoothstep(0.28, 0.78, plasma + uNoise * 0.1);

      float beat = uAudio * 0.35;

      // núcleo escuro + veios de glow (não lava tudo)
      vec3 col = uCore * hemi;
      col = mix(col, uGlow * 0.85, plasma * 0.55 + beat * 0.15);
      col = mix(col, uRim * 0.9, bands * 0.22 * (0.4 + uIntensity * 0.25));
      // rim só na borda — define a esfera
      col += uRim * fres * (0.55 + beat * 0.25);
      col += uGlow * fres * fres * (0.25 + uIntensity * 0.15);

      // clamp suave — evita estourar bloom
      col = col / (col + vec3(0.75));
      col *= 1.15 + uIntensity * 0.15;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
);

export type PlasmaMaterialInstance = InstanceType<typeof PlasmaShaderMaterial> & {
  uTime: number;
  uCore: THREE.Color;
  uGlow: THREE.Color;
  uRim: THREE.Color;
  uIntensity: number;
  uNoise: number;
  uFresnel: number;
  uAudio: number;
};

export function usePlasmaMaterial(): PlasmaMaterialInstance {
  return useMemo(() => new PlasmaShaderMaterial() as PlasmaMaterialInstance, []);
}
