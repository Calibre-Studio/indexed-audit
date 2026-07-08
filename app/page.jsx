"use client";

import { useState, useEffect } from "react";
import LogoScroller from "./components/LogoScroller";

const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/calibrestudio";
const SITE = "https://www.calibrestudio.co";
const LOGO = "https://framerusercontent.com/images/DNz730VdRk76gPUHXillIWOOI.png";
const REEL = "https://cdn.calibrestudio.co/Motion/calibrestudio_directed_hero.mp4";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/calibrestudio_", d: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.12 1.39A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.39 2.12 5.9 5.9 0 0 0 2.12 1.39c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a6.15 6.15 0 0 0 3.51-3.51c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.39-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4m6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44" },
  { label: "X", href: "https://twitter.com/Thor_Elias", d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/calibrestudio/", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "Dribbble", href: "https://dribbble.com/CalibreStudio", d: "M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12c6.601 0 12-5.385 12-12S18.601 0 12 0zm9.949 11.717c-2.075-.427-4.057-.439-5.945-.038-.252-.617-.487-1.179-.74-1.717 2.213-.957 3.825-2.218 4.781-3.745 1.073 1.318 1.764 2.974 1.904 4.5zm-3.05-5.66c-.851 1.354-2.314 2.49-4.3 3.353-1.003-1.834-2.108-3.43-3.281-4.766 1.119-.298 2.291-.451 3.482-.451 1.461 0 2.851.295 4.099.864zm-7.815-.024c1.241 1.376 2.357 2.965 3.32 4.736-2.703.71-5.766.835-8.823.835-.044 0-.088 0-.131-.001.485-2.443 1.957-4.535 3.634-5.57zM2.252 12.002l.003-.234c.046.001.092.001.138.001 3.339 0 6.687-.149 9.671-.969.235.484.46.973.667 1.461-3.279.875-6.064 2.745-8.013 5.301-1.463-1.628-2.404-3.769-2.516-5.561zm3.51 6.94c1.74-2.314 4.182-3.977 7.117-4.737.96 2.495 1.621 4.952 1.916 7.222-3.064 1.18-6.404.665-9.033-2.485zm10.946 1.482c-.273-2.106-.86-4.349-1.692-6.535 1.685-.318 3.418-.232 5.182.139-.443 2.485-1.876 4.704-3.49 6.396z" },
  { label: "Facebook", href: "https://www.facebook.com/CalibreStudio.Co", d: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" },
];

const LAYERS = [
  { key: "discoverability", name: "Discoverability", q: "Can AI find you?" },
  { key: "clarity", name: "Clarity", q: "Does it understand you?" },
  { key: "authority", name: "Authority", q: "Does it rate you?" },
  { key: "trust", name: "Trust", q: "Will it recommend you?" },
];

// All 30 client logos from calibrestudio.co/about, trimmed to zero padding and
// self-hosted in /public/logos. Per-logo scales equalize each mark's visual mass
// (measured rendered ink, not just height) so they read the same optical size:
// wide wordmarks sit lower, compact/light marks sit higher.
// ar = trimmed width/height, used to reserve each logo's box before it loads.
const LOGOS = [
  { n: "Louis Vuitton", s: "/logos/louis-vuitton.png", scale: 0.68, ar: 9.55 },
  { n: "HP", s: "/logos/hp.png", scale: 1.08, ar: 1.0 },
  { n: "Chanel", s: "/logos/chanel.png", scale: 0.75, ar: 6.35 },
  { n: "Hermès", s: "/logos/hermes.png", scale: 1.25, ar: 1.73 },
  { n: "Dior", s: "/logos/dior.png", scale: 0.97, ar: 3.57 },
  { n: "Warner Music", s: "/logos/warner-music.png", scale: 1.25, ar: 1.67 },
  { n: "Sephora", s: "/logos/sephora.png", scale: 0.81, ar: 7.92 },
  { n: "Billabong", s: "/logos/billabong.png", scale: 1.0, ar: 2.35 },
  { n: "Valentino", s: "/logos/valentino.png", scale: 0.88, ar: 6.11 },
  { n: "L'Oréal", s: "/logos/loreal.png", scale: 0.95, ar: 5.48 },
  { n: "Budweiser", s: "/logos/budweiser.png", scale: 1.25, ar: 2.21 },
  { n: "Givenchy", s: "/logos/givenchy.png", scale: 0.71, ar: 9.64 },
  { n: "Bel Group", s: "/logos/bel-group.png", scale: 1.25, ar: 1.21 },
  { n: "Samsung", s: "/logos/samsung.png", scale: 0.68, ar: 6.42 },
  { n: "Galeries Lafayette", s: "/logos/galeries-lafayette.png", scale: 1.25, ar: 1.91 },
  { n: "Bottega Veneta", s: "/logos/bottega-veneta.png", scale: 0.69, ar: 11.39 },
  { n: "Pandora", s: "/logos/pandora.png", scale: 1.04, dy: -2, ar: 4.93 },
  { n: "Volvo", s: "/logos/volvo.png", scale: 0.55, ar: 7.19 },
  { n: "Nina Ricci", s: "/logos/nina-ricci.png", scale: 1.06, ar: 3.8 },
  { n: "Biotherm", s: "/logos/biotherm.png", scale: 0.95, ar: 4.07 },
  { n: "Valley Eyewear", s: "/logos/valley-eyewear.png", scale: 0.92, ar: 4.31 },
  { n: "La Roche-Posay", s: "/logos/la-roche-posay.png", scale: 1.05, ar: 3.89 },
  { n: "Viktor & Rolf", s: "/logos/viktor-rolf.png", scale: 0.84, ar: 8.44 },
  { n: "Skullcandy", s: "/logos/skullcandy.png", scale: 0.9, ar: 5.47 },
  { n: "Air France", s: "/logos/air-france.png", scale: 0.66, ar: 11.18 },
  { n: "Village Roadshow", s: "/logos/village-roadshow.png", scale: 1.04, ar: 5.86 },
  { n: "Silk Laundry", s: "/logos/silk-laundry.png", scale: 0.72, ar: 12.02 },
  { n: "Anti-Order", s: "/logos/anti-order.png", scale: 0.74, ar: 3.19 },
  { n: "Wrangler", s: "/logos/wrangler.png", scale: 0.99, dy: 2, ar: 3.44 },
];

function AnimWords({ text, base = 0.12, step = 0.06 }) {
  const words = text.split(" ");
  return words.flatMap((w, i) => {
    const el = (
      <span key={"w" + i} className="aw" style={{ "--d": (base + i * step).toFixed(2) + "s" }}>{w}</span>
    );
    return i < words.length - 1 ? [el, " "] : [el];
  });
}

export default function Page() {
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);
  const [reelOpen, setReelOpen] = useState(false);
  const [shownScore, setShownScore] = useState(0);
  const [barsReady, setBarsReady] = useState(false);

  async function run(e) {
    e.preventDefault();
    setError("");
    if (!website.trim()) return setError("Enter your website.");
    if (!email.trim()) return setError("Enter your email to get the report.");
    setLoading(true);
    setReport(null);
    setBarsReady(false);
    setShownScore(0);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setReport(data);
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, scores: data.scores, verdict: data.verdict }),
      }).catch(() => {});
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError("Something went wrong running the audit. Try again.");
    }
    setLoading(false);
  }

  // entrance + scroll reveals
  useEffect(() => {
    document.body.classList.add("js");
    const revealOnce = () => document.querySelectorAll(".reveal, .stagger");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".reveal, .stagger, .hero-reveal").forEach((el) => el.classList.add("in"));
      return;
    }

    // Reveal anything already in view on mount so the hero (and any above-the-fold
    // content) paints immediately instead of waiting on the observer callback.
    const vh = window.innerHeight || 0;
    document.querySelectorAll(".reveal, .stagger, .hero-reveal").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add("in");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );
    revealOnce().forEach((el) => io.observe(el));

    // hero copy: replay the reveal each time it enters the viewport
    const heroIO = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.target.classList.toggle("in", en.isIntersecting)),
      { threshold: 0.2 }
    );
    document.querySelectorAll(".hero-reveal").forEach((el) => heroIO.observe(el));

    // Safety net: if any reveal is still hidden after 1.4s (observer never fired on a
    // slow or headless render), force it visible. Content can never ship blank.
    const safety = setTimeout(() => revealOnce().forEach((el) => el.classList.add("in")), 1400);

    return () => {
      io.disconnect();
      heroIO.disconnect();
      clearTimeout(safety);
    };
  }, [report, loading]);

  // score count-up + bar fill
  useEffect(() => {
    if (!report) return;
    const target = Math.round(report.scores?.overall ?? 0);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShownScore(target);
      setBarsReady(true);
      return;
    }
    let raf;
    const start = performance.now();
    const dur = 1100;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 4);
      setShownScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const b = requestAnimationFrame(() => setBarsReady(true));
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(b);
    };
  }, [report]);

  return (
    <>
      <header className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href={SITE} aria-label="Calibre Studio">
            <img src={LOGO} alt="Calibre Studio" />
          </a>
          <nav className="nav-links">
            <a className="nav-hide" href={`${SITE}/works`}>Work</a>
            <a className="nav-hide" href={`${SITE}/about`}>Studio</a>
            <a className="nav-cta" href={CALENDLY}><span>Book a call</span><span className="arr" aria-hidden="true">→</span></a>
          </nav>
        </div>
      </header>

      {!report && (
        <section className="hero wrap hero-reveal">
          <p className="eyebrow ar" style={{ "--d": "0s" }}><span className="slash">//</span>Free · 60 seconds · No card</p>
          <h1 className="display"><AnimWords text="See how AI sees your business." base={0.12} step={0.06} /></h1>
          <p className="lead ar" style={{ "--d": "0.62s" }}>
            Search changed. Your customers ask AI now, and it answers with a shortlist. This audit scores
            the signals ChatGPT, Claude, Gemini, Grok, Perplexity, Copilot and Google AI Overviews read before they recommend anyone.
          </p>

          <form className="audit-form ar" style={{ "--d": "0.78s" }} onSubmit={run}>
            <div className="field">
              <label htmlFor="website">Your website</label>
              <input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="yourbrand.com" autoComplete="url" />
            </div>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@brand.com" autoComplete="email" />
            </div>
            <button className={`btn-primary${loading ? " is-auditing" : ""}`} disabled={loading}>
              <span>{loading ? "Auditing…" : "Run my free audit"}</span>
              {!loading && <span className="arr" aria-hidden="true">→</span>}
            </button>
            <p className="form-note">We read your public site only. No card, no spam.</p>
            {error && <p className="form-error">{error}</p>}
          </form>

          {loading && (
            <div className="loading"><span className="bar" aria-hidden="true" />Reading your site the way an AI engine does…</div>
          )}
        </section>
      )}

      {!report && (
        <section className="proof reveal">
          <p className="eyebrow"><span className="slash">//</span>Trusted by the brands you know</p>
          <LogoScroller logos={LOGOS} />
        </section>
      )}

      {report && <Report report={report} shownScore={shownScore} barsReady={barsReady} />}

      <footer className="footer">
        <div className="footer-wrap">
          <div className="footer-top">
            <div className={`footer-left${reelOpen ? " reel-open" : ""}`}>
              <p className="footer-tagline reveal">Exploring the space between art and technology</p>
              <button type="button" className="footer-reel" onClick={() => { if (typeof window !== "undefined" && window.innerWidth > 560) setReelOpen((o) => !o); }} aria-expanded={reelOpen} aria-label={reelOpen ? "Collapse showreel" : "Expand showreel"}>
                <span className="footer-reel-frame">
                  <video src={REEL} autoPlay muted loop playsInline preload="metadata" />
                </span>
                <span className="footer-reel-meta">
                  <span className="eyebrow"><span className="slash">//</span>Directed</span>
                  <span className="footer-reel-time">1:11</span>
                </span>
              </button>
              <a className="footer-wordmark" href={SITE} aria-label="Calibre Studio">
                <img src={LOGO} alt="Calibre Studio" />
                <span className="footer-reg" aria-hidden="true">©</span>
              </a>
            </div>
            <div className="footer-right">
              <div className="footer-rowgroup">
                <span className="footer-collabel">Services</span>
                <ul className="footer-list">
                  <li><a href={`${SITE}/about`}>Strategy</a><span aria-hidden="true">•</span></li>
                  <li><a href={`${SITE}/about`}>Branding</a><span aria-hidden="true">•</span></li>
                  <li><a href={`${SITE}/about`}>Marketing</a><span aria-hidden="true">•</span></li>
                  <li><a href={`${SITE}/about`}>Content</a><span aria-hidden="true">•</span></li>
                  <li><a href={`${SITE}/intelligence`}>Intelligence</a><span aria-hidden="true">•</span></li>
                  <li><a href="https://getfound.calibrestudio.co">Get Found</a><span aria-hidden="true">•</span></li>
                </ul>
              </div>
              <div className="footer-rowgroup">
                <span className="footer-collabel">Follow</span>
                <div className="footer-socials">
                  {SOCIALS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg>
                    </a>
                  ))}
                </div>
              </div>
              <div className="footer-actions">
                <button type="button" className="footer-totop" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top <span aria-hidden="true">↑</span></button>
                <a className="btn-link footer-book" href={CALENDLY} target="_blank" rel="noopener noreferrer"><span>Book a call</span></a>
              </div>
            </div>
          </div>

          <div className="footer-legal">
            <div className="footer-legal-links">
              <a href={`${SITE}/terms`}>Terms</a><span aria-hidden="true">•</span><a href={`${SITE}/privacy`}>Privacy</a><span className="footer-legal-spacer" aria-hidden="true"></span><span className="footer-legal-bullet" aria-hidden="true">•</span><a href="https://app.calibrestudio.co/" target="_blank" rel="noopener noreferrer">Login</a><span aria-hidden="true">•</span><a href="https://shop.calibrestudio.co/">Shop</a><span aria-hidden="true">•</span><a href={`${SITE}/blog`}>Blog</a>
            </div>
            <span className="footer-copy">© {new Date().getFullYear()} Calibre Studio® | GC | Paris</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function Report({ report, shownScore, barsReady }) {
  const s = report.scores || {};
  return (
    <main className="report wrap">
      <div className="score-block reveal">
        <p className="eyebrow"><span className="slash">//</span>AI visibility score</p>
        <div className="score">{shownScore}<span className="of">/100</span></div>
        <p className="verdict">{report.verdict}</p>
        <p className="target">{report.url}</p>
      </div>

      <div className="dcat stagger">
        {LAYERS.map((l) => {
          const val = s[l.key];
          const provisional = report.deepLayersProvisional && (l.key === "authority" || l.key === "trust");
          return (
            <div className="layer" key={l.key}>
              <div className="layer-top">
                <span className="layer-name">{l.name}</span>
                <span className="layer-num">{val ?? "-"}</span>
              </div>
              <p className="layer-q">{l.q}</p>
              <div className="track"><span className="fill" style={{ "--v": barsReady ? (val ?? 0) / 100 : 0 }} /></div>
              {provisional && <p className="layer-note">Provisional, confirmed in the full audit.</p>}
            </div>
          );
        })}
      </div>

      {report.clarityNote && (
        <>
          <p className="section-label">What AI thinks you are</p>
          <p className="ai-thinks reveal">{report.clarityNote}</p>
        </>
      )}

      {report.findings?.length > 0 && (
        <>
          <p className="section-label">Findings</p>
          <div className="stagger">
            {report.findings.map((f, i) => (
              <div className="finding" key={i}>
                <div className={"sev " + f.severity}>{f.severity}</div>
                <div>
                  <p className="finding-layer">{(f.id || "F" + String(i + 1).padStart(2, "0"))} · {f.layer}</p>
                  <p className="finding-evidence">{f.evidence}</p>
                  <p className="finding-fix">{f.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {report.ninetyDayPlan?.length > 0 && (
        <>
          <p className="section-label">90-day plan</p>
          <div className="plan stagger">
            {report.ninetyDayPlan.map((p, i) => (
              <div className="phase" key={i}>
                <h3>{p.phase}</h3>
                <ul>{(p.items || []).map((it, j) => <li key={j}>{it}</li>)}</ul>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="cta reveal">
        <h2>Found is half of it. Then you have to be seen.</h2>
        <p>We fix what this audit found, then make the brand worth remembering: Authority, Trust, and where you stand across every AI engine.</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 26px", alignItems: "center" }}>
          <a className="btn-link" href="https://getfound.calibrestudio.co"><span>See how we get you found</span><span className="arr" aria-hidden="true">→</span></a>
          <a className="btn-link" href={CALENDLY}><span>Book a call</span><span className="arr" aria-hidden="true">→</span></a>
        </div>
      </div>
    </main>
  );
}
