"use client";

import { useState, useEffect } from "react";
import LogoScroller from "./components/LogoScroller";

const CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/calibrestudio";
const SITE = "https://www.calibrestudio.co";
const LOGO = "https://framerusercontent.com/images/DNz730VdRk76gPUHXillIWOOI.png";

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
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const els = document.querySelectorAll(".reveal, .stagger");
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
    els.forEach((el) => io.observe(el));

    // hero copy: replay the reveal each time it enters the viewport
    const heroIO = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.target.classList.toggle("in", en.isIntersecting)),
      { threshold: 0.2 }
    );
    document.querySelectorAll(".hero-reveal").forEach((el) => heroIO.observe(el));

    return () => {
      io.disconnect();
      heroIO.disconnect();
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
            the signals ChatGPT, Claude, Gemini, Grok, Copilot and Google AI Overviews read before they recommend anyone.
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
        <div className="wrap">
          <p className="footer-tagline reveal">Exploring the space between art and technology</p>
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <img src={LOGO} alt="Calibre Studio" />
              <p>Your technology partner and AI agency.</p>
            </div>
            <div className="footer-col">
              <h4>Studio</h4>
              <a href={`${SITE}/works`}>Work</a>
              <a href={`${SITE}/about`}>Studio</a>
              <a href={`${SITE}/ai-automation`}>Intelligence</a>
              <a href={CALENDLY}>Book a meeting</a>
            </div>
            <div className="footer-col">
              <h4>Follow</h4>
              <a href="https://www.instagram.com/calibrestudio_" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/company/calibrestudio/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.facebook.com/CalibreStudio.Co" target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Calibre Studio® · GC · Paris</span>
            <span>// Indexed — AI visibility</span>
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
                <span className="layer-num">{val ?? "—"}</span>
              </div>
              <p className="layer-q">{l.q}</p>
              <div className="track"><span className="fill" style={{ "--v": barsReady ? (val ?? 0) / 100 : 0 }} /></div>
              {provisional && <p className="layer-note">Provisional — confirmed in the full audit.</p>}
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
                  <p className="finding-layer">{f.layer}</p>
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
        <p>We fix what this audit found, then make the brand worth remembering — Authority, Trust, and where you stand across every AI engine.</p>
        <a className="btn-link" href={CALENDLY}><span>Book your visibility call</span><span className="arr" aria-hidden="true">→</span></a>
      </div>
    </main>
  );
}
