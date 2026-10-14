# abdgafartunde.github.io

Source code for the personal academic website of **Abd'gafar Tunde Tiamiyu**, hosted at [abdgafartunde.github.io](https://abdgafartunde.github.io).

Built with [Jekyll](https://jekyllrb.com/) and [GitHub Pages](https://pages.github.com/).

## About

Postdoctoral Researcher in Computational and Applied Mathematics at Jilin University. Research areas:
- Inverse problems and regularisation theory (linear and nonlinear)
- Computational imaging: EIT, CT, MRI, ultrasound, seismic FWI
- Scientific machine learning and physics-informed neural networks
- Numerical methods for PDEs and large-scale optimisation

## Local Development

```bash
git clone https://github.com/abdgafartunde/abdgafartunde.github.io.git
cd abdgafartunde.github.io
bundle install
bundle exec jekyll serve --livereload
```

Requires Ruby 3.4 (see `.ruby-version`; `github-pages` does not support Ruby 4) and Bundler. Open `http://localhost:4000` in your browser.

To preview posts that are scheduled for a future date, add `--future`:

```bash
bundle exec jekyll serve --livereload --future
```

## Publishing

Every push to `master` builds the site and deploys it to GitHub Pages (`.github/workflows/pages.yml`). Posts dated in the future stay hidden; a daily build at 00:07 China Standard Time publishes each post on the date in its front matter.

Write inline math as `$$x$$`, not `$x$`. Kramdown only protects math inside `$$`, so single-dollar math loses backslash escapes such as `\{` and `\|`. A `$$` block on its own lines is displayed; `$$` inside a sentence is inline.

## License

The website theme is based on [Contrast](https://github.com/niklasbuschmann/contrast) by Niklas Buschmann, released into the [public domain](http://unlicense.org/). Content (blog posts, research descriptions, CV) is copyrighted by Abd'gafar Tunde Tiamiyu.
