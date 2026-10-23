const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bot = fs.readFileSync(path.join(root, 'chatbot.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'chatbot.css'), 'utf8');

test('new Microsoft-focused design is the homepage', () => {
  assert.match(html, /ONN Technologies \| Microsoft Business Solutions/);
  assert.match(html, /We Build <span>Intelligent<\/span>/);
  assert.match(html, /Explore our expertise/);
  assert.match(html, /Employee HR, Onboarding &amp; IPMS/);
  assert.doesNotMatch(html, /DESIGN PREVIEW ONLY/);
});

test('new homepage lists all six services', () => {
  const section = html.match(/<section class="section light" id="services">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'services section exists');
  assert.equal((section.match(/class="card"/g) || []).length, 6);
  for (const item of ['Microsoft 365', 'SharePoint &amp; EDRMS', 'Power Platform', 'Azure &amp; Integration', 'Custom Development', 'Intelligent Automation']) {
    assert.ok(section.includes(item), 'service present: ' + item);
  }
});

test('contact form, analytics and lead conversion tracking are preserved', () => {
  assert.match(html, /<form id="contactForm" class="contact-form" action="https:\/\/formsubmit\.co\/ajax\/info@onntechnologies\.co\.za"/);
  assert.match(html, /id="email" name="email" required type="email"/);
  assert.match(html, /<option>Microsoft 365 consulting<\/option>/);
  assert.match(html, /G-RWSY60K7QZ/);
  assert.match(html, /event_category:'contact',method:'FormSubmit'/);
  assert.match(html, /name="_honey"/);
});

test('chatbot and its consent flow remain available', () => {
  assert.match(html, /<link rel="stylesheet" href="\.\/chatbot\.css\?v=20261023-1">/);
  assert.match(html, /chatbot\.js\?v=20261021-3/);
  assert.match(bot, /Microsoft Solutions/);
  assert.match(bot, /'Microsoft solutions'/);
  assert.match(bot, /name="privacy_consent" type="checkbox"[^>]* required/);
  assert.match(bot, /if\(!lead\.reportValidity\(\)\|\|!\$\('onnLeadConsent'\)\.checked\)return/);
  assert.doesNotMatch(bot, /keys:\['sap'/i);
  assert.doesNotMatch(bot, /localhost:3000|127\.0\.0\.1:3000|\/api\/chat/i);
});

test('responsive menu and accessibility controls remain functional', () => {
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /min-width:44px/);
  assert.match(html, /aria-controls="links"/);
  assert.match(html, /menu\.setAttribute\('aria-label',isOpen\?'Close menu':'Open menu'\)/);
  assert.match(bot, /aria-expanded/);
});

test('metadata and branded icons remain linked', () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/onntechnologies\.co\.za\/">/);
  assert.match(html, /G-RWSY60K7QZ/);
  for (const asset of ['/favicon.ico?v=20261018', '/favicon-16x16.png?v=20261018', '/favicon-32x32.png?v=20261018', '/apple-touch-icon.png?v=20261018']) {
    assert.ok(html.includes(asset), 'icon link ' + asset);
  }
});

test('brand artwork is included in both header and footer', () => {
  assert.equal((html.match(/class="onn-logo-image"/g) || []).length, 2);
  const logo = fs.readFileSync(path.join(root, 'onn-logo-brand.webp'));
  assert.equal(logo.subarray(0, 4).toString(), 'RIFF');
  assert.equal(logo.subarray(8, 12).toString(), 'WEBP');
});
