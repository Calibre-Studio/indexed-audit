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
  metadataBase: new URL("https://indexed.calibrestudio.co"),
  title: "AI Visibility Audit | Calibre Studio",
  description:
    "See how AI sees your business. A free audit of the signals ChatGPT, Claude, Gemini, Grok, Perplexity, Copilot and Google AI Overviews read before they recommend anyone.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AI Visibility Audit | Calibre Studio",
    description:
      "See how AI sees your business. The signals AI reads before it recommends you, scored.",
    url: "https://indexed.calibrestudio.co",
    siteName: "AI Visibility Audit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Visibility Audit | Calibre Studio",
    description:
      "See how AI sees your business. The signals AI reads before it recommends you, scored.",
  },
  robots: { index: true, follow: true },
};

const SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.calibrestudio.co/#org",
      name: "Calibre Studio",
      url: "https://www.calibrestudio.co/",
      logo: "https://framerusercontent.com/images/DNz730VdRk76gPUHXillIWOOI.png",
      sameAs: [
        "https://www.instagram.com/calibrestudio_",
        "https://twitter.com/Thor_Elias",
        "https://www.linkedin.com/company/calibrestudio/",
        "https://dribbble.com/CalibreStudio",
        "https://www.facebook.com/CalibreStudio.Co",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://indexed.calibrestudio.co/#website",
      url: "https://indexed.calibrestudio.co/",
      name: "AI Visibility Audit",
      publisher: { "@id": "https://www.calibrestudio.co/#org" },
    },
    {
      "@type": "WebApplication",
      name: "AI Visibility Audit",
      url: "https://indexed.calibrestudio.co/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A free tool that scores any website on how AI engines read, understand, trust, and recommend it, using the DCAT method: Discoverability, Clarity, Authority, Trust.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": "https://www.calibrestudio.co/#org" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fragmentMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
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
