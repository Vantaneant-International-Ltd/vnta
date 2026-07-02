// =============================================================================
// VNTA Client Portal — shared content schema
// -----------------------------------------------------------------------------
// Single source of truth for the per-client data shape. Both the portal route
// and the (future) email digest read files typed against this. Keep it framework
// free so it lifts cleanly into a standalone app.
//
// Dates are stored as verbatim strings and rendered as-is (never parsed), so a
// placeholder like "TODO date" shows literally instead of crashing a formatter.
// =============================================================================

export interface PortalClient {
	/** Display name of the managed client. */
	name: string;
	/** Plan label, e.g. "Managed". */
	plan: string;
	/** Client since, e.g. "2026-07". */
	since: string;
	/** Reporting period shown in the masthead, e.g. "August 2026". */
	periodLabel: string;
}

export interface PortalSummary {
	headline: string;
	note: string;
	/** Short status label for this period, e.g. "Operational". Rendered monochrome. */
	siteHealth: string;
}

/** One implementation, feature, or optimisation shipped, in chronological order. */
export interface DeliveryEntry {
	date: string;
	/** Free label: "Feature", "Optimisation", "Launch", etc. */
	category: string;
	title: string;
	detail: string;
}

/** Audit finding counts by severity. `null` means "not yet reported". */
export interface SecurityFindings {
	critical: number | null;
	high: number | null;
	medium: number | null;
	low: number | null;
}

export interface SecurityBlock {
	lastAuditDate: string;
	/** e.g. "Monthly". */
	cadence: string;
	findings: SecurityFindings;
	notes: string[];
}

/** A recurring audit in the register. */
export interface AuditEntry {
	date: string;
	/** e.g. "Security", "Accessibility", "Dependency". */
	type: string;
	/** Outcome, e.g. "Passed", "Scheduled". */
	result: string;
	/** Optional link to the full report. */
	href?: string;
}

/** A Lighthouse run, scores 0 to 100. null until measured. */
export interface PerformanceReport {
	date: string;
	/** e.g. "Mobile". */
	profile: string;
	performance: number | null;
	accessibility: number | null;
	bestPractices: number | null;
	seo: number | null;
}

export interface FileEntry {
	name: string;
	/** e.g. "PDF". */
	kind: string;
	href: string;
}

export interface NextUpEntry {
	title: string;
	/** Rough window, e.g. "Aug", "End Sep". */
	eta: string;
}

/** One monitored endpoint, status-page style. */
export interface UptimeMonitor {
	name: string;
	/** e.g. "99.98%". Omit until monitoring has run. */
	uptime?: string;
	/** Up to 90 daily states, oldest first: 0 no data, 1 operational, 2 incident. */
	days?: number[];
}

export interface PortalMonitoring {
	/** Short caption, e.g. "Monitoring begins 1 August". */
	label?: string;
	monitors: UptimeMonitor[];
}

/** One launch-list signup, read live from the client's D1 waitlist. */
export interface WaitlistSignup {
	email: string;
	phone?: string | null;
	source?: string | null;
	created_at: string;
}

export interface PortalWaitlist {
	total: number;
	signups: WaitlistSignup[];
}

/** A recorded operational incident, shown to the client (status-page style). */
export interface IncidentEntry {
	date: string;
	title: string;
	/** One line on who/what was affected. */
	impact: string;
	/** "Resolved", "Monitoring", "Investigating". */
	status: string;
	detail: string;
	/** When it began, e.g. "2 Jul 2026, 17:00". */
	start?: string;
	/** When it was resolved. */
	resolved?: string;
	/** How long it lasted, e.g. "about 55 minutes". */
	duration?: string;
}

export interface PortalData {
	client: PortalClient;
	summary: PortalSummary;
	delivery: DeliveryEntry[];
	incidents?: IncidentEntry[];
	security: SecurityBlock;
	audits: AuditEntry[];
	performance: PerformanceEntry[];
	files: FileEntry[];
	nextUp: NextUpEntry[];
	/** Optional status-page style uptime block (fed live by UptimeRobot). */
	monitoring?: PortalMonitoring;
	/** Optional live launch-list signups (fed live from D1). */
	waitlist?: PortalWaitlist;
}
