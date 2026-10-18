const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bot = fs.readFileSync(path.join(root, 'chatbot.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'chatbot.css'), 'utf8');

test('homepage uses the approved company positioning and primary calls to action', () => {
  assert.match(html, /Software Development, AI &(?:amp;)? Digital Transformation/);
  assert.match(html, /We build intelligent software, automate business processes and deliver digital solutions that help organisations operate smarter and grow\./);
  assert.match(html, /Explore Our Solutions/);
  assert.match(html, /Request a Consultation/);
});

test('homepage presents all five requested service categories and priority offers', () => {
  const section = html.match(/<section class="section services" id="services">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'services section exists');
  assert.equal((section.match(/class="service(?:\s|"|>)/g) || []).length, 5);
  for (const text of [
    'Custom Software Development', 'Website Development', 'e-commerce', 'mobile applications',
    'AI &amp; Intelligent Automation', 'Business Management Solutions', 'HR Solutions',
    'Microsoft Solutions', 'IT Consulting &amp; Digital Transformation', 'SPFx development'
  ]) assert.ok(section.includes(text), `services include ${text}`);
});

test('owned products are separated and clearly marked unavailable while in development', () => {
  const section = html.match(/<section class="section solutions" id="products">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(section, 'products section exists');
  for (const product of ['ONN AI Studio', 'ONN HR Solutions', 'ONN Document Management Solutions', 'Future ONN Software Products']) {
    assert.ok(section.includes(product), `products include ${product}`);
  }
  assert.match(section, /not currently available for purchase or commercial deployment/);
  assert.ok((section.match(/In development · not commercially available/g) || []).length >= 3);
});

test('existing contact form remains and chatbot consent stays mandatory', () => {
  assert.match(html, /<form id="contactForm" action="https:\/\/formsubmit\.co\/ajax\/info@onntechnologies\.co\.za"/);
  assert.match(html, /id="email" name="email" required type="email"/);
  assert.match(html, /<option>Website Development<\/option>/);
  assert.match(html, /<option>E-commerce Website<\/option>/);
  assert.match(bot, /name="privacy_consent" type="checkbox"[^>]* required/);
  assert.match(bot, /if\(!lead\.reportValidity\(\)\|\|!\$\('onnLeadConsent'\)\.checked\)return/);
  assert.match(bot, /name="_honey"/);
});

test('public chatbot covers new categories and has no private ONN AI endpoint', () => {
  for (const topic of ['Website & application development', 'Business Process Automation', 'Business Management Solutions', 'Microsoft Solutions', 'AI & Intelligent Automation', 'IT Consulting & Digital Transformation']) {
    assert.ok(bot.includes(topic), `chatbot has ${topic} guidance`);
  }
  assert.match(bot, /not currently commercially available/);
  for (const label of ['Website development', 'AI & automation', 'HR & business systems', 'Microsoft solutions', 'IT consulting']) {
    assert.ok(bot.includes(label), `chatbot offers ${label} quick access`);
  }
  assert.doesNotMatch(bot, /localhost:3000|127\.0\.0\.1:3000|\/api\/chat/i);
});

test('mobile chatbot layout and accessible state controls are present', () => {
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /min-width:44px/);
  assert.match(html, /menu\.setAttribute\('aria-label', isOpen \? 'Close menu' : 'Open menu'\)/);
  assert.match(bot, /launch\.setAttribute\('aria-label',open\?'Close ONN website assistant':'Open ONN website assistant'\)/);
});

test('branded favicon assets are linked and valid PNG/ICO files', () => {
  for (const href of [
    '/favicon.ico?v=20261018', '/favicon-16x16.png?v=20261018',
    '/favicon-32x32.png?v=20261018', '/apple-touch-icon.png?v=20261018'
  ]) assert.ok(html.includes(href), `homepage links ${href}`);
  for (const name of ['favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png']) {
    const data = fs.readFileSync(path.join(root, name));
    assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name} has PNG signature`);
  }
  const ico = fs.readFileSync(path.join(root, 'favicon.ico'));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 4);
  const firstFrameOffset = ico.readUInt32LE(18);
  assert.equal(ico.subarray(firstFrameOffset, firstFrameOffset + 8).toString('hex'), '89504e470d0a1a0a', 'ICO embeds PNG icon frames');
});

test('every featured chatbot category quick question has a matching FAQ keyword', () => {
  for (const phrase of ['website development', 'ai & automation', 'hr & business systems', 'microsoft solutions', 'it consulting']) {
    assert.match(bot, new RegExp(`keys:\\[[^\\]]*['"]${phrase.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}['"]`), `${phrase} is routable to an FAQ`);
  }
});

test('updated chatbot script is cache-busted for published visitors', () => {
  assert.match(html, /<script defer src="\.\/chatbot\.js\?v=20261018-2"><\/script>/);
});

