// Shared CORS for VNTA edge functions. The site is static (GitHub Pages on
// vnta.xyz); the browser calls these functions cross-origin, so explicit CORS is
// required. Wildcard is intentionally not used.

const ALLOWED_ORIGINS = new Set([
  'https://vnta.xyz',
  'https://www.vnta.xyz',
  'http://localhost:5173',
  'http://localhost:3000',
]);

function originFor(req: Request): string {
  const o = req.headers.get('origin') ?? '';
  return ALLOWED_ORIGINS.has(o) ? o : 'https://vnta.xyz';
}

export function corsHeaders(req: Request): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': originFor(req),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

export function handleCors(req: Request): Response | null {
  if (req.method !== 'OPTIONS') return null;
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}
