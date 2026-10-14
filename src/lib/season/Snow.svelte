<script lang="ts">
	// A light snowfall: few flakes, falling slowly, drifting a little. Over the
	// page but never in the way: it cannot be clicked, screen readers skip it,
	// and it stays still (a few flakes resting) for anyone who asks for less
	// motion. Paused when the tab is hidden.
	import { onMount } from 'svelte';
	import { lessMotion } from './season';

	let {
		colour = '168, 184, 208',
		count = 42,
		fixed = true,
		warm = false
	}: { colour?: string; count?: number; fixed?: boolean; warm?: boolean } = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		let w = 0;
		let h = 0;
		type Flake = { x: number; y: number; r: number; v: number; sway: number; phase: number; a: number };
		let flakes: Flake[] = [];
		const make = (top: boolean): Flake => ({
			x: Math.random() * w,
			y: top ? -10 - Math.random() * 40 : Math.random() * h,
			r: 1.3 + Math.random() * (warm ? 2 : 2.6),
			v: 12 + Math.random() * 22,
			sway: 6 + Math.random() * 14,
			phase: Math.random() * Math.PI * 2,
			a: 0.55 + Math.random() * 0.4
		});

		function layout() {
			const r = canvas.getBoundingClientRect();
			w = r.width;
			h = r.height;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
			const n = Math.round(w < 700 ? count * 0.55 : count);
			flakes = Array.from({ length: n }, () => make(false));
		}

		let t = 0;
		function draw() {
			ctx!.clearRect(0, 0, w, h);
			for (const f of flakes) {
				const x = f.x + Math.sin(t * 0.6 + f.phase) * f.sway;
				if (warm) {
					const g = ctx!.createRadialGradient(x, f.y, 0, x, f.y, f.r * 4);
					g.addColorStop(0, `rgba(${colour}, ${f.a})`);
					g.addColorStop(1, `rgba(${colour}, 0)`);
					ctx!.fillStyle = g;
					ctx!.beginPath();
					ctx!.arc(x, f.y, f.r * 4, 0, Math.PI * 2);
					ctx!.fill();
				} else {
					// A soft, solid flake in a cold blue-grey: pure white would
					// vanish on a white page.
					const g = ctx!.createRadialGradient(x, f.y, 0, x, f.y, f.r * 1.6);
					g.addColorStop(0, `rgba(${colour}, ${f.a})`);
					g.addColorStop(0.55, `rgba(${colour}, ${f.a * 0.8})`);
					g.addColorStop(1, `rgba(${colour}, 0)`);
					ctx!.fillStyle = g;
					ctx!.beginPath();
					ctx!.arc(x, f.y, f.r * 1.6, 0, Math.PI * 2);
					ctx!.fill();
				}
			}
		}

		let frame = 0;
		let last = 0;
		function tick(now: number) {
			const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
			last = now;
			t += dt;
			for (let i = 0; i < flakes.length; i++) {
				const f = flakes[i];
				f.y += f.v * dt;
				if (f.y > h + 10) flakes[i] = make(true);
			}
			draw();
			frame = requestAnimationFrame(tick);
		}
		const start = () => {
			if (lessMotion() || frame || document.hidden) return;
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
		const onVis = () => (document.hidden ? stop() : start());
		document.addEventListener('visibilitychange', onVis);
		start();
		return () => {
			stop();
			ro.disconnect();
			document.removeEventListener('visibilitychange', onVis);
		};
	});
</script>

<canvas class="snow" class:snow--fixed={fixed} bind:this={canvas} aria-hidden="true"></canvas>

<style>
	.snow {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 2;
	}
	.snow--fixed {
		position: fixed;
		z-index: 30;
	}
</style>
