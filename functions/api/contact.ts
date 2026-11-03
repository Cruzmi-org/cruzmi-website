/**
 * POST /api/contact — Cloudflare Pages Function.
 * Validates the form, checks Cloudflare Turnstile, then sends the message to CONTACT_TO
 * through the Brevo transactional email API. Replies JSON: { ok: true } or { ok: false, error }.
 *
 * Environment (Cloudflare Pages > Settings > Variables and secrets):
 *   BREVO_API_KEY         secret — Brevo API key (v3)
 *   TURNSTILE_SECRET_KEY  secret — Turnstile widget secret key
 *   CONTACT_TO            optional — default contact@cruzmi.com
 *   CONTACT_FROM          optional — sender on the Brevo-authenticated domain, default no-reply@cruzmi.com
 */
import { parseContact, type ContactErrorCode, type ContactInput } from '../../src/lib/contact';

interface Env {
  BREVO_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const SUBJECT_LABELS: Record<ContactInput['subject'], string> = {
  app: "Question sur l'application",
  albums: 'Albums photo',
  pro: 'Professionnel',
  press: 'Presse et partenariats',
  other: 'Autre',
};

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
const fail = (error: ContactErrorCode, status: number) => json({ ok: false, error }, status);

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret, response: token, remoteip: ip ?? undefined }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

async function sendWithBrevo(env: Env, input: ContactInput): Promise<boolean> {
  const fullName = `${input.firstName} ${input.lastName}`;
  const text = [
    `Nouveau message depuis le formulaire de contact du site (${input.locale.toUpperCase()}).`,
    '',
    `Nom : ${fullName}`,
    `E-mail : ${input.email}`,
    `Objet : ${SUBJECT_LABELS[input.subject]}`,
    '',
    input.message,
    '',
    '— Répondez directement à cet e-mail pour répondre à l’expéditeur.',
  ].join('\n');

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY!,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Site Cruzmi', email: env.CONTACT_FROM || 'no-reply@cruzmi.com' },
      to: [{ email: env.CONTACT_TO || 'contact@cruzmi.com' }],
      replyTo: { email: input.email, name: fullName },
      subject: `[Site] ${SUBJECT_LABELS[input.subject]} — ${fullName}`,
      textContent: text,
      tags: ['site-contact'],
    }),
  });
  if (!res.ok) console.error('Brevo error', res.status, await res.text());
  return res.ok;
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  // Only accept submissions coming from our own pages.
  const origin = request.headers.get('origin');
  if (origin) {
    let sameHost = false;
    try {
      sameHost = new URL(origin).host === new URL(request.url).host;
    } catch {
      // Opaque origins ("null") are rejected.
    }
    if (!sameHost) return fail('validation', 403);
  }

  if (!env.BREVO_API_KEY || !env.TURNSTILE_SECRET_KEY) {
    console.error('Contact form: missing BREVO_API_KEY or TURNSTILE_SECRET_KEY');
    return fail('send', 500);
  }

  let raw: Record<string, unknown>;
  try {
    raw = Object.fromEntries(await request.formData());
  } catch {
    return fail('validation', 400);
  }

  // Honeypot: real users never see this field. Pretend success so bots learn nothing.
  if (typeof raw.website === 'string' && raw.website.trim() !== '') return json({ ok: true });

  const input = parseContact(raw);
  if (!input) return fail('validation', 400);

  const token = typeof raw['cf-turnstile-response'] === 'string' ? raw['cf-turnstile-response'] : '';
  if (!token || !(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, request.headers.get('cf-connecting-ip')))) {
    return fail('captcha', 400);
  }

  return (await sendWithBrevo(env, input)) ? json({ ok: true }) : fail('send', 502);
}
