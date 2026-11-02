# Website theme

The website defaults to a paper and ink theme: a warm off-white background,
subtle monochrome grain, dark text, muted green links, and soft neutral borders.
A toggle in the header switches to warm charcoal with softer light text.
The reader's choice is saved locally and restored before the page paints.
System color preferences do not override the default paper theme.

Typography uses Newsreader for headings and reading text, Manrope for interface
elements, and JetBrains Mono for code and blog metadata. Fonts are loaded by
`next/font` in the root layout. Article formatting lives in
`src/app/blog/prose.css`; KaTeX retains its own mathematical fonts.

## Where to make changes

- `src/app/globals.css` defines both palettes as CSS variables and exposes them
  to Tailwind. The `data-theme` attribute on the root selects the dark palette.
  Change `--background` in the corresponding palette to adjust the paper color.
- `public/paper-grain.svg` and `public/paper-grain-dark.svg` are deterministic
  tiles of dark and white specks, with opacity tuned for each background.
  The `.paper-texture` class repeats them at their native 256px size behind
  content, without animation or a layer that can intercept clicks.
- `src/components/ThemeToggle.tsx` provides the accessible header toggle and
  synchronizes changes across browser tabs. `src/lib/appearance.ts` contains
  the storage key and the initialization script used in the root layout.
  When storage is unavailable, switching still works for the current visit.
- `src/styles/theme.ts` maps semantic roles to Tailwind classes and provides
  shared card, navigation, social icon, link, and CV button styles.
- `src/components/themed/ThemedComponents.tsx` provides reusable themed
  components. Examples are in `src/components/examples/ThemedSections.tsx`.

## Using the theme

```tsx
import { colors, classes } from '@/styles/theme';

<h1 className={`text-3xl font-bold ${colors.textHeading}`}>Title</h1>
<div className={classes.card}>Card content</div>
<a href="/cv.pdf" className={classes.link}>CV</a>
```

Use semantic tokens such as `textHeading`, `textAccent`, and `textLink` rather
than hardcoded colors in components. Cards and the profile photo use restrained
neutral shadows; links and buttons use color changes on hover and a visible
keyboard focus outline.
