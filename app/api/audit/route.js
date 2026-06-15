import Anthropic from "@anthropic-ai/sdk";
import { auditSite } from "../../../lib/checks";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

const SYSTEM = `You are the audit engine of Calibre Studio's AI Visibility Audit, built on the AI SEO Kit DCAT method (Discoverability, Clarity, Authority, Trust).

Rules — these are hard, not preferences:
- No fabrication. Every finding must trace to a signal in the data provided. If a signal is absent, do not invent it.
- You can only see the homepage HTML signals and homepage text. You CANNOT query ChatGPT/Perplexity/Gemini/Google AI Overviews. So:
  - Score DISCOVERABILITY and CLARITY confidently from the signals.
  - For AUTHORITY and TRUST, give a low-confidence provisional read and say plainly that the real measurement (third-party citations + recommendation strength across five AI engines) happens in the full paid audit.
- Severity tiers: critical (AI cannot reliably read/understand the page), high (materially hurts citation odds), medium (worth fixing), low (polish).
- Voice: direct, spare, no hype words. Short declarative sentences.

Return ONLY valid JSON, no markdown, no preamble, matching exactly:
{
  "scores": { "discoverability": <0-100>, "clarity": <0-100>, "authority": <0-100>, "trust": <0-100>, "overall": <0-100> },
  "deepLayersProvisional": true,
  "verdict": "<one or two sentences, plain>",
  "clarityNote": "<what an AI engine would currently conclude this business is, from the homepage>",
  "findings": [ { "id": "F01", "layer": "Discoverability|Clarity|Authority|Trust", "severity": "critical|high|medium|low", "evidence": "<what the data shows>", "fix": "<the specific fix>" } ],
  "ninetyDayPlan": [ { "phase": "Days 1-30", "items": ["<source-traced action>"] }, { "phase": "Days 31-60", "items": ["..."] }, { "phase": "Days 61-90", "items": ["..."] } ]
}
Aim for 5-9 findings, ordered by severity.`;

function buildPrompt(audit) {
  return `SITE: ${audit.url}

STRUCTURAL SIGNALS (from the homepage + site root):
${JSON.stringify(audit.signals, null, 2)}

HOMEPAGE TEXT (truncated):
"""${audit.homepageText}"""

Produce the DCAT audit JSON now.`;
}

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Used when no ANTHROPIC_API_KEY is set, or if the model output can't be parsed.
function deterministicReport(audit) {
  const s = audit.signals;
  const findings = [];
  let disc = 100;
  if (s.jsonLdCount === 0) { disc -= 30; findings.push({ id: "F" + (findings.length + 1), layer: "Discoverability", severity: "critical", evidence: "No JSON-LD structured data found sitewide.", fix: "Add Organization + WebSite (and Service/Product) JSON-LD so engines can parse who you are." }); }
  if (!s.hasCanonical) { disc -= 12; findings.push({ id: "F" + (findings.length + 1), layer: "Discoverability", severity: "high", evidence: "No canonical link on the homepage.", fix: "Add a self-referencing <link rel=\"canonical\">." }); }
  if (!s.sitemapXml) { disc -= 14; findings.push({ id: "F" + (findings.length + 1), layer: "Discoverability", severity: "high", evidence: "No reachable /sitemap.xml.", fix: "Generate and submit a sitemap; reference it in robots.txt." }); }
  if (!s.robotsTxt) { disc -= 8; findings.push({ id: "F" + (findings.length + 1), layer: "Discoverability", severity: "medium", evidence: "No /robots.txt found.", fix: "Add robots.txt with AI bot groups and a sitemap directive." }); }
  if (!s.llmsTxt) { disc -= 8; findings.push({ id: "F" + (findings.length + 1), layer: "Discoverability", severity: "medium", evidence: "No /llms.txt found.", fix: "Publish llms.txt and llms-full.txt so AI agents get a clean map of the site." }); }
  if (!s.hasViewport) { disc -= 5; }

  let clar = 100;
  if (!s.metaDescription) { clar -= 18; findings.push({ id: "F" + (findings.length + 1), layer: "Clarity", severity: "high", evidence: "No meta description.", fix: "Write a one-sentence description of what the business is and who it serves." }); }
  if (!s.title) { clar -= 20; findings.push({ id: "F" + (findings.length + 1), layer: "Clarity", severity: "critical", evidence: "No <title>.", fix: "Add a clear, specific page title." }); }
  if (s.h1Count === 0) { clar -= 14; findings.push({ id: "F" + (findings.length + 1), layer: "Clarity", severity: "high", evidence: "No H1 on the homepage.", fix: "Add a single H1 that states the offer plainly." }); }
  if (!s.ogImage) { clar -= 8; findings.push({ id: "F" + (findings.length + 1), layer: "Clarity", severity: "medium", evidence: "No og:image — link shares render blank.", fix: "Add og:image, og:title, og:description." }); }

  const discoverability = clamp(disc);
  const clarity = clamp(clar);
  const authority = 50;
  const trust = 50;
  const overall = clamp(discoverability * 0.4 + clarity * 0.35 + authority * 0.125 + trust * 0.125);

  return {
    url: audit.url,
    signals: s,
    scores: { discoverability, clarity, authority, trust, overall },
    deepLayersProvisional: true,
    verdict:
      overall >= 70
        ? "Solid foundations. A few gaps are limiting how cleanly AI can read and cite you."
        : "AI engines struggle to read and understand this site. The structural gaps below are the reason.",
    clarityNote:
      "Provisional read from the homepage only. The full audit confirms what each AI engine actually says you are.",
    findings: findings.length ? findings : [{ id: "F1", layer: "Discoverability", severity: "low", evidence: "Core structural signals are present.", fix: "Run the full audit for Authority and multi-engine citation analysis." }],
    ninetyDayPlan: [
      { phase: "Days 1-30", items: ["Fix critical Discoverability gaps: JSON-LD, canonicals, sitemap, robots/llms.txt."] },
      { phase: "Days 31-60", items: ["Tighten Clarity: titles, meta, H1s, entity consistency across the site."] },
      { phase: "Days 61-90", items: ["Build Authority: third-party citations in your category. Re-run the visibility check."] },
    ],
    model: "deterministic",
  };
}

function parseJson(raw) {
  if (!raw) return null;
  let t = raw.trim().replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const { website } = await req.json();
    if (!website) return Response.json({ error: "Missing website." }, { status: 400 });

    const audit = await auditSite(website);
    if (!audit.reachable) {
      return Response.json(
        { error: `Couldn't reach ${website} (status ${audit.status || "no response"}). Check the URL and try again.` },
        { status: 200 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(deterministicReport(audit));
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(audit) }],
    });
    const raw = msg.content?.[0]?.text || "";
    const data = parseJson(raw);
    if (!data || !data.scores) {
      console.error("Audit fell back to deterministic. Model output (first 600 chars):", raw.slice(0, 600));
      return Response.json(deterministicReport(audit));
    }
    return Response.json({ url: audit.url, signals: audit.signals, ...data, model: MODEL });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
