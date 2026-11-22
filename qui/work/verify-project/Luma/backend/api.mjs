// This module also runs in the local Node host through the same Fetch API.
const ISSNS = new Set([
  "0028-0836",
  "0036-8075",
  "0031-9007",
  "1545-7885",
  "0002-7863",
  "1752-0894",
  "0003-486X",
  "0004-6361",
]);
const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1"]);
const aiModel = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const memo = new Map();

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}
function textTitle(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/g,
      (_, key) =>
        ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[key],
    )
    .slice(0, 500);
}
async function upstream(url, options = {}, timeout = 18000) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeout),
  });
  if (!response.ok) throw new Error("upstream");
  return response.json();
}
async function cached(key, read) {
  const entry = memo.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  const data = await read();
  memo.set(key, { data, expires: Date.now() + 900000 });
  return data;
}
async function news(issn) {
  if (!ISSNS.has(issn)) return json({ error: "Revista desconocida." }, 400);
  const records = await cached("journal:" + issn, async () => {
    const url = new URL("https://api.crossref.org/journals/" + issn + "/works");
    url.search = new URLSearchParams({
      filter:
        "type:journal-article,until-pub-date:" +
        new Date().toISOString().slice(0, 10),
      sort: "published",
      order: "desc",
      rows: "8",
      select: "DOI,title,published,author,container-title",
    }).toString();
    const data = await upstream(url, {
      headers: { Accept: "application/json" },
    });
    const items = (data.message?.items || [])
      .filter((w) => w.title?.[0] && /^10\.\d{4,9}\/\S+$/i.test(w.DOI))
      .map((w) => {
        const a = w.author?.[0],
          by = a && (a.name || [a.given, a.family].filter(Boolean).join(" "));
        return {
          title: textTitle(w.title[0]),
          doi: w.DOI,
          journal: w["container-title"]?.[0] || "",
          author: by
            ? by + (w.author.length > 1 ? " y colaboradores" : "")
            : "",
          date: (w.published?.["date-parts"]?.[0] || [])
            .map((n, i) => String(n).padStart(i ? 2 : 4, "0"))
            .join("-"),
        };
      });
    if (!items.length) throw new Error("empty");
    return { items, fetched: new Date().toISOString(), source: "Crossref" };
  });
  return json(records);
}
async function publicYoutubeFeed() {
  const uri =
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCAY-SMFNfynqz1bdoaV8BeQ";
  const res = await fetch(uri, { signal: AbortSignal.timeout(9000) });
  if (!res.ok) throw new Error("feed");
  const xml = await res.text();
  const items = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const part = match[1],
      id = part.match(/<yt:videoId>([\w-]{11})<\/yt:videoId>/)?.[1];
    const title = textTitle(part.match(/<title>([\s\S]*?)<\/title>/)?.[1]);
    const date = part.match(/<published>(\d{4}-\d{2}-\d{2})/)?.[1];
    if (id && title && date) items.push({ id, title, date });
    if (items.length === 6) break;
  }
  if (!items.length) throw new Error("empty");
  return { mode: "atom", items };
}
async function youtubeApi(env) {
  const byChannel = new URL("https://www.googleapis.com/youtube/v3/channels");
  byChannel.search = new URLSearchParams({
    part: "contentDetails",
    forHandle: "NASAGoddard",
    key: env.YOUTUBE_API_KEY,
  }).toString();
  const channels = await upstream(byChannel);
  const playlist =
    channels.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlist) throw new Error("channel");
  const byPlaylist = new URL(
    "https://www.googleapis.com/youtube/v3/playlistItems",
  );
  byPlaylist.search = new URLSearchParams({
    part: "snippet,contentDetails",
    playlistId: playlist,
    maxResults: "6",
    key: env.YOUTUBE_API_KEY,
  }).toString();
  const videos = await upstream(byPlaylist);
  return {
    mode: "api",
    items: (videos.items || [])
      .map((v) => ({
        id: v.contentDetails?.videoId,
        title: textTitle(v.snippet?.title),
        date: v.contentDetails?.videoPublishedAt?.slice(0, 10),
      }))
      .filter((v) => /^[\w-]{11}$/.test(v.id)),
  };
}
async function social(env) {
  try {
    const result = await cached("youtube", async () => {
      if (env.YOUTUBE_API_KEY) {
        try {
          const data = await youtubeApi(env);
          if (data.items.length) return data;
        } catch {}
      }
      return publicYoutubeFeed();
    });
    return json(result);
  } catch {
    return json({ items: [], mode: "channels" });
  }
}
async function payload(request, limit) {
  if (
    !request.headers
      .get("Content-Type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    return { err: json({ error: "Se requiere JSON." }, 415) };
  if (Number(request.headers.get("Content-Length")) > limit)
    return { err: json({ error: "Contenido demasiado largo." }, 413) };
  let size = 0;
  const reader = request.body?.getReader(),
    parts = [];
  if (!reader) return { err: json({ error: "Falta el contenido." }, 400) };
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > limit) {
      await reader.cancel();
      return { err: json({ error: "Contenido demasiado largo." }, 413) };
    }
    parts.push(value);
  }
  try {
    const input = JSON.parse(await new Blob(parts).text());
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("object");
    return { input };
  } catch {
    return { err: json({ error: "JSON no válido." }, 400) };
  }
}
function tutorProvider(env) {
  if (env.LOCAL_MODEL) return "ollama";
  if (
    env.AI ||
    (/^[a-f\d]{32}$/i.test(env.CF_AI_ACCOUNT_ID || "") && env.CF_AI_TOKEN)
  )
    return "workers-ai";
  return null;
}
async function tutor(request, env) {
  const provider = tutorProvider(env);
  if (!provider) return json({ error: "Guía local disponible." }, 503);
  const { input, err } = await payload(request, 20000);
  if (err) return err;
  if (
    !LEVELS.has(input.level) ||
    !Array.isArray(input.history) ||
    input.history.length > 8 ||
    !input.history.length ||
    input.history.at(-1)?.role !== "user"
  )
    return json({ error: "Conversación no válida." }, 400);
  const history = [];
  for (const message of input.history) {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim()
    )
      return json({ error: "Mensaje no válido." }, 400);
    history.push({
      role: message.role,
      content: message.content.slice(0, message.role === "user" ? 1200 : 2100),
    });
  }
  const system =
    "Eres el tutor de inglés científico de Luma. Nivel de inglés: " +
    input.level +
    ". Responde a la pregunta concreta en español sencillo, con un ejemplo muy corto en inglés. Para A1 usa frases como “Some fish glow.”, con palabras comunes y hasta ocho palabras por frase en inglés. Para B2 y C1 puedes usar términos académicos. Escribe texto plano, hasta 70 palabras. Usa solo citas que el estudiante haya proporcionado. Si recibes únicamente un título, enseña su idioma. Evita atribuir resultados o palabras a los autores. Glosario verificado de la lección: glow = brillar o emitir una luz suave; shine = brillar, puede incluir emisión o reflexión; evidence = evidencia; wave = onda; gap = diferencia o intervalo. Presenta ejemplos creados como ejemplos. Mantén la conversación centrada en aprender inglés y conceptos de ciencias.";
  const messages = [{ role: "system", content: system }];
  if (typeof input.context === "string" && input.context.trim())
    messages.push({
      role: "user",
      content:
        "Estoy practicando con este título de artículo: " +
        JSON.stringify(input.context.slice(0, 500)),
    });
  messages.push(...history);
  let reply;
  if (env.LOCAL_MODEL) reply = await env.LOCAL_MODEL(messages);
  else if (env.AI) {
    const result = await env.AI.run(aiModel, { messages, max_tokens: 320 });
    reply = result.response;
  } else {
    const endpoint =
      "https://api.cloudflare.com/client/v4/accounts/" +
      env.CF_AI_ACCOUNT_ID +
      "/ai/run/" +
      aiModel;
    const result = await upstream(
      endpoint,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + env.CF_AI_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages, max_tokens: 320 }),
      },
      55000,
    );
    reply = result.result?.response;
  }
  if (typeof reply !== "string" || !reply.trim()) throw new Error("empty");
  return json({ reply: reply.trim(), provider });
}
const rejectOrigin = (request, url) => {
  const origin = request.headers.get("Origin");
  return (
    (origin && origin !== url.origin) ||
    request.headers.get("Sec-Fetch-Site") === "cross-site"
  );
};
async function progress(request, env, url, siteIdentity) {
  if (!env.DB) return json({ error: "Usa el guardado del navegador." }, 503);
  if (rejectOrigin(request, url))
    return json({ error: "Origen no permitido." }, 403);
  const userId =
    siteIdentity && request.headers.get("oai-authenticated-user-id");
  const token = userId
    ? "site:" + userId
    : request.headers
        .get("Cookie")
        ?.match(/(?:^|;\s*)luma_profile=([0-9a-f]{64})(?:;|$)/)?.[1];
  if (request.method === "GET") {
    const profile =
      token ||
      [...crypto.getRandomValues(new Uint8Array(32))]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    const { results } = await env.DB.prepare(
      "SELECT key,value FROM learner_values WHERE profile=?",
    )
      .bind(profile)
      .all();
    const values = Object.fromEntries(
      results.map((row) => [row.key, JSON.parse(row.value)]),
    );
    const cookie =
      "luma_profile=" +
      profile +
      "; Max-Age=31536000; Path=/api; HttpOnly; SameSite=Strict" +
      (url.protocol === "https:" ? "; Secure" : "");
    return json({ values }, 200, token ? {} : { "Set-Cookie": cookie });
  }
  if (request.method !== "PUT")
    return json({ error: "Método no permitido." }, 405, { Allow: "GET, PUT" });
  if (!token) return json({ error: "Inicializa el perfil con GET." }, 401);
  const { input, err } = await payload(request, 192000);
  if (err) return err;
  if (
    typeof input.key !== "string" ||
    !input.key.length ||
    input.key.length > 240 ||
    /[\u0000-\u001f]/.test(input.key) ||
    ["__proto__", "prototype", "constructor"].includes(input.key) ||
    !Object.hasOwn(input, "value")
  )
    return json({ error: "Clave o valor incorrecto." }, 400);
  await env.DB.prepare(
    "INSERT INTO learner_values(profile,key,value) VALUES(?,?,?) ON CONFLICT(profile,key) DO UPDATE SET value=excluded.value",
  )
    .bind(token, input.key, JSON.stringify(input.value))
    .run();
  return json({ ok: true });
}
export default {
  async fetch(request, env = {}, ctx, siteIdentity = false) {
    const url = new URL(request.url),
      path = url.pathname;
    try {
      if (path === "/api/progress")
        return await progress(request, env, url, siteIdentity);
      if (path === "/api/tutor") {
        if (request.method !== "POST")
          return json({ error: "Usa POST." }, 405, { Allow: "POST" });
        if (rejectOrigin(request, url))
          return json({ error: "Origen no permitido." }, 403);
        return await tutor(request, env);
      }
      if (request.method !== "GET")
        return json({ error: "Usa GET." }, 405, { Allow: "GET" });
      if (path === "/api/status")
        return json({
          tutor: tutorProvider(env),
          youtube: !!env.YOUTUBE_API_KEY,
          progress: !!env.DB,
        });
      if (path === "/api/news")
        return await news(url.searchParams.get("journal") || "0028-0836");
      if (path === "/api/social") return await social(env);
      return json({ error: "Ruta desconocida." }, 404);
    } catch {
      return json(
        { error: "El servicio no está disponible en este momento." },
        502,
      );
    }
  },
};
