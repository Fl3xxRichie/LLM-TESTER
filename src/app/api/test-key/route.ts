import { NextResponse } from 'next/server';

const TIMEOUT_MS = 15_000;

/** Fetch with an AbortController timeout. */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Safely parse JSON from a response; returns null on failure. */
async function safeJson(resp: Response): Promise<any> {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

/** Extract a human-readable error message from a provider response. */
function extractError(json: any, resp: Response): string {
  if (json?.error?.message) return json.error.message;
  if (json?.error?.type) return `${json.error.type}: ${json.error.status || 'unknown'}`;
  if (json?.message) return json.message;
  return `HTTP ${resp.status}: ${resp.statusText || 'Unknown error'}`;
}

export async function POST(req: Request) {
  try {
    const { key, provider } = await req.json();

    if (!key || !provider) {
      return NextResponse.json({ error: 'Missing key or provider' }, { status: 400 });
    }

    if (provider === 'unknown') {
      return NextResponse.json({
        status: 'DEAD',
        details: 'Could not auto-detect provider. Key format not recognized.',
      });
    }

    let status = 'DEAD';
    let details = '';

    // ── OpenAI ───────────────────────────────────────────────
    if (provider === 'openai') {
      const resp = await fetchWithTimeout('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.data?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    // ── Anthropic (lightweight auth check — does NOT consume tokens) ─
    else if (provider === 'anthropic') {
      // Send a request with an intentionally invalid model name.
      // If the key is valid → 400 "model not found" (proves auth works).
      // If the key is invalid → 401 "invalid x-api-key".
      const resp = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-auth-check-invalid-model',
          max_tokens: 1,
          messages: [{ role: 'user', content: '.' }],
        }),
      });
      const json = await safeJson(resp);
      const errorType = json?.error?.type || '';
      const errorMsg = json?.error?.message || '';

      if (resp.status === 404 || errorType === 'not_found_error') {
        // Key is valid — we got "model not found" which proves authentication passed
        status = 'ACTIVE';
        details = 'Authenticated — API key is valid';
      } else if (resp.ok) {
        // Somehow succeeded (shouldn't happen with invalid model, but handle it)
        status = 'ACTIVE';
        details = 'Authenticated — API key is valid';
      } else if (resp.status === 401 || errorType === 'authentication_error') {
        details = errorMsg || 'Invalid API key';
      } else {
        details = extractError(json, resp);
      }
    }

    // ── Gemini / Google ──────────────────────────────────────
    else if (provider === 'gemini') {
      const resp = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
      );
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.models?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    // ── Grok / xAI ───────────────────────────────────────────
    else if (provider === 'grok') {
      const resp = await fetchWithTimeout('https://api.x.ai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.data?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    // ── Groq ─────────────────────────────────────────────────
    else if (provider === 'groq') {
      const resp = await fetchWithTimeout('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.data?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    // ── Mistral ──────────────────────────────────────────────
    else if (provider === 'mistral') {
      const resp = await fetchWithTimeout('https://api.mistral.ai/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.data?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    // ── DeepSeek ─────────────────────────────────────────────
    else if (provider === 'deepseek') {
      const resp = await fetchWithTimeout('https://api.deepseek.com/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      const json = await safeJson(resp);
      if (resp.ok) {
        const modelCount = json?.data?.length ?? '?';
        status = 'ACTIVE';
        details = `Authenticated — ${modelCount} models available`;
      } else {
        details = extractError(json, resp);
      }
    }

    return NextResponse.json({ status, details });
  } catch (err: any) {
    const message =
      err.name === 'AbortError'
        ? 'Request timed out — provider did not respond within 15 seconds'
        : err.message || 'Unexpected server error';
    return NextResponse.json({ status: 'DEAD', details: message }, { status: 500 });
  }
}
