# Antra Website — Fix Log

Running record of fixes applied during the numbered fix-request pass. Each entry
lists what changed and which files were touched.

This log has two parts:

- **Part 1 — Fixes #1–54:** the initial fix pass, already reported to the owner
  (summarized in `Antra-Update-Summary.md`).
- **Part 2 — Fixes #55 onward:** the new round of changes made in response to the
  owner's review feedback, starting with the header/navbar update.

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

---

## 49. Navbar — "About" hover dropdown with 3 section submenu links
Added a hover submenu to the "About" nav item with 3 links: Who We Are,
Mission, Core Values. Clicking any of them navigates to the About page
and scrolls directly to that section — reusing the hash-scroll mechanism
already built in fix #1 (works both from another page and while already
on the About page, since it depends on `location.hash` too).

"Who We Are" links to the "Our Story" section (`#who-we-are`) — the
literal "Who We Are" section was removed back in fix #13 for duplicating
"Our Story," so this submenu label maps to the section that now answers
that same question.

Also added a matching expandable submenu on mobile (tap the caret to
reveal the 3 links), since "hover" doesn't exist on touch devices.

**Files:** `src/components/layout/Navbar.tsx`, `Navbar.module.css`,
`src/pages/About/OurStorySection.tsx` (added `id="who-we-are"`),
`src/pages/About/MissionSection.tsx` (added `id="our-mission"`),
`src/pages/About/ValuesSection.tsx` (added `id="core-values"`)

---

