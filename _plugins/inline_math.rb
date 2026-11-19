# frozen_string_literal: true

require 'kramdown-parser-gfm'

module Kramdown
  module Parser
    class GFMWithInlineMath < GFM
      # Tight delimiters keep currency as text. Stop at line breaks and code spans.
      DOLLAR_MATH = /(?<!\$)\$(?![\s$])((?:\\[^\n]|[^\\$`\n])+?)(?<!\s)\$(?![\d$])/
      define_parser(:dollar_math, DOLLAR_MATH, '\$', 'parse_inline_math')

      def initialize(source, options)
        super
        @span_parsers.insert(@span_parsers.index(:inline_math) + 1, :dollar_math)
      end
    end
  end
end
