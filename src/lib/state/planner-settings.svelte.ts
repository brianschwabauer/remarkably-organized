import { getFirstDayOfWeek, getUTCDate, objectDiff, type Collection } from '$lib';

type PageTemplate =
	| 'blank'
	| 'grid'
	| 'grid-large'
	| 'dotted'
	| 'dotted-large'
	| 'lined'
	| 'lined-large'
	| 'numbered'
	| 'numbered-large'
	| 'year-checkbox'
	| 'month-checkbox';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepPartial<T> = T extends { [key: string]: any }
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

export interface Timeframe {
	/** A unique identifier for this timeframe used for linking to its page */
	id: string;

	/** The first day of the timeframe */
	start: Date;

	/** The last day of the timeframe */
	end: Date;

	/** The start of the timeframe rounded down to the nearest start of week */
	weekStart: Date;

	/** The user-displayable short name of the timeframe */
	nameShort: string;

	/** The user-displayable long name of the timeframe */
	nameLong: string;

	/** The year this timeframe references */
	year?: number;

	/** The 1-indexed quarter */
	quarter?: number;

	/** The 1-indexed month (January is '1') */
	month?: number;

	/** The 1-indexed week from the start of the year */
	weekSinceYear?: number;

	/** The 1-indexed week from the start of the month */
	weekSinceMonth?: number;

	/** The 1-indexed day from the start of the year (1-365) */
	daySinceYear?: number;

	/** The 1-indexed week from the start of the month (1-31) */
	daySinceMonth?: number;

	/** The 1-indexed week from the start of the week (1-7) */
	daySinceWeek?: number;
}

export interface Year
	extends Omit<
		Timeframe,
		| 'quarter'
		| 'month'
		| 'weekSinceYear'
		| 'weekSinceMonth'
		| 'daySinceYear'
		| 'daySinceMonth'
		| 'daySinceWeek'
	> {
	/** The year this timeframe references */
	year: number;
}

export interface Quarter extends Year {
	/** The 1-indexed quarter */
	quarter: number;
}

export interface Month extends Quarter {
	/** The 1-indexed month (January is '1') */
	month: number;
}

export interface Week extends Month {
	/** The 1-indexed week from the start of the year */
	weekSinceYear: number;

	/** The 1-indexed week from the start of the month */
	weekSinceMonth: number;
}

export interface Day extends Week {
	/** The 1-indexed day from the start of the year (1-365) */
	daySinceYear: number;

	/** The 1-indexed week from the start of the month (1-31) */
	daySinceMonth: number;

	/** The 1-indexed week from the start of the week (1-7) */
	daySinceWeek: number;
}

export class PlannerSettings {
	private initialSettings: ReturnType<PlannerSettings['serialize']> | undefined =
		undefined;

	/** Settings for changing the overall design of the planner */
	readonly design = new (class DesignSettings {
		aspectRatio = $state(0.75);
		width = $state(702);
	})();

	/** Settings for changing the dates of the planner (like start & end dates) */
	readonly date = new (class DateSettings {
		private defaultStart = new Date(
			new Date(
				new Date().setUTCFullYear(
					new Date().getUTCFullYear() + (new Date().getUTCMonth() > 6 ? 1 : 0),
					0,
					1,
				),
			).setUTCHours(0, 0, 0, 0),
		);
		private defaultEnd = new Date(
			new Date(this.defaultStart).setUTCFullYear(
				this.defaultStart.getUTCFullYear() + 1,
				0,
				0,
			),
		);
		timezoneOffset = $state(new Date().getTimezoneOffset() / 60);
		start = $state(this.defaultStart);
		end = $state(this.defaultEnd);
		today = $state(new Date(new Date().setUTCHours(0, 0, 0, 0)));
		startWeekOnSunday = $state(false);
	})();

	/** Settings for changing the side navigation bar display */
	readonly sideNav = new (class SideNavSettings {
		disable = $state(false);
		showCollectionLinks = $state(true);
		width = $state(52);
		font = $state('');
	})();

	/** Settings for changing the top navigation bar display */
	readonly topNav = new (class TopNavSettings {
		disable = $state(false);
		showCollectionLinks = $state(false);
		height = $state(45);
		font = $state('');
	})();

