import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
const require = createRequire(import.meta.url);
const module = { exports: {} };
const code = ts.transpileModule(fs.readFileSync('src/data/posts.tsx', 'utf8'), {
  compilerOptions: {module:ts.ModuleKind.CommonJS, jsx:ts.JsxEmit.ReactJSX}
}).outputText;
new Function('require', 'module', 'exports', code)(require, module, module.exports);
const post = module.exports.CURATED_BLOG_POSTS.find(p => p.slug === 'color-code-complete-guide');
const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, post.content));
const text = html.replace(/<[^>]*>/g, '');
test('rendered HSL example agrees with the displayed HEX/RGB colour', () => {
  const match = text.match(/hsl\(([\d.]+)[ ,]+([\d.]+)%[ ,]+([\d.]+)%\)/);
  assert.ok(match, 'article must show a parseable HSL example');
  // CSS Color 4: max=1, min=51/255, hue=60*(87-51)/(255-51).
  assert.ok(Math.abs(Number(match[1]) - 60 * (87 - 51) / (255 - 51)) < 0.01);
  assert.equal(Number(match[2]), 100);
  assert.equal(Number(match[3]), 60);
  assert.ok(text.includes('#FF5733') && text.includes('255') && text.includes('87'));
});
test('guide preserves publication identity and documents valid alpha forms with a primary source', () => {
  assert.equal(post.date, '2025-12-13');
  assert.ok(post.thumbnail.includes('photo-1525909002-1b05e0c869d8'));
  assert.ok(text.includes('3·4·6·8자리'));
  assert.ok(text.includes('rgb(255 87 51 / 50%)'));
  assert.ok(html.includes('https://www.w3.org/TR/css-color-4/'));
  assert.ok(html.includes('/tools/color-converter'));
});
