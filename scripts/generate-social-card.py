"""Render the ONN social card using the website's logo and signature palette.
Requires Pillow and DejaVu Sans (Debian fonts-dejavu-core).
Run from any directory: python scripts/generate-social-card.py
Only the published PNG is needed by the website; no runtime dependencies are added.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SCALE = 2
NAVY, INK, BLUE, COPPER, WHITE = '#0b1831', '#09142b', '#91c8ff', '#c99270', '#ffffff'
image = Image.new('RGB', (1200 * SCALE, 630 * SCALE), NAVY)
draw = ImageDraw.Draw(image)

def box(coords, color, radius=0):
    draw.rounded_rectangle(tuple(int(v * SCALE) for v in coords), radius=radius * SCALE, fill=color)

def text(x, y, value, size, color=WHITE, bold=False):
    font = ImageFont.truetype('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf', size * SCALE)
    # Keep all text within the card's safe area; fail rather than silently clip copy.
    bounds = draw.textbbox((x * SCALE, y * SCALE), value, font=font, anchor='lt')
    assert bounds[2] <= 1140 * SCALE and bounds[3] <= 585 * SCALE, value
    draw.text((x * SCALE, y * SCALE), value, font=font, fill=color, anchor='lt')

# Reuse the exact homepage artwork instead of introducing another logo variant.
logo = Image.open(ROOT / 'onn-logo-brand.webp').convert('RGB')
logo.thumbnail((310 * SCALE, 114 * SCALE), Image.Resampling.LANCZOS)
image.paste(logo, (64 * SCALE, 44 * SCALE))
box((1010, -90, 1290, 450), INK, 90)
box((1090, 160, 1280, 460), '#204377', 65)
box((1140, 360, 1280, 500), COPPER, 45)
box((64, 184, 114, 189), COPPER, 2)
text(64, 218, 'Microsoft-powered', 51, BLUE, True)
text(64, 283, 'business solutions.', 51, WHITE, True)
text(66, 373, 'Microsoft 365  •  SharePoint  •  Power Platform', 24, '#c4d4e9')
text(66, 413, 'Azure  •  EDRMS  •  Intelligent automation', 24, '#c4d4e9')
text(66, 473, 'Custom software & AI. Built around your business.', 25, WHITE)
box((64, 532, 1136, 534), '#2f537d')
text(64, 559, 'onntechnologies.co.za', 21)
text(752, 565, 'INNOVATE  •  AUTOMATE  •  ELEVATE', 11, '#c4d4e9')
image.resize((1200, 630), Image.Resampling.LANCZOS).save(
    ROOT / 'images' / 'onn-social-card.png', optimize=True)
