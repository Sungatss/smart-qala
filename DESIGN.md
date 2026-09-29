# Smart Qala design rules

## Principles
- Civic service for residents on phones. Clarity beats decoration.
- Mobile-first: every page must work at 375px.
- Must work in light, dark, and easy-mode (high contrast, large font).

## Tokens
- Semantic colors only: background, card, foreground, muted,
  muted-foreground, border, primary, accent, success, warning, danger, info.
- No raw palette classes (slate-*, indigo-*, etc.) and no hex in components.
- One accent color. Status colors are used only to show status.

## Type
- Inter (latin, cyrillic, cyrillic-ext). No monospace anywhere.
- Weights: 400 body, 500 labels, 600 headings.
- Sentence case labels. No uppercase + wide tracking.
- Numbers: tabular-nums.

## Shape and space
- Card radius 16px, control radius 12px, pills full.
- Borders: 1px border-border. Shadows only on hover (shadow-black/5).
- Spacing scale: 4/8/12/16/24/32/48/64.

## Components
- shadcn/ui only. No hand-built buttons, selects, dialogs, tabs.

## Motion
- 200ms ease-out. Reveal once on scroll. Hover lift 2px on cards.
- Respect prefers-reduced-motion.

## Text
- Every user-visible string goes in src/lib/translations.ts (kz, ru, en).
- No inline `lang === 'kz' ? ... : ...` ternaries in components.
