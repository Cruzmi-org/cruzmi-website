/**
 * "Log in" button to Cruzmi Studio (web account), shown in the header.
 * Dormant for now: set `enabled: true` and fill `url` once Studio is open to the public
 * (pros: pro account; individuals: their projects and the app's features on the web).
 * See docs/reste-a-faire.md A8.
 */
export const accountLogin: { enabled: boolean; url: string } = {
  enabled: false,
  // TODO(team): public Cruzmi Studio sign-in URL (e.g. https://studio.cruzmi.com/login).
  url: '',
};

export const showAccountLogin = accountLogin.enabled && accountLogin.url !== '';
