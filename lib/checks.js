// Deterministic AI-legibility checks. No external APIs, no keys.
// Fetches the homepage + robots.txt + sitemap.xml + llms.txt and extracts the
// structural signals AI engines read — the Discoverability + Clarity layer of DCAT.

const UA = "CalibreAuditBot/1.0 (+https://www.calibrestudio.co)";

function normalizeUrl(input) {
  let u = (input || "").trim();
  if (!u) throw new Error("No URL provided");
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  return new URL(u);
}

async function fetchText(url, timeoutMs = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,*/*" },
      redirect: "follow",
      signal: ctrl.signal,
    });
    const body = res.ok ? (await res.text()).slice(0, 2000000) : "";
    return { ok: res.ok, status: res.status, body, finalUrl: res.url };
  } catch (e) {
    return { ok: false, status: 0, body: "", error: String(e) };
  } finally {
    clearTimeout(t);
  }
}

async function exists(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: ctrl.signal });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

function stripToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function first(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

export async function auditSite(input) {
  const url = normalizeUrl(input);
  const origin = url.origin;

  const home = await fetchText(url.href);
  if (!home.ok) {
    return { reachable: false, status: home.status, origin, url: url.href };
  }
  const html = home.body;

  const jsonLdBlocks = [
    ...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ].map((m) => m[1]);
  const schemaTypes = [];
  for (const block of jsonLdBlocks) {
    for (const m of block.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) schemaTypes.push(m[1]);
  }

  const [robotsTxt, sitemapXml, llmsTxt, llmsFullTxt] = await Promise.all([
    exists(origin + "/robots.txt"),
    exists(origin + "/sitemap.xml"),
    exists(origin + "/llms.txt"),
    exists(origin + "/llms-full.txt"),
  ]);

  const title = first(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const metaDescription =
    first(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, html) ||
    first(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html);
  const ogTitle = !!first(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i, html);
  const ogDescription = !!first(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i, html);
  const ogImage = !!first(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i, html);
  const canonical = first(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i, html);
  const htmlLang = first(/<html[^>]+lang=["']([^"']*)["']/i, html);
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripToText(m[1])).filter(Boolean);
  const text = stripToText(html);

  return {
    reachable: true,
    url: home.finalUrl || url.href,
    origin,
    signals: {
      title,
      titleLength: title ? title.length : 0,
      metaDescription,
      metaDescriptionLength: metaDescription ? metaDescription.length : 0,
      hasCanonical: !!canonical,
      ogTitle,
      ogDescription,
      ogImage,
      htmlLang,
      hasViewport,
      h1Count: h1s.length,
      firstH1: h1s[0] || null,
      jsonLdCount: jsonLdBlocks.length,
      schemaTypes: [...new Set(schemaTypes)],
      robotsTxt,
      sitemapXml,
      llmsTxt,
      llmsFullTxt,
      wordCount: text ? text.split(" ").length : 0,
    },
    homepageText: text.slice(0, 6000),
  };
}
