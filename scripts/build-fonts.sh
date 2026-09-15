#!/usr/bin/env bash
#
# Regenerates the self-hosted webfonts in src/assets/fonts.
#
# Not part of `npm run build` — the output is committed, so this only needs to
# run when the weights, the character range, or the upstream fonts change.
# Needs `uv` (https://docs.astral.sh/uv/), which fetches fonttools on demand.
#
# Each font is cut twice: the weight axis is clamped to the range the CSS
# actually asks for, then the glyphs are cut to Google's `latin` subset plus
# U+20B9 (₹) and U+2192 (→). Google splits those two into a `latin-ext` file
# that costs 90 KB for Inter Tight, and a fallback face respectively; folding
# them in here keeps the whole site to one file per family.

set -euo pipefail

cd "$(dirname "$0")/.."

OUT="src/assets/fonts"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

# Google's `latin` unicode-range, plus the rupee sign and the rightwards arrow.
RANGE="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+20B9,U+2122,U+2191-2193,\
U+2212,U+2215,U+FEFF,U+FFFD"

FEATURES="kern,liga,clig,calt,ccmp,locl,mark,mkmk,rlig,rvrn"

# name | upstream path in google/fonts | weight range used by index.css
FONTS=(
  "inter-tight-var|ofl/intertight/InterTight%5Bwght%5D.ttf|400:600"
  "jetbrains-mono-var|ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf|400:500"
)

mkdir -p "$OUT"

for spec in "${FONTS[@]}"; do
  IFS='|' read -r name path weights <<<"$spec"

  echo "→ $name (wght $weights)"
  curl -sSfL -o "$WORK/$name.ttf" "https://github.com/google/fonts/raw/main/$path"

  uv tool run --from "fonttools[woff]" fonttools varLib.instancer \
    "$WORK/$name.ttf" "wght=$weights" -o "$WORK/$name-clamped.ttf" >/dev/null

  uv tool run --from "fonttools[woff]" pyftsubset \
    "$WORK/$name-clamped.ttf" \
    --unicodes="$RANGE" \
    --layout-features="$FEATURES" \
    --flavor=woff2 \
    --output-file="$OUT/$name.woff2"

  echo "  $OUT/$name.woff2 — $(wc -c <"$OUT/$name.woff2" | tr -d ' ') bytes"
done
