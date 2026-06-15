// Forwards the captured lead to GoHighLevel.
// Set GHL_WEBHOOK_URL to an Inbound Webhook trigger URL from a GHL workflow.
// The workflow maps these fields to a contact and tags it source = ai-audit.

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, website, scores, verdict } = body || {};
    if (!email) return Response.json({ error: "Email required." }, { status: 400 });

    const payload = {
      name: name || "",
      firstName: (name || "").split(" ")[0] || "",
      email,
      website: website || "",
      source: "ai-audit",
      tag: "source: ai-audit",
      overall_score: scores?.overall ?? "",
      discoverability: scores?.discoverability ?? "",
      clarity: scores?.clarity ?? "",
      authority: scores?.authority ?? "",
      trust: scores?.trust ?? "",
      verdict: verdict || "",
      submitted_at: new Date().toISOString(),
    };

    const hook = process.env.GHL_WEBHOOK_URL;
    if (hook) {
      try {
        await fetch(hook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        // Don't fail the user's audit if the CRM hook is down — just log.
        console.error("GHL webhook failed:", String(e));
      }
    } else {
      console.log("Lead captured (no GHL_WEBHOOK_URL set):", payload);
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
