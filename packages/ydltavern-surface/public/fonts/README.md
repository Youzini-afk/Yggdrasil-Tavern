# Surface bundle fonts

Fonts are not committed to this directory. They are pulled from `@fontsource`
npm packages during `npm run build` and copied to `dist/fonts/` by
`scripts/copy-assets.mjs`.

Sources (SIL OFL 1.1, AGPLv3 compatible):
- @fontsource/noto-sans@5.2.10 → NotoSans-{Regular,Medium,Bold}.woff2 (latin subset)
- @fontsource/noto-sans-mono@5.2.10 → NotoSansMono-Regular.woff2 (latin subset)

Total bundle weight: ~50KB across 4 weights.

If `dist/fonts/` is empty after build, run `npm install --include=dev` to fetch
@fontsource packages.
