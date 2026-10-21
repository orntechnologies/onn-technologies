const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const tags = [...html.matchAll(/<meta\s+[^>]*>/g)].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:]+)="([^"]*)"/g)].map(m => [m[1], m[2]])));
function meta(key) {
  const matches = tags.filter(t => (t.property || t.name) === key);
  assert.equal(matches.length, 1, `exactly one ${key} tag`);
  return matches[0].content;
}

test('social metadata selects a large, accessible PNG on the canonical origin', () => {
  const url = new URL(meta('og:image'));
  assert.equal(url.href, 'https://onntechnologies.co.za/images/onn-social-card.png');
  assert.equal(url.origin, new URL(meta('og:url')).origin);
  assert.equal(url.hostname, fs.readFileSync(path.join(root, 'CNAME'), 'utf8').trim());
  assert.equal(meta('og:image:secure_url'), url.href);
  assert.equal(meta('twitter:image'), url.href);
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.equal(meta('og:image:type'), 'image/png');
  assert.equal(meta('og:image:width'), '1200');
  assert.equal(meta('og:image:height'), '630');
  for (const key of ['og:image:alt', 'twitter:image:alt', 'twitter:title']) {
    assert.match(meta(key), /ONN Technologies/);
    assert.match(meta(key), /Software Development, AI &amp; Digital Transformation/);
    assert.doesNotMatch(meta(key), /ORN/);
  }
  assert.equal(meta('twitter:description'), meta('og:description'));
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  assert.doesNotMatch(robots, /Disallow:\s*\/(?:\s|images)/i);
});

test('published card is a complete 1200 by 630 opaque RGB PNG under 1 MB', () => {
  const png = fs.readFileSync(path.join(root, new URL(meta('og:image')).pathname.slice(1)));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.equal(png[24], 8);
  assert.equal(png[25], 2, 'opaque RGB avoids transparent preview backgrounds');
  assert.ok(png.length < 1000000);
  const idat = [];
  let ended = false;
  for (let offset = 8; offset < png.length;) {
    const size = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    assert.ok(offset + size + 12 <= png.length, 'complete PNG chunk');
    if (type === 'IDAT') idat.push(png.subarray(offset + 8, offset + 8 + size));
    if (type === 'IEND') ended = true;
    offset += size + 12;
  }
  assert.ok(ended);
  assert.equal(zlib.inflateSync(Buffer.concat(idat)).length, 630 * (1 + 1200 * 3));
});
