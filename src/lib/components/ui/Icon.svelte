<script lang="ts">
	// The site's small line icons, drawn on a 24 grid with one stroke weight so
	// they sit together as a set. Decorative: always paired with a word.
	let { name, size = 20 }: { name: string; size?: number } = $props();

	const paths: Record<string, string> = {
		arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
		layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
		shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
		identity:
			'<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="10.5" r="2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M15 10h3.2M15 13.5h3.2"/>',
		key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16 7l3 3M13.5 9.5l2 2"/>',
		lock: '<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
		nodes:
			'<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="m8 11 8-4M8 13l8 4"/>',
		flow: '<rect x="3" y="4" width="6" height="6" rx="1.6"/><rect x="15" y="4" width="6" height="6" rx="1.6"/><rect x="9" y="15" width="6" height="6" rx="1.6"/><path d="M6 10v2.5A1.5 1.5 0 0 0 7.5 14H12v1M18 10v2.5a1.5 1.5 0 0 1-1.5 1.5H12"/>',
		pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6H21"/>',
		audit: '<path d="M10 6h10M10 12h10M10 18h10"/><path d="m4 6 1 1 1.7-2M4 12l1 1 1.7-2M4 18l1 1 1.7-2"/>',
		grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.8"/>',
		plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>',
		open: '<path d="m8 6-5 6 5 6M16 6l5 6-5 6M13.5 4l-3 16"/>',
		neutral: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
		extend:
			'<rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><path d="M17.25 14v6.5M14 17.25h6.5"/>',
		robot:
			'<rect x="4" y="9" width="16" height="8" rx="2.5"/><circle cx="8" cy="19.2" r="1.6"/><circle cx="16" cy="19.2" r="1.6"/><path d="M12 9V6.2"/><circle cx="12" cy="5" r="1.2"/><path d="M8 13h.01M16 13h.01"/>',
		arm: '<path d="M4 20h10M7 20v-7l6-6 5 3"/><circle cx="7" cy="13" r="1.4"/><circle cx="13" cy="7" r="1.4"/><path d="m18 10 2 1.2M18 10l-.600 2.3"/>',
		vehicle:
			'<path d="M3 16V7.5A1.5 1.5 0 0 1 4.5 6H13v10M13 9.5h4l3.5 3.5V16H13"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
		field: '<path d="m3 19 6-10 4 6 2.5-3.5L21 19H3Z"/><circle cx="17" cy="6" r="1.6"/>',
		agent: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m7 10 3 2-3 2M12.5 14H17"/>',
		compute:
			'<rect x="6" y="6" width="12" height="12" rx="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
		pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
		calendar: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
		building:
			'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7.5h1.5M13.5 7.5H15M9 11.5h1.5M13.5 11.5H15M10 21v-4h4v4"/>',
		check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
		clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
		ban: '<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>'
	};
</script>

<svg
	class="icon"
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{@html paths[name] ?? ''}
</svg>

<style>
	.icon {
		display: block;
		flex: none;
	}
</style>
