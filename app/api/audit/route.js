import Anthropic from "@anthropic-ai/sdk";
import { auditSite } from "../../../lib/checks";

export const runtime = "nodejs";
export const maxDuration = 60;

// Pinned. This tool must always run on Claude Sonnet 4.6.
// Hardcoded so it can never silently fall back to another model via env config.
const MODEL = "claude-sonnet-4-6";

const SYSTEM = `You are the audit engine of Calibre Studio's AI Visibility Audit, built on the AI SEO Kit DCAT method (Discoverability, Clarity, Authority, Trust).

Rules (these are hard, not preferences):
- No fabrication. Every finding must trace to a signal in the data provided. If a signal is absent, do not invent it.
- You can only see the homepage HTML signals and homepage text. You CANNOT query ChatGPT/Perplexity/Gemini/Google AI Overviews. So:
  - Score DISCOVERABILITY and CLARITY confidently from the signals.
  - For AUTHORITY and TRUST, give a low-confidence provisional read and say plainly that the real measurement (third-party citations + recommendation strength across five AI engines) happens in the full paid audit.
- Severity tiers: critical (AI cannot reliably read/understand the page), high (materially hurts citation odds), medium (worth fixing), low (polish).
- Voice: direct, spare, no hype words. Short declarative sentences.
- Never use em dashes or en dashes (the "—" or "–" characters) anywhere in your output. Use a comma, a period, parentheses, or the word "to" instead. For numeric ranges use a plain hyphen, for example "Days 1-30".
- The signals JSON uses short internal field names. In your writing, always use the real-world names, never the field names. Specifically: write "llms.txt" not "llmsTxt", "llms-full.txt" not "llmsFullTxt", "robots.txt" not "robotsTxt", "sitemap.xml" not "sitemapXml", "JSON-LD" not "jsonLdCount", "meta description" not "metaDescription", "og:image" not "ogImage", "canonical tag" not "hasCanonical". Write for a business owner, not a developer reading variable names.
- Treat the CURRENT DATE given in the prompt as authoritative for "today". Never flag a copyright year or any date as stale, wrong, or anomalous unless it is clearly AFTER the current date. A current-year copyright is correct, so do not tell them to change it.

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

// Forcing this tool guarantees the model returns valid, schema-shaped JSON
// (no prefill, no markdown, no parsing) on any current Claude model.
const AUDIT_TOOL = {
  name: "emit_audit",
  description: "Return the completed DCAT AI-visibility audit as structured data.",
  input_schema: {
    type: "object",
    properties: {
      scores: {
        type: "object",
        properties: {
          discoverability: { type: "integer", minimum: 0, maximum: 100 },
          clarity: { type: "integer", minimum: 0, maximum: 100 },
          authority: { type: "integer", minimum: 0, maximum: 100 },
          trust: { type: "integer", minimum: 0, maximum: 100 },
          overall: { type: "integer", minimum: 0, maximum: 100 },
        },
        required: ["discoverability", "clarity", "authority", "trust", "overall"],
      },
      deepLayersProvisional: { type: "boolean" },
      verdict: { type: "string" },
      clarityNote: { type: "string" },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            layer: { type: "string", enum: ["Discoverability", "Clarity", "Authority", "Trust"] },
            severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
            evidence: { type: "string" },
            fix: { type: "string" },
          },
          required: ["layer", "severity", "evidence", "fix"],
        },
      },
      ninetyDayPlan: {
        type: "array",
        items: {
          type: "object",
          properties: {
            phase: { type: "string" },
            items: { type: "array", items: { type: "string" } },
          },
          required: ["phase", "items"],
        },
      },
    },
    required: ["scores", "verdict", "findings", "ninetyDayPlan"],
  },
};

function buildPrompt(audit) {
  return `CURRENT DATE: ${new Date().toISOString().slice(0, 10)}
SITE: ${audit.url}

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
  if (!s.ogImage) { clar -= 8; findings.push({ id: "F" + (findings.length + 1), layer: "Clarity", severity: "medium", evidence: "No og:image, so link shares render blank.", fix: "Add og:image, og:title, og:description." }); }

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

// Robust JSON extraction: strips code fences, scans balanced braces (string-aware
// so braces inside strings don't fool it), repairs trailing commas, and tolerates
// any prose before/after the object.
function extractJson(raw) {
  if (!raw) return null;
  const t = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = t.indexOf("{");
  if (start === -1) return null;
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { end = i; break; } }
  }
  const slice = end === -1 ? t.slice(start) : t.slice(start, end + 1);
  for (const a of [slice, slice.replace(/,(\s*[}\]])/g, "$1")]) {
    try { return JSON.parse(a); } catch {}
  }
  return null;
}

function validReport(d) {
  return !!(d && d.scores && typeof d.scores.overall === "number" && Array.isArray(d.findings));
}

// Hard guarantee on rendered report text: no em or en dashes (numeric ranges
// become hyphens, prose dashes become commas), and any internal signal field
// names get rewritten to their real-world names (llmsTxt becomes llms.txt, etc).
function stripDashes(v) {
  if (typeof v === "string") {
    return v
      .replace(/(\d)\s*[—–]\s*(\d)/g, "$1-$2")
      .replace(/\s*[—–]\s*/g, ", ")
      .replace(/,\s*,/g, ", ")
      .replace(/\s+,/g, ",")
      .replace(/\bllmsFullTxt\b/gi, "llms-full.txt")
      .replace(/\bllmsTxt\b/gi, "llms.txt")
      .replace(/\brobotsTxt\b/gi, "robots.txt")
      .replace(/\bsitemapXml\b/gi, "sitemap.xml")
      .replace(/\bjsonLd(Count)?\b/g, "JSON-LD")
      .replace(/\bmetaDescription\b/g, "meta description")
      .replace(/\bogImage\b/g, "og:image");
  }
  if (Array.isArray(v)) return v.map(stripDashes);
  if (v && typeof v === "object") {
    const o = {};
    for (const k in v) o[k] = stripDashes(v[k]);
    return o;
  }
  return v;
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
    const basePrompt = buildPrompt(audit);
    let data = null;
    for (let attempt = 0; attempt < 2 && !data; attempt++) {
      const msg = await client.messages.create({
        model: MODEL,
        max_tokens: 8192,
        system: SYSTEM,
        tools: [AUDIT_TOOL],
        tool_choice: { type: "tool", name: "emit_audit" },
        messages: [{ role: "user", content: basePrompt }],
      });
      const blocks = msg.content || [];
      let candidate = blocks.find((b) => b.type === "tool_use")?.input || null;
      if (!candidate) {
        // Defensive: if a model ever answers in text despite the forced tool, parse it.
        candidate = extractJson(blocks.find((b) => b.type === "text")?.text || "");
      }
      if (validReport(candidate)) data = candidate;
    }
    if (!data) {
      console.error("Audit fell back to deterministic after retries (no valid tool output).");
      return Response.json(deterministicReport(audit));
    }
    return Response.json({ url: audit.url, signals: audit.signals, ...stripDashes(data), model: MODEL });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
