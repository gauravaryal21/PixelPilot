const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  }
});

async function topScores(db) {
  const { results } = await db.prepare(
    "SELECT name, score FROM scores ORDER BY score DESC, created_at ASC LIMIT 10"
  ).all();
  return results;
}

export async function onRequestGet({ env }) {
  try {
    return json({ scores: await topScores(env.DB) });
  } catch {
    return json({ error: "Leaderboard is unavailable." }, 503);
  }
}

export async function onRequestPost({ request, env }) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Send JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 2048) {
    return json({ error: "Request is too large." }, 413);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return json({ error: "Invalid score payload." }, 400);
  }

  const runId = String(payload.runId || "").slice(0, 64);
  const name = String(payload.name || "PILOT")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim()
    .slice(0, 12) || "PILOT";
  const score = Number(payload.score);

  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(runId)) {
    return json({ error: "Invalid run ID." }, 400);
  }
  if (!Number.isSafeInteger(score) || score < 0 || score > 10000000) {
    return json({ error: "Invalid score." }, 400);
  }

  try {
    const results = await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO scores (run_id, name, score)
        VALUES (?, ?, ?)
        ON CONFLICT(run_id) DO UPDATE SET
          name = excluded.name,
          score = MAX(scores.score, excluded.score)
      `).bind(runId, name, score),
      env.DB.prepare(`
        DELETE FROM scores
        WHERE run_id NOT IN (
          SELECT run_id FROM scores
          ORDER BY score DESC, created_at ASC
          LIMIT 100
        )
      `),
      env.DB.prepare(
        "SELECT name, score FROM scores ORDER BY score DESC, created_at ASC LIMIT 10"
      )
    ]);

    return json({ saved: true, scores: results[2].results });
  } catch {
    return json({ error: "Could not save score." }, 503);
  }
}
