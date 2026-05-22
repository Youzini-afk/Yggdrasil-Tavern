# Surface font assets

`surface.css` declares self-hosted Noto Sans and Noto Sans Mono font faces at these runtime paths:

- `dist/fonts/NotoSans-Regular.woff2`
- `dist/fonts/NotoSans-Medium.woff2`
- `dist/fonts/NotoSans-Bold.woff2`
- `dist/fonts/NotoSansMono-Regular.woff2`

No matching Noto Sans `.woff2` or `.ttf` files were available in `/usr/share/fonts` in the current build environment. The copy step is in place and will copy `.woff2` files from this directory to `dist/fonts/` when they are sourced.

Noto Sans is licensed under the SIL Open Font License 1.1, which is compatible with YdlTavern's AGPLv3 redistribution model.

TODO Phase B: source or convert the four production `.woff2` files listed above before publishing an offline release bundle.
