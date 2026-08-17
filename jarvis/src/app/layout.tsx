import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { BrandBar } from "@/components/JarvisLogo";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

/** Anti-FOUC: data-theme + /embed transparente (sem mexer no body → sem hydration warn). */
const themeBootScript = `(function(){try{var p=location.pathname||"",h=document.documentElement;if(p==="/embed"||p.indexOf("/embed/")===0){h.setAttribute("data-jarvis-embed","");h.style.background="transparent";h.style.colorScheme="normal";}var t=localStorage.getItem("jarvis-theme");if(t!=="light"&&t!=="dark")t="dark";h.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export const metadata: Metadata = {
  title: "Jarvis — Voice AI",
  description: "Assistente de voz com conhecimento corporativo Foursys",
};

export const viewport: Viewport = {
  themeColor: "#181828",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={nunito.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${nunito.className} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <BrandBar />
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
