import "./globals.css";
import Script from "next/script";
import { Inter, Fragment_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "AI Visibility Audit | Calibre Studio",
  description:
    "See how AI sees your business. A free audit of the signals ChatGPT, Claude, Gemini, Grok, Copilot and Google AI Overviews read before they recommend anyone.",
  openGraph: {
    title: "AI Visibility Audit | Calibre Studio",
    description:
      "See how AI sees your business. The signals AI reads before it recommends you, scored.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fragmentMono.variable}`}>
      <body>
        {children}
        <Script
          src="https://beta.leadconnectorhq.com/loader.js"
          data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="68ccba8e12ad321a12f9d532"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
