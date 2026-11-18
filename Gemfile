source "https://rubygems.org"

# GitHub Actions builds and deploys this site directly. Keep its existing
# Jekyll engine without the unused GitHub Pages theme/remote-plugin bundle.
gem "jekyll", "3.10.0"
gem "kramdown-parser-gfm", "1.1.0"
# Jekyll 3's safe_yaml and Liquid require these former standard-library gems.
gem "base64", "~> 0.3.0"
gem "bigdecimal", "~> 4.0"

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"
end

# Ruby 3+ dropped WEBrick from stdlib; needed for `jekyll serve`
gem "webrick", "~> 1.8"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:windows, :jruby]

# Performance-booster for watching directories on Windows
# wdm 0.1.x doesn't build on Ruby 3.2; skip it (polling fallback is fine)
# gem "wdm", "~> 0.1.0" if Gem.win_platform?
