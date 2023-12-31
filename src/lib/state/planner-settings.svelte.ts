import { objectDiff } from '$lib';

export class PlannerSettings {
	name = $state('');
	email = $state('');
	showLinksOnCoverPage = $state(false);
	showLinksOnSideNav = $state(true);
	showLinksOnTopNav = $state(false);
	startWeekOnSunday = $state(false);
	disableCoverPage = $state(false);
	disableQuarters = $state(false);
	disableYears = $state(false);
	disableMonths = $state(false);
	disableWeeks = $state(false);
	disableDays = $state(false);
	aspectRatio = $state(0.75);
	sidebarWidth = $state(52);
	topbarHeight = $state(45);
	timezoneOffset = $state(new Date().getTimezoneOffset() / 60);
	today = $state(
		new Date(new Date().setUTCHours(0, 0, 0, 0) + this.timezoneOffset * 60 * 60 * 1000),
	);
	start = $state(
		new Date(new Date().setUTCHours(0, 0, 0, 0) + this.timezoneOffset * 60 * 60 * 1000),
	);
	end = $state(new Date());
	collections = $state([]);

	private initialSettings: ReturnType<PlannerSettings['serialize']> | undefined =
		undefined;

	edits = $derived(
		!this.initialSettings
			? {}
			: objectDiff({ prev: this.initialSettings, next: this.serialize() }).diff,
	);

	constructor(initialState: string) {
		this.deserialize(initialState);
		this.initialSettings = this.serialize();
	}

	private serialize() {
		return {
			name: this.name,
			email: this.email,
			today: this.today,
			start: this.start,
			end: this.end,
			collections: this.collections,
			aspectRatio: this.aspectRatio,
			sidebarWidth: this.sidebarWidth,
			topbarHeight: this.topbarHeight,
			showLinksOnCoverPage: this.showLinksOnCoverPage,
			showLinksOnSideNav: this.showLinksOnSideNav,
			showLinksOnTopNav: this.showLinksOnTopNav,
			startWeekOnSunday: this.startWeekOnSunday,
			disableCoverPage: this.disableCoverPage,
			disableQuarters: this.disableQuarters,
			disableYears: this.disableYears,
			disableMonths: this.disableMonths,
			disableWeeks: this.disableWeeks,
			disableDays: this.disableDays,
		};
	}

	private deserialize(json: string) {
		const obj = JSON.parse(json);
		if (this.name) this.name = obj.name;
	}

	// private extractFromURL(url: URL) {
	// 	this.name = url.searchParams.get('name') || '';
	// 	const email = url.searchParams.get('email') || '';
	// 	const showLinksOnCoverPage = url.searchParams.get('showLinksOnCoverPage') === '1';
	// 	const showLinksOnSideNav =
	// 		(url.searchParams.get('showLinksOnSideNav') || '1') === '1';
	// 	const showLinksOnTopNav = url.searchParams.get('showLinksOnTopNav') === '1';
	// 	const startWeekOnSunday = url.searchParams.get('startWeekOnSunday') === '1';
	// 	const disableCoverPage = url.searchParams.get('disableCoverPage') === '1';
	// 	const disableQuarters = url.searchParams.get('disableQuarters') === '1';
	// 	const disableYears = url.searchParams.get('disableYears') === '1';
	// 	const disableMonths = url.searchParams.get('disableMonths') === '1';
	// 	const disableWeeks = url.searchParams.get('disableWeeks') === '1';
	// 	const disableDays = url.searchParams.get('disableDays') === '1';
	// 	const aspectRatio = +(url.searchParams.get('aspectRatio') || '') || 0.75;
	// 	const sidebarWidth = +(url.searchParams.get('sidebarWidth ') || '') || 52;
	// 	const topbarHeight = +(url.searchParams.get('topbarHeight ') || '') || 45;
	// 	const timezoneOffset =
	// 		+(url.searchParams.get('timezoneOffset') || '') ||
	// 		new Date().getTimezoneOffset() / 60;
	// 	const today = new Date(
	// 		new Date().setUTCHours(0, 0, 0, 0) + timezoneOffset * 60 * 60 * 1000,
	// 	);
	// 	const defaultStart = new Date();
	// 	if (defaultStart.getMonth() > 6) {
	// 		defaultStart.setFullYear(defaultStart.getFullYear() + 1);
	// 	}
	// 	defaultStart.setMonth(0);
	// 	defaultStart.setDate(1);
	// 	defaultStart.setHours(0, 0, 0, 0);
	// 	const defaultEnd = new Date(defaultStart.getTime());
	// 	defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
	// 	defaultEnd.setDate(0);
	// 	const start = new Date(
	// 		+(url.searchParams.get('start') || 0) || defaultStart.getTime(),
	// 	);
	// 	const end = new Date(+(url.searchParams.get('end') || 0) || defaultEnd.getTime());

	// 	const collections = !url.searchParams.get('collections')
	// 		? ([
	// 				{
	// 					id: 'notes',
	// 					name: 'Notes',
	// 					total: 40,
	// 					type: 'dotted',
	// 				},
	// 				{
	// 					id: 'goals',
	// 					name: 'Goals',
	// 					total: 40,
	// 					type: 'year-checkbox',
	// 				},
	// 			] as Collection[])
	// 		: (JSON.parse(url.searchParams.get('collections') || '[]') as Collection[]);
	// }
}
