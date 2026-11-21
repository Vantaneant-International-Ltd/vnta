// Shared app state: who is signed in, and the person's documents and suggestions.
// Loaded once by the app layout and refreshed after every change.
import { api, ApiFailure, type Doc, type Finding } from './api';

class Session {
	state = $state<'loading' | 'out' | 'in' | 'offline'>('loading');
	email = $state('');
	retentionDays = $state(365);
	documents = $state<Doc[]>([]);
	findings = $state<Finding[]>([]);
	loaded = $state(false);
	error = $state('');

	async init() {
		try {
			const me = await api.me();
			this.email = me.user.email;
			this.retentionDays = me.user.retentionDays;
			this.state = 'in';
			await this.refresh();
		} catch (e) {
			this.state = e instanceof ApiFailure && e.status === 401 ? 'out' : 'offline';
			this.error = e instanceof ApiFailure && e.status !== 401 ? e.message : '';
		}
	}

	async refresh() {
		try {
			const [d, f] = await Promise.all([api.documents(), api.findings()]);
			this.documents = d.documents;
			this.findings = f.findings;
			this.loaded = true;
			this.error = '';
		} catch (e) {
			if (e instanceof ApiFailure && e.status === 401) this.state = 'out';
			else this.error = e instanceof Error ? e.message : 'Could not load your data.';
		}
	}

	/** Replace one finding in place after a change, without waiting for a full reload. */
	patch(f: Finding) {
		this.findings = this.findings.map((x) => (x.id === f.id ? f : x));
	}

	async signOut() {
		try {
			await api.logout();
		} finally {
			this.documents = [];
			this.findings = [];
			this.email = '';
			this.loaded = false;
			this.state = 'out';
		}
	}
}

export const session = new Session();
