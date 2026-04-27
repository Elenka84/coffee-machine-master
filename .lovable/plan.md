## Add Magnet animation to all site cards

Wrap all card-like blocks across the site with a new `Magnet` component (from React Bits) so cards smoothly follow the cursor when it gets near them.

### What will change

A new reusable component will be created at `src/components/Magnet.tsx` (TypeScript port of the snippet you shared, no extra dependencies). Then it will wrap every card on the site:

`**src/pages/Index.tsx**`

- 4 "Проблемы" cards (problems grid)
- 2 "Отзывы" cards (reviews grid)
- The `ContactCard` (phone) in the Contacts section

`**src/pages/Calculator.tsx**`

- All 4 cards in the calculator (machine select, options, additional services, result/total card)

### Magnet settings

To keep the effect tasteful (cards are larger UI blocks, not buttons), defaults will be tuned per area:

- Problems / Reviews / Calculator cards: `padding={40}`, `magnetStrength={8}` — subtle pull
- Contact card (smaller): `padding={50}`, `magnetStrength={6}`

The wrapper will use `display: block` and `width: 100%` so it doesn't break the existing grid layouts (the original snippet uses `inline-block`, which would shrink cards inside `grid`).

### Technical details

- Component file: `src/components/Magnet.tsx` — typed in TS, props: `padding`, `disabled`, `magnetStrength`, `activeTransition`, `inactiveTransition`, `wrapperClassName`, `innerClassName`, plus `children` and passthrough.
- Mouse listener uses `mousemove` on `window`, cleaned up on unmount, respects `disabled` prop.
- Wrapper style overridden to `display: block, width: 100%` (instead of `inline-block`) so cards still fill their grid cell. The inner div keeps the `translate3d` transform.
- Existing `float-card` reveal animation, hover shadows, and `-translate-y-0.5` hover stay intact — Magnet only adds the cursor-follow translate on top.
- No changes to Tailwind config, theme tokens, or other components.

### Out of scope

- Buttons, inputs, badges, and section containers will not get the magnet effect — only the card components listed above.
- Mobile (touch) behavior is unaffected since it relies on `mousemove`.
  &nbsp;

Сейчас: Определяю причину за 15–30 минут , надо сделать: Определяю причину за 15–30 минут и сразу называю стоимость

добавь в блок:  ✔ 90% поломок устраняю в день обращения; Не нашли свою проблему?   
Опишите её — подскажу решение

```

```