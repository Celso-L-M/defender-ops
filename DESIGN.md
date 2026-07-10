# Design Brief

## Direction

Brutalist SecOps Dashboard — A utilitarian, data-dense operational hub for security teams monitoring multi-cloud infrastructure threats in real time.

## Tone

Brutalist, functional, high-stakes. No decoration; every visual element serves operational clarity. Monospace identifiers, minimal hierarchy, stark status indicators.

## Differentiation

Raw findings first, polished interfaces second — this is SOC-grade data instrumentation where the analyst brain matters more than the pixel.

## Color Palette

| Token        | OKLCH           | Role                              |
|--------------|-----------------|-----------------------------------|
| background   | 0.12 0 0        | Deep charcoal canvas              |
| foreground   | 0.96 0 0        | High-contrast primary text        |
| card         | 0.16 0 0        | Elevated surface for data panels  |
| primary      | 0.52 0.255 220  | Connected/active cyan accent      |
| destructive  | 0.62 0.22 25    | Error/critical red warning        |
| warning      | 0.65 0.19 70    | Amber for medium-level alerts     |
| success      | 0.6 0.18 135    | Green for resolved/secure status  |
| muted        | 0.2 0 0         | Secondary background for groups   |

## Typography

- Display: Space Grotesk — metric labels, timestamps, severity cards
- Body: DM Sans — table text, descriptions, status flows
- Mono: JetBrains Mono — finding IDs, API responses, timestamps
- Scale: hero 2xl bold, h2 lg semibold, label xs monospace, body sm regular

## Elevation & Depth

Layered background tonality (charcoal → card → popover) with minimal shadows; depth conveyed through contrast and z-index, not blur. Card borders define surfaces over shadow depth.

## Structural Zones

| Zone         | Background  | Border       | Notes                                    |
|--------------|-------------|--------------|------------------------------------------|
| Header       | card 0.16   | border/0.3   | Primary nav, title, status strip         |
| Main content | background  | —            | Full-bleed findings table/dashboard      |
| Data panel   | card 0.16   | border/0.3   | Isolated metric cards, grids             |
| Footer       | background  | border/0.3   | Polling status, legend, debug info       |

## Spacing & Rhythm

Tight vertical spacing (0.5rem between table rows); generous horizontal grid gutters (1rem–1.5rem) to separate cloud provider columns. Badge inline padding 0.25rem–0.5rem. Section gaps 2rem.

## Component Patterns

- Badges: small (0.75rem), monospace uppercase, background tinted 20%, border solid 1px accent, letter-spacing 0.025em
- Cards: 0.625rem roundness, flat background (no gradient), border-bottom or border-right only on tables
- Tables: data-dense utility, 2rem row height, 0.875rem font, monospace IDs, left-aligned text, alternating muted rows
- Buttons: primary cyan, hover brightened L+0.05, minimal rounded, no shadows except on :active

## Motion

- Entrance: fade-in 200ms ease-out on mount, cascade rows 40ms stagger
- Hover: text-foreground brightens 0.1 L, border emphasizes 0.2 opacity, 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Decorative: none; every animation serves usability (polling indicator pulse, status transitions)

## Constraints

- No full-page gradients or decorative blur effects
- All status colors must pass WCAG AAA on dark background
- Table cells never center-align; preserve scanning direction (left→right, top→bottom)
- Monospace used only for IDs, timestamps, technical values; never for UI copy

## Signature Detail

Data-dense table utility with sub-2rem row heights and 1px internal borders at 30% opacity creates a technical, military-grade aesthetic reminiscent of Shodan or a network analyzer UI.
