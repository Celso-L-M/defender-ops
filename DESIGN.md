# Design Brief

## Direction

Defender Ops — a dark SecOps command center with distinct per-provider dashboard identities (AWS / Azure / GCP) so analysts always know which cloud they are acting on, extended with a centralized secure vault for per-provider credentials, API keys, and secrets.

## Tone

Brutalist, functional, high-stakes. Every element serves operational clarity; each provider gets an unmistakable accent identity to prevent cross-cloud mistakes, and every secret reads as encrypted and locked until explicitly revealed.

## Differentiation

Provider-coded visual identity (top accent bar + tinted surface) re-themes each dashboard per cloud, while the vault adds a cool steel "encrypted" treatment — dot-masked secrets, reveal-on-demand toggles, and audit/access cues — so secrecy is visible at a glance.

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
| vault        | 0.68 0.1 250    | Cool steel "encrypted" accent     |
| aws          | 0.72 0.17 55    | Warm amber/orange provider accent |
| azure        | 0.62 0.19 250   | Azure blue provider accent        |
| gcp          | 0.68 0.16 160   | Emerald green provider accent     |

## Typography

- Display: Space Grotesk — metric labels, timestamps, severity cards
- Body: DM Sans — table text, descriptions, status flows
- Mono: JetBrains Mono — finding IDs, secret names, masked values, timestamps
- Scale: hero 2xl bold, h2 lg semibold, label xs monospace, body sm regular

## Elevation & Depth

Layered background tonality (charcoal → card → popover) with minimal shadows; depth conveyed through contrast and z-index, not blur. Provider shells use a 3px top accent bar plus a tinted surface; vault shells use a cool steel 3px bar and steel-tinted surface.

## Structural Zones

| Zone          | Background     | Border       | Notes                                    |
|---------------|----------------|--------------|------------------------------------------|
| Header        | card 0.16      | border/0.3   | Primary nav, provider selector, status   |
| Provider nav  | muted/0.5      | border/0.3   | Active item tinted with provider accent  |
| Main content  | background     | —            | Full-bleed provider-scoped dashboard     |
| Vault panel   | vault-soft/0.35| vault-border | Steel-tinted secret rows, masked values  |
| Data panel    | provider-soft  | border/0.3   | Provider-tinted metric cards, grids      |
| Footer        | background     | border/0.3   | Polling status, legend, debug info       |

## Spacing & Rhythm

Tight vertical spacing (0.5rem between table rows); generous horizontal grid gutters (1rem–1.5rem) to separate provider columns. Secret rows keep 0.5rem row height with the reveal toggle inline; section gaps 2rem.

## Component Patterns

- Buttons: primary cyan, hover brightened L+0.05, minimal rounded, no shadows except on :active
- Cards: 0.625rem roundness, flat background, provider-soft tint on provider pages, vault-soft tint on vault rows
- Badges: 0.75rem monospace uppercase, 20% tinted background, solid 1px accent border, 0.025em tracking
- Secret value: `.secret-masked` dot-masked monospace at 0.18em tracking, steel color; `.secret-revealed` swaps to plaintext with `secret-reveal` blur-in
- Reveal toggle: `.secret-reveal-toggle` quiet steel outline button, hover fills 15% steel
- Vault shell: `.vault-shell` with 3px steel top bar; provider shells keep `provider-aws/azure/gcp` accent
- Audit badge: `.badge-vault` steel-tinted monospace uppercase for access/audit cues

## Motion

- Entrance: fade-in 200ms ease-out on mount, cascade rows 40ms stagger
- Reveal: secret-reveal 250ms ease-out — value blurs in from 6px to sharp as it decrypts
- Hover: text-foreground brightens 0.1 L, border emphasizes 0.2 opacity, 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Decorative: provider-pulse 2s on live connection dot; no other decoration

## Constraints

- No full-page gradients or decorative blur effects (except the reveal blur-in)
- All status colors must pass WCAG AAA on dark background
- Secrets never render in plaintext by default; only the reveal action shows the value
- Monospace used only for IDs, timestamps, secret names/values; never for UI copy
- Provider accents (aws/azure/gcp) reserved for provider identity; vault steel reserved for secrecy/encryption cues
- Table cells never center-align; preserve scanning direction (left→right, top→bottom)

## Signature Detail

The cool steel vault treatment — dot-masked secrets that blur-in on explicit reveal, framed by a 3px steel top bar — makes "this is encrypted, unlock it deliberately" a glance rather than a read, standing apart from the provider-coded dashboards it protects.
