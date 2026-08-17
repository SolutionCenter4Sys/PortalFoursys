import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jarvis — Voice AI",
    short_name: "Jarvis",
    description: "Assistente de voz com conhecimento corporativo Foursys",
    start_url: "/app",
    display: "standalone",
    background_color: "#181828",
    theme_color: "#181828",
    icons: [
      {
        src: "/brand/jarvis-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/jarvis-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/brand/jarvis-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
