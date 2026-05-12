# Tactical Elite — Style Reference
> editorial gold accent, monochromatic depth, precise utility

**Theme:** light/dark hybrid

Tactical Elite establishes a confident, minimalist e-commerce aesthetic with a strong emphasis on product presentation. The system uses a high-contrast achromatic base (Ink Black and Pure White) accented by a sophisticated Gold palette. This combination conveys premium quality and extreme utility. Typography is compact and precise, using Hanken Grotesk. Components are structured and refined, relying on subtle borders, gold accents, and uniform radii.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Ink Black | `#000000` | `--color-ink-black` | Primary backgrounds (Hero), primary text, strong branding elements |
| Pure White | `#ffffff` | `--color-pure-white` | Dialog backgrounds, card surfaces, text on dark backgrounds |
| Gold | `#c9a96e` | `--color-gold` | Primary accent, primary CTA background, status indicators, decorative lines |
| Gold Light | `#d4bc8e` | `--color-gold-light` | Hover states for gold elements |
| Gold Muted | `#a8905c` | `--color-gold-muted` | Borders, subtle accents, less prominent gold elements |
| Canvas Ice | `#e5e7eb` | `--color-canvas-ice` | Secondary backgrounds, subtle dividers |
| Fog Gray | `#efefef` | `--color-fog-gray` | Secondary surface backgrounds |
| Steel Gray | `#6b7280` | `--color-steel-gray` | Input borders, muted text, placeholder text |
| Surface | `#f9f9f9` | `--color-surface` | Default page background |
| On Surface | `#1b1b1b` | `--color-on-surface` | Default text color on light surfaces |

## Tokens — Typography

### Hanken Grotesk — The singular typeface, used across all text elements. Its geometric yet humanist style, combined with tight letter-spacing for body and wide tracking for labels, defines the brand's precise and modern voice. · `--font-heading`, `--font-body`
- **Substitute:** ui-sans-serif, system-ui
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Line height:** 1.2 (Headings), 1.5 (Body)
- **Letter spacing:** -0.02em (Body), 0.15em - 0.4em (Labels/Uppercase)

### Type Scale

| Role | Size | Weight | Tracking | Token |
|------|------|--------|----------|-------|
| Label | 11-12px | 500-700 | 0.15em-0.4em | n/a (Utility classes) |
| Body | 14px | 400 | -0.02em | n/a (Base body) |
| Heading SM | 18px | 600 | -0.02em | n/a (Utility classes) |
| Heading MD | 35px | 700 | -0.04em | n/a (Utility classes) |
| Heading LG | 50px | 700 | -0.05em | n/a (Utility classes) |
| Display | 96px+ | 700 | -0.05em | n/a (Utility classes) |

## Tokens — Spacing & Shapes

**Base unit:** 4px (Tailwind default scale)

**Density:** Comfortable

### Border Radius

| Element | Value |
|---------|-------|
| Standard | 8px |
| Pill | 9999px |

### Layout

- **Section gap:** 80px - 96px
- **Card padding:** 24px - 32px
- **Element gap:** 16px

## Components

### Primary Gold Button
**Role:** Main call to action (Conversion)

Solid Gold background (`#c9a96e`) with Ink Black text, no radius (sharp) or 4px radius depending on context. Font is Hanken Grotesk 700, 12px, with 0.15em tracking.

### Ghost Border Button
**Role:** Secondary action on dark backgrounds

Transparent background with Pure White/Gold text, 1px border (`pure-white/20` or `gold`), transition to gold on hover.

### Surface Card
**Role:** Content grouping, product listings

Pure White background, 8px border-radius, subtle border (`surface-container-high`). Minimal to no visible elevation.

### Product Card
**Role:** Catalog listing

Container with Pure White background, 8px border-radius. High-quality product image, product name (14px, Bold), and price (14px, Gold). Separated by 4px-8px gaps.

## Do's and Don'ts

### Do
- Use Gold for intent: Reserve gold for primary actions, current state indicators, and high-value accents.
- Maintain high contrast: Use Ink Black for large sections to create depth, and Pure White for content clarity.
- Leverage Wide Tracking: Use wide tracking (0.2em+) for uppercase labels and small headers to add an editorial feel.
- Consistent Grid: Adhere to the 4px base unit for all layout decisions.

### Don't
- Avoid generic colors: Do not use standard blues, reds, or greens unless for critical errors (Semantic Red).
- Overuse Gold: If everything is gold, nothing is special. Keep it strategic.
- Use soft edges: Maintain a crisp, structured look with 8px radius or sharp corners for CTA buttons.
- Heavy Shadows: Rely on surface color differences and subtle borders instead of elevation.

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Ink Black | `#000000` | Hero sections, Footers, immersive brand moments. |
| 1 | Surface | `#f9f9f9` | Default page background for catalog and content. |
| 2 | Pure White | `#ffffff` | Surface for cards, modals, and interactive inputs. |

## Imagery

Imagery should be high-quality, professional, and consistent. Products should be shown on clean backgrounds or in "extreme/tactical" environments that align with the "Inquebrantable" brand promise. No generic stock photos.

## Layout

- Max-width contained for content (1280px).
- Full-bleed for hero sections.
- Modular grid approach for product listings.