	/** Settings for changing the cover page display */
	readonly coverPage = new (class CoverPageSettings {
		disable = $state(false);
		name = $state('');
		email = $state('');
		title = $state('');
		showCollectionLinks = $state(true);
		showCurrentDay = $state(false);
		font = $state('');
		darkBackground = $state(true);
	})();

	/** Settings for changing how the year pages should work */
	readonly yearPage = new (class YearPageSettings {
		disable = $state(false);
		notePagesTemplate = $state('dotted' as PageTemplate);
		notePagesAmount = $state(1);
	})();

	/** Settings for changing how the quarterly pages should work */
	readonly quarterPage = new (class QuarterPageSettings {
		disable = $state(false);
		notePagesTemplate = $state('dotted' as PageTemplate);
		notePagesAmount = $state(1);
	})();

	/** Settings for changing how the monthly pages should work */
	readonly monthPage = new (class MonthPageSettings {
		disable = $state(false);
		notePagesTemplate = $state('dotted' as PageTemplate);
		notePagesAmount = $state(1);
	})();

	/** Settings for changing how the weekly pages should work */
	readonly weekPage = new (class WeekPageSettings {
		disable = $state(false);
		notePagesTemplate = $state('dotted' as PageTemplate);
		notePagesAmount = $state(1);
		useWeekSinceYear = $state(true);
	})();

	/** Settings for changing how the daily pages should work */
	readonly dayPage = new (class DayPageSettings {
		disable = $state(false);
		notePagesTemplate = $state('dotted' as PageTemplate);
		notePagesAmount = $state(1);
	})();

	/** The list of extra note/goals collections in addition to the planner pages */
	collections = $state([
		{
			id: 'notes',
			name: 'Notes',
			total: 40,
			type: 'dotted',
			numIndexPages: 2,
			numPagesPerItem: 1,
		},
		{
			id: 'goals',
			name: 'Goals',
			total: 40,
			type: 'year-checkbox',
			numIndexPages: 1,
			numPagesPerItem: 1,
		},
	] as Collection[]);

	/** The computed list of years within the start/end timeframe in this.date */
	readonly years = $derived(
		// eslint-disable-next-line @typescript-eslint/no-array-constructor
		Array.from(
			{ length: this.date.end.getUTCFullYear() - this.date.start.getUTCFullYear() + 1 },
			(_, i) => {
				const numYears =
					this.date.end.getUTCFullYear() - this.date.start.getUTCFullYear() + 1;
				const year = this.date.start.getUTCFullYear() + i;
				const firstDayOfYear = new Date(`${year}-01-01`);
				const lastDayOfYear = new Date(`${year}-12-31`);
				const start = i === 0 ? new Date(this.date.start.getTime()) : firstDayOfYear;
				const end =
					i === numYears - 1 ? new Date(this.date.end.getTime()) : lastDayOfYear;
				const weekStart = new Date(getFirstDayOfWeek(start, this.date.startWeekOnSunday));
				return {
					id: `${year}`,
					year,
					start,
					end,
					weekStart,
					nameShort: year.toString().slice(-2),
					nameLong: year.toString(),
				} as Year;
			},
		),
	);

	/** The computed list of quarters within the start/end timeframe in this.date */
	readonly quarters = $derived(
		this.years.reduce((acc, year) => {
			const startQuarter = Math.floor(year.start.getUTCMonth() / 3) + 1;
			const endQuarter = Math.floor(year.end.getUTCMonth() / 3) + 1;
			for (let quarter = startQuarter; quarter <= endQuarter; quarter++) {
				const start = getUTCDate(year.start.getUTCFullYear(), (quarter - 1) * 3);
				const end = getUTCDate(year.start.getUTCFullYear(), (quarter - 1) * 3 + 3, 0);
				acc.push({
					id: `${year.year}-q${quarter}`,
					year: year.year,
					quarter,
					start,
					end,
					weekStart: new Date(getFirstDayOfWeek(start, this.date.startWeekOnSunday)),
					nameShort: `Q${quarter}`,
					nameLong: `Quarter ${quarter}`,
				});
			}
			return acc;
		}, [] as Quarter[]),
	);

