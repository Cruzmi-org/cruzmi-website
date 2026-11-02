/**
 * Contact form rules, shared by the page (HTML constraints) and the Cloudflare Pages Function
 * (server-side validation) so they never drift apart.
 */
export const SUBJECTS = ['app', 'albums', 'pro', 'press', 'other'] as const;
export type Subject = (typeof SUBJECTS)[number];

export const LIMITS = {
  name: 80,
  email: 254,
  messageMin: 10,
  messageMax: 5000,
} as const;

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  subject: Subject;
  message: string;
  locale: 'fr' | 'en';
}

export type ContactErrorCode = 'validation' | 'captcha' | 'send';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Header-injection guard: names end up in the email subject line.
const NO_CONTROL_CHARS = /^[^\r\n\t\0]*$/;

/** Returns the cleaned input, or null when anything is missing or invalid. */
export function parseContact(raw: Record<string, unknown>): ContactInput | null {
  const str = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '');
  const input = {
    firstName: str('firstName'),
    lastName: str('lastName'),
    email: str('email'),
    subject: str('subject') as Subject,
    message: str('message'),
    locale: str('locale') === 'en' ? 'en' : 'fr',
  } satisfies ContactInput;

  const nameOk = (n: string) => n.length > 0 && n.length <= LIMITS.name && NO_CONTROL_CHARS.test(n);
  if (!nameOk(input.firstName) || !nameOk(input.lastName)) return null;
  if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) return null;
  if (!SUBJECTS.includes(input.subject)) return null;
  if (input.message.length < LIMITS.messageMin || input.message.length > LIMITS.messageMax) return null;
  return input;
}
