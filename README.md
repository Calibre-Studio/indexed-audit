# Calibre Studio — AI Visibility Audit (Vercel)

A public, self-serve AI visibility audit for calibrestudio.co. A prospect enters their URL, the tool reads their site the way an AI engine does, scores it on **DCAT** (Discoverability, Clarity, Authority, Trust), returns evidence-tiered findings + a 90-day plan, captures the lead to GoHighLevel, and drives to your Calendly.

Built on the **Solid State AI SEO Kit** methodology. One paid API (Anthropic). No Ahrefs, no SEO subscription.

---

## What it does (and the one honest limit)

The free tool runs the layers that can be measured from a site's public HTML in seconds:

- **Discoverability** — JSON-LD, canonicals, sitemap.xml, robots.txt, llms.txt, viewport, crawlable title/H1. *(deterministic, in `lib/checks.js`)*
- **Clarity** — title, meta description, H1, og tags, and an entity-clarity read of the homepage. *(Claude)*

**Authority** and **Trust** need third-party citation data and live "money query" runs across the five AI engines — that's the **paid Calibre engagement** (running the full kit). The tool shows them as *provisional* and uses them as the reason to book the call. This keeps the free tool honest and protects the offer.

This mirrors the kit's own rule: same-day runs verify structure; citation lift takes weeks and a follow-up `ai-visibility-check`.

---

## Architecture

```
app/page.jsx           Public UI — form + report (client component, Calibre monochrome)
app/api/audit/route.js Fetches the site → deterministic DCAT signals → Claude scores + findings + 90-day plan
app/api/lead/route.js  Forwards the captured lead to a GHL inbound webhook
lib/checks.js          The deterministic site reader (no keys)
```

The Anthropic key lives **server-side only** (API route). It is never exposed to the browser.

---

## Run locally

```bash
cp .env.example .env.local      # then fill in ANTHROPIC_API_KEY
npm install
npm run dev                     # http://localhost:3000
```

Without an `ANTHROPIC_API_KEY`, the audit still runs in a deterministic-only fallback mode (structural scoring, no AI narrative) — useful for testing the flow.

---

## Environment variables

| Var | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | The only paid API. console.anthropic.com |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-haiku-4-5-20251001` — cheapest/fastest, plenty here |
| `GHL_WEBHOOK_URL` | No | GHL Inbound Webhook trigger URL. Blank = leads logged server-side only |
| `NEXT_PUBLIC_CALENDLY_URL` | No | Defaults to `https://calendly.com/calibrestudio` |

---

## Deploy to Vercel

1. Push this folder to a Git repo (GitHub/GitLab).
2. In Vercel: **New Project → import the repo** (framework auto-detects as Next.js).
3. Add the env vars above in **Project → Settings → Environment Variables**.
4. Deploy.

Or with the CLI:

```bash
npm i -g vercel
vercel            # preview
vercel --prod     # production
```

### Domain

Keep Framer on the apex/`www`. Point a **subdomain** at Vercel — cleanest is `audit.calibrestudio.co`:

- Vercel → Project → Domains → add `audit.calibrestudio.co`
- Add the CNAME Vercel gives you at your DNS provider.

(Alternatively, embed the deployed URL inside the Framer `/ai-audit` page from the build-spec doc.)

---

## Wire the lead to GoHighLevel

1. In GHL, create a **Workflow** with an **Inbound Webhook** trigger. Copy its URL.
2. Set it as `GHL_WEBHOOK_URL` in Vercel.
3. In the workflow: **Create/Update Contact** mapping `email`, `name`, `website`; add tag `source: ai-audit`; (optional) store the scores in custom fields; drop them in your `Audit Run` pipeline stage and the 3-email nurture.

The tool sends: `name, firstName, email, website, source, overall_score, discoverability, clarity, authority, trust, submitted_at`.

---

## How it fits the funnel

- This tool = the **AEO layer the GHL "Analyze My Business" report can't produce.** Use it as the AI-visibility front door.
- Free audit (Discoverability + Clarity) → lead captured → **Book your visibility call** (Calendly).
- On/after the call, run the **full AI SEO Kit** (all nine skills, Authority + multi-engine citation) = the paid **Indexed** deliverable.
- Then **Directed** for the visuals once they're found.

---

## Phase 2 — make Authority + Trust live

To move those two layers from provisional to measured, add one of:

- **Perplexity API** (`sonar`) or **OpenAI** — run the prospect's money queries ("best [service] in [city]") and parse whether they're named/cited.
- **A SERP/AI-Overview source** (e.g. SerpApi, Firecrawl) — capture Google AI Overview citations.
- Or trigger a **Claude Agent SDK** job that runs your actual AI SEO Kit skills end-to-end and returns the verdict file.

All optional, all additive — the v1 above ships and converts without them.

---

## Cost

- Anthropic Haiku per audit ≈ fractions of a cent (one short call).
- Vercel Hobby is free for this; Pro if you want the 300s function ceiling and more traffic.
- GHL: already yours.
