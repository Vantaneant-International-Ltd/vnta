// Cloudflare Turnstile client helper for the VNTA static site.
//
// The SITE key is public and read from env (PUBLIC_TURNSTILE_SITE_KEY), never
// hardcoded. This loads the Turnstile script once, renders an explicit widget into
// a container element, and hands back the token via callback. It also posts the
// verified payload to the vnta-submit edge function (the token is verified there,
// server-side, before any insert).

const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined;
const FN_URL = `${import.meta.env.PUBLIC_SUPABASE_URL}/functions/v1/vnta-submit`;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
}
function api(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile;
}

let scriptLoading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (api()) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load the verification widget.'));
    document.head.appendChild(s);
  });
  return scriptLoading;
}

/** True when a site key is configured. If false, the form should refuse to submit. */
export function turnstileConfigured(): boolean {
  return !!SITE_KEY;
}

/** Render a widget into `el`. `onToken` fires with the solved token; `onReset`
 *  fires when it expires or errors. Returns the widget id for resetTurnstile. */
export async function renderTurnstile(
  el: HTMLElement,
  onToken: (token: string) => void,
  onReset?: () => void,
): Promise<string | null> {
  if (!SITE_KEY) return null;
  await loadScript();
  const ts = api();
  if (!ts) return null;
  return ts.render(el, {
    sitekey: SITE_KEY,
    callback: onToken,
    'expired-callback': () => onReset?.(),
    'error-callback': () => onReset?.(),
  });
}

export function resetTurnstile(id: string | null): void {
  const ts = api();
  if (ts && id) ts.reset(id);
}

/** POST a form payload to the vnta-submit edge function. */
export async function submitVnta(
  form: 'inquiry' | 'application',
  data: Record<string, unknown>,
  turnstileToken: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(FN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ form, data, turnstileToken }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) return { ok: false, error: json.error || `Request failed (${res.status}).` };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error. Please try again.' };
  }
}
