# Design Brief

## Direction

Defender Ops — a dark SecOps command center with distinct per-provider dashboard identities (AWS / Azure / GCP) so analysts always know which cloud they are acting on.

## Tone

Brutalist, functional, high-stakes. Every element serves operational clarity; each provider gets an unmistakable accent identity to prevent cross-cloud mistakes.

## Differentiation

Provider-coded visual identity — a top accent bar, tinted surface, and accent nav state that re-theme the entire dashboard per provider, so context is never ambiguous.

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
| aws          | 0.72 0.17 55    | Warm amber/orange provider accent |
| azure        | 0.62 0.19 250   | Azure blue provider accent        |
| gcp          | 0.68 0.16 160   | Emerald green provider accent     |

## Typography

- Display: Space Grotesk — metric labels, timestamps, severity cards
- Body: DM Sans — table text, descriptions, status flows
- Mono: JetBrains Mono — finding IDs, API responses, timestamps
- Scale: hero 2xl bold, h2 lg semibold, label xs monospace, body sm regular

## Elevation & Depth

Layered background tonality (charcoal → card → popover) with minimal shadows; depth conveyed through contrast and z-index, not blur. Provider shells use a 3px top accent bar plus a tinted surface for instant recognition.

## Structural Zones

| Zone         | Background  | Border       | Notes                                    |
|--------------|-------------|--------------|------------------------------------------|
| Header       | card 0.16   | border/0.3   | Primary nav, provider selector, status   |
| Provider nav | muted/0.5   | border/0.3   | Active item tinted with provider accent  |
| Main content | background  | —            | Full-bleed provider-scoped dashboard     |
| Data panel   | provider-soft | border/0.3 | Provider-tinted metric cards, grids      |
| Footer       | background  | border/0.3   | Polling status, legend, debug info       |

## Spacing & Rhythm

Tight vertical spacing (0.5rem between table rows); generous horizontal grid gutters (1rem–1.5rem) to separate provider columns. Badge inline padding 0.25rem–0.5rem. Section gaps 2rem.

## Component Patterns

- Buttons: primary cyan, hover brightened L+0.05, minimal rounded, no shadows except on :active
- Cards: 0.625rem roundness, flat background, provider-soft tint on provider pages, border-bottom/right on tables
- Badges: 0.75rem monospace uppercase, 20% tinted background, solid 1px accent border, 0.025em tracking
- Provider badge: uses provider accent + soft tint; nav active item gets 3px left accent bar
- Shells: `provider-shell` with 3px top accent bar; accent bound via `provider-aws/azure/gcp` var

## Motion

- Entrance: fade-in 200ms ease-out on mount, cascade rows 40ms stagger
- Hover: text-foreground brightens 0.1 L, border emphasizes 0.2 opacity, 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Decorative: provider-pulse 2s on live connection dot; no other decoration

## Constraints

- No full-page gradients or decorative blur effects
- All status colors must pass WCAG AAA on dark background
- Table cells never center-align; preserve scanning direction (left→right, top→bottom)
- Monospace used only for IDs, timestamps, technical values; never for UI copy
- Provider accents (aws/azure/gcp) reserved for provider identity only, never for status semantics

## Signature Detail

The 3px provider accent bar + tinted shell re-themes the whole dashboard per cloud, turning "which provider am I in?" from a read into a glance — a military-grade guard against cross-cloud mistakes.
