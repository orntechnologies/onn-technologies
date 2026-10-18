"""Generate ONN favicon assets using only Python's standard library.
The mark follows the website's existing rounded navy/blue/orange O brandmark.
"""
from __future__ import annotations
import math
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SUPERSAMPLE = 4

def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))

def color_at(x, y):
    # Diagonal color sweep echoes the gradient on the site's existing brandmark.
    t = max(0.0, min(1.0, (x + y) / 2))
    if t < 0.56:
        return mix((7, 31, 71), (8, 124, 216), t / 0.56)
    return mix((8, 124, 216), (255, 107, 0), (t - 0.56) / 0.44)

def covered(x, y, size):
    # Rounded square on a transparent margin, with an outlined O at its center.
    u, v = x / size, y / size
    left, top, right, bottom = 0.055, 0.055, 0.945, 0.945
    radius = 0.22
    dx = max(left + radius - u, 0.0, u - (right - radius))
    dy = max(top + radius - v, 0.0, v - (bottom - radius))
    outside = math.hypot(dx, dy) - radius
    if outside > 0 and (u < left + radius or u > right - radius) and (v < top + radius or v > bottom - radius):
        return None
    if u < left or u > right or v < top or v > bottom:
        return None
    # Preserve the strong rounded-square silhouette of the current site icon.
    ox, oy = (u - 0.5) / 0.245, (v - 0.5) / 0.30
    radius_from_o = math.sqrt(ox * ox + oy * oy)
    if abs(radius_from_o - 1.0) <= 0.14:
        return (255, 255, 255)
    return color_at(u, v)

def make_png(size):
    rows = []
    for py in range(size):
        row = bytearray([0])
        for px in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(SUPERSAMPLE):
                for sx in range(SUPERSAMPLE):
                    c = covered(px + (sx + 0.5) / SUPERSAMPLE, py + (sy + 0.5) / SUPERSAMPLE, size)
                    if c is not None:
                        acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; acc[3] += 255
            count = SUPERSAMPLE * SUPERSAMPLE
            row.extend((round(acc[0] / count), round(acc[1] / count), round(acc[2] / count), round(acc[3] / count)))
        rows.append(bytes(row))
    raw = b"".join(rows)
    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xffffffff)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">2I5B", size, size, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")

for size, name in ((16, "favicon-16x16.png"), (32, "favicon-32x32.png"), (180, "apple-touch-icon.png")):
    (ROOT / name).write_bytes(make_png(size))

sizes = (16, 32, 48, 256)
images = [make_png(size) for size in sizes]
header = struct.pack("<HHH", 0, 1, len(sizes))
entries = bytearray()
offset = 6 + 16 * len(sizes)
for size, data in zip(sizes, images):
    dim = 0 if size == 256 else size
    entries.extend(struct.pack("<BBBBHHII", dim, dim, 0, 0, 1, 32, len(data), offset))
    offset += len(data)
(ROOT / "favicon.ico").write_bytes(header + entries + b"".join(images))
