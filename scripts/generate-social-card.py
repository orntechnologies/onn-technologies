"""Render the ONN social card. Requires Pillow and DejaVu Sans (Debian fonts-dejavu-core).
Run from any directory: python scripts/generate-social-card.py
Only the published PNG is needed by the website; no runtime dependencies are added.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SCALE = 2
NAVY, INK, BLUE, ORANGE, WHITE = '#071f47', '#06152d', '#087cd8', '#ff6b00', '#ffffff'
image = Image.new('RGB', (1200 * SCALE, 630 * SCALE), NAVY)
draw = ImageDraw.Draw(image)

def box(coords, color, radius=0, outline=None):
    draw.rounded_rectangle(tuple(int(v * SCALE) for v in coords), radius=radius * SCALE,
                           fill=color, outline=outline, width=2 * SCALE)

def text(x, y, value, size, color=WHITE, bold=False):
    font = ImageFont.truetype('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf', size * SCALE)
    draw.text((x * SCALE, y * SCALE), value, font=font, fill=color, anchor='lt')
    return draw.textlength(value, font=font) / SCALE

# Restrained geometric motif, kept clear of the message and safe margins.
box((954, -110, 1290, 440), INK, 100)
box((1014, 90, 1240, 500), BLUE, 80)
box((1090, 318, 1270, 570), ORANGE, 60)
box((64, 62, 130, 128), BLUE, 17)
text(78, 71, 'O', 46, bold=True)
x = 150
x += text(x, 61, 'ON', 48, bold=True)
text(x, 61, 'N', 48, ORANGE, True)
text(153, 116, 'T E C H N O L O G I E S', 12)
box((64, 186, 112, 191), ORANGE, 2)
text(64, 221, 'Software Development,', 48, bold=True)
text(64, 286, 'AI & Digital', 48, bold=True)
text(64, 351, 'Transformation', 48, bold=True)
text(66, 437, 'Intelligent software. Smarter business.', 25, '#c8d5e7')
box((64, 520, 914, 522), '#254165')
text(64, 553, 'onntechnologies.co.za', 21)
text(684, 557, 'INNOVATE  •  AUTOMATE  •  ELEVATE', 11, '#c8d5e7')
image.resize((1200, 630), Image.Resampling.LANCZOS).save(
    ROOT / 'images' / 'onn-social-card.png', optimize=True)
