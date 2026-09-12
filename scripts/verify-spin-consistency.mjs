import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const home = read('src/pages/Home.tsx');
const editor = read('src/components/ItemEditor.tsx');
const presets = read('src/components/RecommendedPresets.tsx');

assert.match(
  home,
  /const handleUpdateItems = useCallback\([\s\S]*?if \(isSpinning\) \{\s*return false;\s*\}/,
  'all item mutations must fail closed while the wheel is spinning',
);
assert.match(home, /<ItemEditor[^>]*isSpinning={isSpinning}/s, 'desktop editor receives the spin lock');
assert.match(home, /<RecommendedPresets[^>]*isSpinning={isSpinning}/s, 'recommended presets receive the spin lock');
assert.equal(
  (home.match(/if \(!handleUpdateItems\(presetItems\)\) \{\s*return;\s*\}/g) ?? []).length,
  2,
  'recommended and deep-link presets only continue after an accepted item update',
);
assert.match(
  home,
  /onClick=\{\(\) => setIsEditorModalOpen\(true\)\}[\s\S]*?disabled=\{isSpinning\}/,
  'mobile item editor cannot open during a spin',
);
assert.match(
  home,
  /onClick=\{\(\) => setIsTemplateModalOpen\(true\)\}[\s\S]*?disabled=\{isSpinning\}/,
  'mobile template picker cannot open during a spin',
);
assert.equal(
  (editor.match(/disabled=\{isSpinning\}/g) ?? []).length,
  2,
  'desktop preset buttons and textarea expose native disabled state',
);
assert.match(presets, /disabled=\{isSpinning\}/, 'recommended preset buttons expose native disabled state');
assert.match(presets, /aria-busy=\{isSpinning\}/, 'preset group exposes the temporary busy state');

console.log('SPIN_CONSISTENCY_OK');
