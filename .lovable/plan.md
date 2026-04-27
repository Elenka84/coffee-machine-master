## Update the "Problems" section on the home page

All changes are in `src/pages/Index.tsx`, in the Problems block (around lines 305–344).

### 1. Rename the section title

- Change `title="Какие проблемы устраняю"` → `title="Устраню любую проблему с кофемашиной"` in the `SectionHeader`.

### 2. Make the problem cards dark

Currently each card uses `bg-background` (light cream/white) with dark text. Switch them to a dark coffee surface that matches the existing "Условия работы" block lower on the page (`bg-coffee-dark text-primary-foreground`).

Specifically for each problem card:
- Card classes: `bg-background` → `bg-coffee-dark text-primary-foreground border-coffee-dark/40`
- Icon tile: `bg-cream` → `bg-primary-foreground/10`
- Icon color: `text-coffee-dark` → `text-primary-foreground`
- Title: keep `font-semibold` but ensure it inherits the light foreground color (no extra `text-foreground` override needed once the card text color is set; if present, drop it).
- Description: `text-muted-foreground` → `text-primary-foreground/70` for readable contrast on dark.

The "Не нашли свою проблему?" callout block below the grid stays as-is (light card with the "Описать проблему" button) — only the 6 problem cards become dark.

### 3. Remove the duplicate CTA buttons under the grid

Delete the entire block at lines 337–344 (the `<div className="mt-12 flex flex-wrap gap-3">` containing the "Оставить заявку" and "Рассчитать стоимость" buttons). The "Описать проблему" CTA in the "Не нашли свою проблему?" card remains as the section's call to action.

### Out of scope

- No changes to the header, hero CTAs, calculator page, or other sections.
- The Magnet hover animation on the cards stays intact.