	/** The computed list of months within the start/end timeframe in this.date */
	readonly months = $derived(
		this.years.reduce((acc, year) => {
			const startMonth = year.start.getUTCMonth() + 1;
			const endMonth = year.end.getUTCMonth() + 1;
			for (let month = startMonth; month <= endMonth; month++) {
				const start = getUTCDate(year.start.getUTCFullYear(), month - 1);
				const end = getUTCDate(year.start.getUTCFullYear(), month, 0);
				const quarter = Math.floor((month - 1) / 3) + 1;
				acc.push({
					id: `${year.year}-${month}`,
					year: year.year,
					quarter,
					month,
					start,
					end,
					weekStart: new Date(getFirstDayOfWeek(start, this.date.startWeekOnSunday)),
					nameShort: start.toLocaleDateString('default', {
						timeZone: 'UTC',
						month: 'short',
					}),
					nameLong: start.toLocaleDateString('default', {
						timeZone: 'UTC',
						month: 'long',
					}),
				});
			}
			return acc;
		}, [] as Month[]),
	);

	/** The computed list of weeks within the start/end timeframe in this.date */
	readonly weeks = $derived(
		this.years.reduce((acc, year) => {
			const firstDay = year.weekStart.getTime();
			const numWeeks = Math.floor((year.end.getTime() - firstDay) / 604800000) + 1;
			for (let week = 1; week <= numWeeks; week++) {
				const start = new Date(firstDay + (week - 1) * 604800000);
				const end = new Date(start.getTime() + 86400000 * 6);
				const month = start.getUTCMonth() + 1;
				const quarter = Math.floor((month - 1) / 3) + 1;
				const firstWeekDayOfMonth = new Date(
					getFirstDayOfWeek(getUTCDate(year.year, month - 1)),
				);
				const weekSinceMonth = Math.floor(
					(start.getTime() - firstWeekDayOfMonth.getTime()) / 604800000,
				);
				acc.push({
					id: `${year.year}-wk${week}`,
					year: year.year,
					quarter,
					month,
					weekSinceYear: week,
					weekSinceMonth,
					start,
					end,
					weekStart: start,
					nameShort: `WK${week}`,
					nameLong: `Week ${week}`,
				});
			}
			return acc;
		}, [] as Week[]),
	);

	/** The computed list of days within the start/end timeframe in this.date */
	readonly days = $derived(
		this.years.reduce((acc, year) => {
			const firstDay = year.start.getTime();
			const numDays = Math.floor((year.end.getTime() - firstDay) / 86400000) + 1;
			for (let day = 1; day <= numDays; day++) {
				const start = new Date(firstDay + (day - 1) * 86400000);
				const month = start.getUTCMonth() + 1;
				const quarter = Math.floor((month - 1) / 3) + 1;
				const firstWeekDayOfMonth = new Date(
					getFirstDayOfWeek(getUTCDate(year.year, month - 1)),
				);
				acc.push({
					id: `${year.year}-${month}-${day}`,
					year: year.year,
					quarter,
					month,
					weekSinceYear:
						Math.floor((start.getTime() - year.weekStart.getTime()) / 604800000) + 1,
					weekSinceMonth:
						Math.floor((start.getTime() - firstWeekDayOfMonth.getTime()) / 604800000) + 1,
					daySinceYear: (start.getTime() - year.start.getTime()) / 86400000 + 1,
					daySinceMonth: start.getUTCDate(),
					daySinceWeek:
						((start.getUTCDay() - (this.date.startWeekOnSunday ? 0 : 1) + 7) % 7) + 1,
					start,
					end: start,
					weekStart: start,
					nameShort: start.toLocaleDateString('default', {
						timeZone: 'UTC',
						month: 'short',
						day: 'numeric',
					}),
					nameLong: start.toLocaleDateString('default', {
						timeZone: 'UTC',
						month: 'long',
						weekday: 'short',
						day: 'numeric',
					}),
				});
			}
			return acc;
		}, [] as Day[]),
	);

	/** A computed diff object of the settings that have been changed by the user */
	readonly edits = $derived(
		!this.initialSettings
			? {}
			: objectDiff({
					prev: this.initialSettings,
					next: this.serialize(),
					enableDeepDiff: true,
				}).diff,
	);