## 50. Navbar — "Consultancy" hover dropdown with nested "Services" flyout
Added a hover submenu to "Consultancy" with 5 items: Services, Coaching &
Mentorship, Organizational Strategy, What Makes Us Unique, Key Partners —
same click-to-jump-to-section behavior as the About dropdown (fix #49).

"Services" additionally opens its own nested flyout (hover on desktop,
tap-to-expand on mobile) listing all 6 practices in order: 01
Organizational Transformation, 02 Leadership Development Programs, 03
Training on People Management, 04 Talent Search & Assessments, 05
Advisory & Change, 06 Coaching & Mentorship — each jumping straight to
that specific practice card (added an `id` to every `ServiceCard`, e.g.
`practice-org`, `practice-leadership`, etc.). "Coaching & Mentorship" in
the main 5-item list and "06" in the Services flyout point to the exact
same anchor, since they're the same card.

**Files:** `src/components/layout/Navbar.tsx`, `Navbar.module.css`,
`src/pages/Consultancy/ServicesSection.tsx` (added `id="services"` +
per-card ids), `StrategySection.tsx` (`id="organizational-strategy"`),
`WhatMakesUsUniqueSection.tsx` (`id="what-makes-us-unique"`),
`KeyPartnersSection.tsx` (`id="key-partners"`)

---

## 51. Navbar — "Trading" hover dropdown with nested "Product Lines" flyout
Same pattern as Consultancy (fix #50). "Trading" now has a 4-item hover
submenu: Product Lines, Why Buyers Work With Us, What Makes Us Unique,
Suppliers — each jumps straight to that section.

"Product Lines" opens its own nested flyout listing all 4 categories in
order: 01 Electric Vehicles, 02 Construction Machinery, 03 Sanitary
Equipment, 04 Medical Equipment — each jumping to that specific product
card (added an `id` to every product card, e.g. `product-ev`,
`product-construction`, etc.). Works the same on mobile via nested
tap-to-expand.

**Files:** `src/components/layout/Navbar.tsx`,
`src/pages/Trading/ProductLinesSection.tsx` (added `id="product-lines"` +
per-card ids), `WhyBuyersSection.tsx` (`id="why-buyers-work-with-us"`),
`WhatMakesUsUniqueSection.tsx` (`id="what-makes-us-unique"`),
`KeySuppliersSection.tsx` (`id="suppliers"`)

---

## 52. Hero cube click — fixed a real reliability bug in hash-scroll retry
The cube's click target (`/consultancy#what-clients-bring-us`) and the
section's `id` were already correctly matched — but the hash-scroll retry
in `App.tsx` only tried once, 150ms after failing to find the target
element. Since Consultancy is a lazy-loaded page that now renders many
more sections than when this retry was first written, a single 150ms
attempt could miss the mount on a slower connection — silently leaving
the scroll at position 0 (top of the Hero) instead of jumping to "What
Clients Bring Us." That's what looked like "wrong place."

Replaced the single retry with a poll (every 100ms, up to ~3s) that keeps
trying until the target element exists, so the jump can't silently fail
regardless of how long the page chunk takes to mount.

**Files:** `src/App.tsx`

---

## 53. Hero floating chips — replaced with "Challenges we help you solve"
Swapped the 3 single-word chips ("What" / "Clients" / "Bring Us") for the
phrase "Challenges we help you solve," split across the same 3 chip slots:
"Challenges we" / "help you" / "solve."

Since the new phrases are longer than the original single words, removed
the all-caps + wide letter-spacing styling (which would have ballooned
the pills far past their intended size) in favor of normal sentence case
with tighter spacing — reads as a natural caption instead of a shouty
label, and keeps the pills a sensible size.

**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`

---

## 54. Hero floating chips — re-split text
Changed the split from "Challenges we" / "help you" / "solve" to
"Challenges" / "we help" / "you solve."

**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`

---
---

# ══════════════════════════════════════════════════════════════
# PART 2 — OWNER FEEDBACK ROUND (new fixes, not yet reported)
# Everything above (#1–54) was already reported to the owner in
# `Antra-Update-Summary.md`. Everything below is new, made in
# response to the owner's review comments — starting with the
# header/navbar update.
# ══════════════════════════════════════════════════════════════

---

## 55. Navbar — "Coaching & Mentorship" removed from top-level Consultancy menu
It's already listed as practice 06 inside the "Services" nested flyout —
having it twice (once standalone, once nested) was redundant since it's
a sub-item of Services, not a peer section. Removed the standalone entry;
it's still reachable via Services → 06 Coaching & Mentorship.

**Files:** `src/components/layout/Navbar.tsx`

---

## 56. Homepage hero — 3D system removed entirely, replaced with a video background
Per owner feedback: the 3D system (the scroll-scrubbed 120-frame image
sequence *and* the draggable 3D CSS cube) was too heavy for initial load
time and was removed completely. Also removed the separate branded
loading-screen intro (`Preloader`) — it had its own 3D spinning cube and
depended on the now-deleted frame files, and as a full-screen blocking
overlay it worked directly against faster load times.

The hero now plays a single looping background video (provided by the
owner, copied into the project) instead of scrubbing through frames.
This is one video request instead of dozens of image requests, no
JavaScript-driven canvas drawing loop, and no 3D CSS transforms. All the
lightweight ambient effects were kept (film grain, light rays, gradient
mesh, particle dust, cursor spotlight, marquee ticker) since they're
CSS/canvas-only and don't add network weight.

The cube's "click to jump to Consultancy" behavior and its 6 problem-face
labels were removed along with the cube (no longer applicable). The
floating "Challenges we help you solve" chips, which existed to orbit the
cube, were also removed since they no longer have anything to orbit.

**Cleanup — deleted entirely:**
- 120 original hero frame images (`art-source/hero-frames-original/`)
- 60 optimized hero frame images (`public/assets/hero-frames/`)
- The frame-generation script (`scripts/optimize-hero-frames.mjs`) and its
  `npm run optimize:frames` command
- The branded loading-screen intro (`src/components/Preloader/`)
- Leftover dead code from an earlier unused attempt: `VideoSection.tsx`,
  `VideoSection.module.css`, `public/assets/webpage2_video.mp4`
- An already-unused 3D particle component (`ParticleField.tsx`) and its
  now-pointless dependencies (`three`, `@react-three/fiber`,
  `@react-three/drei`) and the unused `sharp` image-processing dependency

**Files added:** `public/assets/home assets/hero-video.mp4`
**Files removed:** see cleanup list above
**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`,
`src/App.tsx`, `index.html`, `package.json`

*Note: `package.json` dependencies were edited but `npm install` was not
run — the lockfile/node_modules still have the old packages physically
present until you run `npm install` to sync them.*

---

## 57. Hero — cube restored, effects removed, layout fixed (correction to #56)
Fix #56 over-removed: the owner wanted only the heavy 3D *frame-sequence
background* gone (the ~180 image frames that hurt load time), NOT the
lightweight 3D CSS cube. Corrected:

- **3D cube restored** — the draggable, auto-rotating glass cube with its 6
  problem faces, floating "Challenges / we help / you solve" chips, hover
  hint, and click-to-jump-to-Consultancy behavior are all back. It's pure
  CSS/JS with zero network weight, so it doesn't affect load time.
- **Video background kept** — still one looping video instead of the frame
  sequence (the heavy part that was correctly removed).
- **Darkening overlay added** — the video was washing out the text
  (headline unreadable in the owner's screenshot). Added a background
  overlay (general top-to-bottom wash + stronger right-side tint where the
  text sits) plus subtle text shadows, so the copy is clearly legible.
- **Text overlap fixed** — the headline and subhead were rendering on top
  of each other. Root cause: the old design placed both text groups in the
  *same* CSS grid cell (`grid-row: 1 / -1`) so they could cross-fade as you
  scroll-scrubbed; with the scroll-scrub gone they both showed at once,
  overlapping. Rebuilt the hero as a normal 100vh section with the two
  groups stacked vertically (eyebrow → headline → subhead → CTAs).
- **Ambient effects removed** — per the owner's "remove the effects":
  dropped the marquee ticker, floating particle dust, cursor spotlight,
  god rays, gradient mesh, film grain, scan-slash, sonar pulse rings, and
  load bloom. Kept only the video, overlay, cube, text, and scroll cue for
  a clean, fast hero.

**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`

---

## 58. Impact-stats moved from Consultancy "Key Partners" to the Home hero
The 4 cited industry-benchmark stats ("Why structured transformation pays
off" — 25–35% delivery efficiency, 2× leadership retention, 12% rework
reduction, 3–5× ROI) were removed from the bottom of the Consultancy
"Key Partners" section and relocated to the Home hero.

In the hero they render as a clean full-width stat band anchored along the
bottom edge: a small "Why structured transformation pays off · industry
benchmarks" label above a 4-column row of stats (big orange figure +
caption + source), each separated by a thin divider. The hero's text was
given extra bottom padding and the cube was nudged/shrunk on shorter
viewports so nothing collides with the band; the old scroll cue was
removed (the stat band now anchors the bottom). Band drops to 2 columns
on tablet and hides on phones (hero too tight there).

The source attributions were kept on every stat — these are owner-approved
*because* they're clearly-sourced external research (McKinsey / Deloitte),
not Antra's own metrics, so the attribution must stay for them to remain
compliant.

Consultancy "Key Partners" now shows just the two partner logos (NOVA
Business School Africa, Batian Consulting), as before the stats were added.

**Files:** `src/pages/Home/HeroSection.tsx`, `HeroSection.module.css`,
`src/pages/Consultancy/KeyPartnersSection.tsx`, `KeyPartnersSection.module.css`

---

## 59. Hero — text/stat-band overlap fixed (follow-up to #58)
On laptop-height viewports the vertically-centred hero text was taller than
the space above the new stat band, so the headline/buttons spilled down
over the stats. Fixed by reducing the headline (max 72px → 60px) and
subhead sizing/margins, and adding a short-viewport rule
(`max-height: 860px` on desktop widths) that compacts the text further,
hides the band's label, and shrinks the stat figures — so the centred
content always clears the band. Also shrinks/lifts the cube on short
viewports (already partly handled in #58) so it clears the band too.

**Files:** `src/pages/Home/HeroSection.module.css`

---

## 60. "Our Services" section — bigger "What we do" label + bigger card titles
- The small orange "What we do" label was restyled to match the "Our
  Services" heading — large, bold, heading font (`clamp(28px, 3.6vw, 48px)`)
  — while keeping its orange color (per the owner: bigger/bolder, same
  color). Its accent dot was scaled up (6px → 11px) to stay proportional.
- The two service-card titles ("Leadership. Strategy. Organizational
  Transformation. People Solutions." and "Source. Ship. Deliver.") were
  increased (`clamp(19px, 2vw, 26px)` → `clamp(23px, 2.6vw, 33px)`) so they
  read as bigger, more prominent titles.

**Files:** `src/pages/Home/ServicePillarsSection.module.css`

---

## 61. "Our Services" cards — bigger tag titles + whole card clickable
- Increased the card tag title font size only ("Management Consultancy" /
  "Trading & Supply" pills): 10px → 14px, with slightly larger padding so
  the pill stays balanced.
- Made the **entire card clickable** instead of just the CTA link. The card
  element is now a single React Router `<Link>` to its destination
  (`/consultancy` / `/trading`); the inner "Explore consultancy" / "See our
  product lines" CTA became a visual `<span>` (a nested `<a>` inside an `<a>`
  is invalid HTML). Added anchor resets (`text-decoration: none`,
  `color: inherit`) and an `aria-label` so the whole card reads as one link.
  Bonus: it now uses client-side routing (no full page reload) — the old
  CTA was a plain `<a>` that reloaded the page.

**Files:** `src/pages/Home/ServicePillarsSection.tsx`, `ServicePillarsSection.module.css`

---

## 62. Key Partners moved from Consultancy to the Home page + logos made clickable
Removed the "Key Partners" section (§04) from the Consultancy page and
placed it on the Home page as the last section, directly above the footer
(both it and the footer are `navy-dark`, so the seam is clean).

- Created `src/pages/Home/PartnersSection.tsx` — centered "Our Partners"
  header + the two partner logo cards.
- Each partner card is now a **clickable link** opening in a new tab:
  NOVA Business School Africa → https://nova.edu.gh, Batian Consulting →
  https://www.batian-consulting.com (owner-supplied URLs).
- Deleted the Consultancy `KeyPartnersSection.tsx`/`.module.css`.
- Removed the now-dead "Key Partners" item from the navbar's Consultancy
  dropdown (its `#key-partners` anchor no longer exists on that page).
- Consultancy §04 was the last numbered section, so no renumbering needed;
  "Book a discovery call" (Closing CTA) is now the Consultancy page's final
  section.

**Files added:** `src/pages/Home/PartnersSection.tsx`, `PartnersSection.module.css`
**Files removed:** `src/pages/Consultancy/KeyPartnersSection.tsx`, `KeyPartnersSection.module.css`
**Files:** `src/pages/Home/index.tsx`, `src/pages/Consultancy/index.tsx`,
`src/components/layout/Navbar.tsx`

---

## 63. "Our Team" moved from Home to the About page + navbar submenu added
Removed the "Our Team / Leadership that stays in the room." section from the
Home page and added it to the About page as a new numbered section,
**§04 "Meet Our Leaders"**, sitting right after Core Values (03). Adapted
its header from the Home dot-label style to the About page's numbered
`sectionLabel` convention so it matches the rest of the page; kept the
"Leadership that stays in the room." heading, the textured photo background,
and the Anteneh Tegegn leader card.

Renumbered the sections after it: "Let's Talk" 04→05, "Find Us" 05→06.

Added an **"Our Leaders"** item to the navbar's About dropdown, linking to
`/about#meet-our-leaders` (jumps straight to the new section).

All section seams verified: Core Values ends `navy-dark` → Leaders fades in
from `navy-dark` and out to `navy-dark` → Find Us/Map starts `navy-dark`.
On the Home page, removing the Team band left two adjacent `navy-dark`
sections (Latest News → Closing CTA), which is seamless.

**Files added:** `src/pages/About/LeadersSection.tsx`, `LeadersSection.module.css`
**Files removed:** `src/pages/Home/TeamSection.tsx`, `TeamSection.module.css`
**Files:** `src/pages/About/index.tsx`, `MapSection.tsx`,
`src/pages/Home/index.tsx`, `src/components/layout/Navbar.tsx`

---

## 64. About page — removed the "01 Our Story" number/label, renamed heading to "Our Story"
Removed the small numbered eyebrow row ("01 · Our Story") above the big
heading in the About page's first content section. The big heading that
used to read "Built to do / two things at once." is now simply **"Our
Story"**. Cleaned up the now-unused `sectionLabel`/`labelNumber`/`labelText`/
`labelLine`/`headingAccent` CSS rules that only existed for that removed row.
No other section's numbering changed — this only affects the first section.

**Files:** `src/pages/About/OurStorySection.tsx`, `OurStorySection.module.css`

---

## 65. About page — "Our Mission" section simplified (bold title, new subtitle, description removed)
Restructured the Mission section's header, matching the pattern used for
Our Story:
- Removed the small "02 · Our Mission" numbered eyebrow row and its thin
  horizontal divider line.
- "Our Mission" is now the big, bold heading itself — bumped up to
  extra-bold (800) and a larger size than before.
- The old heading "Our mission is to / empower organisations." is replaced
  by a new subtitle line: **"Enabling growth and transformation."**
- The long description paragraph underneath ("Our mission is to empower
  organizations by delivering exceptional management consulting...") is
  removed completely.
- The two pillar cards (Management Consultancy / Trading & Supply) are
  unchanged.

Cleaned up the now-unused `sectionLabel`/`labelNumber`/`labelText`/
`labelLine`/`headingAccent`/`statement` CSS rules.

**Files:** `src/pages/About/MissionSection.tsx`, `MissionSection.module.css`

---

## 66. About page — "Our Mission" heading now uses the Core Values two-line/shimmer treatment
Reworked fix #65's result so the Mission heading matches the exact visual
pattern used on the Core Values section ("The principles that / don't
bend."):
- Combined into a single two-line heading — no longer a separate title +
  subtitle paragraph.
- Line 1, **"Our Mission"** — plain bold white text.
- Line 2, **"Enabling growth and transformation."** — the same shimmering
  orange gradient sweep animation used for Values' "don't bend." accent
  (own keyframe `missionShimmer` to avoid colliding with Values' scoped
  `valuesShimmer`).
- Heading size/weight brought in line with the Values heading (700 weight,
  same clamp) so both sections read consistently.

**Files:** `src/pages/About/MissionSection.tsx`, `MissionSection.module.css`

---

## 67. About page — "Enabling growth and transformation." made smaller than "Our Mission"
Follow-up to #66: the accent line was the same size as the "Our Mission"
line above it. Sized it down (~30% smaller, lighter weight) so "Our
Mission" reads as the dominant line and "Enabling growth and
transformation." sits underneath it as a smaller accent, not equal weight.

**Files:** `src/pages/About/MissionSection.module.css`

---

## 68. About page — Core Values cards overlapping on phone, fixed
Root cause: `.valueCard:last-child` sets `grid-column: span 2` (so the 5th
card fills the leftover cell in the 3-column desktop grid), but the mobile
breakpoint (≤540px) collapses the grid to a single column without
resetting that span. Spanning 2 tracks inside a 1-column grid forces the
browser to create a phantom implicit 2nd column, so the last card rendered
half-width and overlapped the card next to it.

Fixed by resetting `.valueCard:last-child { grid-column: span 1; }` inside
the ≤540px breakpoint. Also removed a dead, misnamed `.missions` rule at
the 768px breakpoint (leftover/typo — the section has no `.missions` class,
its grid class is `.valuesGrid`, and the correct single-column collapse
already happens at the 540px breakpoint).

**Files:** `src/pages/About/ValuesSection.module.css`

---

## 69. About page — hero section background image swapped
Changed the top ("About Us") hero section's background image from
`about-hero-bg.webp` to the owner-supplied `about-bg.jpg`.

**Files:** `src/pages/About/HeroSection.module.css`

---

## 70. Consultancy page — "Our Practices" cards simplified + separate detail pages per practice
Reworked the "Six areas. One commitment." section (owner reference: Nova's
"Leadership Development Programmes" layout — small image + title cards that
link out to their own detail page, not an inline expand).

**Card grid** (`ServicesSection.tsx`):
- Each of the 6 practice cards is now just a small image + title +
  "Explore this practice →", no more inline description/points/tag overlay.
- Grid is responsive: 3 columns on desktop, 4 columns on very wide screens
  (≥1400px), 2 columns on tablet (≤900px), 1 column on phone (≤480px).
- Clicking a card navigates to its own detail page instead of expanding
  in place.

**New detail pages** — one per practice, at `/consultancy/practices/:slug`
(`org`, `leadership`, `people-mgmt`, `talent`, `advisory`, `coaching`):
- New route + lazy-loaded page: `src/pages/PracticeDetail/index.tsx`.
- Layout: dark banner with breadcrumb (Consultancy › Our Practices ›
  [Practice]) + title, then an image/description intro with a "Book a
  discovery call" CTA, then two columns — **Indicative Modules** and
  **What Your Organisation Gains** — then a strip linking to the other 5
  practices. Unknown/invalid slugs redirect back to `/consultancy`.
- Practice content (title, image, description, modules, gains) now lives
  in one shared source, `src/data/practices.ts`, used by both the card
  grid and the detail pages. The "modules" lists reuse the existing
  practice bullet points where they already existed (Organizational
  Transformation, Leadership Development); for the other four practices
  (Training on People Management, Talent Search & Assessments, Advisory &
  Change, Coaching & Mentorship) I broke their existing description text
  into module bullets and wrote a matching "what your organisation gains"
  list in the same voice as the rest of the site — sample copy, flag if
  the owner wants it rewritten.

**Navbar submenu fix**: the Consultancy → Services flyout's 6 sub-links
used to jump to `#practice-org` etc. anchors on the same page. Since those
anchor ids no longer exist on the simplified cards, updated those 6 links
to route straight to the new detail pages instead (added an optional `to`
override so `Navbar.tsx`'s link-building logic can point directly at a
route instead of building a `page#hash` anchor).

**Files added:** `src/data/practices.ts`, `src/pages/PracticeDetail/index.tsx`,
`src/pages/PracticeDetail/PracticeDetail.module.css`
**Files changed:** `src/pages/Consultancy/ServicesSection.tsx`,
`ServicesSection.module.css`, `src/router/index.tsx`,
`src/components/layout/Navbar.tsx`

---

## 71. Practice detail pages — removed fabricated bullet content, kept only the real original bullets
Follow-up to #70 after owner feedback: no invented copy allowed on these
pages — only content that actually existed on the site already.

- **"What Your Organisation Gains"** was entirely new copy I wrote for
  fix #70 (it never existed anywhere on the site before). Removed
  completely, for all 6 practices.
- The **modules bullet list** for Training on People Management, Talent
  Search & Assessments, Advisory & Change, and Coaching & Mentorship was
  me splitting their existing paragraph into bullet points — that
  reformatting counts as added content, not original site copy, so it's
  removed. Those 4 detail pages now show only the original description
  paragraph (unchanged), same as before, no bullet list section.
- **Organizational Transformation** and **Leadership Development
  Programs** keep their bullet lists exactly as they were on the old
  cards — verified word-for-word against the original `points` arrays,
  nothing added, corrected, or reworded.

**Files:** `src/data/practices.ts`, `src/pages/PracticeDetail/index.tsx`,
`PracticeDetail.module.css`

---

## 72. Consultancy page — practice cards always 3 per row, slightly wider
Removed the ≥1400px breakpoint that bumped the grid to 4 cards per row —
it's now a fixed 3-per-row on desktop at every width. Tightened the gap
between cards a bit and increased the card image height slightly so each
card reads a little larger/wider now that it isn't competing for space
with a 4th column.

**Files:** `src/pages/Consultancy/ServicesSection.module.css`

---

## 73. Trading page — "Key Suppliers" renamed to "Key Suppliers & Brands"
Renamed the section label on the Trading page and its matching entry in
the navbar's Trading submenu flyout, so both read "Key Suppliers & Brands"
consistently.

**Files:** `src/pages/Trading/KeySuppliersSection.tsx`, `src/components/layout/Navbar.tsx`

---

## 74. Trading page — "Key Suppliers & Brands" nav link fixed + logos made clickable
**Nav link landing wrong**: root cause was section ordering, not the anchor
itself (`id="suppliers"` already matched the navbar's `hash: 'suppliers'`
correctly). The Key Suppliers section had ended up placed *after* the
Closing CTA — the very last thing on the page, right against the footer
with almost no scroll room past it, so the anchor-scroll couldn't land on
it properly. Every other page on the site keeps its Closing CTA last;
Trading was the exception. Moved Key Suppliers back to before the Closing
CTA (between "Why Buyers Work With Us" and the CTA), restoring that
pattern. Added a bottom fade to Key Suppliers so it still hands off
cleanly into the Closing CTA's navy-dark background (previously it had no
bottom fade at all, since it used to butt directly against the footer).

**Clickable logos**: each supplier card is now a link to their site,
opening in a new tab:
- XCMG → https://www.xcmgglobal.com
- DEVELON → https://www.mydevelon.com
- My Wish Enterprise → https://mywishenterprise.com
- ABA Trading FZCO → no website supplied, left as a plain (non-clickable) card

**Files:** `src/pages/Trading/index.tsx`, `KeySuppliersSection.tsx`, `KeySuppliersSection.module.css`

---

## 75. Anchor nav links unreliable (worst on Trading "Key Suppliers & Brands") — hardened the scroll handler
The intermittent "jumps to the wrong place / does nothing" behaviour on
in-page nav links wasn't specific to Key Suppliers — that section just
exposed it most because it's the deepest section on a long page. Two real
bugs in the global anchor-scroll handler (`App.tsx`), both fixed:

1. **Re-clicking the same link did nothing.** The scroll effect only
   depended on `location.pathname` + `location.hash` *values*. Clicking
   `#suppliers`, scrolling away by hand, then clicking `#suppliers` again
   left both values unchanged, so the effect never re-ran. Added
   `location.key` to the dependency array — React Router mints a fresh key
   on every navigation (even to an identical URL), so every click now
   re-fires the scroll. (This was the "I scroll a little then click and
   nothing happens" case.)

2. **Landed short / in the wrong place.** The handler scrolled the instant
   the target element existed, but a section low on the page keeps sliding
   down while everything above it settles — lazy images loading, font
   swaps, in-view animations, and (cross-page) the 0.3s exit + 0.5s enter
   page transition. The one-shot scroll therefore landed above the section.
   Replaced the "scroll once and stop" logic with a scroll-and-settle loop
   that re-scrolls at 150/350/600/900ms, tracking the target until the
   layout stops moving. Also bumped the mount-polling window from ~3s to
   ~4s to comfortably cover the page-transition delay on cross-page jumps.

This is a general improvement for every submenu anchor across the site, not
just the Trading page.

**Files:** `src/App.tsx`

---

## 76. Contact page — reduced gap between hero subtext and "Send a Message" form
The form section (`.body`) used the same large top/bottom padding value
(`--section-pad-y`, ~110–220px) on both sides, which stacked on top of the
hero's own bottom whitespace and created a big empty gap between "Send us
a note..." and the "01 · Send a Message" label. Reduced just the top
padding to a smaller clamp, leaving the bottom padding (spacing before the
map section) unchanged.

**Files:** `src/pages/Contact/ContactFormSection.module.css`

---

## 77. Contact page — odd navy stripe between hero and form section, fixed
Root cause: `.hero`'s `min-height: 78vh` and `max-height: 760px` were
conflicting. Per the CSS spec, `min-height` wins when the two disagree, so
on any tall viewport where `78vh` exceeds `760px` (common on desktop
monitors), `.hero` grew taller than the decorative background layers
(image, overlay, aurora, orbs), which are capped at `760px` via
`height` + `max-height` (no `min-height`, so they behave differently and
correctly clamp to 760px). That left a gap between where the image/overlay
stopped and where `.hero`'s box actually ended — exposing the raw page
background (`body { background-color: var(--navy) }`) as a stray
medium-navy stripe, distinct from both the darker photo overlay above it
and the near-black form section below it.

Fixed by sizing `.hero` with `min-height: min(78vh, 760px)` instead — now
it can never grow past what the background layers actually cover. Also
gave `.section` itself a `var(--navy-dark)` fallback background (matching
the form section's color) so any future rendering gap blends in instead of
showing the page's raw navy.

**Files:** `src/pages/Contact/ContactFormSection.module.css`

---

## 78. Footer links reordered/renamed to match services + "Construction Machinery" → "Construction Machineries" site-wide
**Footer — Consultancy column**, now ordered and labeled to match the six
practices exactly (and linked to each practice's own detail page from
fix #70, instead of just `/consultancy`):
1. Organizational Transformation
2. Leadership Development
3. Training on People Management
4. Talent Search & Assessments
5. Advisory & Change
6. Coaching & Mentorship

**Footer — Trading column**, reordered to: Construction Machineries,
Medical Equipment, Electric Vehicles, Sanitary Products.

**"Construction Machinery" → "Construction Machineries"** — renamed
everywhere it appeared for consistency: the navbar's Trading → Product
Lines flyout, the Trading page's product card title, the Trading closing
CTA's category pill, and the page's JSON-LD service/offer names.

**Files:** `src/components/layout/Footer.tsx`, `src/components/layout/Navbar.tsx`,
`src/pages/Trading/ProductLinesSection.tsx`, `src/pages/Trading/ClosingCTASection.tsx`,
`src/pages/Trading/index.tsx`

---

## 79. Backend Phase 1 — foundation + public Careers/Jobs flow (PHP + MySQL on cPanel)
First backend beyond the contact form. Extends the existing dependency-free
PHP setup (`server/mail.php` style) with a MySQL database, admin auth
foundation, and the complete public-facing careers experience.

**Database** (`server/schema.sql`): `admin_users` (multi-user + roles
admin/hr), `jobs`, `applications`, and the survey tables (`surveys`,
`survey_questions`, `survey_responses`, `survey_answers`) ready for the
next phase.

**Shared PHP libs** (`server/api/_lib/`, blocked from direct web access via
.htaccess): `bootstrap.php` (config + JSON headers + hardened session +
error handler), `db.php` (PDO/MySQL), `http.php` (JSON + method + rate-limit
+ input helpers), `auth.php` (session login, `require_auth`/`require_role`,
bcrypt), `mailer.php` (reusable SMTP, copied from mail.php so the contact
form stays untouched).

**Auth endpoints:** `auth/login.php`, `logout.php`, `me.php`. Plus
`create-admin.php` — a one-time CLI script to seed the first admin (delete
after use).

**Public careers endpoints:** `jobs.php` (list open jobs / single by slug,
hides drafts + expired) and `apply.php` (application submit with CV upload —
validates file by real MIME not client type, stores outside web root,
emails HR an alert, saves to DB).

**Frontend:**
- "Careers" nav link added next to Contact.
- `src/lib/api.ts` — small typed fetch client for `/api/*.php`.
- `/careers` — listing page (fetches open jobs, with loading/empty/error states).
- `/careers/:slug` — job detail + application form (name/email/phone/cover
  note/CV upload) posting to `apply.php`, with field-level validation and a
  success state.
- Routes lazy-loaded in the router.

**Security:** CV files stored outside `public_html` (served only via an
authenticated endpoint, built next phase); `config.php` + `private/` CV
folder gitignored; admin auth enforced server-side; passwords bcrypt-hashed.

**Ops:** `server/README.md` — full cPanel setup guide (create DB, run
schema, config, private CV folder, first-admin). `server/seed-sample-jobs.sql`
— optional sample rows to preview the Careers page before the admin exists.

Verified: all 15 PHP files pass `php -l`; frontend `tsc --noEmit` clean; new
CSS modules cross-checked. NOTE: the API only responds on the deployed
cPanel site (needs PHP+MySQL) — like the existing contact form, it won't
work under `vite dev`.

**Still to build (next phases):** admin panel UI (login, jobs CRUD,
applications dashboard + CV download, user management), then the custom
survey builder + public survey fill + results dashboard.

**Files added:** `server/schema.sql`, `server/seed-sample-jobs.sql`,
`server/create-admin.php`, `server/README.md`, `server/api/config.example.php`,
`server/api/_lib/{bootstrap,db,http,auth,mailer}.php`, `server/api/_lib/.htaccess`,
`server/api/auth/{login,logout,me}.php`, `server/api/jobs.php`, `server/api/apply.php`,
`src/lib/api.ts`, `src/pages/Careers/{index.tsx,Careers.module.css,JobDetailPage.tsx,JobDetail.module.css}`
**Files changed:** `src/components/layout/Navbar.tsx`, `src/router/index.tsx`, `.gitignore`

---

## 80. Backend config moved to .env + local (XAMPP) dev setup working
Per owner request, unified the new backend's configuration into a `.env`
file instead of a PHP config array:
- `server/api/_lib/env.php` — tiny dependency-free `.env` parser.
- `server/api/config.php` — now reads values from `.env` (with safe
  fallback defaults) and holds NO secrets, so it's committed. It looks for
  `.env` one level ABOVE the web/server root (local: `<project>/.env`;
  cPanel: `/home/USER/.env`, outside public_html).
- `.env` (gitignored, created for local XAMPP) + `.env.example` (committed
  template). SMTP stays in `mail-config.php` (shared with the contact form,
  left untouched).
- Vite dev proxy added: `/api` + `/mail.php` → `http://localhost:8080` so
  `npm run dev` talks to a local `php -S` server. No effect on prod build.

**Local stack verified working** (XAMPP MariaDB 10.4 + PHP 8.2):
schema imported (7 tables), 2 sample jobs seeded, first admin user created,
and all endpoints tested via curl — public jobs list returns data, admin
login succeeds (200), brute-force throttle fires (429), wrong password
rejected (401).

**Files added:** `server/api/_lib/env.php`, `.env.example` (+ local `.env`, gitignored)
**Files changed:** `server/api/config.php` (now env-driven, committed), `vite.config.ts`, `.gitignore`

---

## 81. Admin panel built (login + dashboard + jobs + applications) + job cards → grid
Two things: fixed the Careers job cards to a **grid/box layout** (was a
stacked single-column list — now responsive `auto-fill` boxes, each a
self-contained card with type/department tags, title, summary, location +
"View role →"), and built the **admin panel** (the reason `/admin` errored —
the route + API didn't exist).

**Admin API** (`server/api/admin/`, all auth-guarded server-side):
- `jobs.php` — full CRUD (list w/ application counts, create w/ auto-unique
  slug, update, delete, publish/close via status).
- `applications.php` — list (all or by job), single detail, status update.
- `download-cv.php` — streams a stored CV to a signed-in admin only (the CV
  lives outside the web root; this is the only way to fetch it).
- `stats.php` — dashboard counts.

**Admin frontend** (`src/admin/`, its own lazy chunk, mounted at a separate
top-level `/admin/*` route so it has none of the public navbar/footer/theme):
- `AuthContext` (session check via `/auth/me.php`, login, logout).
- `LoginPage`, `AdminLayout` (sidebar + protected-route redirect).
- `Dashboard` (stat cards), `JobsManager` (table + publish/close/delete),
  `JobEditor` (create/edit form), `ApplicationsManager` (table + detail
  modal with CV download + status change).
- Self-contained `admin.module.css` (fixed light palette, independent of the
  site's dark/light theme).

**Verified end-to-end** against local XAMPP: login sets session → stats,
job create, list, delete all work with the cookie → unauthenticated request
returns 401. Frontend `tsc` clean; admin CSS classes cross-checked.

**Files added:** `server/api/admin/{jobs,applications,download-cv,stats}.php`,
`src/admin/{types.ts,AuthContext.tsx,AdminApp.tsx,AdminLayout.tsx,LoginPage.tsx,Dashboard.tsx,JobsManager.tsx,JobEditor.tsx,ApplicationsManager.tsx,admin.module.css}`
**Files changed:** `src/lib/api.ts` (apiJson for PATCH/DELETE),
`src/router/index.tsx` (/admin route), `src/pages/Careers/{index.tsx,Careers.module.css}` (grid)

---

## 82. Fix: admin login page rendered blank (white-on-white)
The admin CSS palette variables (`--a-navy`, `--a-text`, `--a-border`, …)
were declared only on `.root`, but the login page (`.loginWrap`) and the
loading screen (`.centered`) render OUTSIDE `.root`. So every color inside
the login card resolved to an undefined variable → inherited white text and
white input borders on a white card = an empty-looking box. Moved the
variable declarations onto a shared selector (`.root, .loginWrap, .centered`)
so all three admin entry points get the palette.

**Files:** `src/admin/admin.module.css`

---

## 83. Applications: status emails + note, inline CV preview; Jobs: auto-close + deadline countdown
Three owner requests on the careers/admin side.

**1. Status-update emails + optional note.** Added `status_note` +
`status_updated_at` columns to `applications`. The admin's application
detail now has a proper "Update status" panel: status dropdown, an optional
message box, and a "notify applicant" checkbox (on by default). On save it
updates the status and — if notify + a valid email — sends the applicant a
professional, per-status email (`_lib/status-emails.php`) that always names
the job they applied for, thanks them, and includes the admin's note. The
**rejected** template specifically encourages them to keep applying, not
give up, and keep developing; **hired** congratulates and sets up next
steps. Uses the shared SMTP mailer (owner-updated `mail-config.php`
credentials — verified: a real test send returned success).

**2. In-browser CV preview.** `download-cv.php` gained an `?inline=1` mode
(Content-Disposition: inline). The admin detail modal now has "View in
browser" (embeds a PDF preview iframe), "Open in new tab", and "Download".
Non-PDF files fall back to open/download (browsers can't render docx inline).

**3. Auto-close + deadline countdown.** Jobs now auto-close once their
`closes_at` date passes: a shared `close_expired_jobs()` runs whenever the
public or admin job lists are read, `apply.php` refuses expired postings,
and `cron-close-jobs.php` provides a daily safety-net cron. A countdown
warning (`src/lib/jobTime.ts`) shows only inside the last 5 days —
"5 days left" … "1 day left", then hours on the final day ("6 hrs left") —
on the public careers cards, the job detail page, and the admin jobs table.

**Files added:** `server/api/_lib/status-emails.php`, `server/api/_lib/jobs-maintenance.php`,
`server/cron-close-jobs.php`, `src/lib/jobTime.ts`
**Files changed:** `server/schema.sql` (+status_note cols), `server/mail-config.php` (SMTP pass),
`server/api/admin/applications.php`, `server/api/admin/download-cv.php`, `server/api/jobs.php`,
`server/api/admin/jobs.php`, `server/api/apply.php`, `server/README.md`,
`src/admin/{ApplicationsManager.tsx,JobsManager.tsx,types.ts}`,
`src/pages/Careers/{index.tsx,Careers.module.css,JobDetailPage.tsx,JobDetail.module.css}`

---

## 84. Survey module — full custom builder, public fill page, results + CSV (owner's big feature)
The complete self-hosted, Google-Forms-style survey system (Google Forms is
only the visual reference — nothing is integrated with Google; all data is
in our MySQL).

**Backend (all dependency-free PHP):**
- `admin/surveys.php` — survey CRUD; saves the survey + its questions in one
  request. Questions lock automatically once responses exist (prevents
  orphaning answer data — meta/settings/status stay editable).
- `survey.php` (public) — list published surveys (for the site card) + fetch
  one to fill; enforces response limit ("closed" state).
- `survey-submit.php` (public) — validates required answers + email, stores
  response + answers in a transaction, returns the confirmation message.
- `admin/survey-results.php` — per-question aggregates (choice counts +
  text answers) + individual responses; `?format=csv` streams an Excel-ready
  CSV (UTF-8 BOM).
- 10 question types: short answer, paragraph, multiple choice, checkboxes,
  dropdown, linear scale, star rating, date, email, number. Settings:
  status (draft/published/closed), collect email, show progress bar,
  confirmation message, response limit.

**Admin frontend** (`src/admin/`): `SurveysManager` (list + publish/close/
delete), `SurveyEditor` (the builder — add/reorder/delete questions, per-type
config, settings, live question-lock notice), `SurveyResults` (summary bars
+ individual table + CSV export). Added "Surveys" to the sidebar + routes.

**Public frontend:**
- `/survey/:slug` (`src/pages/Survey/`) — a clean Google-Forms-style fill
  page rendering every question type, with progress bar, validation,
  required markers, and a confirmation screen.
- `SurveySection` on the **Consultancy page** — shows published surveys as
  simple cards linking to their own fill page (renders nothing when none are
  published), exactly as the owner asked (card on Consultancy → separate
  survey page).

**Verified end-to-end** on local XAMPP: create survey w/ 3 question types →
publish → public list → fetch → submit response → aggregates → CSV export,
plus admin list. All PHP lints clean; `tsc` clean; CSS cross-checked. A
sample "Employee Experience Survey" (published, 1 response) is in the DB.

**Files added:** `server/api/_lib/slug.php`, `server/api/admin/surveys.php`,
`server/api/admin/survey-results.php`, `server/api/survey.php`, `server/api/survey-submit.php`,
`src/admin/{surveyTypes.ts,SurveysManager.tsx,SurveyEditor.tsx,SurveyResults.tsx}`,
`src/pages/Survey/{index.tsx,Survey.module.css}`,
`src/pages/Consultancy/{SurveySection.tsx,SurveySection.module.css}`
**Files changed:** `src/admin/{AdminApp.tsx,AdminLayout.tsx}`, `src/router/index.tsx`,
`src/pages/Consultancy/index.tsx`

---

## 85. Admin overhaul — staff management, job thumbnails, modern dashboard with charts
Three big admin additions.

**1. Staff / user management** (admin-role only). New `admin/users.php`
(list/create/update/delete, role, activate/deactivate, password reset) with
guards: can't delete/deactivate yourself, can't remove or demote the last
active admin, email uniqueness. New `admin/profile.php` for any user to edit
their own name/email/password (password change requires the current one).
Frontend: `UsersManager` (table + add/edit modal + reset password + activate)
and `Profile`. "Staff" appears in the sidebar for admins only; "My profile"
for everyone.

**2. Job thumbnail images.** Added `thumbnail` column to jobs + a public
web-accessible uploads folder (`server/uploads/jobs`, gitignored) served at
`/uploads/...` (added to the Vite dev proxy). New authenticated
`admin/upload-image.php` (validates real MIME — jpg/png/webp/gif, 4 MB cap).
The job editor has an optional image field with live preview + remove; the
image shows on the public careers **cards** (full-bleed top) and the job
**detail** page.

**3. Modern dashboard.** Rewrote `admin/stats.php` to return rich data
(counters, applications-by-status, jobs-by-status, 14-day application trend,
top jobs, recent applications, survey response counts). Built dependency-free
**animated SVG charts** (`charts.tsx`: donut/pie with legend, horizontal
bars, area/line trend — all animated via framer-motion). New Dashboard:
accent-topped stat cards, an area chart of applications over time, donut
charts for application + job status, top-jobs bars, a recent-applications
table, and survey response bars — all in a responsive 2-column grid.

**Verified end-to-end**: staff create + guards (409 on self-delete / last-admin
demote), profile update, image upload → served at /uploads → job thumbnail
round-trips to the public API. All PHP lints clean; `tsc` clean; CSS
cross-checked. A sample HR user (Hiwot HR / hr@antragroup.et) is seeded.

**Files added:** `server/api/admin/{users,profile,upload-image}.php`,
`src/admin/{charts.tsx,UsersManager.tsx,Profile.tsx}`
**Files changed:** `server/api/admin/{stats,jobs}.php`, `server/api/jobs.php`,
`server/schema.sql`, `.gitignore`, `vite.config.ts`,
`src/admin/{Dashboard.tsx,AdminApp.tsx,AdminLayout.tsx,JobEditor.tsx,types.ts,admin.module.css}`,
`src/lib/api.ts`, `src/pages/Careers/{index.tsx,Careers.module.css,JobDetailPage.tsx,JobDetail.module.css}`

---

## 86. Survey-only staff role + Consultancy survey nav sub-link
**New "survey" role.** Added `survey` to the `admin_users.role` enum. Access
is now role-scoped server-side (was any-authenticated): jobs / applications /
CV-download / image-upload require `admin` or `hr`; surveys / survey-results
require `admin` or `survey`; staff stays `admin`-only. The admin sidebar now
shows links by role — HR sees Jobs + Applications, a Survey user sees only
Surveys, admin sees everything (all roles see Dashboard + My profile). The
staff editor has a "Survey (surveys only)" role option. Verified: a survey
user gets 200 on surveys and 403 on jobs/applications/staff.

**Consultancy survey nav link.** Added "Survey" under the Consultancy dropdown
in the public navbar, linking to `/consultancy#surveys` — it scrolls to the
survey card section (id="surveys"). (That section was already wired and the
public endpoint returns the published surveys — if it wasn't showing, the
local PHP server just needed a restart to pick up the survey endpoints.)

**Files changed:** `server/schema.sql`, `server/api/admin/{jobs,applications,surveys,survey-results,users,download-cv,upload-image}.php`,
`src/admin/{types.ts,AdminLayout.tsx,UsersManager.tsx}`, `src/components/layout/Navbar.tsx`

---

## 87. Fix: survey dropdown options invisible on dark theme
The native `<select>` on the public survey fill page inherited white text,
but the browser's dropdown popup has a light background — so the options
rendered white-on-white (invisible). Added explicit `.input option`
colours (`--navy-dark` background, `--white` text) so options are readable
in both dark and light theme. (The Contact form already handled this.)

**Files:** `src/pages/Survey/Survey.module.css`

---

## 88. Fix: Consultancy survey section rendered as an empty box
The survey section on the Consultancy page mounts only *after* its `/survey.php`
data resolves — often after the user has already scrolled to where it sits
(deep in a long page, below the fixed navbar). Its content animations were
gated on `useInView`, which never flipped to `true` for that late mount, so
the label, heading, and cards stayed at `opacity: 0` — a tall, empty dark
box. Switched it to animate on mount (no scroll-into-view dependency), so the
content is always visible once the surveys load. (Renders nothing at all when
there are no published surveys / the API is unreachable, as before.)

**Files:** `src/pages/Consultancy/SurveySection.tsx`

---

## 89. Fix: careers job card with a thumbnail broke the card shape
The card used negative margins to full-bleed the image, with the card also
forcing equal heights (`height: 100%` + grid `stretch`) and no
`overflow: hidden`. So a card WITH an image rendered taller and its image
sat outside the padded flow, making that card look misshapen and pushing
the text-only cards in the row to stretch with big empty gaps.

Refactored to the standard "image banner + padded body" pattern: the card
is now `overflow: hidden` with no padding; the image is a clean full-width
banner clipped to the rounded top; and all text lives in a new padded
`.cardBody`. Grid switched to `align-items: start` so image cards no longer
stretch the text-only cards. Image and no-image cards now share one clean
shape.

**Files:** `src/pages/Careers/index.tsx`, `src/pages/Careers/Careers.module.css`
