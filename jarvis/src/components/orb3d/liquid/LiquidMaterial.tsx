"use client";

import { useMemo } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Líquido viscoso — displacement suave + iridescência.
 * Pegada “gota / mercúrio / óleo”, não plasma sci-fi.
 */
export const LiquidShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color("#FF5315"),
    uColorB: new THREE.Color("#89BAB1"),
    uColorC: new THREE.Color("#FFE2A9"),
    uDeep: new THREE.Color("#181828"),
    uViscosity: 0.55,
    uAudio: 0,
    uGlow: 0.7,
  },
  /* glsl */ `
    uniform float uTime;
    uniform float uViscosity;
    uniform float uAudio;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vObj;
    varying float vDisp;

    // hash / noise 3D
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
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.02 + 9.3;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      // onda lenta = viscosidade (não “fervendo”)
      float t = uTime * mix(0.18, 0.55, uViscosity);
      vec3 p = position * 1.15;
      float n1 = fbm(p + vec3(t * 0.35, t * 0.22, -t * 0.18));
      float n2 = fbm(p * 1.6 + vec3(-t * 0.2, t * 0.3, t * 0.15));
      float wave = (n1 * 0.7 + n2 * 0.3) - 0.45;
      // áudio = ondulação extra suave (gota falando)
      float amp = 0.14 + uAudio * 0.16;
      float disp = wave * amp;
      vDisp = disp;

      vec3 pos = position + normal * disp;
      vec4 world = modelMatrix * vec4(pos, 1.0);
      vObj = pos;
      vNormal = normalize(normalMatrix * normal);
      vViewDir = normalize(cameraPosition - world.xyz);
      gl_Position = projectionMatrix * viewMatrix * world;
    }
  `,
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uDeep;
    uniform float uGlow;
    uniform float uAudio;
    uniform float uTime;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vObj;
    varying float vDisp;

    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(vViewDir);
      float fres = pow(1.0 - max(dot(n, v), 0.0), 2.4);
      float hemi = max(dot(n, vec3(0.2, 0.8, 0.35)), 0.0) * 0.5 + 0.5;

      // iridescência líquida — mistura lenta das cores Foursys
      float band = sin(vObj.y * 3.2 + uTime * 0.4 + vDisp * 8.0) * 0.5 + 0.5;
      float band2 = sin(vObj.x * 2.5 - uTime * 0.25) * 0.5 + 0.5;
      vec3 irid = mix(uColorA, uColorB, band);
      irid = mix(irid, uColorC, band2 * 0.35);

      vec3 col = mix(uDeep, irid, 0.55 + hemi * 0.25);
      // highlight espelhado (gota molhada)
      col += vec3(1.0, 0.95, 0.9) * pow(fres, 1.6) * (0.55 + uGlow * 0.35);
      col += uColorA * fres * fres * (0.25 + uAudio * 0.35);
      // veios internos suaves
      col = mix(col, uColorB, smoothstep(-0.05, 0.12, vDisp) * 0.2);

      // tonemap leve
      col = col / (col + vec3(0.9));
      col *= 1.2;

      gl_FragColor = vec4(col, 0.94);
    }
  `,
);

export type LiquidMaterialInstance = InstanceType<typeof LiquidShaderMaterial> & {
  uTime: number;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uColorC: THREE.Color;
  uDeep: THREE.Color;
  uViscosity: number;
  uAudio: number;
  uGlow: number;
};

export function useLiquidMaterial(): LiquidMaterialInstance {
  return useMemo(() => new LiquidShaderMaterial() as LiquidMaterialInstance, []);
}
