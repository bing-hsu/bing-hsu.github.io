# Bertram's notebook

A custom Hugo site for technical writing, published with GitHub Pages. The design lives in this repository and does not require an external theme or a JavaScript framework.

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
