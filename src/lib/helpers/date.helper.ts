import type { Timeframe, Week } from '$lib';

/** Returns a date object representing the first day of the week for the given date (will be a Monday unless startWeekOnSunday is true) */
export function getFirstDayOfWeek(
	date: Date | number | string,
	startWeekOnSunday = false,
) {
	const parsed = new Date(new Date(date).setUTCHours(0, 0, 0, 0));
	return new Date(parsed).setUTCDate(
		parsed.getUTCDate() - ((parsed.getUTCDay() - (startWeekOnSunday ? 0 : 1) + 7) % 7),
	);
}

/** Returns a date object in UTC time for the given date (or year/month/day) */
export function getUTCDate(year: number, month?: number, day?: number): Date;
export function getUTCDate(date: Date | string): Date;
export function getUTCDate(
	date: Date | number | string,
	maybeMonth?: number,
	maybeDay?: number,
) {
	if (typeof date === 'number') {
		return new Date(Date.UTC(date, maybeMonth || 0, maybeDay ?? 1));
	}
	return new Date(new Date(date).setUTCHours(0, 0, 0, 0));
}

/** Returns the parsed timeframe of the given year, month, date */
export function getTimeframe(
	year: number,
	month = 1,
	day = 1,
	startWeekOnSunday = false,
): Timeframe {
	const start = new Date(Date.UTC(year, month - 1, day));
	const quarter = Math.floor((month - 1) / 3) + 1;
	const firstWeekDayOfMonth = getFirstDayOfWeek(
		getUTCDate(year, month - 1),
		startWeekOnSunday,
	);
	const firstWeekDayOfYear = getFirstDayOfWeek(getUTCDate(year), startWeekOnSunday);
	return {
		id: `${year}-${month}-${day}`,
		year: year,
		quarter,
		month,
		weekSinceYear: Math.floor((start.getTime() - firstWeekDayOfYear) / 604800000) + 1,
		weekSinceMonth: Math.floor((start.getTime() - firstWeekDayOfMonth) / 604800000) + 1,
		daySinceYear: (start.getTime() - firstWeekDayOfYear) / 86400000 + 1,
		daySinceMonth: start.getUTCDate(),
		daySinceWeek: ((start.getUTCDay() - (startWeekOnSunday ? 0 : 1) + 7) % 7) + 1,
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
	};
}

/** Returns the week timeframe info for the given date */
export function getWeek(fromDate: Date | number | string, startWeekOnSunday = false) {
	const date = new Date(new Date(fromDate).setUTCHours(0, 0, 0, 0));
	const start = new Date(getFirstDayOfWeek(date, startWeekOnSunday));
	const end = new Date(start.getTime() + 86400000 * 6);
	const year1st = Date.UTC(start.getUTCFullYear());
	const year1stIsPreviousYear =
		(new Date(year1st).getUTCDay() + 7 - (startWeekOnSunday ? 0 : 1)) % 7 >= 4;
	const month1st = Date.UTC(start.getUTCFullYear(), start.getUTCMonth());
	const month1stIsPreviousYear =
		(new Date(month1st).getUTCDay() + 7 - (startWeekOnSunday ? 0 : 1)) % 7 >= 4;
	const firstCountableWeekdayOfYear =
		getFirstDayOfWeek(year1st, startWeekOnSunday) +
		(year1stIsPreviousYear ? 604800000 : 0);
	const firstCountableWeekdayOfMonth =
		getFirstDayOfWeek(month1st, startWeekOnSunday) +
		(month1stIsPreviousYear ? 604800000 : 0);
	let year = start.getUTCFullYear();
	let month = start.getUTCMonth() + 1;
	let weekSinceYear =
		Math.floor((start.getTime() - firstCountableWeekdayOfYear) / 604800000) + 1;
	let weekSinceMonth =
		Math.floor((start.getTime() - firstCountableWeekdayOfMonth) / 604800000) + 1;

	const nextMonth1st = new Date(Date.UTC(year, start.getUTCMonth() + 1, 1));
	const nextMonth1stInWeek = (nextMonth1st.getTime() - start.getTime()) / 604800000 < 1;
	if (nextMonth1stInWeek) {
		const belongsToNextMonth =
			(nextMonth1st.getUTCDay() + 7 - (startWeekOnSunday ? 0 : 1)) % 7 < 4;
		if (belongsToNextMonth) {
			year = nextMonth1st.getUTCFullYear();
			month = nextMonth1st.getUTCMonth() + 1;
			weekSinceMonth = 1;
			if (month === 1 && year !== start.getUTCFullYear()) weekSinceYear = 1;
		}
	}

	return {
		id: `${year}-wk${weekSinceYear}`,
		year,
		quarter: Math.floor((month - 1) / 3) + 1,
		month,
		weekSinceYear,
		weekSinceMonth,
		start,
		end,
		weekStart: start,
		nameShort: `WK${weekSinceYear}`,
		nameLong: `Week ${weekSinceYear}`,
	} as Week;
}
