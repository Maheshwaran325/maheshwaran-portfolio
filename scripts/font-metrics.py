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

The webfonts themselves are `font-display: optional`, so a fallback that gets
painted is the one that stays for that pageview — these numbers decide how
close it looks, not whether the page moves.
"""

from fontTools.ttLib import TTFont

# The local faces the fallbacks resolve to, measured from the first name and
# listed in the src in this order. Chrome does not alias a missing family for
# you: on the Linux it runs under on PageSpeed, local("Arial") alone matched
# nothing and the face was dropped along with every override below. The rest
# are the metric clones of Arial and Courier that Linux distributions ship, so
# one set of numbers stays right wherever the match lands.
SUPPLEMENTAL = "/System/Library/Fonts/Supplemental"
REFERENCES = {
    "Arial": (
        f"{SUPPLEMENTAL}/Arial.ttf",
        ["Arial", "Helvetica", "Liberation Sans", "Arimo", "Nimbus Sans", "DejaVu Sans"],
    ),
    "Courier New": (
        f"{SUPPLEMENTAL}/Courier New.ttf",
        ["Courier New", "Liberation Mono", "Cousine", "Nimbus Mono PS", "DejaVu Sans Mono"],
    ),
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
    reference_path, names = REFERENCES[local]
    reference = metrics(reference_path)
    m = metrics(path)
    adjust = m["avg_width"] / reference["avg_width"]
    src = ", ".join(f"local('{name}')" for name in names)
    print(f"""@font-face {{
  font-family: '{fallback}';
  src: {src};
  size-adjust: {adjust * 100:.2f}%;
  ascent-override: {m['ascent'] / adjust * 100:.2f}%;
  descent-override: {m['descent'] / adjust * 100:.2f}%;
  line-gap-override: {m['line_gap'] / adjust * 100:.2f}%;
}}
""")
