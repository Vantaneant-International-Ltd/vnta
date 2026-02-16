const roles: Role[] = [
	{
		id: 'sales-executive-trial',
		title: 'Sales Executive (Trial)',
		meta: '14-day trial · Independent contractor · High commission contract',
		status: 'Open',
		applySubject: 'VNTA Sales Executive (Trial) — Application',
		applyLead:
			'Outcome-defined. Pre-launch. Your job is to secure first placements and build commercial traction.',
		form: { requiresCv: true, requiresPortfolio: false, ackPay: true },
		sections: [
			{
				heading: 'Overview',
				body:
					'Vendr is pre-launch. There are no live locations yet. This is a 14-day trial phase designed to test commercial traction fast. If alignment is clear, it converts into a 6 to 12 month high-commission performance contract.'
			},
			{
				heading: 'Structure',
				bullets: [
					'14-day full immersion trial',
					'Company resources provided',
					'Free daily lunch',
					'End-of-trial performance review',
					'6 to 12 month contract offered to top performers'
				]
			},
			{
				heading: 'What you will do',
				bullets: [
					'Secure meetings',
					'Pitch Vendr Stations across B2B and B2I',
					'Acquire clients',
					'Lock commercial locations',
					'Build and manage pipeline',
					'Track conversions and territory signal'
				]
			},
			{
				heading: 'Trial requirement',
				body:
					'Maintain a detailed activity log for the full 14-day period and submit it at the end. We measure traction, not effort.',
				bullets: [
					'Meetings held',
					'Prospects contacted',
					'Sales closed',
					'Locations secured',
					'Partnerships explored',
					'Revenue generated or forecasted',
					'Strategy adjustments'
				]
			},
			{
				heading: 'Compensation (post-trial contract)',
				bullets: [
					'10 to 12.5 percent commission on all sales',
					'1,000 EUR annual performance bonus',
					'Additional percentage on campaigns you contribute to',
					'Performance incentives and company benefits',
					'No fixed retainer at this stage (retainer may be introduced once revenue positive)'
				]
			},
			{
				heading: 'Who this fits',
				bullets: [
					'Self-directed operators',
					'Commercially sharp closers',
					'People who want an early footprint and can execute without hand-holding'
				]
			}
		]
	},
	{
		id: 'vendr-cinematic-artist',
		title: 'Cinematic Artist (Vendr)',
		meta:
			'Contract engagement · Hybrid (on-site + remote) · Per-unit + performance incentives · Revenue share per campaign',
		status: 'Open',
		applySubject: 'Vendr Cinematic Artist — Application',
		applyLead:
			'Pre-launch teaser mandate. Taste over volume. Cinematic restraint. Build the tone before deployment.',
		form: { requiresCv: true, requiresPortfolio: true, ackPay: false },
		sections: [
			{
				heading: 'Overview',
				body:
					'Vendr is pre-launch. There are no live stations yet. Your first mandate is a teaser campaign that defines tone before deployment. This is not a volume posting role.'
			},
			{
				heading: 'What you will do',
				bullets: [
					'Create cinematic video content and high-signal stills',
					'Direct teaser and campaign visuals',
					'Shape spatial mood and installation tone',
					'Establish brand atmosphere across platforms',
					'Operate solo or with a small setup for lighting and post as needed'
				]
			},
			{
				heading: 'How this works',
				bullets: [
					'Hybrid: on-site for filming, photography and key moments; remote for editing and ideation',
					'Per-unit compensation plus performance incentives and campaign revenue share',
					'You will lead and build your team as we scale'
				]
			},
			{
				heading: 'Compensation',
				bullets: [
					'150 to 200 EUR per cinematic video',
					'30 EUR per still image',
					'250 EUR per on-site filming session including 8 to 10 edited select images',
					'3 to 5 percent revenue share on assigned campaigns',
					'500 EUR bonus for exceptional work shown',
					'5 EUR per 1,000 views capped at 500 EUR per cinematic release'
				]
			},
			{
				heading: 'Signals / tools',
				bullets: [
					'Cinematography and lighting instincts (teaser sensibility)',
					'DaVinci Resolve, Adobe suite (or equivalents)',
					'Strong portfolio required'
				]
			},
			{
				heading: 'Who should not apply',
				bullets: [
					'Quantity-over-quality content spammers',
					'People who treat every platform the same',
					'Those who need heavy structure, constant feedback, or day-to-day management'
				]
			}
		]
	}
];
