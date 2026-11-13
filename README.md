# Bertram — Analytics & Building

A bilingual personal site focused on judgment and building, built with Hugo and
published with GitHub Pages. The design lives in this repository and does not
require an external theme or a JavaScript framework.

## Local development

Use Hugo 0.168.0 or newer (the version used to validate this design).

```sh
hugo server --disableFastRender
```

Open http://localhost:1313. Edit a source file to see the preview update.

```sh
hugo --minify
```

The production site is generated in `public/`, which is ignored by Git. The
existing GitHub Actions workflow builds and deploys pushes to `main`.

## Editing the site

- Articles: `content/posts/`; retain filenames and front matter to preserve
  existing URLs.
- Homepage: `layouts/home.html`.
- Shared page shell and navigation: `layouts/baseof.html`.
- Article presentation: `layouts/single.html`.
- Styles, colors, and responsive layouts: `assets/css/notebook.css`.
- Site description and social links: `hugo.toml`.
- Search: `layouts/partials/search-index.html` and `static/js/search.js`. The
  search index is generated from published posts at build time.

Use `math = true` in an article's TOML front matter to enable MathJax. This
retains the existing CDN-based math renderer. Search runs in the browser;
navigation and articles work without JavaScript.

The previous Archie submodule remains in `themes/archie` for reference but is no
longer loaded. No content migration is needed.

## English and Chinese

English is the default language at `/`; simplified Chinese is served at `/zh/`.
Existing English article URLs are unchanged. Both languages share templates and
styles.

- UI and homepage copy: `i18n/en.toml` and `i18n/zh.toml`.
- About pages: `content/about.en.md` and `content/about.zh.md`.
- Pair translated pages with the same filename stem and language suffix
  (`example.en.md`, `example.zh.md`), or give them the same `translationKey` in
  front matter. Existing unsuffixed articles belong to English.
- Publish in either language independently. Do not duplicate English posts into
  Chinese routes to fill empty archives.
- Navigation uses language-aware URLs; shared static assets use language-neutral
  URLs.
- The language switcher links to actual translations. Untranslated pages explain
  the absence and offer the other language’s homepage.
- Search indexes published pages in the current language (including About),
  excluding the search page itself and hidden pages. Chinese search preserves
  CJK characters and matches substrings; English search remains case-insensitive
  and accent-insensitive.
- Both languages build and deploy together through the existing Pages workflow.

## Fonts

Both languages use the system font stack
`Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", "Noto Sans CJK", sans-serif`.
No sans-serif font files are downloaded; the browser uses available local fonts,
falling back per character.

Monospaced text uses the CSS family alias `JetBrainsMono`. Official JetBrains
Mono v2.304 WOFF2 files are served from `static/fonts/jetbrains-mono/`, with
regular, bold, italic, and bold italic faces. Browsers download the faces they
need automatically; visitors do not need to install the font.
`font-display: swap` keeps text visible while the fonts load. The SIL Open Font
License is included in `OFL.txt` alongside the font files. Source:
https://github.com/JetBrains/JetBrainsMono/tree/v2.304.

JetBrains Mono does not supply Chinese glyphs; Chinese text inside code uses the
browser’s glyph fallback. MathJax retains its own mathematical fonts.

## Article image zoom

Article images open in a lightweight, bilingual image viewer when clicked or activated with the keyboard. The viewer can fit the image to the window or show its original size with scrolling, and closes with Escape, the Close button, or a click on the backdrop. Focus returns to the image button after closing.

This is progressive enhancement: article images work normally without JavaScript. Images already inside authored links are left alone; add `data-no-zoom` to an image or ancestor to opt out. An optional `data-full-src` on the image can point to a higher-resolution source. Keep meaningful `alt` text or a `figcaption` for the preview caption. The implementation lives in `layouts/partials/image-viewer.html` and `static/js/image-viewer.js`.

For wide charts, use a responsive image and avoid fixing the figure container's height. Set `max-height` on the image itself if a compact preview is needed; the viewer displays the source independently of that preview size.

## Hierarchical series

Series members share `seriesID` and `seriesTitle`. Use `seriesRole = 'chapter'`
for chapters and `seriesRole = 'section'` for their child posts. Set
`seriesChapter` to the chapter number and `seriesSection` to 0 for a chapter,
or 1, 2, 3, etc. for its sections. `seriesOrder` is an integer reading-order
key (100, 200, 201, 202, 203); displayed numbers are generated from chapter and
section metadata, never decimal sorting.

The series roadmap nests sections under their chapter and highlights the current
page. Previous/next links follow this hierarchy, independent of publication date.
Archive badges and article headings use the same numbers. Keep article titles
free of the repeated series title and numbering.

Only built pages appear. Drafts require `hugo server --buildDrafts --disableFastRender`.
English members fill gaps in the current language's roadmap and are individually
labeled; translated members take precedence. Page translation switching remains
unchanged. The `series-link` shortcode renders unavailable targets as planned
text instead of dead links.

**Analyze Time-to-Event** contains chapter 1, Data and Math Toolset; chapter 2,
Business Cases; and cases 2.1–2.3 under chapter 2. Both original chapter URLs and
the older objective anchors on chapter 2 are preserved.
