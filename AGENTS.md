# Repository guidance

## Purpose and positioning

This is Bertram’s personal website, built with Hugo and published on GitHub
Pages at https://bing-hsu.github.io/.

- The site identity is **Judgment & Building** in both English and Chinese.
  Keep this subtitle in English on the Chinese site; do not translate it as
  “判断与构建”. Omit the redundant identity eyebrow above the homepage headline.
  Its slogan is
  “Better questions. Clearer decisions. Useful software.” The Chinese homepage
  expresses this as “问清问题，做出判断，把方案落地。”
- Present two mutually supporting pillars:
  - **Intelligence Analysis & Decision Support / 情报分析与决策支持**: use data
    analysis, intelligence research, and business context to connect evidence,
    understand problems, and support decisions.
  - **Outcome-Driven Engineering / 结果导向的工程实践**: work close to users and
    real operations, identify bottlenecks, make product trade-offs, and build
    practical software whose usefulness can be evaluated in actual use.
- Connect the pillars through the path from understanding a business problem
  to forming a judgment, building a solution, and learning from its effects.
  Do not narrow the identity back to analytics alone.
- Founder mindset means initiative, ownership, judgment, and follow-through.
  FDE, GTM Engineer, and Product Engineer are reference approaches, not claims
  that Bertram currently holds those titles or has founded a company.
- Bertram is developing an independent practice, with employment and solo or
  boutique consulting as possible career paths. Do not imply an established
  consulting business, client roster, or proven commercial results without
  supporting information. Distinguish prototypes, adoption, and demonstrated
  business outcomes.
- Treat existing deep learning, robotics, and C++ articles as technical
  foundations. Do not relabel them as client work or business case studies.
- Keep copy warm, enthusiastic, grounded, and personal. The About page opens
  with a friendly greeting and emphasizes caring about business outcomes more
  than counting tickets closed. Preserve the approved bilingual About copy
  unless asked to revise it.
- Content-series planning remains open. Do not introduce a new editorial
  taxonomy or content program just to fit the positioning without a request.

## Architecture and source files

The site uses project-owned Hugo templates, plain CSS, and a small amount of
browser JavaScript. No external theme or frontend framework is required.

- `hugo.toml`: language configuration, site metadata, social links, and Markdown
  configuration.
- `i18n/en.toml` and `i18n/zh.toml`: interface strings and localized homepage copy.
- `content/_index.en.md` and `content/_index.zh.md`: paired homepages.
- `content/about.en.md`, `content/about.zh.md`, and `layouts/about.html`:
  approved personal introduction and About presentation.
- `content/posts/`: articles, with Markdown content and front matter.
- `layouts/home.html`: homepage layout and inline SVG illustration; localized copy
  comes from the translation files. The homepage has no separate pillars section;
  the About page explains the two-pillar positioning.
- `layouts/baseof.html`: shared shell, navigation, and footer.
- `layouts/partials/languages.html`: language switcher and missing-translation
  guidance.
- `layouts/partials/header.html`: document head, metadata, stylesheet loading,
  and conditional math support.
- `layouts/single.html`: article layout, table of contents, tags, and adjacent
  articles.
- `layouts/list.html`, `layouts/taxonomy.html`, and `layouts/term.html`: archive
  and topic pages.
- `assets/css/notebook.css`: the active stylesheet, including design tokens and
  responsive rules. The filename is historical; it is still the source of truth.
- `layouts/search.html`, `layouts/search.json.json`,
  `layouts/partials/search-index.html`, and `static/js/search.js`: search UI,
  generated index, and browser-side filtering.
- `static/`: images, favicon, scripts, and downloadable assets.
- `static/fonts/jetbrains-mono/`: self-hosted JetBrains Mono v2.304 WOFF2 faces
  and their SIL Open Font License. Keep the license with redistributed fonts.
- `.github/workflows/hugo.yaml`: GitHub Pages build and deployment.
- `themes/archie`: an inactive legacy Git submodule retained for reference. Do
  not edit it for current design changes or reintroduce a theme dependency
  inadvertently.
- `public/`: ignored generated output. Edit source files, not generated pages.

## Design and content conventions

- Preserve the warm paper background, restrained green accents, and readable
  editorial layout unless the user requests a new direction.
- Both English and Chinese use sans-serif headings and body text. The shared
  font stack is `Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
  "WenQuanYi Micro Hei", "Noto Sans CJK", sans-serif`. These are system-font
  preferences; do not bundle proprietary system fonts.
- Monospaced text uses `JetBrainsMono, monospace`, with locally served regular,
  bold, italic, and bold italic WOFF2 files and `font-display: swap`. Do not add
  an external font CDN dependency. MathJax retains its own mathematical fonts.
- Navigation order is About → Writing → Topics → Search, localized as
  关于我 → 文章 → 主题 → 搜索. Keep the language switcher separate.
