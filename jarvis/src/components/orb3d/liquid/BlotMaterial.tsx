"use client";

import { useMemo } from "react";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Mancha líquida viva — raymarch metaballs + fbm no espaço do objeto.
 * Silhueta irregular (tendrils), não esfera.
 */
export const BlotShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uAudio: 0,
    uTurbulence: 0.65,
    uStretch: 1.05,
    uCamLocal: new THREE.Vector3(0, 0, 4),
    uColorA: new THREE.Color("#FF5315"),
    uColorB: new THREE.Color("#5EC8FF"),
    uColorC: new THREE.Color("#9B6BFF"),
    uBright: new THREE.Color("#F7F6F2"),
  },
  /* glsl */ `
    varying vec3 vLocalPos;
    void main() {
      vLocalPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform float uAudio;
    uniform float uTurbulence;
    uniform float uStretch;
    uniform vec3 uCamLocal;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform vec3 uBright;
    varying vec3 vLocalPos;

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
        p = p * 2.03 + 13.1;
        a *= 0.5;
      }
      return v;
    }

    float field(vec3 p) {
      float t = uTime;
      // anisotropia moderada — irregular sem virar fumaça
      p.y *= uStretch * 0.92;
      p.x *= mix(0.97, 0.78, clamp(uTurbulence, 0.0, 1.2));
      p.z *= mix(0.97, 0.86, uTurbulence * 0.5);

      // núcleos espalhados, mas com raio um pouco menor
      vec3 c0 = vec3(sin(t*0.71)*0.9, cos(t*0.53)*0.82, sin(t*0.41)*0.78);
      vec3 c1 = vec3(cos(t*0.93+1.1)*1.05, sin(t*0.67)*0.9, cos(t*0.49+0.4)*0.88);
      vec3 c2 = vec3(sin(t*1.15+2.0)*0.82, cos(t*0.81+0.6)*1.0, sin(t*0.62+1.7)*0.75);
      vec3 c3 = vec3(cos(t*0.48+2.8)*0.95, sin(t*1.25+0.3)*0.65, cos(t*0.97+1.2)*0.9);
      vec3 c4 = vec3(sin(t*0.38+0.5)*0.6, cos(t*0.72+2.1)*0.95, sin(t*1.05)*1.0);
      vec3 c5 = vec3(cos(t*1.4+0.9)*1.1, sin(t*0.55+1.8)*0.78, cos(t*0.88)*0.6);
      vec3 c6 = vec3(sin(t*0.62+3.1)*0.72, cos(t*1.05+0.4)*0.55, sin(t*0.77+2.2)*1.05);

      float d = 0.0;
      d += 0.95 / (0.09 + length(p - c0));
      d += 0.8 / (0.085 + length(p - c1));
      d += 0.72 / (0.1 + length(p - c2));
      d += 0.58 / (0.11 + length(p - c3));
      d += 0.5 / (0.12 + length(p - c4));
      d += 0.4 / (0.14 + length(p - c5));
      d += 0.35 / (0.15 + length(p - c6));
      d *= 1.0 + uAudio * 0.35;

      // tendrils curtos — irregular, pouca fumaça
      float n = fbm(p * 1.55 + vec3(t * 0.12, -t * 0.1, t * 0.07));
      float n2 = fbm(p * 2.9 - vec3(t * 0.08, t * 0.05, -t * 0.09));
      d += (n - 0.42) * (0.55 + uTurbulence * 0.7);
      d += (n2 - 0.5) * (0.28 + uTurbulence * 0.35);
      return d;
    }

    void main() {
      vec3 ro = uCamLocal;
      vec3 rd = normalize(vLocalPos - uCamLocal);

      vec3 col = vec3(0.0);
      float alpha = 0.0;
      float tRay = 0.0;

      for (int i = 0; i < 56; i++) {
        vec3 p = ro + rd * tRay;
        if (abs(p.x) > 2.0 || abs(p.y) > 2.0 || abs(p.z) > 2.0) {
          tRay += 0.08;
          if (tRay > 6.0) break;
          continue;
        }

        float d = field(p);
        // limiar mais alto = menos névoa, corpo mais sólido
        float dens = smoothstep(2.35, 5.0, d);
        dens = dens * dens;

        float m = fbm(p * 1.25 + uTime * 0.09);
        float m2 = fbm(p * 2.3 - uTime * 0.07);
        vec3 c = mix(uColorA, uColorB, clamp(m, 0.0, 1.0));
        c = mix(c, uColorC, smoothstep(0.3, 0.8, m2));
        c = mix(c, uBright, dens * dens * 0.45);

        float a = dens * 0.095;
        col += c * a * (1.0 - alpha);
        alpha += a * (1.0 - alpha);
        if (alpha > 0.97) break;

        tRay += mix(0.04, 0.09, 1.0 - dens);
        if (tRay > 6.0) break;
      }

      if (alpha < 0.04) discard;

      col += uColorB * alpha * 0.08;
      col = col / (col + vec3(0.5));
      col *= 1.22;

      gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
    }
  `,
);

export type BlotMaterialInstance = InstanceType<typeof BlotShaderMaterial> & {
  uTime: number;
  uAudio: number;
  uTurbulence: number;
  uStretch: number;
  uCamLocal: THREE.Vector3;
  uColorA: THREE.Color;
  uColorB: THREE.Color;
  uColorC: THREE.Color;
  uBright: THREE.Color;
};

export function useBlotMaterial(): BlotMaterialInstance {
  return useMemo(() => new BlotShaderMaterial() as BlotMaterialInstance, []);
}
