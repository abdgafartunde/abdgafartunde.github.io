source "https://rubygems.org"

# Jekyll version
gem "jekyll", "~> 4.3.0"

# GitHub Pages compatibility
gem "github-pages", group: :jekyll_plugins

# Essential plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
  gem "jekyll-gist"
  gem "jekyll-include-cache"
end

# Performance and development
gem "webrick", "~> 1.7" # Required for Ruby 3.0+
gem "kramdown-parser-gfm" # GitHub Flavored Markdown

# Windows and JRuby specific
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance booster for watching directories
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock http_parser.rb gem to v0.6.x for JRuby
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
