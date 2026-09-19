import assert from 'node:assert/strict';
import { formatSupportedJson } from '../src/utils/json-format.ts';

for (const source of [
  'null', 'true', '0', '-0', '1.25', '1e3', '1e-3',
  '{"n":9007199254740991,"negative":-9007199254740991}',
  '{"text":"9007199254740993","1e999":"escaped \\" 9007199254740993"}',
  '{"nested":[1,2.5,{"ok":true}]}',
  '90071992547409910e-1',
]) {
  for (const space of [0, 2, 4]) assert.equal(formatSupportedJson(source, space), JSON.stringify(JSON.parse(source), null, space));
}
for (const value of ['9007199254740992', '9007199254740993', '-9007199254740993', '9.007199254740993e15', '9007199254740993.0', '1e400', '-1e400']) {
  for (const source of [value, `{"nested":[${value}]}`, `{"a":${value},"a":1}`]) assert.throws(() => formatSupportedJson(source), /지원 범위/);
}
for (const source of ['', '{"n":1,}', '{n:1}', '[01]', '[1 2]', 'NaN', 'Infinity']) assert.throws(() => formatSupportedJson(source), SyntaxError);
console.log('JSON numeric boundaries, escaped strings, exponents, decimals, syntax and formatting PASS');
