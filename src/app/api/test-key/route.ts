import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { key, provider } = await req.json();

    if (!key || !provider) {
      return NextResponse.json({ error: 'Missing key or provider' }, { status: 400 });
    }

    let status = 'DEAD';
    let details = '';

    if (provider === 'openai') {
      const resp = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (resp.ok) status = 'ACTIVE';
      else details = (await resp.json()).error?.message || 'Invalid key';
    }
    else if (provider === 'anthropic') {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }],
        }),
      });
      if (resp.ok) status = 'ACTIVE';
      else details = (await resp.json()).error?.message || 'Invalid key';
    }
    else if (provider === 'gemini') {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      if (resp.ok) status = 'ACTIVE';
      else details = (await resp.json()).error?.message || 'Invalid key';
    }

    return NextResponse.json({ status, details });
  } catch (err: any) {
    return NextResponse.json({ status: 'DEAD', details: err.message }, { status: 500 });
  }
}
