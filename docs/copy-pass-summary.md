# Copy & Structure Pass, review summary

Branch: `copy/offer-legibility` (3 commits). Nothing merged.
Preview: http://localhost:5176 (dev, hot-reloads).

The problem this addresses: the site led with identity and hid the offer. Every
page now tells the reader what they get and ends with one ask (the Diagnosis).

## Hard rules, status

- En dashes: none anywhere (swept all of `src/`).
- No BUILDT mention on the public site.
- No future dates except the availability line (now Q2 2027). All maison dates and
  the /horizon timeline removed.
- /legal, /privacy, /terms untouched.
- 750 euro Diagnosis price and scope unchanged.
- "Áilleacht na díomhaointe" preserved (homepage hero).
- Monochrome, existing type stack, no serif, no emoji. Copy and existing section
  grammar only, no new visual elements.
- "Diagnosis" capitalised sitewide (fixed one lowercase copy instance in /explore).

## Homepage (/), heaviest edit

- Hero subline. Before: "A modern holding company building and guiding premium
  maisons through strategy, design systems, and clear long-term direction."
  After: "We take residence inside one brand at a time: strategy, identity, and
  direction, led rather than advised."
- Availability: "One seat. Q3 2026." to "One seat. Q2 2027." (per your note, no
  client this year).
- Hero CTA: "Engagement" (navigation) to "Request a Diagnosis" (to /explore). This
  is the quieter secondary ask.
- NEW Problem beat, after the hero. On the branch: "Most brands are run by
  committee. Every decision relitigated, every asset slightly off, nobody holding
  the line." CANDIDATES for your pick below.
- NEW Features echo, "Inside the residency": three lines compressing the /explore
  pillars (Cadence, Leadership, Outcome). Not duplicated verbatim.
- Maisons index: removed the dates (March 2026, Summer 2026, 2027).
- NEW closing CTA (the single ask): "Begin with a Diagnosis. Two weeks, 750 euro
  fixed, a clear read on what comes next." plus "Request a Diagnosis" (to /explore).
  Removed the competing "View the Horizon" button.
- Meta: "VNTA, A Modern Holding Company" to "VNTA, Brand Leadership in Residence";
  description now leads with the offer.
- Kept: the Gaelic line, Aim & Vision statement, Brand Values.

### Problem beat, pick one (I did not pick silently)

- A (on the branch): "Most brands are run by committee. Every decision
  relitigated, every asset slightly off, nobody holding the line."
- B: "Most brands drift. Direction set by whoever spoke last, standards that slip
  between hires, no single hand on the wheel."
- C: "A brand without an owner erodes. Decisions relitigated, the work goes
  slightly off, and no one is accountable for the whole."

### FLAG, Story line (needs you)

One sentence on why VNTA exists, as a bridge into the houses index. I did not
invent it; the founding logic is yours. Send a sentence and I will place it.

## /houses

- Removed all dates and statuses: Vendr "In Progress · March 2026", Eirvox
  "Launching Summer 2026", Maison Seul "Coming 2027". Each entry is now the house
  name plus its one-line description, nothing more.
- Footnote: removed "Release windows are indicative and may shift." Kept the
  trademark note.

## Footer (site-wide)

- Removed the maison status dates (Vendr March 2026, Eirvox Summer 2026, Maison
  Seul 2027). Names only now.
- Removed "Horizon" from the footer navigation.

## /explore (Engagement), lightest touch

- BUG FIX: the inquiry modal would not close. Cause was the `use:portal` action
  re-appending the modal node back into the page on teardown. Removed it; the
  backdrop is `position: fixed` so it still overlays. Now closes on the close
  button, Cancel, backdrop click, and Escape.
- CTA verified consistent with the homepage ("Request a Diagnosis").
- No availability date on this page (the Q line lives only on the homepage).

## /about (The Studio)

- Ending changed from a generic "start a conversation / studio@vnta.xyz" to a
  quieter Diagnosis CTA: "If a residency is right, it begins with a Diagnosis. Two
  weeks, 750 euro fixed." plus "Request a Diagnosis" (ghost, to /explore).
- Owns Story (why VNTA exists, residency logic). Six beats read fine.

## /approach

- Added a closing Diagnosis CTA (ghost). The page previously ended with no action.
- FLAG, overlap with /explore: /approach is philosophy of working (Nature of
  engagements, Philosophy, Process); /explore is the commercial offer. Distinct
  enough to justify existing, but the pillars overlap conceptually. Your call:
  keep as philosophy, or consolidate into /explore. Left in place for now.

## /horizon, REMOVED (needs your confirmation)

- The whole page was a dated 2026-2027 quarterly timeline plus forward states
  ("In progress", "Launching", "Coming"). Every element breaks "no dates on future
  work." Stripping the dates would leave a thin near-duplicate of /houses.
- I removed the page and its nav and footer links on the branch. Reinstate if you
  disagree. If you want a page here, give me its non-dated purpose and I will
  rebuild it date-free.

## /careers

- Truth check: zero open roles. The page already said so with the email; I aligned
  "No open roles" to "No open positions" (matching the section header). The
  invitation and studio@vnta.xyz stay.

## Nav (mobile and desktop)

- Checked. The three items (The Studio, Engagement, Houses) are the right three:
  offer, story, proof. No additions recommended. Approach (possible consolidation)
  and Careers (no roles) stay footer-only. Menu unchanged.

## Unverified-claims scan

- Introduced no testimonials, metrics, client names, or outcomes. Existing claims
  left as-is: about's "Selected work and references available on request", and
  approach's "informed by work across early-stage ventures and founder-led brands.
  Positioning conducted both before and after VNTA's incorporation in 2025." These
  are yours; say if any should soften.

## Awaiting your call

1. Problem beat: A, B, or C.
2. Story line: send the founding sentence, or say skip.
3. /horizon: confirm removal, or reinstate with a date-free purpose.
4. /approach: keep as philosophy, or consolidate into /explore.
5. Metas for /about and /approach: left identity-led (not commercial pages). Say if
   you want them offer-led too.
