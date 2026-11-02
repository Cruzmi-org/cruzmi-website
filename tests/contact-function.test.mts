// Exercises functions/api/contact.ts with mocked Turnstile / Brevo endpoints.
import { onRequestPost } from '../functions/api/contact.ts';

type Call = { url: string; body: any; headers: Record<string, string> };
let calls: Call[] = [];
let turnstileOk = true;
let brevoStatus = 201;

globalThis.fetch = (async (url: string, init: RequestInit) => {
  const body = JSON.parse(String(init.body));
  calls.push({ url, body, headers: init.headers as Record<string, string> });
  if (url.includes('turnstile')) return new Response(JSON.stringify({ success: turnstileOk }), { status: 200 });
  if (url.includes('brevo')) return new Response('{}', { status: brevoStatus });
  throw new Error('unexpected fetch ' + url);
}) as typeof fetch;
console.error = () => {}; // silence expected error logs

const env = { BREVO_API_KEY: 'k', TURNSTILE_SECRET_KEY: 's' };
const valid = {
  firstName: 'Marie',
  lastName: 'Durand',
  email: 'marie@example.com',
  subject: 'press',
  message: 'Bonjour, je prépare un article sur Cruzmi.',
  locale: 'fr',
  'cf-turnstile-response': 'tok',
};

function req(fields: Record<string, string>, origin = 'https://www.cruzmi.com') {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return new Request('https://www.cruzmi.com/api/contact', { method: 'POST', body: fd, headers: { origin } });
}

let failed = 0;
async function check(name: string, fields: Record<string, string>, expect: { status: number; body: object; fetches: number }, opts: { env?: object; origin?: string } = {}) {
  calls = [];
  const res = await onRequestPost({ request: req(fields, opts.origin), env: (opts.env ?? env) as any });
  const body = await res.json();
  const ok = res.status === expect.status && JSON.stringify(body) === JSON.stringify(expect.body) && calls.length === expect.fetches;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  -> ${res.status} ${JSON.stringify(body)} (${calls.length} fetch)`);
  return calls;
}

const sent = await check('valid message is sent', valid, { status: 200, body: { ok: true }, fetches: 2 });
const brevo = sent[1].body;
const payloadOk =
  sent[1].headers['api-key'] === 'k' &&
  brevo.to[0].email === 'contact@cruzmi.com' &&
  brevo.sender.email === 'no-reply@cruzmi.com' &&
  brevo.replyTo.email === 'marie@example.com' &&
  brevo.subject === '[Site] Presse et partenariats — Marie Durand' &&
  brevo.textContent.includes('je prépare un article') &&
  sent[0].body.response === 'tok';
if (!payloadOk) failed++;
console.log(`${payloadOk ? 'PASS' : 'FAIL'}  Brevo payload (to, sender, replyTo, subject, text, Turnstile token)`);

await check('honeypot filled -> silent success, nothing sent', { ...valid, website: 'spam.biz' }, { status: 200, body: { ok: true }, fetches: 0 });
await check('invalid email', { ...valid, email: 'pas-un-email' }, { status: 400, body: { ok: false, error: 'validation' }, fetches: 0 });
await check('message too short', { ...valid, message: 'Salut' }, { status: 400, body: { ok: false, error: 'validation' }, fetches: 0 });
await check('unknown subject', { ...valid, subject: 'hack' }, { status: 400, body: { ok: false, error: 'validation' }, fetches: 0 });
await check('newline in name (header injection)', { ...valid, lastName: 'Durand\nBcc: x@y.z' }, { status: 400, body: { ok: false, error: 'validation' }, fetches: 0 });
await check('missing Turnstile token', { ...valid, 'cf-turnstile-response': '' }, { status: 400, body: { ok: false, error: 'captcha' }, fetches: 0 });
turnstileOk = false;
await check('Turnstile rejects token', valid, { status: 400, body: { ok: false, error: 'captcha' }, fetches: 1 });
turnstileOk = true;
await check('cross-origin post', valid, { status: 403, body: { ok: false, error: 'validation' }, fetches: 0 }, { origin: 'https://evil.example' });
await check('opaque origin "null"', valid, { status: 403, body: { ok: false, error: 'validation' }, fetches: 0 }, { origin: 'null' });
await check('missing secrets', valid, { status: 500, body: { ok: false, error: 'send' }, fetches: 0 }, { env: {} });
brevoStatus = 401;
await check('Brevo error', valid, { status: 502, body: { ok: false, error: 'send' }, fetches: 2 });

console.log(failed ? `\n${failed} FAILED` : '\nALL PASSED');
process.exit(failed ? 1 : 0);
