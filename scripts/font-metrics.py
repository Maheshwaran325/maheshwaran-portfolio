"""
Prints the @font-face fallback blocks that keep the webfont swap from moving
the page.

    uv run --with fonttools python scripts/font-metrics.py

Fonts load after the first paint, so the browser lays the page out in a
fallback and relays it out when the real font arrives. That reflow is a layout
shift — it was measured at up to 0.17 CLS on the hero copy. Overriding the
fallback's metrics so it occupies exactly the space the webfont will occupy
makes the swap invisible to layout.

`size-adjust` scales the fallback so its average advance width matches the
webfont's; the ascent/descent/line-gap overrides then restate the webfont's own
vertical metrics in the scaled em, so line boxes match too. Paste the output
into src/index.css and put the fallback family directly after the webfont in
the stack.
"""

from fontTools.ttLib import TTFont

# The local faces the fallbacks resolve to. Chrome aliases both names on
# platforms that lack them — Arial to Roboto on Android and Liberation Sans on
# Linux, Courier New to the platform monospace — and the aliases are metrically
# close, so one set of numbers covers what matters.
SUPPLEMENTAL = "/System/Library/Fonts/Supplemental"
REFERENCES = {
    "Arial": f"{SUPPLEMENTAL}/Arial.ttf",
    "Courier New": f"{SUPPLEMENTAL}/Courier New.ttf",
}

# Weighted toward what the page actually sets: prose, not a specimen.
SAMPLE = (
    "etaoinshrdlcumwfgypbvkjxqz"
    "ETAOINSHRDLCUMWFGYPBVKJXQZ"
    "0123456789 .,'\"-—:/"
)

FONTS = [
    ("src/assets/fonts/inter-tight-var.woff2", "Inter Tight Fallback", "Arial"),
    ("src/assets/fonts/jetbrains-mono-var.woff2", "JetBrains Mono Fallback", "Courier New"),
]


def metrics(path):
    font = TTFont(path)
    upm = font["head"].unitsPerEm
    hhea = font["hhea"]
    cmap = font.getBestCmap()
    widths = font["hmtx"].metrics

    advances = [
        widths[cmap[ord(ch)]][0] for ch in SAMPLE if ord(ch) in cmap and cmap[ord(ch)] in widths
    ]
    return {
        "upm": upm,
        "ascent": hhea.ascent / upm,
        "descent": abs(hhea.descent) / upm,
        "line_gap": hhea.lineGap / upm,
        "avg_width": sum(advances) / len(advances) / upm,
    }


for path, fallback, local in FONTS:
    reference = metrics(REFERENCES[local])
    m = metrics(path)
    adjust = m["avg_width"] / reference["avg_width"]
    print(f"""@font-face {{
  font-family: '{fallback}';
  src: local('{local}');
  size-adjust: {adjust * 100:.2f}%;
  ascent-override: {m['ascent'] / adjust * 100:.2f}%;
  descent-override: {m['descent'] / adjust * 100:.2f}%;
  line-gap-override: {m['line_gap'] / adjust * 100:.2f}%;
}}
""")
