# Antra Website — Fix Log

Running record of fixes applied during the numbered fix-request pass. Each entry
lists what changed and which files were touched.

---

## 1. Hero cube — clickable, links to Consultancy §03
Clicking the hero's 3D cube (a tap, not a drag) now navigates to
`/consultancy#what-clients-bring-us`, scrolling straight to Section 03
"What Clients Bring Us" — the cube's 6 faces are the same 6 problems listed
there. Dragging still spins the cube as before; only a near-stationary
press+release counts as a click. A hover badge above the cube reads
"03 · What Clients Bring Us →". Added app-wide hash-aware smooth scrolling
(via Lenis) so `#section-id` links work from any page.

**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`,
`src/pages/Consultancy/ProblemsSection.tsx` (added `id="what-clients-bring-us"`),
`src/App.tsx`

---

## 2. "Our Two Practices" section rewritten
Label "OUR TWO PRACTICES" → "What we do". Heading "Built for clients who need
both kinds of help." → "Our Services". Inserted the two client-provided
description paragraphs (organizational leadership / trading division text).

**Files:** `src/pages/Home/ServicePillarsSection.tsx`

---

## 3. Background texture matched to section above
Added the same subtle square grid line texture used by the (now-removed)
"What We Do" section, so the visual language is consistent.

**Files:** `src/pages/Home/ServicePillarsSection.module.css`

---

## 4. Removed duplicate "WHAT WE DO" section
It duplicated content now living in "Our Services". Deleted the component
files and unmounted it from the Home page.

**Files removed:** `src/pages/Home/WhatWeDoSection.tsx`, `WhatWeDoSection.module.css`
**Files:** `src/pages/Home/index.tsx`

---

## 5. Background color set to exact brand hex
Changed to `#0a2135` (Antra's primary navy) — later superseded by fix #10,
which restored full light/dark theme adaptation.

**Files:** `src/pages/Home/ServicePillarsSection.module.css`

---

## 6. "Our Services" section redesigned
Replaced the oversized centered layout with a left-aligned header (label +
heading matching the site's established convention) and slimmed the cards
down (shorter, tighter padding, smaller type, refined tag pill, animated
gradient underline instead of the dated triangle corner accent).

**Files:** `src/pages/Home/ServicePillarsSection.tsx`, `ServicePillarsSection.module.css`

---

## 7. Service cards — full text, new headline, bolder tag
- Removed the 3-line clamp on card body text — full descriptions now show.
- Card 1 headline: "Leadership. Strategy. People." →
  "Leadership. Strategy. Organizational Transformation. People Solutions."
- Tag pill (e.g. "MANAGEMENT CONSULTANCY") redesigned as a bold orange
  gradient badge with dark navy text and a glow shadow that intensifies on hover.

**Files:** `src/pages/Home/ServicePillarsSection.tsx`, `ServicePillarsSection.module.css`

---

## 8. Section layout reordered
Split into two distinct blocks: (1) "What we do" label + description
paragraphs, (2) "Our Services" heading directly above its own card grid —
instead of the label/heading/paragraphs being crowded together at the top.

**Files:** `src/pages/Home/ServicePillarsSection.tsx`, `ServicePillarsSection.module.css`

---

## 9→10. Light-mode contrast bug fixed properly
**Bug:** "Our Services" heading and "The latest from Antra" section text were
invisible in light mode — caused by mixing theme-adaptive CSS variables with
hardcoded literal colors that don't flip with the theme (e.g. `var(--white)`
text over a background hardcoded to stay dark, or hardcoded white text over a
background that *did* flip to near-white).

