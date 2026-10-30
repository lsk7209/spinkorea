import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

function loadTsx(path, imports = {}) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }
    }).outputText;
    const loadedModule = { exports: {} };
    const localRequire = (name) => {
        if (name === 'react/jsx-runtime') return require(name);
        if (name in imports) return imports[name];
        throw new Error(`Unexpected import: ${name}`);
    };
    vm.runInNewContext('(function(require,module,exports){' + code + '\n})', {})(localRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
}

const Article = loadTsx('../src/components/articles/RandomNumberArticle.tsx').default;
const { TEMPLATES } = loadTsx('../src/data/templates.ts');
let homeProps;
const Home = (props) => {
    homeProps = props;
    return React.createElement('main', {}, props.intro, React.createElement(props.ArticleComponent));
};
const RandomNumber = loadTsx('../src/pages/RandomNumber.tsx', {
    './Home': { default: Home },
    '@/data/templates': { TEMPLATES },
    '@/components/articles/RandomNumberArticle': { default: Article }
}).default;

test('page and article SSR describe batch draw and optional auto-exclusion', () => {
    const html = renderToStaticMarkup(React.createElement(RandomNumber));
    assert.equal(homeProps.initialItems.length, 45);
    assert.match(html, /한 번에 뽑을 수/);
    assert.match(html, /추첨 후 자동 제외/);
    assert.match(html, /묶음 내 중복 없음/);
    assert.match(html, /최대 100개/);
    assert.match(html, /명단 수정|명단 편집 열기/);
    assert.doesNotMatch(html, /한 번에 하나|하나만 뽑|직접 지워야|항목 수정|자동 중복 제외는 지원하지/);
    assert.doesNotMatch(homeProps.description, /하나를|직접 지워|반복 실행/);
});

test('visible FAQ and JSON-LD agree on repeat draws and limitations', () => {
    const html = renderToStaticMarkup(React.createElement(RandomNumber));
    const graph = homeProps.structuredData['@graph'];
    const app = graph.find((node) => node['@type'] === 'SoftwareApplication');
    const faq = graph.find((node) => node['@type'] === 'FAQPage');
    assert.match(app.description, /한 번에 여러|여러 개/);
    assert.match(app.description, /자동 제외/);
    assert.match(html, /중복 없이 숫자를 뽑을 수 있나요/);
    const duplicateAnswer = faq.mainEntity.find((item) => item.name === '중복 없는 번호를 뽑을 수 있나요?')?.acceptedAnswer.text;
    assert.match(duplicateAnswer, /한 묶음/);
    assert.match(duplicateAnswer, /추첨 후 자동 제외/);
    assert.doesNotMatch(duplicateAnswer, /직접 제거|독립 실행|직접 지워/);
    const visibleText = html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
    assert.ok(visibleText.replace(/\s/g, '').includes(duplicateAnswer.replace(/\s/g, '')));
    const batchAnswer = faq.mainEntity.find((item) => item.name === '한 번에 여러 번호를 뽑을 수 있나요?')?.acceptedAnswer.text;
    assert.ok(visibleText.replace(/\s/g, '').includes(batchAnswer.replace(/\s/g, '')));
    assert.match(html, /공식 추첨|감사 기록/);
});

test('guidance distinguishes roster link from result and exclusion state', () => {
    const html = renderToStaticMarkup(React.createElement(RandomNumber));
    assert.match(html, /원본 후보 목록/);
    assert.match(html, /결과나 제외 상태/);
    assert.match(homeProps.intro, /기본 1~45/);
});

function generatorEntry(name) {
    const source = readFileSync(new URL('../scripts/generate-assets.mjs', import.meta.url), 'utf8');
    const file = ts.createSourceFile('generate-assets.mjs', source, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS);
    let entry;
    for (const statement of file.statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
            if (declaration.name.getText(file) !== name || !ts.isObjectLiteralExpression(declaration.initializer)) continue;
            entry = declaration.initializer.properties.find((property) =>
                ts.isPropertyAssignment(property) && property.name.getText(file) === '"/random-number"'
            )?.initializer;
        }
    }
    assert.ok(entry, `missing generator ${name} random-number entry`);
    return entry;
}

test('static generator and page metadata carry current random-number behavior', () => {
    const pages = JSON.parse(readFileSync(new URL('../src/data/site-pages.json', import.meta.url), 'utf8'));
    const page = pages.find((item) => item.path === '/random-number');
    assert.ok(page);
    const body = generatorEntry('approvalBodies');
    const paragraphs = body.elements.map((element) => element.text).join(' ');
    const meta = generatorEntry('approvalMetaOverrides');
    const description = meta.properties.find((property) => property.name.getText() === 'description')?.initializer.text;
    for (const text of [page.description, page.summary, paragraphs, description]) {
        assert.match(text, /한 번에|한 묶음/);
        assert.match(text, /자동 제외/);
        assert.doesNotMatch(text, /한 번 돌릴 때마다 숫자 하나|자동 중복 제외 기능은 없|이미 나온 숫자는 목록에서 직접 지우|범위·개수 지정과 자동 중복 제외는 지원하지/);
    }
    assert.match(paragraphs, /원본 명단/);
    assert.match(paragraphs, /결과와 제외 상태는 포함되지/);
});
