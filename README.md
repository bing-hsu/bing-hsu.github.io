# Bertram — Judgment & Building

A bilingual personal site focused on judgment and building, built with Hugo and published with GitHub Pages. The design lives in this repository and does not require an external theme or a JavaScript framework.

## Local development

Use Hugo 0.168.0 or newer (the version used to validate this design).

```sh
hugo server --disableFastRender
```

Open http://localhost:1313. Edit a source file to see the preview update.

```sh
hugo --minify
```

The production site is generated in `public/`, which is ignored by Git. The existing GitHub Actions workflow builds and deploys pushes to `main`.

## Editing the site

- Articles: `content/posts/`; retain filenames and front matter to preserve existing URLs.
- Homepage: `layouts/home.html`.
- Shared page shell and navigation: `layouts/baseof.html`.
- Article presentation: `layouts/single.html`.
- Styles, colors, and responsive layouts: `assets/css/notebook.css`.
- Site description and social links: `hugo.toml`.
- Search: `layouts/partials/search-index.html` and `static/js/search.js`. The search index is generated from published posts at build time.

Use `math = true` in an article's TOML front matter to enable MathJax. This retains the existing CDN-based math renderer. Search runs in the browser; navigation and articles work without JavaScript.

The previous Archie submodule remains in `themes/archie` for reference but is no longer loaded. No content migration is needed.

## English and Chinese

English is the default language at `/`; simplified Chinese is served at `/zh/`. Existing English article URLs are unchanged. Both languages share templates and styles.

- UI and homepage copy: `i18n/en.toml` and `i18n/zh.toml`.
- About pages: `content/about.en.md` and `content/about.zh.md`.
- Pair translated pages with the same filename stem and language suffix (`example.en.md`, `example.zh.md`), or give them the same `translationKey` in front matter. Existing unsuffixed articles belong to English.
- Publish in either language independently. Do not duplicate English posts into Chinese routes to fill empty archives.
- Navigation uses language-aware URLs; shared static assets use language-neutral URLs.
- The language switcher links to actual translations. Untranslated pages explain the absence and offer the other language’s homepage.
- Search indexes published pages in the current language (including About), excluding the search page itself and hidden pages. Chinese search preserves CJK characters and matches substrings; English search remains case-insensitive and accent-insensitive.
- Both languages build and deploy together through the existing Pages workflow.

## Fonts

Both languages use the system font stack `Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Noto Sans CJK", sans-serif`. No sans-serif font files are downloaded; the browser uses available local fonts, falling back per character.

Monospaced text uses the CSS family alias `JetBrainsMono`. Official JetBrains Mono v2.304 WOFF2 files are served from `static/fonts/jetbrains-mono/`, with regular, bold, italic, and bold italic faces. Browsers download the faces they need automatically; visitors do not need to install the font. `font-display: swap` keeps text visible while the fonts load. The SIL Open Font License is included in `OFL.txt` alongside the font files. Source: https://github.com/JetBrains/JetBrainsMono/tree/v2.304.

JetBrains Mono does not supply Chinese glyphs; Chinese text inside code uses the browser’s glyph fallback. MathJax retains its own mathematical fonts.
