// Run: npm run test:extract
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	extract,
	findDates,
	findAmounts,
	parseNumber,
	verifyEvidence,
	documentFingerprint,
	dedupeFindings,
	draftReply,
	type Finding
} from './extract.ts';

const LETTER = `Dear Ms Example,

Your home insurance policy renews on 14 February 2027. The renewal premium is €412.80.
Please confirm by 31 January 2027 that your details are correct.
An appointment has been scheduled for 22 January 2027 at 10:00.
`;

// --- Dates -------------------------------------------------------------------

test('reads written, ISO and unambiguous numeric dates', () => {
	assert.equal(findDates('on 14 February 2027')[0].iso, '2027-02-14');
	assert.equal(findDates('on 14th of Feb 2027')[0].iso, '2027-02-14');
	assert.equal(findDates('on February 14, 2027')[0].iso, '2027-02-14');
	assert.equal(findDates('on 2027-02-14')[0].iso, '2027-02-14');
	assert.equal(findDates('on 25/12/2027')[0].iso, '2027-12-25'); // 25 cannot be a month
	assert.equal(findDates('on 12/25/2027')[0].iso, '2027-12-25');
});

test('an ambiguous date is not resolved, and both readings are kept', () => {
	const [d] = findDates('due 03/04/2027');
	assert.equal(d.ambiguous, true);
	assert.equal(d.iso, null);
	assert.deepEqual(d.candidates.sort(), ['2027-03-04', '2027-04-03']);
});

test('the same day and month is not ambiguous', () => {
	const [d] = findDates('due 05/05/2027');
	assert.equal(d.ambiguous, false);
	assert.equal(d.iso, '2027-05-05');
});

test('impossible dates are never turned into a date', () => {
	assert.equal(findDates('on 31 February 2027')[0].iso, null);
	assert.equal(findDates('on 31/02/2027')[0].iso, null);
	assert.equal(findDates('on 29 February 2027')[0].iso, null); // not a leap year
	assert.equal(findDates('on 29 February 2028')[0].iso, '2028-02-29');
});

test('a two-digit year is flagged, not guessed', () => {
	const [d] = findDates('pay by 14/02/27');
	assert.equal(d.ambiguous, true);
	assert.equal(d.iso, null);
	assert.deepEqual(d.candidates, []);
});

// --- Amounts -----------------------------------------------------------------

test('parses amounts written in either convention', () => {
	assert.equal(parseNumber('1,234.56'), 1234.56);
	assert.equal(parseNumber('1.234,56'), 1234.56);
	assert.equal(parseNumber('12,50'), 12.5);
	assert.equal(parseNumber('1,200'), 1200);
	const a = findAmounts('Total due: €1.234,56 and £20 and 15 EUR');
	assert.deepEqual(a.map((x) => [x.value, x.currency]), [[1234.56, 'EUR'], [20, 'GBP'], [15, 'EUR']]);
});

// --- Findings ----------------------------------------------------------------

test('finds the obligations in a letter, each as a suggestion', () => {
	const r = extract(LETTER);
	assert.equal(r.state, 'ok');
	const kinds = r.findings.map((f) => f.kind);
	assert.ok(kinds.includes('renewal'));
	assert.ok(kinds.includes('response'));
	assert.ok(kinds.includes('appointment'));
	for (const f of r.findings) assert.equal(f.status, 'suggested');
	const renewal = r.findings.find((f) => f.kind === 'renewal')!;
	assert.equal(renewal.date?.iso, '2027-02-14');
	const appt = r.findings.find((f) => f.kind === 'appointment')!;
	assert.equal(appt.date?.iso, '2027-01-22');
	assert.equal(appt.time, '10:00');
});

test('every finding quotes the document exactly, at the place it says', () => {
	const r = extract(LETTER);
	for (const f of r.findings) {
		assert.equal(LETTER.slice(f.evidence.start, f.evidence.end), f.evidence.quote);
		assert.ok(f.evidence.line >= 1);
	}
	assert.equal(verifyEvidence(LETTER, r.findings).rejected.length, 0);
});

