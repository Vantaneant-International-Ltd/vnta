<script lang="ts">
	// The background at the top of the robotics page: a warehouse floor seen
	// from above. Points joined by routes, the way a VDA 5050 order is a list
	// of nodes and edges, and a few robots driving from point to point. A
	// route lights up behind a robot and fades. Decoration only: hidden from
	// screen readers, still for anyone who asks for less motion, and paused
	// when it is off screen or the tab is hidden.
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const BLUE = '31, 85, 214';

		type Node = { x: number; y: number };
		type Robot = { from: number; to: number; p: number; speed: number; prev: number };
		let w = 0;
		let h = 0;
		let cols = 0;
		let rows = 0;
		let nodes: Node[] = [];
		let edges = new Map<string, number>(); // "a-b" -> how lit, 0..1
		let robots: Robot[] = [];

		let seed = 7;
		const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
		const key = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
		const at = (c: number, r: number) => r * cols + c;

		// Not every crossing is a route: some links are left out, as aisles are.
		let open = new Set<string>();
		function neighbours(i: number) {
			const c = i % cols;
			const r = Math.floor(i / cols);
			const out: number[] = [];
			if (c > 0) out.push(at(c - 1, r));
			if (c < cols - 1) out.push(at(c + 1, r));
			if (r > 0) out.push(at(c, r - 1));
			if (r < rows - 1) out.push(at(c, r + 1));
			return out.filter((j) => open.has(key(i, j)));
		}

		function layout() {
			const rect = canvas.getBoundingClientRect();
			w = rect.width;
			h = rect.height;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			const step = w < 700 ? 64 : 84;
			cols = Math.ceil(w / step) + 1;
			rows = Math.ceil(h / step) + 1;
			const ox = (w - (cols - 1) * step) / 2;
			const oy = (h - (rows - 1) * step) / 2;
			nodes = [];
			for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) nodes.push({ x: ox + c * step, y: oy + r * step });
			seed = 7;
			open = new Set();
			edges = new Map();
			for (let i = 0; i < nodes.length; i++) {
				const c = i % cols;
				const r = Math.floor(i / cols);
				if (c < cols - 1 && rand() < 0.72) open.add(key(i, at(c + 1, r)));
				if (r < rows - 1 && rand() < 0.62) open.add(key(i, at(c, r + 1)));
			}
			const count = w < 700 ? 4 : 9;
			robots = [];
			for (let k = 0; k < count; k++) {
				let i = Math.floor(rand() * nodes.length);
				let tries = 0;
				while (neighbours(i).length === 0 && tries++ < 50) i = Math.floor(rand() * nodes.length);
				const n = neighbours(i);
				robots.push({ from: i, to: n.length ? n[Math.floor(rand() * n.length)] : i, p: rand(), speed: 0.45 + rand() * 0.35, prev: -1 });
			}
		}

		function draw() {
			ctx!.clearRect(0, 0, w, h);
			// The routes.
			ctx!.lineWidth = 1;
			for (const k of open) {
				const [a, b] = k.split('-').map(Number);
				const lit = edges.get(k) ?? 0;
				ctx!.strokeStyle = `rgba(${BLUE}, ${0.1 + lit * 0.45})`;
				ctx!.lineWidth = 1 + lit * 1.2;
				ctx!.beginPath();
				ctx!.moveTo(nodes[a].x, nodes[a].y);
				ctx!.lineTo(nodes[b].x, nodes[b].y);
				ctx!.stroke();
			}
			// The points.
			ctx!.fillStyle = `rgba(${BLUE}, 0.22)`;
			for (const n of nodes) {
				ctx!.beginPath();
				ctx!.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
				ctx!.fill();
			}
			// The robots: a small square, as seen from above, with a soft halo.
			for (const r of robots) {
				const a = nodes[r.from];
				const b = nodes[r.to];
				const e = r.p < 0.5 ? 2 * r.p * r.p : 1 - Math.pow(-2 * r.p + 2, 2) / 2;
				const x = a.x + (b.x - a.x) * e;
				const y = a.y + (b.y - a.y) * e;
				const halo = ctx!.createRadialGradient(x, y, 0, x, y, 18);
				halo.addColorStop(0, `rgba(${BLUE}, 0.25)`);
				halo.addColorStop(1, `rgba(${BLUE}, 0)`);
				ctx!.fillStyle = halo;
				ctx!.beginPath();
				ctx!.arc(x, y, 18, 0, Math.PI * 2);
				ctx!.fill();
				ctx!.fillStyle = `rgba(${BLUE}, 0.85)`;
				ctx!.fillRect(x - 3.5, y - 3.5, 7, 7);
			}
		}

		function step(dt: number) {
			for (const [k, v] of edges) {
				const next = v - dt * 0.22;
				next <= 0 ? edges.delete(k) : edges.set(k, next);
			}
			for (const r of robots) {
				r.p += dt * r.speed;
				edges.set(key(r.from, r.to), 1);
				if (r.p >= 1) {
					// Arrived. Pick the next route, preferring not to turn straight back.
					const n = neighbours(r.to);
					const onward = n.filter((j) => j !== r.from);
					const choice = (onward.length ? onward : n)[Math.floor(rand() * (onward.length || n.length))];
					r.prev = r.from;
					r.from = r.to;
					r.to = choice ?? r.to;
					r.p = 0;
				}
			}
		}

		let frame = 0;
		let last = 0;
		let visible = true;
		function tick(now: number) {
			const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
			last = now;
			step(dt);
			draw();
			frame = requestAnimationFrame(tick);
		}
		const start = () => {
			if (still || frame || !visible || document.hidden) return;
			last = 0;
			frame = requestAnimationFrame(tick);
		};
		const stop = () => {
			cancelAnimationFrame(frame);
			frame = 0;
		};

		layout();
		draw();
		const ro = new ResizeObserver(() => {
			layout();
			draw();
		});
		ro.observe(canvas);
		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			visible ? start() : stop();
		});
		io.observe(canvas);
		const onVis = () => (document.hidden ? stop() : start());
		document.addEventListener('visibilitychange', onVis);
		start();

		return () => {
			stop();
			ro.disconnect();
			io.disconnect();
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<canvas class="routes" bind:this={canvas} aria-hidden="true"></canvas>

<style>
	.routes {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		/* Faint behind the words on the left, fuller towards the right. */
		-webkit-mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.65) 40%, #000 70%);
		mask-image: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.65) 40%, #000 70%);
	}
</style>
