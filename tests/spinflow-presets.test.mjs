// SPK2-05 unknown /spinflow/:slug is a real 404 (T20). Static config + router contract.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SPINFLOW_PRESET_ALIASES, getPresetIdForSlug } from '../src/data/spinflow-presets.ts';
import { TEMPLATES } from '../src/data/templates.ts';

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const app = fs.readFileSync('src/App.tsx', 'utf8');
const home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

function rewriteRegex(source) {
  // Converts "/spinflow/:slug(a|b)" into an anchored RegExp (path-to-regexp subset used here).
  const pattern = source.replace(/:(\w+)\(([^)]+)\)/g, '($2)').replace(/\//g, '\\/');
  return new RegExp(`^${pattern}$`);
}

describe('spinflow preset aliases', () => {
  it('each alias maps to an existing template', () => {
    for (const [slug, id] of Object.entries(SPINFLOW_PRESET_ALIASES)) {
      assert.ok(TEMPLATES.some((t) => t.id === id), `${slug} -> ${id}`);
    }
  });

  it('unknown or prototype slugs are not presets', () => {
    for (const slug of ['audit-nonexistent-example', 'constructor', '__proto__', 'toString', '', undefined]) {
      assert.equal(getPresetIdForSlug(slug), undefined, String(slug));
    }
  });

  it('vercel rewrite allowlist matches the alias list exactly', () => {
    const rewrite = vercel.rewrites.find((r) => r.source.startsWith('/spinflow/:slug'));
    assert.ok(rewrite, 'spinflow rewrite exists');
    const regex = rewriteRegex(rewrite.source);
    for (const slug of Object.keys(SPINFLOW_PRESET_ALIASES)) {
      assert.match(`/spinflow/${slug}`, regex);
    }
    for (const slug of ['audit-nonexistent-example', 'lunchx', 'lotto/extra']) {
      assert.doesNotMatch(`/spinflow/${slug}`, regex);
    }
    const listed = rewrite.source.match(/\(([^)]+)\)/)[1].split('|').sort();
    assert.deepEqual(listed, Object.keys(SPINFLOW_PRESET_ALIASES).sort());
  });

  it('SPA router sends /spinflow/:slug through the allowlist component (source contract)', () => {
    assert.match(app, /path="\/spinflow\/:slug" element={<SpinflowPreset \/>}/);
    assert.doesNotMatch(app, /path="\/spinflow\/:slug" element={<Home \/>}/);
    assert.match(home, /getPresetIdForSlug\(slug\)/);
  });
});
