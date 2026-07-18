import "./globals.css";
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
        "A free tool that scores any website on how AI engines read, understand, trust, and recommend it, using the DCAT method: Discoverability, Clarity, Authority, Trust. AI visibility decides whether a brand is recommended inside an AI answer, a measurable acquisition channel that traditional SEO and standard analytics miss.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": "https://www.calibrestudio.co/#org" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${fragmentMono.variable}`}>
      <body>
        {/* Analytics — LinkedIn Insight 7100092, GA4 G-Z190SM5JHP, Meta Pixel 1590155688538388 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `_linkedin_partner_id="7100092";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Z190SM5JHP');(function(){var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=G-Z190SM5JHP';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(g,s);})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1590155688538388');fbq('track','PageView');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
        {children}
      </body>
    </html>
  );
}
