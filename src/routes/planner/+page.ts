import type { Collection } from '$lib';

export function load({ url }) {
	const name = url.searchParams.get('name') || '';
	const email = url.searchParams.get('email') || '';
	const showLinksOnCoverPage = url.searchParams.get('showLinksOnCoverPage') === '1';
	const showLinksOnSideNav = (url.searchParams.get('showLinksOnSideNav') || '1') === '1';
	const showLinksOnTopNav = url.searchParams.get('showLinksOnTopNav') === '1';
	const startWeekOnSunday = url.searchParams.get('startWeekOnSunday') === '1';
	const disableCoverPage = url.searchParams.get('disableCoverPage') === '1';
	const disableQuarters = url.searchParams.get('disableQuarters') === '1';
	const disableYears = url.searchParams.get('disableYears') === '1';
	const disableMonths = url.searchParams.get('disableMonths') === '1';
	const disableWeeks = url.searchParams.get('disableWeeks') === '1';
	const disableDays = url.searchParams.get('disableDays') === '1';
	const aspectRatio = +(url.searchParams.get('aspectRatio') || '') || 0.75;
	const sidebarWidth = +(url.searchParams.get('sidebarWidth ') || '') || 52;
	const topbarHeight = +(url.searchParams.get('topbarHeight ') || '') || 45;
	const timezoneOffset =
		+(url.searchParams.get('timezoneOffset') || '') ||
		new Date().getTimezoneOffset() / 60;
	const today = new Date(
		new Date().setUTCHours(0, 0, 0, 0) + timezoneOffset * 60 * 60 * 1000,
	);
	const defaultStart = new Date();
	if (defaultStart.getMonth() > 6) {
		defaultStart.setFullYear(defaultStart.getFullYear() + 1);
	}
	defaultStart.setMonth(0);
	defaultStart.setDate(1);
	defaultStart.setHours(0, 0, 0, 0);
	const defaultEnd = new Date(defaultStart.getTime());
	defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
	defaultEnd.setDate(0);
	const start = new Date(+(url.searchParams.get('start') || 0) || defaultStart.getTime());
	const end = new Date(+(url.searchParams.get('end') || 0) || defaultEnd.getTime());

	const collections = !url.searchParams.get('collections')
		? ([
				{
					id: 'notes',
					name: 'Notes',
					total: 40,
					type: 'dotted',
				},
				{
					id: 'goals',
					name: 'Goals',
					total: 40,
					type: 'year-checkbox',
				},
			] as Collection[])
		: (JSON.parse(url.searchParams.get('collections') || '[]') as Collection[]);
	return {
		name,
		email,
		today,
		start,
		end,
		collections,
		aspectRatio,
		sidebarWidth,
		topbarHeight,
		showLinksOnCoverPage,
		showLinksOnSideNav,
		showLinksOnTopNav,
		startWeekOnSunday,
		disableCoverPage,
		disableQuarters,
		disableYears,
		disableMonths,
		disableWeeks,
		disableDays,
	};
}