	constructor(
		initialState:
			| DeepPartial<ReturnType<PlannerSettings['serialize']>>
			| undefined = undefined,
	) {
		this.initialSettings = this.serialize();
		this.deserialize(initialState);
	}

	/** Serializes the data into a valid JSON format */
	private serialize() {
		return {
			design: {
				aspectRatio: this.design.aspectRatio,
				width: this.design.width,
			},
			date: {
				timezoneOffset: this.date.timezoneOffset,
				start: this.date.start.getTime(),
				end: this.date.end.getTime(),
				today: this.date.today.getTime(),
				startWeekOnSunday: this.date.startWeekOnSunday,
			},
			sideNav: {
				disable: this.sideNav.disable,
				showCollectionLinks: this.sideNav.showCollectionLinks,
				width: this.sideNav.width,
				font: this.sideNav.font,
			},
			topNav: {
				disable: this.topNav.disable,
				showCollectionLinks: this.topNav.showCollectionLinks,
				height: this.topNav.height,
				font: this.topNav.font,
			},
			coverPage: {
				disable: this.coverPage.disable,
				title: this.coverPage.title,
				showCollectionLinks: this.coverPage.showCollectionLinks,
				font: this.coverPage.font,
				darkBackground: this.coverPage.darkBackground,
				showCurrentDay: this.coverPage.showCurrentDay,
			},
			yearPage: {
				disable: this.yearPage.disable,
				notePagesTemplate: this.yearPage.notePagesTemplate,
				notePagesAmount: this.yearPage.notePagesAmount,
			},
			quarterPage: {
				disable: this.quarterPage.disable,
				notePagesTemplate: this.quarterPage.notePagesTemplate,
				notePagesAmount: this.quarterPage.notePagesAmount,
			},
			monthPage: {
				disable: this.monthPage.disable,
				notePagesTemplate: this.monthPage.notePagesTemplate,
				notePagesAmount: this.monthPage.notePagesAmount,
			},
			weekPage: {
				disable: this.weekPage.disable,
				notePagesTemplate: this.weekPage.notePagesTemplate,
				notePagesAmount: this.weekPage.notePagesAmount,
				useWeekSinceYear: this.weekPage.useWeekSinceYear,
			},
			dayPage: {
				disable: this.dayPage.disable,
				notePagesTemplate: this.dayPage.notePagesTemplate,
				notePagesAmount: this.dayPage.notePagesAmount,
			},
			collections: this.collections.map((collection) => ({
				...collection,
				...(collection.start ? { start: collection.start.getTime() } : {}),
				...(collection.end ? { end: collection.end.getTime() } : {}),
			})),
		};
	}

