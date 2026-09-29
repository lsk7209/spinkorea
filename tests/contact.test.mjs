// SPK2-12 private contact: one email source shared by React pages and the static shell.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const guidance = JSON.parse(fs.readFileSync('src/data/site-guidance.json', 'utf8'));
const EMAIL = 'igeonu377@gmail.com';

describe('private contact', () => {
  it('guidance carries the operator email and no "no private channel" wording', () => {
    assert.equal(guidance.contact.email, EMAIL);
    const text = JSON.stringify(guidance);
    assert.ok(guidance.privacy.rightsContact.includes(EMAIL));
    assert.doesNotMatch(text, /비공개 수신 (경로|채널)은? (현재 )?(이 사이트에 안내되어 있지 않습니다|없습니다)/);
  });

  it('asks users not to send sensitive data in the first email', () => {
    assert.match(guidance.contact.emailCaution, /비밀번호/);
  });

  it('Contact page renders a mailto link from guidance', () => {
    const contact = fs.readFileSync('src/pages/Contact.tsx', 'utf8');
    assert.match(contact, /href=\{`mailto:\$\{guidance\.contact\.email\}`\}/);
    assert.doesNotMatch(contact, /비공개 문의 경로 미설정/);
  });

  it('static shell links the same email', () => {
    const generator = fs.readFileSync('scripts/generate-assets.mjs', 'utf8');
    assert.match(generator, /"mailto:" \+ guidance\.contact\.email/);
  });
});
