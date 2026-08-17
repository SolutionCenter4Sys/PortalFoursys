import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SWA hybrid: reduz artefato das Azure Functions (limite ~100–250 MB).
  // Ver: https://learn.microsoft.com/azure/static-web-apps/deploy-nextjs-hybrid
  output: "standalone",
  // compressão gzip nas respostas (default true, explícito por clareza)
  compress: true,
  // não expõe o header X-Powered-By: Next.js
  poweredByHeader: false,
  // Dev: Turbopack é o default do `next dev` (Next 16). Evitar `--webpack`
  // salvo regressão — cold start no Windows sobe de ~segundos para minutos.
  experimental: {
    // tree-shaking de barrel imports em libs pesadas
    optimizePackageImports: [
      "mermaid",
      "@supabase/supabase-js",
      "@supabase/ssr",
      "@react-three/fiber",
      "@react-three/drei",
      "@react-three/postprocessing",
    ],
  },
  // three.js / R3F — evita bundling issues em SSR
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],
  async headers() {
    return [
      {
        source: "/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' http://localhost:4001 http://127.0.0.1:4001 https://*.azurestaticapps.net https://*.foursys.com.br",
          },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
      {
        source: "/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' http://localhost:4001 http://127.0.0.1:4001 https://*.azurestaticapps.net https://*.foursys.com.br",
          },
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
};

export default nextConfig;
