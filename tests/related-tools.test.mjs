// SPK2-07/08 static shell related links come from the same declarations as the React tool pages (T22, T23).
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { buildRelatedToolMap, extractRelatedPaths, selectRelatedPages } from '../scripts/lib/related-tools.mjs';

const sitePages = JSON.parse(fs.readFileSync('src/data/site-pages.json', 'utf8'));
const map = buildRelatedToolMap(process.cwd());

describe('related tools', () => {
  it('extracts only paths inside the relatedTools block', () => {
    const source = 'faqs={[{ path: "/nope" }]}\nrelatedTools={[\n { name: "A", path: "/tools/a" },\n { name: "B", path: \'/tools/b\' },\n]}\nother={[{ path: "/x" }]}';
    assert.deepEqual(extractRelatedPaths(source), ['/tools/a', '/tools/b']);
  });

  it('reads declarations for real tool routes', () => {
    assert.ok(map.size >= 30, `declared pages: ${map.size}`);
    assert.deepEqual(map.get('/tools/age-calculator').slice(0, 2), ['/tools/d-day-counter', '/tools/bmi-calculator']);
  });

  it('static shell uses the declared tools, not the first site pages', () => {
    const page = sitePages.find((p) => p.path === '/tools/age-calculator');
    const selected = selectRelatedPages(page, sitePages, map).map((p) => p.path);
    assert.equal(selected[0], '/tools/d-day-counter');
    assert.ok(!selected.includes('/'), 'no longer the generic home link');
  });

  it('never links to itself, to missing pages, or twice', () => {
    for (const page of sitePages) {
      const selected = selectRelatedPages(page, sitePages, map).map((p) => p.path);
      assert.ok(!selected.includes(page.path), page.path);
      assert.equal(new Set(selected).size, selected.length, page.path);
      for (const p of selected) assert.ok(sitePages.some((s) => s.path === p), `${page.path} -> ${p}`);
    }
  });

  it('every declared related path is a real route', () => {
    const app = fs.readFileSync('src/App.tsx', 'utf8');
    for (const [route, related] of map) {
      for (const p of related) assert.ok(app.includes(`path="${p}"`), `${route} -> ${p}`);
    }
  });
});
