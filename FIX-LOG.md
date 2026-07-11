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

---

## 30. Consultancy page reordered — Problems under Strategy, Key Partners under CTA
New order: Hero → Our Approach (Intro) → Our Practices (Services) →
Strategy Practice → What Clients Bring Us (Problems) → Book a discovery
call (Closing CTA) → Key Partners (now last).

Renumbered "Key Partners" from a duplicate "03" (it collided with "What
Clients Bring Us") to "04" to stay sequential in the new position.

Reordering broke two previously-matched section-seam colors (the same bug
class as fix #24/#25 on the About page) — fixed both:
- "What Clients Bring Us" (image background) had no top fade, so it now cut
  in abruptly against Strategy's solid navy-dark. Added a top fade matching
  navy-dark, and corrected its bottom fade to target navy-dark (Closing
  CTA's actual color) instead of navy (its old neighbor, Services).
- "Key Partners" had no top fade at all, cutting in abruptly against
  Closing CTA's navy-dark. Added one, and gave its `.container` (previously
  missing z-index) an explicit `z-index: 1` so the new fade sits behind the
  content instead of covering it.

**Files:** `src/pages/Consultancy/index.tsx`, `KeyPartnersSection.tsx`,
`KeyPartnersSection.module.css`, `ProblemsSection.tsx`, `ProblemsSection.module.css`

---

## 31. "Our Practices" — reordered, dotted list kept on only 2 of 6 cards
Reordered the 6 practice cards to: 01 Organizational Transformation,
02 Leadership Development Programs, 03 Training on People Management,
04 Talent Search & Assessments, 05 Advisory & Change, 06 Coaching &
Mentorship (tags renumbered to match).

Removed the hover-reveal dotted bullet list from all cards except
"Organizational Transformation" and "Leadership Development Programs" —
those two keep their detailed sub-program lists; the other four now show
just the image, tag, title, and description, with the list rendered
conditionally only when a card has one.

**Files:** `src/pages/Consultancy/ServicesSection.tsx`

---

## 32. "Our Practices" cards — points always visible, hover simplified
The dotted sub-program list (on the 2 cards that still have one) was hidden
by default and only revealed on hover via a JS state + height/opacity
animation. Removed that — the list is now a normal static block, always
visible, no hover required.

Replaced the whole hover interaction with plain CSS `:hover` rules (removed
the `useState`/`onMouseEnter`/`onMouseLeave` JS entirely) applied uniformly
to all 6 cards: a simple scale-up (`transform: scale(1.02)`) on the card
itself, plus the existing image zoom and bottom accent-line reveal — same
visual effects as before, just simpler code and consistent across every
card regardless of whether it has a points list.

**Files:** `src/pages/Consultancy/ServicesSection.tsx`, `ServicesSection.module.css`

---

## 33. "Strategy Practice" — image replaced with the 5 extracted points
The chess-piece infographic image next to "Organizational Strategy and
Business Alignment" was replaced with its own text content. Carefully
transcribed the 5 circled points from the image (verified with the user
first — the image showed 5, not 6, one per chess piece):

1. Strategy formulation and refinement aligned to organizational purpose,
   market realities, and growth ambitions
2. Translating strategy into clear priorities, operating models, and
   performance objectives
3. Aligning organizational structure, leadership, and capabilities to
   strategic direction
4. Supporting leadership teams to drive strategy execution, not just
   strategy design
5. Ensuring coherence between strategy, functional transformation, and
   people outcomes

Built as a numbered list (01–05) with a scroll-triggered staggered
slide-in animation per row, an orange accent bar that grows in on hover,
and a subtle background tint on hover — replacing the static image with
an interactive, on-brand list. Removed the image entirely.

**Files:** `src/pages/Consultancy/StrategySection.tsx`, `StrategySection.module.css`

---

## 34. New "What Makes Us Unique" section added (Consultancy page)
Added a new section right after "Strategy Practice" and before "What
Clients Bring Us", listing the 5 differentiators exactly as given:
Practical, Strategic and Business-Driven Expertise · BHR-led Organization
Transformation · Africa-focused and Market relevant solutions ·
Partnership-based approach · End-to-end support.

Design: label + heading ("What makes us unique."), then a 3-column card
grid (icon badge + title), staggered scroll-in animation per card, hover
lift + orange border highlight. The last card spans the remaining columns
so a 5-in-3 grid never leaves an empty trailing cell (same technique as
fix #19). Background matches "Strategy Practice" exactly (`var(--navy-dark)`)
so both neighboring section seams stay seamless with no extra fade work.

No description text was added under each title — only the 5 titles were
provided, so the cards are title-only rather than inventing body copy.

**Files added:** `src/pages/Consultancy/WhatMakesUsUniqueSection.tsx`, `WhatMakesUsUniqueSection.module.css`
**Files:** `src/pages/Consultancy/index.tsx`

---

## 35. "What Makes Us Unique" — custom icon per card
Replaced the identical rotated-square bullet on every card with a distinct,
meaning-matched SVG icon per item: target (Practical/Strategic Expertise),
refresh arrows (BHR-led Transformation), map pin (Africa-focused Market
solutions), linked chain (Partnership-based approach), layers (End-to-end
support). Icon badge enlarged slightly and now tints/scales up on card hover.

**Files:** `src/pages/Consultancy/WhatMakesUsUniqueSection.tsx`, `WhatMakesUsUniqueSection.module.css`

---

## 36. Consultancy page light mode — 3 sections had invisible text
Same bug class as #9/#26/#27: these sections' backgrounds use theme-adaptive
variables (`var(--navy)`/`var(--navy-dark)`, which flip to near-white in
light mode) while their text used hardcoded literals (`#ffffff`,
`rgba(255,255,255,…)`) that don't flip — white-on-white.

- **"Strategy Practice"**: heading, body paragraph, and all 5 point-list
  rows were invisible.
- **"What Makes Us Unique"**: heading and all 5 card titles were invisible.
- **"Key Partners"**: the "04 KEY PARTNERS" label was invisible (the
  partner logos themselves were fine — they're a raster image, unaffected).

Fixed by switching every hardcoded white literal to the matching adaptive
token (`var(--white)`, `var(--white-60)`, `var(--white-80)`,
`var(--white-10)`, `var(--white-20)`) — the same correct pattern already
used by "Our Practices" and "Book a call," which is why those rendered
fine. Also removed three no-op light-mode overrides that just reapplied
the same already-flipping variable and did nothing.

**Files:** `src/pages/Consultancy/StrategySection.module.css`,
`WhatMakesUsUniqueSection.module.css`, `KeyPartnersSection.module.css`

---

## 37. Trading page "Our Approach" — missing second paragraph added
Added the missing paragraph 2 under the existing "Our trading work is
concentrated..." paragraph: "We offer trading solutions that connect
clients with quality products, trusted suppliers, and efficient
route-to-market strategies across Ethiopia and regional markets."

**Files:** `src/pages/Trading/IntroSection.tsx`, `IntroSection.module.css`

---

## 38. "Product Categories" — hover spec list removed from all 4 cards
Removed the hover-reveal bullet list (specs) from Electric Vehicles,
Construction Machinery, Sanitary Equipment, and Medical Equipment cards
entirely — no points shown at all now, on hover or otherwise. Kept the
other hover effects (image zoom, tag underline, bottom accent bar), only
the specs list was removed. Cleaned up the now-unused `specs` data and CSS.

**Files:** `src/pages/Trading/ProductLinesSection.tsx`, `ProductLinesSection.module.css`

---

## 39. New "What Makes Us Unique" section added (Trading page)
Added a new section right after "Product Categories," before "Key
Suppliers." Content: 3 groups, each with a custom icon (truck for
Distribution & Retail, trending-up for Brand Building, two people for
Fleet/Trader relationships) and its sub-bullet list, exactly as given:

- **Distribution and Retail Expertise** — distribution capabilities incl.
  Logistics (Cars & Parts) training & org setup; deep retail performance
  knowledge; price positioning and competitive value offerings.
- **Brand Building Capability** — consistent marketing/messaging from
  start; aligned to OEM brand strategy & execution; prioritized model &
  partnership leverage; immediate investment in marketing channels.
- **Handling Fleet Customers and Traders** — close cooperation with fleet
  customers; close engagement with government and business owners; trust
  built with major traders/fleet customers through long relationships.

3-column card grid, staggered scroll-in animation, icon badge + hover lift
matching the Consultancy page's "What Makes Us Unique" design language.
Text colors used theme-adaptive tokens (`var(--white)` family) from the
start to avoid the light-mode bug fixed in #36. Background matches its
neighbors exactly (`var(--navy)`), so no seam/fade issues.

**Files added:** `src/pages/Trading/WhatMakesUsUniqueSection.tsx`, `WhatMakesUsUniqueSection.module.css`
**Files:** `src/pages/Trading/index.tsx`

---

## 40. Trading page — "What Makes Us Unique" moved to sit directly under "Product Categories"
The new section (fix #39) was placed after the *entire* Product Lines
component — but that component also contained an embedded "Why Buyers Work
With Us" (Djibouti Freezone) block, so "What Makes Us Unique" wasn't
actually adjacent to "Product Categories."

Extracted "Why Buyers Work With Us" into its own standalone component
(`WhyBuyersSection.tsx`) and reordered the page so "What Makes Us Unique"
sits immediately after the product cards:

**New order:** Hero → Our Approach (Intro) → Product Categories →
**What Makes Us Unique** → Why Buyers Work With Us → Key Suppliers →
Closing CTA.

All of Product Categories, What Makes Us Unique, and Why Buyers Work With
Us now share the exact same flat `var(--navy)` background, so the whole
run is seamless with no fade patching needed — removed Product Categories'
now-obsolete bottom fade (it used to target `navy-dark` for the old
neighbor, Closing CTA) and gave Why Buyers Work With Us its own fresh
bottom fade into Key Suppliers.

**Files added:** `src/pages/Trading/WhyBuyersSection.tsx`, `WhyBuyersSection.module.css`
**Files:** `src/pages/Trading/index.tsx`, `ProductLinesSection.tsx`, `ProductLinesSection.module.css`

---

## 41. "Why Buyers Work With Us" — square grid-line background added
Added the same subtle square grid-line texture used across the rest of the
site (60px squares, `var(--white-10)` lines) on top of the section's flat
navy background.

**Files:** `src/pages/Trading/WhyBuyersSection.module.css`

---

## 42. Trading page — "Key Suppliers" moved under "Request a quote" (now last)
Confirmed section numbering was already correct/sequential (Product
Categories 01, Why Buyers Work With Us 02, Key Suppliers 03 — Intro and
What Makes Us Unique stay unnumbered, matching the site's convention).

Moved "Key Suppliers" to the very end of the page, after the "Request a
quote" Closing CTA.

**New order:** Hero → Our Approach → Product Categories (01) → What Makes
Us Unique → Why Buyers Work With Us (02) → Request a quote (Closing CTA) →
Key Suppliers (03, now last).

Fixed the two seams this reorder touched: "Why Buyers Work With Us" now
fades into the CTA's `navy-dark` (was fading to `navy`, its old neighbor),
and "Key Suppliers" gained a new top fade from `navy-dark` since it now
follows the CTA instead of preceding it — same pattern as fix #30 on the
Consultancy page.

**Files:** `src/pages/Trading/index.tsx`, `WhyBuyersSection.module.css`,
`KeySuppliersSection.tsx`, `KeySuppliersSection.module.css`

---

## 43. Contact page hero — background image no longer cut off
The hero's background image wrapper (`.bgWrap`) was sized with
`inset: -20% 0 60% 0` — percentages taken against the *entire* section
(hero + the whole contact form below it combined), not just the visible
hero band. As the form grew over past edits, that `bottom: 60%` cutoff
point drifted, so the image box ended up far shorter than the visible
hero area — cutting the background image off well before it reached the
bottom of the hero, and exposing gaps/seams.

Replaced it with a box sized in fixed units (`vh`/`px`, never a percent of
the oversized parent) that matches the `.overlay` gradient's own box
exactly (78vh / 760px max), plus a small symmetric buffer on both edges so
the existing GSAP scroll-parallax always has image to reveal in either
direction without ever exposing blank space.

**Files:** `src/pages/Contact/ContactFormSection.module.css`

---

## 44. Contact hero — gap between image and form section closed
The symmetric buffer added in fix #43 over-corrected: the bottom half of
that buffer let raw, untinted image poke out below the dark overlay's
fade, showing as a visible photo strip with a hard seam right above the
form section (exactly what the marked-up screenshot showed).

Root cause: the scroll-parallax (`yPercent: -12`) only ever shifts the
image *upward*, so a bottom buffer was never needed — it only created a
gap where none should exist. Removed the bottom buffer entirely; the
image box's bottom edge now lands exactly on the overlay's bottom edge
(78vh / 760px), with the top-only buffer still giving the parallax room
to move.

**Files:** `src/pages/Contact/ContactFormSection.module.css`

---

## 45. Contact form — clear per-field error messages instead of one generic banner
The form had no client-side validation at all (`noValidate` on the
`<form>`, native browser validation disabled) — a missing name, invalid
email, or empty message would submit anyway and only ever surface a single
generic banner ("Something went wrong…") with no indication of what was
actually wrong.

Added real validation that runs before submission:
- **Full Name** — required.
- **Email** — required, and checked against a real email pattern
  ("That email address doesn't look right — check for typos.").
- **Message** — required, minimum length nudge if it's just a couple of
  words ("A few more details would help…").

Each invalid field now gets its own specific message directly beneath it,
plus an orange→red error border, and clears itself the moment the user
edits that field. The top banner is reserved for what it's actually good
for — a validation summary ("Please fix the highlighted field(s) below.")
or real server/network failures, both reworded to be more specific and
actionable than the previous single catch-all message.

**Files:** `src/pages/Contact/ContactFormSection.tsx`, `ContactFormSection.module.css`

---

## 46. Working hours updated site-wide
Changed from "Mon – Fri, 8am – 6pm EAT" to Mon–Fri 8am–5pm plus a Saturday
half day (8am–12pm), everywhere it appears on the site.

**Files:** `src/pages/Contact/ContactFormSection.tsx`, `src/pages/Contact/MapSection.tsx`,
`src/pages/About/MapSection.tsx`

---

## 47. Map location updated to the exact place link (Contact + About pages)
Resolved the given short link (`https://maps.app.goo.gl/voFHXuUdfUe2Ezfc8`)
— it points to "Rayuma Building, beside Getu Commercial, in front of Oda
Restaurant, Addis Ababa," confirming the existing office address. Updated
both pages:

- **Map embed** — re-pointed the iframe query to that exact resolved place
  name (same proven `q=…&output=embed` technique already used site-wide,
  just now targeting the precise location instead of a generic street
  search).
- **Clickable map** — added a transparent link overlay on top of the
  iframe, so clicking anywhere on the map opens
  `maps.app.goo.gl/voFHXuUdfUe2Ezfc8` in a new tab (an iframe swallows
  clicks itself, so this required an overlay rather than just wrapping it
  in an `<a>`).
- **"Get Directions" / "Open in Google Maps" buttons** — both now link
  directly to the exact `maps.app.goo.gl/voFHXuUdfUe2Ezfc8` URL.

**Files:** `src/pages/Contact/MapSection.tsx`, `MapSection.module.css`,
`src/pages/About/MapSection.tsx`, `MapSection.module.css`

---

## 48. "Our Location" (Contact page) — invisible text in light mode fixed
Same bug class as fix #27 (which fixed the near-identical map section on
the About page, but missed this Contact-page version): three light-mode
overrides used `var(--navy-dark)`/`var(--navy)`/`var(--navy-60)` — all
*background* tokens that flip to near-white in light mode — applied to the
heading, address text, and office-hours note. White-on-white, invisible.

The base styles already use the correct auto-flipping `--white` family
(`var(--white)`, `var(--white-80)`, `var(--white-60)`), so the three
overrides were pure regressions. Deleted them.

**Files:** `src/pages/Contact/MapSection.module.css`