- GitHub is the current social link. The X link was explicitly removed; do not
  restore it without a request.
- Keep navigation, article content, and topic browsing usable without
  JavaScript. Search requires JavaScript; math rendering uses the existing
  MathJax CDN integration.
- Preserve semantic HTML, keyboard navigation, visible focus states, skip
  navigation, and meaningful accessible labels.
- Check responsive layouts, particularly long titles, code blocks, equations,
  tables, and the article table of contents.
- Preserve article filenames, front matter, existing URLs, and assets unless a
  requested change requires otherwise. Plan redirects if published URLs must
  change.
- Preserve the author’s article content when changing presentation or site
  positioning.
- Use `math = true` in TOML front matter for articles requiring MathJax.
- Prefer small changes within the existing stack. Add dependencies only when
  they solve a concrete requirement.

## English and Chinese

- Use Hugo native multilingual support with shared templates and styles.
  English is the default at `/`; simplified Chinese is at `/zh/`. Preserve
  existing English article URLs.
- Use translation keys for interface text rather than scattering hardcoded
  English or Chinese across templates. Write natural localized copy rather
  than forcing word-for-word translations.
- Pair content with language suffixes (`example.en.md`, `example.zh.md`) or a
  shared front matter `translationKey`. Existing unsuffixed articles are English.
- Both languages can publish independently. Existing technical articles remain
  English unless translation is requested; never copy them into Chinese routes
  merely to populate the archive. Empty Chinese archives link explicitly to
  English content.
- Switch directly to the corresponding translation when one exists. Otherwise,
  explain that it is unavailable and offer the other language's homepage.
  Do not silently redirect or force browser-language detection.
- Use language-aware URLs for navigation and language-neutral URLs for shared
  static assets. Localize dates, reading labels, titles, and descriptions.
- Generate canonical URLs and `lang` attributes for each language, with
  `hreflang` links only to actual versions of the page.
- Search indexes published pages in the current language, including About,
  excluding the search page itself and hidden pages. Keep localized indices
  separate and preserve Chinese characters during normalization.

## Development and verification

Hugo 0.168.0 was used to validate the custom design; the README documents that
version or newer for local development.

Start the local preview with:

```sh
hugo server --disableFastRender
```

The default preview URL is http://localhost:1313/. Reuse a running preview when
appropriate.

Build the production site with:

```sh
hugo --minify
```

- For code, template, configuration, or content changes, run the Hugo build and
  address introduced errors or warnings. A documentation-only change does not
  require rebuilding the site.
- Run `git diff --check` before handing off changes.
- For visual changes, inspect representative pages at desktop and phone widths
  when browser preview is available.
- For navigation or content-structure changes, check internal links and asset
  paths. For search changes, verify the generated index and representative
  queries.
- For multilingual changes, check both languages, paired-page switching,
  missing-translation guidance, localized search, and unchanged English URLs.
- Report checks actually performed and any verification limitations. Avoid
  adding a test framework for simple copy or styling changes.

## Git and deployment

- Inspect the current branch and working tree before editing. Preserve unrelated
  user changes.
- Use the `codex/` prefix when creating a new branch unless the user specifies
  another name.
- Commit, merge, and push when requested; do not infer a deployment request from
  a request to edit or preview.
- Pushing to `main` triggers the GitHub Actions workflow, which builds with Hugo
  and deploys to GitHub Pages.
- Prefer a fast-forward merge when appropriate; do not rewrite shared history or
  force-push without explicit authorization.
- When deploying, verify the workflow or live site when access permits.
  Distinguish a successful push from a confirmed successful deployment.

## Response formatting

- Write standard, portable Markdown that renders cleanly in ChatGPT and remains
  editable when copied to a Markdown editor.
- Use paragraphs, headings, emphasis, and lists naturally. Do not wrap an entire
  response in a code fence, escape formatting merely to expose its syntax, or
  show Markdown source unless requested.
- Do not use Markdown tables unless the user explicitly requests one. Use lists
  with consistent nested labels for comparisons.
- Avoid HTML formatting unless explicitly requested.
- Use inline backticks for code identifiers, commands, and filenames. Use fenced
  blocks with language identifiers for multiline code.
- Use `$...$` for inline mathematics and `$$...$$` for display mathematics,
  rather than backslash-parenthesis or backslash-bracket delimiters.
- Keep each single-line display equation, including both `$$` delimiters, on one
  physical source line in its own paragraph, with a blank line before and after
  it.
- Use ordinary spaces around mathematical operators. Do not add sentence-ending
  punctuation inside or immediately after display equations; preserve
  mathematically meaningful punctuation.
- Use multiline LaTeX only when mathematically useful, such as for aligned
  derivations, matrices, or piecewise definitions. Show raw LaTeX in code fences
  only when source or formatting examples are explicitly requested.
