import type { VoiceOrbState } from "@/lib/voice/types";

/** Look numérico — fácil de lerp no useFrame */
export type OrbLook = {
  core: [number, number, number];
  glow: [number, number, number];
  rim: [number, number, number];
  ring: [number, number, number];
  intensity: number;
  noise: number;
  fresnel: number;
  spin: number;
  breath: number;
  scale: number;
  bloom: number;
  particles: number;
};

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const C = {
  orange: hex("#FF5315"),
  orangeHot: hex("#ff7848"),
  mint: hex("#89BAB1"),
  vanilla: hex("#FFE2A9"),
  navy: hex("#181828"),
  navyLite: hex("#2e2e4a"),
  red: hex("#e63946"),
  white: hex("#F7F6F2"),
};

export const ORB_LOOK: Record<VoiceOrbState, OrbLook> = {
  idle: {
    core: C.navy,
    glow: C.mint,
    rim: C.mint,
    ring: C.mint,
    intensity: 0.45,
    noise: 0.35,
    fresnel: 1.1,
    spin: 0.18,
    breath: 0.018,
    scale: 1,
    bloom: 0.55,
    particles: 0.25,
  },
  standby: {
    core: C.navyLite,
    glow: C.mint,
    rim: C.orange,
    ring: C.orange,
    intensity: 0.7,
    noise: 0.45,
    fresnel: 1.35,
    spin: 0.28,
    breath: 0.03,
    scale: 1.02,
    bloom: 0.75,
    particles: 0.4,
  },
  armed: {
    core: C.navyLite,
    glow: C.orangeHot,
    rim: C.orange,
    ring: C.mint,
    intensity: 1.05,
    noise: 0.55,
    fresnel: 1.6,
    spin: 0.5,
    breath: 0.045,
    scale: 1.05,
    bloom: 1.05,
    particles: 0.65,
  },
  listening: {
    core: C.navy,
    glow: C.orange,
    rim: C.vanilla,
    ring: C.orangeHot,
    intensity: 1.35,
    noise: 0.75,
    fresnel: 1.9,
    spin: 0.75,
    breath: 0.07,
    scale: 1.1,
    bloom: 1.35,
    particles: 0.9,
  },
  processing: {
    core: C.navyLite,
    glow: C.vanilla,
    rim: C.mint,
    ring: C.orange,
    intensity: 1.0,
    noise: 0.95,
    fresnel: 1.5,
    spin: 1.55,
    breath: 0.035,
    scale: 1.04,
    bloom: 0.95,
    particles: 0.55,
  },
  speaking: {
    core: C.navy,
    glow: C.orange,
    rim: C.orangeHot,
    ring: C.mint,
    intensity: 1.55,
    noise: 0.7,
    fresnel: 2.1,
    spin: 0.6,
    breath: 0.1,
    scale: 1.08,
    bloom: 1.6,
    particles: 1,
  },
  interrupted: {
    core: C.navyLite,
    glow: C.vanilla,
    rim: C.orange,
    ring: C.orange,
    intensity: 1.15,
    noise: 0.85,
    fresnel: 1.7,
    spin: 1.0,
    breath: 0.055,
    scale: 1.05,
    bloom: 1.15,
    particles: 0.7,
  },
  error: {
    core: C.navy,
    glow: C.red,
    rim: C.vanilla,
    ring: C.red,
    intensity: 0.85,
    noise: 0.4,
    fresnel: 1.4,
    spin: 0.12,
    breath: 0.012,
    scale: 0.98,
    bloom: 0.7,
    particles: 0.15,
  },
};

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
