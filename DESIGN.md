# Design System — B2B Netthandel i Norge

## Product Context
- **What this is:** Registry of 6,325 Norwegian B2B e-commerce companies
- **Who it's for:** Procurement professionals finding suppliers
- **Space/industry:** B2B supplier directories (Thomasnet, Kompass, proff.no)
- **Project type:** Data tool / search application
- **Domain:** viainq.no

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian
- **Decoration level:** Minimal — typography and whitespace do the work
- **Mood:** Confident, purposeful, Scandinavian. A well-built instrument, not a brochure.

## Typography
- **Display/Hero:** Satoshi (Fontshare, free) — geometric, sharp, modern
- **Body:** DM Sans (Google Fonts, free) — clean readability at all sizes
- **Data/Tables:** DM Sans with `font-variant-numeric: tabular-nums`
- **Loading:** Satoshi via Fontshare CDN, DM Sans via next/font/google
- **Scale:** Body 15-16px, meta 14-15px, headings 17-19px, stat numbers 26-30px

## Color
- **Approach:** Restrained — one accent + neutrals, color is rare and meaningful
- **Primary:** #0F5132 (deep forest green) — Scandinavian, not corporate blue
- **Primary hover:** #166534
- **Green tint:** #ECFDF5 (confirmed badges)
- **Amber:** #92400E on #FFFBEB (probable badges)
- **Blue:** #1D4ED8 on #EFF6FF (platform badges)
- **Background:** #FAFAF8 (warm off-white)
- **Surface (cards):** #FFFFFF
- **Text:** #1A1A1A
- **Muted:** #6B7280
- **Border:** #E5E5E3
- **Dark mode:** Not implemented — not needed for personal tool

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Max content width:** 1120px

## Layout
- **Approach:** Grid-disciplined
- **Homepage:** 3 stat cards, search bar, 3-column breakdown (2 on mobile)
- **Search results:** Sticky search + filters, card list
- **Company detail:** 2x2 info card grid
- **Border radius:** 6px cards/buttons, 4px badges, 8px search input

## Cards
- **No visible borders** — use subtle box-shadow instead
- **Shadow:** `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)`
- **Hover shadow:** `0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06)`

## Mobile
- **Touch targets:** Minimum 44px height on interactive elements
- **Search button:** Full-width below input on mobile
- **Website links:** Full-width green buttons with URL + ↗ arrow
- **Homepage columns:** Kategorier + Søkeord (2-col), Etter region hidden
- **Stats:** Single column stacked
- **Detail cards:** Single column stacked
- **Filters:** Collapsible details/summary pattern

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-03 | Forest green (#0F5132) over blue | Every B2B directory uses blue. Green is distinctive and Scandinavian. |
| 2026-04-03 | Satoshi + DM Sans fonts | Separates from default Inter/system-ui. Geometric + readable. |
| 2026-04-03 | Categories over NACE codes | Users search by product category, not industry classification codes. |
| 2026-04-03 | Company size column removed | Not useful as a discovery dimension for procurement. |
| 2026-04-03 | Søkeord column added | Dynamic search terms help users discover what the registry can find. |
| 2026-04-03 | Næringsformål card on detail page | Shows what the company actually does in their own words. |
| 2026-04-03 | Lokasjon card removed | Redundant with address in Kontakt and meta line in search results. |
| 2026-04-03 | Text sizes bumped for readability | Primary user is 66 years old. Body 15-16px minimum. |
