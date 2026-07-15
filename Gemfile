source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

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
