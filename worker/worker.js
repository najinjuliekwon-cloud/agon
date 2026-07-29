/**
 * AGON API 프록시 — Cloudflare Worker
 *
 * 브라우저에 API 키를 노출하지 않기 위한 중계 서버입니다.
 * 앱은 이 Worker로 요청을 보내고, Worker가 키를 붙여 Anthropic API로 전달합니다.
 *
 * 배포:
 *   npx wrangler deploy
 *   npx wrangler secret put ANTHROPIC_API_KEY
 *
 * ALLOWED_ORIGIN 은 wrangler.toml 의 [vars] 에서 본인 GitHub Pages 주소로 바꾸세요.
 */

const MODEL_ALLOWLIST = ["claude-sonnet-4-6"];

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors });
    }

    try {
      const body = await request.json();

      // 남용 방지: 모델과 토큰 상한을 서버에서 고정
      if (!MODEL_ALLOWLIST.includes(body.model)) {
        return json({ error: { message: "model not allowed" } }, 400, cors);
      }
      body.max_tokens = Math.min(body.max_tokens || 1000, 1000);

      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });

      const data = await upstream.json();
      return json(data, upstream.status, cors);
    } catch (e) {
      return json({ error: { message: String(e && e.message) } }, 500, cors);
    }
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
