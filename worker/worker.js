/**
 * AGON API 프록시 — Cloudflare Worker
 *
 * 브라우저에 API 키를 노출하지 않기 위한 중계 서버입니다.
 * 앱은 이 Worker로 요청을 보내고, Worker가 Google Gemini API를 호출해
 * Anthropic Messages API와 같은 모양({content:[{type:"text",text:"..."}]})으로
 * 변환해 돌려줍니다 — 프론트엔드 callJudge()는 이 응답 모양만 보므로 수정이 필요 없습니다.
 *
 * 배포:
 *   npx wrangler deploy
 *   npx wrangler secret put GEMINI_API_KEY
 *
 * GEMINI_API_KEY 는 https://aistudio.google.com/apikey 에서 무료로 발급받습니다.
 * ALLOWED_ORIGIN 은 wrangler.toml 의 [vars] 에서 본인 GitHub Pages 주소로 바꾸세요.
 */

const GEMINI_MODEL = "gemini-3.6-flash";

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
      // 프론트는 항상 단일 user 메시지 하나만 보낸다 (messages: [{role:"user", content: promptText}]).
      const promptText = (body.messages || []).map((m) => m.content).join("\n");
      if (!promptText) {
        return json({ error: { message: "no prompt" } }, 400, cors);
      }

      // 남용 방지: 모델과 토큰 상한을 서버에서 고정 (클라이언트가 보낸 model은 무시)
      const maxTokens = Math.min(body.max_tokens || 1000, 2000);

      const upstream = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { maxOutputTokens: maxTokens, thinkingConfig: { thinkingBudget: 0 } },
          }),
        }
      );

      const data = await upstream.json();

      if (!upstream.ok) {
        const message = (data && data.error && data.error.message) || "gemini error";
        return json({ error: { message } }, upstream.status, cors);
      }

      const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
      const text = parts.map((p) => p.text || "").join("\n");
      if (!text) {
        return json({ error: { message: "empty response from gemini" } }, 502, cors);
      }

      return json({ content: [{ type: "text", text }] }, 200, cors);
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
