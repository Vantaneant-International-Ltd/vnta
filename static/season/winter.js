/*
 * VNTA winter, for sites that are not built from this repository (the
 * Carbon Wheels Shopify store, and any other brand added later). Add it as
 * a script tag:
 *
 *   https://vnta.xyz/season/winter.js?colour=%23c9d3df&count=60
 *
 * It shows falling snow (magic-snowflakes, MIT, see snowflakes.LICENSE.txt)
 * from 14 October to 6 January by the visitor's clock, and nothing otherwise.
 * ?season=winter or ?season=off on the page's own address overrides the date.
 * Nothing is shown to anyone who asks for less motion.
 */
(function () {
	var me = document.currentScript;
	var opts = new URL(me && me.src ? me.src : location.href).searchParams;
	var ask = new URLSearchParams(location.search).get('season');
	var now = new Date();
	var m = now.getMonth() + 1;
	var d = now.getDate();
	var inSeason = (m > 10 || (m === 10 && d >= 14)) || (m === 1 && d <= 6);
	if (ask === 'off' || (!inSeason && ask !== 'winter')) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	var base = me && me.src ? me.src.replace(/winter\.js.*$/, '') : 'https://vnta.xyz/season/';
	var count = parseInt(opts.get('count') || '60', 10);
	var lib = document.createElement('script');
	lib.src = base + 'snowflakes.min.js';
	lib.onload = function () {
		if (!window.Snowflakes) return;
		new window.Snowflakes({
			color: opts.get('colour') || '#c9d3df',
			count: window.innerWidth < 700 ? Math.round(count / 2) : count,
			minSize: 8,
			maxSize: 20,
			minOpacity: 0.45,
			maxOpacity: 0.95,
			speed: 0.8,
			zIndex: 9999
		});
		var style = document.createElement('style');
		style.textContent = '.snowflakes{pointer-events:none}';
		document.head.appendChild(style);
	};
	document.head.appendChild(lib);
})();
