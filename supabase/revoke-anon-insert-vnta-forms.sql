-- revoke-anon-insert-vnta-forms.sql
--
-- Make the verified vnta-submit edge function the ONLY way rows are created in
-- vnta_applications and vnta_inquiries. The edge function uses the service role
-- (bypasses RLS) after verifying the Cloudflare Turnstile token; revoking the
-- anon/authenticated INSERT policy closes the direct browser-insert path.
--
-- The validation that previously lived in the INSERT policy WITH CHECK is re-added
-- here as TABLE CHECK constraints, so it still applies to the service-role inserts
-- (defense in depth). There were no table CHECK constraints before this; the
-- checks were policy-only, which the service role would have bypassed.
--
-- DO NOT APPLY until the vnta-submit edge function is deployed AND
-- TURNSTILE_SECRET_KEY is set on the project. Applying earlier breaks both forms.
-- Apply via the dashboard/SQL editor; not run automatically.

-- 1) Close the direct anon/authenticated insert path.
drop policy if exists "vnta_applications_insert" on public.vnta_applications;
drop policy if exists "vnta_inquiries_insert"   on public.vnta_inquiries;

-- 2) Preserve validation as table constraints (mirrors the old policy WITH CHECK).
alter table public.vnta_applications
  add constraint vnta_applications_valid check (
    name is not null and char_length(name) between 1 and 200
    and email is not null and char_length(email) between 3 and 200
    and char_length(coalesce(pitch, '')) <= 8000
    and char_length(coalesce(links, '')) <= 2000
    and char_length(coalesce(vendr_examples, '')) <= 4000
    and char_length(coalesce(location, '')) <= 300
  );

alter table public.vnta_inquiries
  add constraint vnta_inquiries_valid check (
    kind = any (array['tailored', 'contact'])
    and char_length(coalesce(name, '')) <= 200
    and char_length(coalesce(email, '')) <= 200
    and char_length(coalesce(company, '')) <= 300
    and char_length(coalesce(notes, '')) <= 8000
  );
