#!/usr/bin/env bash
set -euo pipefail

source_file="${1:-CV.tex}"
destination="${2:-CV.pdf}"
fallback_url="${3:-https://abdgafartunde.github.io/CV.pdf}"
workdir=$(mktemp -d "${RUNNER_TEMP:-${TMPDIR:-/tmp}}/website-cv.XXXXXX")
staged_file=''
trap 'rm -rf "$workdir"; if [[ -n "$staged_file" ]]; then rm -f "$staged_file"; fi' EXIT

command -v pdfinfo >/dev/null || { echo 'CV validation requires pdfinfo.' >&2; exit 1; }
valid_pdf() {
    [[ -s "$1" ]] &&
        [[ "$(head -c 5 "$1")" == '%PDF-' ]] &&
        tail -c 1024 "$1" | grep -aEq '^%%EOF[[:space:]]*$' &&
        pdfinfo "$1" >/dev/null
}

compiled="$workdir/$(basename "${source_file%.tex}").pdf"
if latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir="$workdir" "$source_file" && valid_pdf "$compiled"; then
    candidate="$compiled"
    echo 'CV.pdf compiled and validated.'
else
    echo 'CV compilation failed; downloading the currently live CV.' >&2
    candidate="$workdir/fallback.pdf"
    curl --fail --silent --show-error --location --retry 2 --output "$candidate" "$fallback_url"
    valid_pdf "$candidate" || { echo 'Downloaded CV is not a valid, complete PDF; stopping publication.' >&2; exit 1; }
    echo 'Fallback CV downloaded and validated.'
fi

# Only replace the destination after validation; keep partial files out of builds.
staged_file=$(mktemp "$(dirname "$destination")/.cv-publish.XXXXXX")
cp "$candidate" "$staged_file"
chmod 0644 "$staged_file"
mv "$staged_file" "$destination"
staged_file=''
