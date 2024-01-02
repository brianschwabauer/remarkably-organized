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
