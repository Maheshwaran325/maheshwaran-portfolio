"""
Builds every derived image in the site from one piece of artwork.

Not part of `npm run build` — the output is committed, so this only runs when
the artwork changes:

    uv run --with pillow --with numpy --with scipy python scripts/build-images.py [source.png]

With no argument it rebuilds from src/assets/avatar.png, the corrected master.
Pass new artwork — the illustration as exported, on its white studio
background — and everything downstream is regenerated, the master included.

What "corrected" means, since the exported artwork cannot be used as-is:

  * The white background is cut to transparency. The cut is a flood fill from
    the canvas edge rather than a colour match, so the white inside the
    drawing — the glasses lenses, the shirt lettering, the shoes — survives.
  * The grey floor shadow goes with it. It is a shadow cast on a white studio
    floor, and the plate it sits on is near-black; the old asset kept it and it
    read as a grey slab under the figure. `.plate-inner img` already casts its
    own drop-shadow in CSS.
  * The figure is cropped tight and padded back to a square, so it fills the
    frame the way the previous asset did rather than floating in its margins.

Outputs: the avatar at three widths for the hero's srcset, a portrait for the
JSON-LD `image`, and the favicons — a head crop on the site's rounded square,
since the full figure is an unreadable smudge at the 16px Google renders.
"""

import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

MASTER = "src/assets/avatar.png"

# Hero srcset. 384 covers a phone at 2x, 512 a phone at ~2.6x, 640 desktop 2x.
AVATAR_WIDTHS = (384, 512, 640)

# The icon's backdrop is --signal rather than --bg: a near-black icon is
# invisible against Google's dark-mode results page, which is the one place the
# favicon has to fight for attention. The green is the site's own accent, so it
# still reads as this site.
ICON_BG = (204, 255, 61)
ICON_RADIUS = 0.183  # share of the side; matches the previous touch icon
ICON_INSET = 0.10  # breathing room; the head spanned ~78% of the previous icon

# The nav brand mark gets the opposite treatment: a white disc, head bled to
# the edge, which is what reads at the 30px the nav renders it at.
MARK_BG = (255, 255, 255)
MARK_SIZE = 96

# The illustration's hair and shirt are near-black, and so is every surface the
# figure sits on, so the silhouette used to dissolve into the background. A
# hairline lifts it off without reading as a sticker: thin enough to be an edge
# rather than a border, and held back from full white. The width is a share of
# the figure's height, so it keeps its weight across all the sizes below.
OUTLINE = 0.0024
OUTLINE_OPACITY = 0.5
OUTLINE_COLOUR = (255, 255, 255)

WEBP = dict(quality=85, alpha_quality=100, method=6)


def cut_background(img):
    """White studio background and its floor shadow -> transparency."""
    rgb = np.array(img.convert("RGB")).astype(np.int16)
    lo = rgb.min(axis=2)
    chroma = rgb.max(axis=2) - lo

    def from_edge(candidate):
        labels, _ = ndimage.label(candidate)
        edge = np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])
        touching = [int(v) for v in np.unique(edge) if v]
        return np.isin(labels, touching)

    # Two passes. The first takes the white surround, stopping at the grey
    # floor. The second continues from there through anything grey, which
    # takes the floor but stops at the white shoes standing on it — they are
    # brighter than the grey, and the pass never re-enters white.
    background = from_edge(lo >= 242)
    background = from_edge(background | ((chroma <= 20) & (lo >= 120)))

    # Grow the cut by a pixel so the anti-aliased rim blended into white goes
    # with it, then soften what is left; the downscale does the rest.
    background = ndimage.binary_dilation(background)
    alpha = np.where(background, 0, 255).astype(np.uint8)

    out = img.convert("RGBA")
    out.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.6)))
    return out


