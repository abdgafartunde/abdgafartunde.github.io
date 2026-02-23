# Abd'gafar Tunde Tiamiyu - Academic Website

Personal academic website built with Jekyll and hosted on [GitHub Pages](https://abdgafartunde.github.io).

## About

Postdoctoral Researcher in Computational and Applied Mathematics at Jilin University, specialising in:
- Inverse problems and regularisation theory
- Electrical impedance tomography
- Scientific machine learning and physics-informed neural networks
- Numerical methods for PDEs

## Site Structure

```
_config.yml          # Site configuration
index.md             # Home page (profile, about, research interests, news)
research.md          # Research overview and publications
experience.md        # Education, positions, teaching, awards, skills
blog.md              # Blog listing page
_posts/              # Blog posts (Markdown with MathJax)
_layouts/            # HTML templates (default, page, post)
_includes/           # Reusable components (head)
assets/
  css/main.css       # Custom stylesheet
  images/            # Profile photo and other images
```

## Local Development

### Prerequisites
- Ruby 2.7+ and Bundler
- Git

### Setup

```bash
git clone https://github.com/abdgafartunde/abdgafartunde.github.io.git
cd abdgafartunde.github.io
bundle install
bundle exec jekyll serve
```

Open `http://localhost:4000` in your browser.

## Writing Blog Posts

Create a new Markdown file in `_posts/` with the naming convention `YYYY-MM-DD-title.md`:

```yaml
---
layout: post
title: "Your Post Title"
description: "A short description."
date: 2026-03-01
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Topic]
math: true
---

Your content here. Use $inline$ and $$display$$ math.
```

### Scheduled Publishing

Posts with future dates are hidden until their date arrives. A GitHub Actions workflow ([.github/workflows/scheduled-publish.yml](.github/workflows/scheduled-publish.yml)) triggers a site rebuild every Monday at 06:00 UTC, automatically publishing any post whose date has passed. You can also trigger a rebuild manually from the Actions tab.

**Workflow:** Write several posts in advance with future dates, push them, and they will appear on schedule without further action.

## Tech Stack

- **Static site generator:** Jekyll with GitHub Pages gem
- **CSS framework:** Bootstrap 5.3.3
- **Icons:** Font Awesome 6.5.1
- **Fonts:** Inter (sans-serif) + Source Serif 4 (serif), via Google Fonts
- **Math rendering:** MathJax 3 (SVG output, loaded conditionally on posts)
- **SEO:** jekyll-seo-tag, JSON-LD structured data, Open Graph meta tags
- **Feed:** jekyll-feed (Atom)

## License

The website theme is based on [Contrast](https://github.com/niklasbuschmann/contrast) by Niklas Buschmann, released into the [public domain](http://unlicense.org/). Content (blog posts, research descriptions, CV) is copyrighted by Abd'gafar Tunde Tiamiyu.
