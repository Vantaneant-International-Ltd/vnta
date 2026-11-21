// The browser half of passkeys. The device (phone, laptop, security key) does the secret part;
// this file only carries messages between it and the server.
import { startRegistration, startAuthentication, browserSupportsWebAuthn } from '@simplewebauthn/browser';
import { api, ApiFailure } from './api';

export const passkeysSupported = () => typeof window !== 'undefined' && browserSupportsWebAuthn();

/** Turns the browser's own errors into plain words. Cancelling is not an error worth shouting about. */
function plain(e: unknown, doing: 'add' | 'sign in'): never {
	if (e instanceof ApiFailure) throw e;
	const name = e instanceof Error ? e.name : '';
	if (name === 'NotAllowedError' || name === 'AbortError') throw new ApiFailure(0, doing === 'add' ? 'No passkey was added.' : 'No passkey was used. You can try again, or use an emailed code.');
	if (name === 'InvalidStateError') throw new ApiFailure(0, 'This device already has a passkey for VNTA.');
	throw new ApiFailure(0, doing === 'add' ? 'This device could not make a passkey.' : 'This device could not use a passkey.');
}

export async function addPasskey(name: string): Promise<void> {
	try {
		const { options, challengeId } = await api.passkeyRegisterOptions();
		const response = await startRegistration({ optionsJSON: options });
		await api.passkeyRegisterVerify(challengeId, response, name);
	} catch (e) {
		plain(e, 'add');
	}
}

export async function signInWithPasskey(): Promise<void> {
	try {
		const { options, challengeId } = await api.passkeySigninOptions();
		const response = await startAuthentication({ optionsJSON: options });
		await api.passkeySigninVerify(challengeId, response);
	} catch (e) {
		plain(e, 'sign in');
	}
}