def content_box(img):
    ys, xs = np.where(np.array(img)[..., 3] > 8)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def outline(img, width):
    """Lay the figure on a grown copy of its own silhouette."""
    alpha = np.array(img.getchannel("A")).astype(np.float32) / 255

    # Distance from the figure gives a perfectly round, cheap dilation, and the
    # fractional part of it anti-aliases the new edge for free.
    distance = ndimage.distance_transform_edt(alpha <= 0.5)
    ring = np.clip(width + 0.5 - distance, 0, 1) * OUTLINE_OPACITY

    silhouette = Image.new("RGBA", img.size, OUTLINE_COLOUR + (0,))
    silhouette.putalpha(Image.fromarray((ring * 255).astype(np.uint8)))
    return Image.alpha_composite(silhouette, img)


def square_figure(img):
    """Crop to the figure, then pad sideways to a square — full-bleed vertically."""
    x0, y0, x1, y1 = content_box(img)
    figure = img.crop((x0, y0, x1, y1))
    side = max(figure.width, figure.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(figure, ((side - figure.width) // 2, (side - figure.height) // 2))
    return canvas


def head_box(img):
    """The head, found at the narrowest row between the chin and the shoulders."""
    solid = np.array(img)[..., 3] > 8
    x0, y0, x1, y1 = content_box(img)
    widths = np.array(
        [np.count_nonzero(solid[r]) and np.ptp(np.where(solid[r])[0]) + 1 for r in range(y0, y1)]
    )
    span = y1 - y0
    neck = y0 + int(np.argmin(widths[int(span * 0.55):int(span * 0.75)]) + span * 0.55)

    above = solid[y0:neck]
    cols = np.where(above.any(axis=0))[0]
    side = max(int(cols.max() - cols.min()) + 1, neck - y0)
    cx = (int(cols.min()) + int(cols.max())) // 2
    return (cx - side // 2, y0, cx - side // 2 + side, y0 + side)


def badge(head, size, shape, colour, inset):
    """The head on a shape, everything outside it transparent."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    if shape == "circle":
        draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    else:
        draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=int(size * ICON_RADIUS), fill=255)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(Image.new("RGBA", (size, size), colour + (255,)), (0, 0), mask)

    inner = max(1, int(size * (1 - 2 * inset)))
    art = head.resize((inner, inner), Image.LANCZOS)
    canvas.alpha_composite(art, ((size - inner) // 2, (size - inner) // 2))

    # Clip anything of the drawing that overhangs the shape.
    canvas.putalpha(Image.composite(canvas.getchannel("A"), Image.new("L", (size, size), 0), mask))
    return canvas


def rounded_icon(head, size):
    return badge(head, size, "rounded", ICON_BG, ICON_INSET)


# --- the social card ---------------------------------------------------------
# og.png is a hand-made 1200x630 card with the figure standing on the right, so
# it cannot be regenerated from the artwork — but leaving it alone would ship a
# preview wearing last year's shirt. Instead the figure is cut out and redrawn.
# Everything it covered is reconstructible: a flat ground, a 40px grid, and the
# rule above the footer. The asserts below fail loudly if the card is ever
# redesigned out from under this.

OG = "public/og.png"
OG_GROUND = (10, 10, 11)  # --bg
OG_GRID = (15, 15, 17)  # grid line
OG_RULE = (29, 29, 33)  # --line, the divider above the footer
OG_PITCH = 40


def og_background(x, y, rule_row, rule_span):
    if y == rule_row and rule_span[0] <= x <= rule_span[1]:
        return OG_RULE
    if x % OG_PITCH == 0 or y % OG_PITCH == 0:
        return OG_GRID
    return OG_GROUND


def restamp_card(figure):
    card = np.array(Image.open(OG).convert("RGB")).astype(int)
    h, w, _ = card.shape

    def is_colour(block, colour):
        return np.abs(block - np.array(colour)).max(axis=-1) <= 3

    drawn = ~(is_colour(card, OG_GROUND) | is_colour(card, OG_GRID))

    # The rule is a full-width row of --line; find it and exclude it, so it does
    # not chain the figure to the footer text when components are labelled.
    rule_rows = [y for y in range(h) if is_colour(card[y], OG_RULE).mean() > 0.8]
    assert len(rule_rows) == 1, f"expected one divider rule in {OG}, found {rule_rows}"
    rule_row = rule_rows[0]
    on_rule = np.where(is_colour(card[rule_row], OG_RULE))[0]
    rule_span = (int(on_rule.min()), int(on_rule.max()))
    drawn[rule_row] = False

    # The figure is the one large blob to the right of the copy. Seed it well
    # inside that half, then grow the seed through the whole drawing — the
    # figure is connected, the copy is not connected to it, and a seed window
    # tight enough to exclude the copy would otherwise clip the figure's edge.
    seed = drawn.copy()
    seed[:, : w * 2 // 3] = False
    labels, count = ndimage.label(seed)
    assert count, f"no figure found on the right of {OG}"
    areas = ndimage.sum(seed, labels, range(1, count + 1))
    blob = ndimage.binary_propagation(labels == int(np.argmax(areas)) + 1, mask=drawn)
    ys, xs = np.where(blob)
    x0, x1, y0, y1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
    assert x1 - x0 > 150 and y1 - y0 > 250, f"figure in {OG} is {x1-x0}x{y1-y0}, too small to be right"

    # Erase it, a little wider than itself to catch its anti-aliased rim.
    erase = ndimage.binary_dilation(blob, iterations=3)
    ey, ex = np.where(erase)
    card[ey, ex] = [og_background(int(x), int(y), rule_row, rule_span) for x, y in zip(ex, ey)]

    # Redraw at the same height and centred where the old one was, keeping the
    # new figure's own proportions rather than stretching it into the old box.
    fx0, fy0, fx1, fy1 = content_box(figure)
    height = y1 - y0 + 1
    width = round((fx1 - fx0) * height / (fy1 - fy0))
    art = figure.crop((fx0, fy0, fx1, fy1)).resize((width, height), Image.LANCZOS)

    out = Image.fromarray(card.astype(np.uint8)).convert("RGBA")
    out.alpha_composite(art, ((x0 + x1) // 2 - width // 2, y0))
    out.convert("RGB").save(OG)
    return f"{width}x{height} at ({(x0 + x1) // 2 - width // 2}, {y0})"


source = sys.argv[1] if len(sys.argv) > 1 else MASTER
src = Image.open(source)
print(f"source {source} ({src.width}x{src.height}, {src.mode})")

cut = cut_background(src)
_, top, _, bottom = content_box(cut)
figure = square_figure(outline(cut, round(OUTLINE * (bottom - top))))
print(f"figure cut, outlined and squared to {figure.width}x{figure.height}")

written = []


def record(path):
    written.append(path)


# The master is what a later run rebuilds from, so write it before anything
# derives from it. Largest srcset width is plenty — nothing needs more.
master = figure.resize((max(AVATAR_WIDTHS),) * 2, Image.LANCZOS)
master.save(MASTER, optimize=True)
record(MASTER)

for width in AVATAR_WIDTHS:
    path = f"src/assets/avatar-{width}.webp"
    figure.resize((width, width), Image.LANCZOS).save(path, **WEBP)
    record(path)

# Referenced by the Person JSON-LD rather than rendered by the page.
figure.resize((640, 640), Image.LANCZOS).save("public/portrait.webp", **WEBP)
record("public/portrait.webp")

head = figure.crop(head_box(figure))

badge(head, MARK_SIZE, "circle", MARK_BG, 0).save("src/assets/mark.webp", **WEBP)
record("src/assets/mark.webp")

rounded_icon(head, 180).save("public/apple-touch-icon.png", optimize=True)
record("public/apple-touch-icon.png")

# Google Search wants a square whose side is a multiple of 48px, and its
# crawler asks for /favicon.ico by path whether or not the page declares one.
rounded_icon(head, 96).save("public/favicon-96.png", optimize=True)
record("public/favicon-96.png")

# BMP entries rather than Pillow's default PNG-in-ICO: every decoder that has
# ever read an .ico understands them, and a one-off icon is not worth the
# compatibility question.
rounded_icon(head, 256).save(
    "public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], bitmap_format="bmp"
)
record("public/favicon.ico")

print(f"restamped the social card figure: {restamp_card(figure)}")
record(OG)

print("wrote:")
for path in written:
    print(f"  {path}")
