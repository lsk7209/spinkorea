// Source-level contracts for UI behaviour that has no DOM test runner in this repo.
// These are string assertions (not rendering tests); browser checks are recorded in the QA report.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

describe('SPK2-01 Home draw reset', () => {
  const home = read('src/pages/Home.tsx');
  it('resets the current draw when the candidate list actually changes', () => {
    assert.match(home, /areItemsEqual\(items, newItems\)[\s\S]*?updateItems\(newItems\);\s*reset\(\);/);
  });
  it('tracks tool_used only for an accepted draw', () => {
    assert.match(home, /const draw = spin\(\);\s*if \(!draw\) \{\s*return;\s*\}/);
  });
  it('completion event uses the draw snapshot, not the live list', () => {
    assert.match(home, /item_count: draw\.items\.length/);
  });
  it('hook cancels the in-flight draw on unmount', () => {
    assert.match(read('src/hooks/use-roulette.ts'), /useEffect\(\(\) => \(\) => controllerRef\.current\?\.cancel\(\), \[\]\)/);
  });
});

describe('SPK2-02 restore notice', () => {
  it('a rejected share link does not fall back to stored items silently', () => {
    const hook = read('src/hooks/use-state-persistence.ts');
    assert.match(hook, /status === 'invalid'\) \{\s*setRestoreNotice\('invalid-share-link'\);/);
    assert.match(read('src/pages/Home.tsx'), /restoreNotice === 'invalid-share-link'/);
  });
  it('history.state (React Router key) is preserved on URL updates', () => {
    const url = read('src/utils/url-state.ts');
    assert.match(url, /replaceState\(window\.history\.state/);
    assert.doesNotMatch(url, /replaceState\(\{\}/);
  });
});

describe('SPK2-03 share UI', () => {
  const share = read('src/components/ShareButtons.tsx');
  it('builds the link from items at click time instead of copying location.href', () => {
    assert.match(share, /buildShareUrl\(items, window\.location\.href\)/);
    assert.doesNotMatch(share, /writeText\(window\.location\.href\)/);
  });
  it('does not promise that the link shows the result', () => {
    assert.doesNotMatch(share, /결과 확인/);
    assert.match(share, /결과는 포함되지 않습니다/);
  });
  it('result text stays available when the link is unsafe', () => {
    assert.match(share, /disabled=\{!result\}/);
  });
});

describe('SPK2-04 page purpose', () => {
  const randomNumber = read('src/pages/RandomNumber.tsx');
  it('random-number prefers its own candidates on direct entry', () => {
    assert.match(randomNumber, /preferInitialOnFirstLoad/);
    assert.match(read('src/pages/LunchMenu.tsx'), /preferInitialOnFirstLoad/);
  });
  it('specialised pages pass their own H1/intro', () => {
    assert.match(randomNumber, /heading="랜덤 숫자 뽑기 룰렛"/);
    assert.match(read('src/pages/LunchMenu.tsx'), /heading="점심 메뉴 추천 룰렛"/);
    assert.match(read('src/pages/Home.tsx'), /\{heading\}/);
  });
  it('random-number copy does not promise range/count generation', () => {
    const article = read('src/components/articles/RandomNumberArticle.tsx');
    for (const text of [randomNumber, article]) {
      assert.doesNotMatch(text, /숫자 범위를 선택|범위를 설정하거나|로또 번호 생성 \|/);
    }
  });
  it('specialised pages render a single H1 (article headings are h2)', () => {
    for (const file of ['src/components/articles/RandomNumberArticle.tsx', 'src/components/articles/LunchArticle.tsx']) {
      assert.doesNotMatch(read(file), /<h1/);
    }
  });
});

describe('SPK2-09 modal accessibility', () => {
  const modal = read('src/components/ItemEditorModal.tsx');
  const templates = read('src/components/TemplateModal.tsx');
  const hook = read('src/hooks/use-modal-dialog.ts');
  it('textarea has a programmatic label and linked errors', () => {
    assert.match(modal, /<label htmlFor=\{TEXTAREA_ID\}/);
    assert.match(modal, /aria-invalid=\{hasErrors\}/);
    assert.match(modal, /role="alert"/);
  });
  it('save always shows validation instead of silently doing nothing', () => {
    assert.match(modal, /const result = validate\(text\);/);
    assert.doesNotMatch(modal, /disabled=\{errors\.length > 0\}/);
  });
  it('presets (including reset) go through the validator', () => {
    assert.match(modal, /setText\(newText\);\s*validate\(newText\);/);
    assert.match(read('src/components/ItemEditor.tsx'), /const result = processAndValidateItems\(newText\);\s*setErrors/);
  });
  it('both modals use the shared dialog behaviour', () => {
    assert.match(modal, /useModalDialog\(isOpen, onClose, dialogRef, textareaRef\)/);
    assert.match(templates, /useModalDialog\(isOpen, onClose, dialogRef, searchRef\)/);
    assert.match(templates, /role="dialog"/);
    assert.match(templates, /aria-label="템플릿 창 닫기"/);
  });
  it('dialog hook handles Escape, Tab trap, inert background and focus return', () => {
    assert.match(hook, /event\.key === 'Escape'/);
    assert.match(hook, /event\.key === 'Tab'/);
    assert.match(hook, /setAttribute\('inert', ''\)/);
    assert.match(hook, /opener\.focus\(\)/);
  });
});

describe('SPK2-10 reduced motion', () => {
  it('Home and wheel share the controller timing', () => {
    assert.match(read('src/pages/Home.tsx'), /useReducedMotion\(\)/);
    assert.match(read('src/components/RouletteWheel.tsx'), /duration: isSpinning \? spinDurationMs \/ 1000/);
  });
  it('confetti is skipped when reduced motion is preferred', () => {
    assert.match(read('src/components/ResultDisplay.tsx'), /reducedMotion \|\| confettiTriggeredRef\.current/);
  });
});
