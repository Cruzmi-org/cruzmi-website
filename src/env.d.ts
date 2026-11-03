interface ImportMetaEnv {
  /** Cloudflare Turnstile site key (public). Falls back to Cloudflare's test key when unset. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
