
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/api" | "/api/submit-application" | "/approach" | "/careers" | "/explore" | "/horizon" | "/houses" | "/legal" | "/pricing" | "/privacy" | "/terms";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/api": Record<string, never>;
			"/api/submit-application": Record<string, never>;
			"/approach": Record<string, never>;
			"/careers": Record<string, never>;
			"/explore": Record<string, never>;
			"/horizon": Record<string, never>;
			"/houses": Record<string, never>;
			"/legal": Record<string, never>;
			"/pricing": Record<string, never>;
			"/privacy": Record<string, never>;
			"/terms": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/api" | "/api/" | "/api/submit-application" | "/api/submit-application/" | "/approach" | "/approach/" | "/careers" | "/careers/" | "/explore" | "/explore/" | "/horizon" | "/horizon/" | "/houses" | "/houses/" | "/legal" | "/legal/" | "/pricing" | "/pricing/" | "/privacy" | "/privacy/" | "/terms" | "/terms/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/CNAME" | "/favicon.svg" | "/main-dark.png" | "/main-light.png" | "/partners/felixto.png" | "/robots.txt" | "/secondary-dark.png" | "/secondary-light.png" | "/vnta-directional-horizon.svg" | string & {};
	}
}