	/** Initializes the settings state from a serialized JSON state */
	private deserialize(
		state: DeepPartial<ReturnType<PlannerSettings['serialize']>> | undefined = undefined,
	) {
		// Design Settings
		if (state?.design?.aspectRatio !== undefined)
			this.design.aspectRatio = state.design.aspectRatio;
		if (state?.design?.width !== undefined) this.design.width = state.design.width;

		// Date Settings
		if (state?.date?.timezoneOffset !== undefined)
			this.date.timezoneOffset = state.date.timezoneOffset;
		if (state?.date?.start !== undefined) this.date.start = new Date(state.date.start);
		if (state?.date?.end !== undefined) this.date.end = new Date(state.date.end);
		if (state?.date?.today !== undefined) this.date.today = new Date(state.date.today);
		if (state?.date?.startWeekOnSunday !== undefined)
			this.date.startWeekOnSunday = state.date.startWeekOnSunday;

		// Side Nav Settings
		if (state?.sideNav?.disable !== undefined)
			this.sideNav.disable = state.sideNav.disable;
		if (state?.sideNav?.showCollectionLinks !== undefined)
			this.sideNav.showCollectionLinks = state.sideNav.showCollectionLinks;
		if (state?.sideNav?.width !== undefined) this.sideNav.width = state.sideNav.width;
		if (state?.sideNav?.font !== undefined) this.sideNav.font = state.sideNav.font;

		// Top Nav Settings
		if (state?.topNav?.disable !== undefined) this.topNav.disable = state.topNav.disable;
		if (state?.topNav?.showCollectionLinks !== undefined)
			this.topNav.showCollectionLinks = state.topNav.showCollectionLinks;
		if (state?.topNav?.height !== undefined) this.topNav.height = state.topNav.height;
		if (state?.topNav?.font !== undefined) this.topNav.font = state.topNav.font;

		// Cover Page Settings
		if (state?.coverPage?.disable !== undefined)
			this.coverPage.disable = state.coverPage.disable;
		if (state?.coverPage?.title !== undefined)
			this.coverPage.title = state.coverPage.title;
		if (state?.coverPage?.showCollectionLinks !== undefined)
			this.coverPage.showCollectionLinks = state.coverPage.showCollectionLinks;
		if (state?.coverPage?.font !== undefined) this.coverPage.font = state.coverPage.font;
		if (state?.coverPage?.darkBackground !== undefined)
			this.coverPage.darkBackground = state.coverPage.darkBackground;
		if (state?.coverPage?.showCurrentDay !== undefined)
			this.coverPage.showCurrentDay = state.coverPage.showCurrentDay;

		// Year Page Settings
		if (state?.yearPage?.disable !== undefined)
			this.yearPage.disable = state.yearPage.disable;
		if (state?.yearPage?.notePagesTemplate !== undefined)
			this.yearPage.notePagesTemplate = state.yearPage.notePagesTemplate;
		if (state?.yearPage?.notePagesAmount !== undefined)
			this.yearPage.notePagesAmount = state.yearPage.notePagesAmount;

		// Quarter Page Settings
		if (state?.quarterPage?.disable !== undefined)
			this.quarterPage.disable = state.quarterPage.disable;
		if (state?.quarterPage?.notePagesTemplate !== undefined)
			this.quarterPage.notePagesTemplate = state.quarterPage.notePagesTemplate;
		if (state?.quarterPage?.notePagesAmount !== undefined)
			this.quarterPage.notePagesAmount = state.quarterPage.notePagesAmount;

		// Month Page Settings
		if (state?.monthPage?.disable !== undefined)
			this.monthPage.disable = state.monthPage.disable;
		if (state?.monthPage?.notePagesTemplate !== undefined)
			this.monthPage.notePagesTemplate = state.monthPage.notePagesTemplate;
		if (state?.monthPage?.notePagesAmount !== undefined)
			this.monthPage.notePagesAmount = state.monthPage.notePagesAmount;

		// Week Page Settings
		if (state?.weekPage?.disable !== undefined)
			this.weekPage.disable = state.weekPage.disable;
		if (state?.weekPage?.notePagesTemplate !== undefined)
			this.weekPage.notePagesTemplate = state.weekPage.notePagesTemplate;
		if (state?.weekPage?.notePagesAmount !== undefined)
			this.weekPage.notePagesAmount = state.weekPage.notePagesAmount;
		if (state?.weekPage?.useWeekSinceYear !== undefined)
			this.weekPage.useWeekSinceYear = state.weekPage.useWeekSinceYear;

		// Day Page Settings
		if (state?.dayPage?.disable !== undefined)
			this.dayPage.disable = state.dayPage.disable;
		if (state?.dayPage?.notePagesTemplate !== undefined)
			this.dayPage.notePagesTemplate = state.dayPage.notePagesTemplate;
		if (state?.dayPage?.notePagesAmount !== undefined)
			this.dayPage.notePagesAmount = state.dayPage.notePagesAmount;

		// Collections
		if (state?.collections !== undefined) {
			this.collections = state.collections.filter(Boolean).map((collection, i) => ({
				id: collection?.id || `${i}`,
				name: collection?.name || `Collection ${i}`,
				type: collection?.type || 'blank',
				total: collection?.total || 40,
				columns: collection?.columns || 1,
				lines: collection?.lines,
				numIndexPages: collection?.numIndexPages || 1,
				numPagesPerItem: collection?.numPagesPerItem || 1,
				...(collection!.start ? { start: new Date(<number>collection!.start) } : {}),
				...(collection!.end ? { end: new Date(<number>collection!.end) } : {}),
			}));
		}
	}
}