test('"within 14 days" gives no due date and low confidence', () => {
	const r = extract('You must reply within 14 days of the date of this letter.');
	assert.equal(r.findings.length, 1);
	const f = r.findings[0];
	assert.equal(f.date, null);
	assert.match(f.relative ?? '', /within 14 days/i);
	assert.equal(f.confidence, 'low');
	assert.ok(f.notes.length > 0);
});

test('an ambiguous date lowers confidence and explains why', () => {
	const f = extract('Payment is due by 03/04/2027.').findings[0];
	assert.equal(f.confidence, 'low');
	assert.equal(f.date?.iso, null);
	assert.match(f.notes.join(' '), /VNTA has not chosen one/);
});

test('two dates in one sentence are flagged', () => {
	const f = extract('The deadline is 1 March 2027, not 1 February 2027.').findings[0];
	assert.equal(f.confidence, 'medium');
	assert.match(f.notes.join(' '), /more than one date/);
});

test('a payment with an amount and no date is still found, and is not given a date', () => {
	const f = extract('Amount due: €250.00.').findings[0];
	assert.equal(f.kind, 'payment');
	assert.equal(f.amount?.value, 250);
	assert.equal(f.date, null);
});

test('the sender\'s own promise is not the reader\'s deadline', () => {
	assert.equal(extract('We will reply within 14 days.').findings.length, 0);
	assert.equal(extract('You must reply within 14 days of the date of this letter.').findings.length, 1);
});

test('"change your payment date, tell us before <date>" is a deadline, not a payment', () => {
	const f = extract('If you wish to change your payment date, tell us before 14 March 2027.').findings[0];
	assert.equal(f.kind, 'deadline');
	assert.equal(f.date?.iso, '2027-03-14');
});

// --- Failure and noise -------------------------------------------------------

test('no text is reported as no text, not as "nothing needs doing"', () => {
	assert.equal(extract('').state, 'no_text');
	assert.equal(extract('   \n \t ').state, 'no_text');
});

test('text without obligations finds nothing and says so', () => {
	const r = extract('Thank you for staying with us. We hope you enjoyed the garden and the long weekend in 2026.');
	assert.equal(r.state, 'nothing_found');
	assert.equal(r.findings.length, 0);
});

test('a date with no cue is not turned into an action', () => {
	assert.equal(extract('The photograph was taken on 3 June 2019.').findings.length, 0);
});

// --- Hallucination guard -----------------------------------------------------

test('a finding with a quote that is not in the document is rejected', () => {
	const real = extract(LETTER).findings[0];
	const fake: Finding = {
		...real,
		id: 'x',
		evidence: { quote: 'Pay €9,999 by 1 May 2027.', start: 0, end: 25, line: 1 }
	};
	const { kept, rejected } = verifyEvidence(LETTER, [real, fake]);
	assert.deepEqual(kept.map((f) => f.id), [real.id]);
	assert.deepEqual(rejected.map((f) => f.id), ['x']);
});

test('a finding whose date is not in its own quote is rejected', () => {
	const real = extract(LETTER).findings.find((f) => f.kind === 'renewal')!;
	const lie: Finding = { ...real, id: 'lie', date: { ...real.date!, raw: '1 May 2030', iso: '2030-05-01', candidates: ['2030-05-01'] } };
	assert.equal(verifyEvidence(LETTER, [lie]).rejected.length, 1);
});

// --- Duplicates --------------------------------------------------------------

test('the same document with different spacing and case has the same fingerprint', async () => {
	const a = await documentFingerprint(LETTER);
	const b = await documentFingerprint(LETTER.toUpperCase().replace(/\n/g, '\r\n\r\n   '));
	assert.equal(a, b);
	assert.notEqual(a, await documentFingerprint(LETTER + ' Extra.'));
});

test('duplicate findings collapse to one', () => {
	const doubled = extract(LETTER + '\n' + LETTER).findings;
	assert.ok(doubled.length > dedupeFindings(doubled).length);
	assert.equal(dedupeFindings(doubled).length, extract(LETTER).findings.length);
});

// --- Drafts ------------------------------------------------------------------

test('a draft is a draft: not sent, with blanks only the person can fill', () => {
	const d = draftReply(extract(LETTER).findings[0]);
	assert.equal(d.status, 'draft');
	assert.equal(d.sent, false);
	assert.match(d.body, /\[Your name\]/);
});