**First attempt (fix #9):** forced both sections to always render dark via
`data-theme-section="hero"` (the pattern used elsewhere for photo-heavy
sections). This worked but was visually inconsistent with the rest of the
light-mode site.

**Correct fix (fix #10):** reverted the forced-dark approach. Both sections
now properly follow the site's real light-mode palette — white background,
dark navy text, orange accents — using the same adaptive CSS variables
(`var(--navy)`, `var(--white)`, `var(--white-60)`, `var(--white-10/20)`)
consistently for every background, text, and border declaration, so they
flip correctly with the theme toggle instead of being locked to dark.
Orange accents (labels, tags, glow) were left untouched — orange stays
orange in both themes. Photo cards keep their local dark-overlay/white-text
treatment (a legibility pattern independent of site theme, used throughout
the site for images).

**Files:** `src/pages/Home/ServicePillarsSection.tsx`, `ServicePillarsSection.module.css`,
`src/pages/Home/LatestNewsSection.tsx`, `LatestNewsSection.module.css`

---

## 11. "The latest from Antra" card — shadow removed
Removed the drop shadow entirely (both resting and hover states) from the
OVID featured card.

**Files:** `src/pages/Home/LatestNewsSection.module.css`

---

## 12. "What Makes Us Unique" replaced with a new "Our Team" section
The "What Makes Us Unique" title + differentiator cards duplicated content
already on another page, so the heading and cards were removed entirely —
but the section's textured background image (`why-us-section-bg.webp`,
overlay, edge fades) was kept in place to preserve the page's visual flow.

That same section slot now holds a new **"Our Team"** section: label +
heading ("Leadership that stays in the room.") followed by a photo-card
team grid. Built as a scalable grid (`repeat(auto-fit, minmax(240px, 280px))`,
centered) so it looks intentional with today's single entry (Anteneh Tegegn)
and is ready to add more people later without any layout changes.

The old standalone "Meet Our Leaders" section (which duplicated copy already
on the About page's Leaders section) was removed — its one entry now lives
in this new Team section with fresh, non-duplicated copy.

**Files added:** `src/pages/Home/TeamSection.tsx`, `TeamSection.module.css`
**Files removed:** `src/pages/Home/WhyUsSection.tsx`, `WhyUsSection.module.css`,
`src/pages/Home/LeaderSection.tsx`, `LeaderSection.module.css`
**Files:** `src/pages/Home/index.tsx`

---

## 13. About page — "Who We Are" (§01) removed, "Our Story" promoted to §01
"Who We Are" duplicated content already covered by "Our Story" (both describe
the business, leadership bench, trading, and reach). Removed "Who We Are"
entirely and moved "Our Story" into its vacated slot, right after the hero.

"Our Story" keeps its own existing square grid-line background exactly as
it was — nothing about its design changed, only its position on the page.
(As a side effect, the seam under the hero is now even more seamless: the
hero fades to `var(--navy)` and "Our Story"'s background is also `var(--navy)`.)

All subsequent section number labels were renumbered to close the gap:
Mission stays 02; Values 04→03; What Makes Us Unique 05→04; Selected
Engagement 06→05; Meet Our Leaders 07→06; In the News 08→07; Find Us 09→08.

**Files removed:** `src/pages/About/WhoWeAreSection.tsx`, `WhoWeAreSection.module.css`
**Files:** `src/pages/About/index.tsx`, `OurStorySection.tsx`, `ValuesSection.tsx`,
`HowPracticesFitSection.tsx`, `NotableClientsSection.tsx`, `LeadersSection.tsx`,
`NewsSection.tsx`, `MapSection.tsx`

---

## 14. Mission card — exact client copy
The mission statement paragraph and the "Trading & Supply" pillar already
matched the client's exact wording. The "Management Consultancy" pillar had
two small drifts from the source text — "choice" → "choices" and
"organisational" (British) → "organizational" (American) — corrected to
match the client copy exactly, word for word.

**Files:** `src/pages/About/MissionSection.tsx`

---

## 15. "Our Story" section — trading paragraph removed
Removed the second body paragraph ("In addition to our management
consultancy services, we offer trading solutions...") from the "Our Story"
section. Only the first paragraph (passion for transforming organizations,
leadership experience, partnerships) remains.

**Files:** `src/pages/About/OurStorySection.tsx`

---

## 16. About page order confirmed + "Core Values" title made eye-catching
Requested order (Our Story → Our Mission → Core Values → ...) was already in
place from fix #13. Renamed the "What We Stand For" label to "Core Values"
and gave its heading accent ("don't bend.") a shimmering animated gradient
sweep — the same premium gold-shimmer treatment used elsewhere on the site
— instead of a flat orange color, so the title pulls the eye more.

**Files:** `src/pages/About/ValuesSection.tsx`, `ValuesSection.module.css`

---

## 17. "Core Values" — duplicate mission card removed
The "Core Values" section had its own embedded "Our Mission" card repeating
the same mission text already covered by the dedicated "Our Mission" section
directly above it. Removed that card entirely (component, its data, and the
now-unused CSS) — "Core Values" now goes straight from heading to the
divider to the values grid, no duplication.

**Files:** `src/pages/About/ValuesSection.tsx`, `ValuesSection.module.css`

---

## 18. "Core Values" — leftover empty divider gap removed
Removing the mission card in fix #17 left an oversized empty gap where the
divider line used to visually separate the mission card from the values
grid — with the card gone, that divider's large top/bottom margins collapsed
into a big empty rectangle. Removed the divider entirely; the heading's own
bottom margin now provides the spacing straight into the values grid.

**Files:** `src/pages/About/ValuesSection.tsx`, `ValuesSection.module.css`

---

## 19. "Core Values" — empty 6th grid cell fixed
5 value cards in a 3-column grid left an empty 6th cell in the bottom row —
with no card there to dim it, the section's raw background image showed
through as an odd, out-of-place lighter patch. Fixed by making the last
card (`05 · Continuous Learning and Agility`) span the remaining 2 columns
so the grid is always fully filled — works cleanly at every breakpoint
(fills the last row on the 2-column tablet layout too; no effect on the
1-column mobile layout).

**Files:** `src/pages/About/ValuesSection.module.css`

---

## 20. About page — 4 sections removed, CTA preserved, order renumbered
Removed "What Makes Us Unique" (§04), "Selected Engagement" (§05),
"Meet Our Leaders" (§06), and "In the News" (§07) entirely from the About
page.

"What Makes Us Unique" had a closing CTA block ("Ready to work with us? /
Tell us what you are working on. We will respond within one business day.")
that was explicitly kept — it's now its own standalone section
(`ClosingCTASection.tsx`) sitting in the vacated §04 slot, right after
"Core Values."

New order: Hero → Our Story (01) → Our Mission (02) → Core Values (03) →
**Let's Talk / Ready to work with us? (04, new)** → Find Us (05, was 08).

**Files added (later merged away, see #22):** `ClosingCTASection.tsx`, `ClosingCTASection.module.css`
**Files removed:** `HowPracticesFitSection.tsx/.module.css`,
`NotableClientsSection.tsx/.module.css`, `LeadersSection.tsx/.module.css`,
`NewsSection.tsx/.module.css`
**Files:** `src/pages/About/index.tsx`, `MapSection.tsx`

---

## 21. "Core Values" — square grid-line texture added
Added the same subtle square grid-line texture used across the rest of the
site (60px squares, `var(--white-10)` lines) as a new layer over "Core
Values"' existing background image + dark overlay.

**Files:** `src/pages/About/ValuesSection.tsx`, `ValuesSection.module.css`

---

## 22. "Let's Talk" CTA merged into the "Find Us" section
The "Let's Talk" CTA (fix #20) was its own standalone section between "Core
Values" and "Find Us." Merged it into the "Find Us" section instead — both
now live inside one `<section>` (one background, no seam/fade between them):
CTA block on top (§04 Let's Talk — "Ready to work with us?"), a thin
divider, then the Find Us block below (§05, map + address). The separate
`ClosingCTASection.tsx` component was deleted since its content now lives
directly in `MapSection.tsx`.

**Files removed:** `src/pages/About/ClosingCTASection.tsx`, `ClosingCTASection.module.css`
**Files:** `src/pages/About/MapSection.tsx`, `MapSection.module.css`, `index.tsx`

---

## 23. "Core Values" — background now exactly matches "Our Story" (§01)
Replaced the section's own background image + dark overlay with the exact
same treatment as "Our Story": solid `var(--navy)` background, the square
grid-line texture on `::before`, and the same bottom fade on `::after` —
byte-for-byte the same CSS recipe. Removed the now-unused background image
div and overlay div from the markup.

(Kept the section locked to always-dark via `data-theme-section="hero"` —
its value cards use a hardcoded dark card background that would go
invisible against light-mode text if the section were allowed to flip
themes, the same bug class fixed back in #9/#10.)

**Files:** `src/pages/About/ValuesSection.tsx`, `ValuesSection.module.css`

---

## 24. Harsh section-seam shadows softened (Our Story ↔ Mission ↔ Core Values)
"Our Mission" sits between "Our Story" and "Core Values" and is the one
section still using a background *image* (`values-section-bg.webp`) instead
of solid navy. It only had a bottom fade, no top fade — so its image (and
its own near-opaque dark overlay) started abruptly right where the
grid-textured navy sections ended, showing as a hard dark line at both
boundaries.

Added a matching top fade (solid `var(--navy-dark)` → transparent) that
exactly mirrors the color "Our Story"'s own bottom fade hands off, and
corrected the bottom fade's target from `var(--navy-dark)` to `var(--navy)`
to exactly match "Core Values"' actual background color. Both seams now
blend smoothly instead of cutting hard, the same soft-fade technique
already used correctly elsewhere on the site (e.g. Trading Hero → Intro).

**Files:** `src/pages/About/MissionSection.module.css`

---

## 25. "Our Story" ↔ "Our Mission" seam — black replaced with primary navy
The fade between "Our Story" and "Our Mission" (fix #24) used
`var(--navy-dark)` (#060f1a — reads as near-black) on both sides. Changed
both fades to use `var(--navy)` (#0B2135, the site's actual primary navy)
instead, so the seam blends with the brand color rather than fading to black.

**Files:** `src/pages/About/OurStorySection.module.css`, `MissionSection.module.css`

---

## 26. About page light mode — "Our Mission" invisible text + shadow blob fixed
In light mode, "Our Mission" was badly broken: the pillar cards rendered as
solid black boxes with no visible text, the heading/statement text was
barely legible, and the fade gradients above/below the section showed as an
odd hazy "shadow blob." Root cause: the section's background is a fixed
dark photo that never adapts to the site theme, but its text colors
(`var(--white)`, `var(--white-80)`) and fade gradients (`var(--navy)`) *do*
flip to their light-mode values (dark navy text, white fade) — dark-on-dark
text, and a white gradient fading over a dark photo.

Fixed by locking the section to always-dark via `data-theme-section="hero"`
— the same convention already used correctly by "Core Values" and other
photo-background sections. Every color token inside now resolves to its
dark-mode value regardless of the site theme toggle, matching how the
section already looked correct in dark mode.

Verified against the same screenshot: Hero, "Our Story," "Core Values,"
and the merged "Let's Talk"/"Find Us" section were all already correct in
light mode (Hero has explicit light-mode overrides; the others properly
adapt or are already locked) — only "Our Mission" needed this fix.

**Files:** `src/pages/About/MissionSection.tsx`

---

## 27. "Find Us" — "Our office." heading + details invisible in light mode
Three light-mode overrides used the wrong CSS variable family: `var(--navy)`
/`var(--navy-dark)`/`var(--navy-60)` are *background* tokens that flip to
near-white in light mode, but they were applied to the "Our office." heading
and the address/phone/email detail text — rendering white-on-white and
invisible.

The base styles already use the correct auto-flipping `--white` family
(`var(--white)`, `var(--white-80)`, `var(--white-60)`, which flip to dark
navy in light mode on their own) — so the three broken overrides were pure
regressions with no purpose. Deleted them; text is now visible in light mode
using the styling that was already correct underneath.

**Files:** `src/pages/About/MapSection.module.css`

---

## 28. "Let's Talk" / "Find Us" — leftover empty divider removed
The thin divider line between the CTA block and the "Find Us" block had
oversized top/bottom margins, showing as an empty box (same issue as #18 on
"Core Values"). Removed it — `ctaInner`'s own bottom margin already provides
clean spacing into the "Find Us" label below.

**Files:** `src/pages/About/MapSection.tsx`, `MapSection.module.css`

---

## 29. Footer — bottom "About | Contact" links removed, "Org Transformation" spelled out
Removed the small "About" / "Contact" nav links from the footer's bottom
bar (copyright + "Made by Wubsites" now sit at opposite ends). Renamed the
Consultancy column's "Org Transformation" link to its full, unabbreviated
form: "Organizational Transformation."

**Files:** `src/components/layout/Footer.tsx`, `Footer.module.css`
