import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Use the project's compiler so these tests also run on Next.js-supported Node 20.
const source = await readFile(new URL('../src/lib/calendar.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const {
  filterCalendarRequests, formatCalendarDate, getCalendarDays,
  getSubmissionDate, groupCalendarRequests, isCalendarDate,
  shiftCalendarDate, shiftCalendarMonth,
} = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('submission dates follow Semey midnight, regardless of the host timezone', () => {
  assert.equal(getSubmissionDate('2026-11-05T18:59:59Z'), '2026-11-05');
  assert.equal(getSubmissionDate('2026-11-05T19:00:00Z'), '2026-11-06');
  assert.equal(getSubmissionDate('2026-12-31T23:30:00Z'), '2027-01-01');
  assert.equal(getSubmissionDate('2026-11-06T00:00:00+05:00'), '2026-11-06');
  assert.equal(getSubmissionDate('invalid'), null);
});

test('query dates reject impossible dates and accept leap days', () => {
  for (const date of [null, undefined, '', '2026-2-01', '2026-02-29', '2026-04-31', '2026-13-01', '<script>']) {
    assert.equal(isCalendarDate(date), false, String(date));
  }
  assert.equal(isCalendarDate('2028-02-29'), true);
  assert.equal(isCalendarDate('2026-11-05'), true);
});

test('the calendar covers six complete Monday-first weeks without gaps', () => {
  const days = getCalendarDays('2026-11-01');
  assert.equal(days.length, 42);
  assert.equal(new Set(days).size, 42);
  assert.equal(days[0], '2026-10-26');
  assert.equal(days.at(-1), '2026-12-06');
  assert.equal(new Date(`${days[0]}T12:00:00Z`).getUTCDay(), 1);
  assert.equal(new Date(`${days.at(-1)}T12:00:00Z`).getUTCDay(), 0);
  for (let index = 1; index < days.length; index++) {
    assert.equal(Date.parse(days[index]) - Date.parse(days[index - 1]), 86_400_000);
  }
  assert.equal(days.filter((date) => date.startsWith('2026-11')).length, 30);
  assert.equal(getCalendarDays('2028-02-01').filter((date) => date.startsWith('2028-02')).length, 29);
  assert.equal(getCalendarDays('2026-06-01')[0], '2026-06-01');
});

test('day and month navigation crosses leap days and year boundaries', () => {
  assert.equal(shiftCalendarDate('2028-02-28', 1), '2028-02-29');
  assert.equal(shiftCalendarDate('2028-02-29', 1), '2028-03-01');
  assert.equal(shiftCalendarDate('2026-01-01', -1), '2025-12-31');
  assert.equal(shiftCalendarMonth('2026-12-31', 1), '2027-01-01');
  assert.equal(shiftCalendarMonth('2026-03-31', -1), '2026-02-01');
  assert.equal(shiftCalendarMonth('2026-01-01', -1), '2025-12-01');
});

test('date-only display never shifts to an adjacent day', () => {
  assert.equal(formatCalendarDate('2026-11-05', 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), '5 November 2026');
  assert.equal(formatCalendarDate('2026-11-02', 'en-GB', { weekday: 'long' }), 'Monday');
});

const cards = [
  { id: 'SQ-1', title: 'Repair the bridge', location_address: 'Semey', type: 'problem', status: 'new', created_at: '2026-11-05T18:00:00Z' },
  { id: 'SQ-2', title: 'A new park', location_address: 'Central district', type: 'idea', status: 'resolved', created_at: '2026-11-05T20:00:00Z' },
  { id: 'SQ-3', title: 'Street lights', location_address: 'Semey', type: 'problem', status: 'new', created_at: '2026-11-05T19:30:00Z' },
];

test('type, status and search combine without changing the source list', () => {
  const before = structuredClone(cards);
  const filtered = filterCalendarRequests(cards, { type: 'problem', status: 'new', query: ' SEMEY ' });
  assert.deepEqual(filtered.map((card) => card.id), ['SQ-3', 'SQ-1']);
  assert.deepEqual(cards, before);
  assert.deepEqual(filterCalendarRequests(cards, { type: 'idea', status: 'new', query: '' }), []);
  assert.deepEqual(filterCalendarRequests(cards, { type: 'all', status: 'all', query: 'sq-2' }).map((card) => card.id), ['SQ-2']);
  assert.deepEqual(filterCalendarRequests(cards, { type: 'all', status: 'all', query: 'BRIDGE' }).map((card) => card.id), ['SQ-1']);
});

test('grouping includes both card types once, on their real submission dates', () => {
  const grouped = groupCalendarRequests(filterCalendarRequests(cards, { type: 'all', status: 'all', query: '' }));
  assert.deepEqual(grouped.get('2026-11-05').map((card) => card.id), ['SQ-1']);
  assert.deepEqual(grouped.get('2026-11-06').map((card) => card.id), ['SQ-2', 'SQ-3']);
  assert.equal([...grouped.values()].flat().length, cards.length);
  assert.equal(groupCalendarRequests([{ ...cards[0], created_at: 'invalid' }]).size, 0);
  assert.equal(groupCalendarRequests([]).size, 0);
});
