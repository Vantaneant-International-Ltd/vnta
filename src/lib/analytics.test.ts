// Run: npm test. The app must never send anything to Google Analytics.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trackPageView, isAppPath } from './analytics.ts';

function withWindow(fn: (calls: unknown[][], w: Record<string, unknown>) => void) {
	const calls: unknown[][] = [];
	const w: Record<string, unknown> = { gtag: (...a: unknown[]) => void calls.push(a) };
	(globalThis as any).window = w;
	(globalThis as any).document = { title: 'T' };
	try {
		fn(calls, w);
	} finally {
		delete (globalThis as any).window;
		delete (globalThis as any).document;
	}
}

test('app paths are recognised, and look-alikes are not', () => {
	for (const p of ['/app', '/app/', '/app/inbox', '/app/settings']) assert.equal(isAppPath(p), true, p);
	for (const p of ['/', '/apple', '/applications', '/studio', '/privacy']) assert.equal(isAppPath(p), false, p);
});

test('nothing is sent from inside the app, including document addresses', () => {
	withWindow((calls) => {
		trackPageView(new URL('https://vnta.xyz/app/inbox?doc=abc123'));
		trackPageView(new URL('https://vnta.xyz/app'));
		assert.equal(calls.length, 0);
	});
});

test('moving from a public page into the app switches Google off, and back switches it on', () => {
	withWindow((calls, w) => {
		trackPageView(new URL('https://vnta.xyz/'));
		assert.equal(calls.length, 1);
		assert.equal(w['ga-disable-G-81P6Q4C2QR'], false);
		trackPageView(new URL('https://vnta.xyz/app/actions'));
		assert.equal(calls.length, 1, 'no event from the app');
		assert.equal(w['ga-disable-G-81P6Q4C2QR'], true);
		trackPageView(new URL('https://vnta.xyz/privacy'));
		assert.equal(calls.length, 2);
		assert.equal(w['ga-disable-G-81P6Q4C2QR'], false);
	});
});
