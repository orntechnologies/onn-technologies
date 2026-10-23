const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'chatbot.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function luminance(hex) {
  const rgb = hex.match(/[a-f0-9]{2}/gi).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

test('chat launcher uses ONN copper with accessible text contrast', () => {
  const launcher = css.match(/\.onn-chat-launch\{([^}]+)\}/)[1];
  const background = launcher.match(/(?:^|;)background:(#[a-f0-9]{6})(?:;|$)/i)?.[1];
  const foreground = launcher.match(/(?:^|;)color:(#[a-f0-9]{6})(?:;|$)/i)?.[1];
  assert.equal(background, '#c99270');
  assert.ok(html.includes('background:' + background), 'matches existing homepage brand accent');
  assert.ok(foreground, 'explicit text colour');
  const values = [luminance(background), luminance(foreground)].sort((a, b) => b - a);
  assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, 'normal text contrast >= 4.5:1');
  assert.doesNotMatch(launcher, /#ff6b00|#ff8b3d/i);
});
