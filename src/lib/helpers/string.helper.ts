/** Creates a search query param string based on the given url and new param value */
export function getSearchParamString(
	url: URL,
	paramChanges: Record<string, string | number | undefined> = {},
): string {
	const searchParams = new URLSearchParams(url.searchParams);
	Object.entries(paramChanges).forEach(([key, value]) => {
		if (value === undefined) {
			searchParams.delete(key);
		} else {
			searchParams.set(key, value.toString());
		}
	});
	const search = searchParams.toString();
	if (!search) return '';
	return `?${search}`;
}

type StringFormatOptions =
	| {
			/** The provided value should be treated as a date. The date will be formatted with the given options */
			type: 'date';

			/** The date formatting style to use when calling format(). Possible values are "full", "long", "medium", and "short" */
			dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];

			/** The time formatting style to use when calling format(). Possible values are "full", "long", "medium", and "short" */
			timeStyle?: Intl.DateTimeFormatOptions['timeStyle'];

			/** The formatting style used for day periods like "in the morning", "am", "noon", "n" etc. Possible values are "narrow", "short", and "long" */
			dayPeriod?: Intl.DateTimeFormatOptions['dayPeriod'];

			/** The representation of the second. Possible values are "numeric" and "2-digit" */
			second?: Intl.DateTimeFormatOptions['second'];

			/** The representation of the minute. Possible values are "numeric" and "2-digit" */
			minute?: Intl.DateTimeFormatOptions['minute'];

			/** The representation of the hour. Possible values are "numeric" and "2-digit" */
			hour?: Intl.DateTimeFormatOptions['hour'];

			/** The representation of the day. Possible values are "numeric" and "2-digit" */
			day?: Intl.DateTimeFormatOptions['day'];

			/**
			 * The representation of the weekday. Possible values are:
				"long"		E.g., Thursday
				"short"		E.g., Thu
				"narrow"	E.g., T. Two weekdays may have the same narrow style for some locales (e.g. Tuesday's narrow style is also T).
			 */
			weekday?: Intl.DateTimeFormatOptions['weekday'];

			/** 
			 * The representation of the month. Possible values are:
					"numeric"	E.g., 3
					"2-digit"	E.g., 03
					"long"		E.g., March
					"short"		E.g., Mar
					"narrow"	E.g., M). Two months may have the same narrow style for some locales (e.g. May's narrow style is also M).
			 */
			month?: Intl.DateTimeFormatOptions['month'];

			/** The representation of the year. Possible values are "numeric" and "2-digit" */
			year?: Intl.DateTimeFormatOptions['year'];
	  }
	| {
			/** The provided value should be treated as a date and the output will be a relative time format - like 'in 2 min' */
			type: 'relative-date';

			/** The style of the formatted relative time */
			style?: Intl.RelativeTimeFormatOptions['style'];

			/**
			 * Whether to use numeric values in the output.
			 * Possible values are "always" and "auto"; the default is "always".
			 * When set to "auto", the output may use more idiomatic phrasing such as "yesterday" instead of "1 day ago".
			 */
			numeric?: Intl.RelativeTimeFormatOptions['numeric'];

			/** A function that should return the current epoch timestamp in ms. @defaults to Date.now */
			now?: () => number;
	  }
	| {
			/** The provided value should be treated as a currency */
			type: 'currency';

			/** The ISO currency string of the currency to use for formating the string. Defaults to 'USD' */
			currency?: Intl.NumberFormatOptions['currency'];

			/**
			 * If true, the output of format() will include html tags (e.g. <span>) to separate the parts of the string
			 * @example <span class="symbol">$</span>100<span class="decimal">.</span><span class="fraction">00</span>
			 */
			html?: boolean;
	  }
	| {
			/** The provided value should be treated as a unit of storage like megabytes, gigabytes, etc */
			type: 'storage';
	  }
	| {
			/**
			 * The given number will be converted to a number that represents an order
			 * @example 1 => 1st, 2 => 2nd, 3 => 3rd, 4 => 4th, etc
			 */
			type: 'ordinal';

			/**
			 * If true, the output of format() will include html tags (e.g. <span>) to separate the parts of the string
			 * @example <span class="value">1</span><span class="ordinal">st</span>
			 */
			html?: boolean;
	  };

/** Formats the given value into a string with special meaning (depending on options.type) */
export function formatToString(
	val: string | number | undefined | null | Date,
	options?: StringFormatOptions,
): string {
	// Format the value as a relative date
	if (options?.type === 'relative-date') {
		const second = 1000;
		const minute = 60 * 1000;
		const hour = minute * 60;
		const day = hour * 24;
		const month = day * 30;
		const year = day * 365;
		const intl = new Intl.RelativeTimeFormat(undefined, {
			numeric: 'auto',
			style: 'narrow',
			...options,
		});
		const time = val instanceof Date ? val.getTime() : +(val || '0');
		const relativeTime = (options?.now || Date.now)() - time;
		const elapsed = Math.abs(relativeTime);
		const sign = Math.sign(-relativeTime);
		if (elapsed < minute) {
			return intl.format(sign * Math.round(elapsed / second), 'second');
		} else if (elapsed < hour) {
			return intl.format(sign * Math.round(elapsed / minute), 'minute');
		} else if (elapsed < day) {
			return intl.format(sign * Math.round(elapsed / hour), 'hour');
		} else if (elapsed < month) {
			return intl.format(sign * Math.round(elapsed / day), 'day');
		} else if (elapsed < year) {
			return intl.format(sign * Math.round(elapsed / month), 'month');
		} else {
			return intl.format(sign * Math.round(elapsed / year), 'year');
		}
	}

	// Format the value as a date string (with reasonable default options)
	if (options?.type === 'date' || (!options && val instanceof Date)) {
		if (!val) return '';
		if (Object.keys(options || {}).length > 1) {
			return new Intl.DateTimeFormat(undefined, options).format(
				typeof val === 'string' ? new Date(val) : val,
			);
		}
		const isSameDay =
			new Date(val).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
		if (isSameDay) {
			return new Intl.DateTimeFormat(undefined, {
				timeStyle: 'short',
			}).format(typeof val === 'string' ? new Date(val) : val);
		}
		const isSameYear = new Date(val).getFullYear() === new Date().getFullYear();
		if (isSameYear) {
			return new Intl.DateTimeFormat(undefined, {
				month: 'short',
				day: 'numeric',
			}).format(typeof val === 'string' ? new Date(val) : val);
		}
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'short',
		}).format(typeof val === 'string' ? new Date(val) : val);
	}

	// Fallback to a string representation of the date
	if (val instanceof Date) return val.toString();

	// Format the value as a string representing bytes of storage - like '23MB'
	if (options?.type === 'storage') {
		const kilobyte = 1000;
		const megabyte = kilobyte * 1000;
		const gigabyte = megabyte * 1000;
		const terabyte = gigabyte * 1000;
		const storage = +(val || 0);
		if (storage < megabyte) {
			return new Intl.NumberFormat(undefined, {
				style: 'unit',
				unit: 'kilobyte',
				unitDisplay: 'short',
				maximumFractionDigits: 0,
			}).format(storage / kilobyte);
		}
		if (storage < megabyte * 10) {
			return new Intl.NumberFormat(undefined, {
				style: 'unit',
				unit: 'megabyte',
				unitDisplay: 'short',
				maximumFractionDigits: 1,
			}).format(storage / megabyte);
		}
		if (storage < gigabyte) {
			return new Intl.NumberFormat(undefined, {
				style: 'unit',
				unit: 'megabyte',
				unitDisplay: 'short',
				maximumFractionDigits: 0,
			}).format(storage / megabyte);
		}
		if (storage < gigabyte * 10) {
			return new Intl.NumberFormat(undefined, {
				style: 'unit',
				unit: 'gigabyte',
				unitDisplay: 'short',
				maximumFractionDigits: 1,
			}).format(storage / gigabyte);
		}
		if (storage < terabyte) {
			return new Intl.NumberFormat(undefined, {
				style: 'unit',
				unit: 'gigabyte',
				unitDisplay: 'short',
				maximumFractionDigits: 0,
			}).format(storage / gigabyte);
		}
		return new Intl.NumberFormat(undefined, {
			style: 'unit',
			unit: 'terabyte',
			unitDisplay: 'short',
			maximumFractionDigits: 2,
		}).format(storage / terabyte);
	}

	// Format the value as a currency string - like '$23.00'
	if (options?.type === 'currency') {
		const amount = +(val || 0);
		const currencyFormatter = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: 'USD',
			...options,
		});
		if (!options?.html) return currencyFormatter.format(amount);
		const parts = currencyFormatter.formatToParts(amount);
		const hasEmptyFraction = parts.find(
			(part) => part.type === 'fraction' && !+part.value,
		);
		return parts
			.map((part) => {
				if (part.type === 'currency') {
					return `<span class="symbol">${part.value}</span>`;
				}
				if (part.type === 'fraction' || part.type === 'decimal') {
					if (hasEmptyFraction) return '';
					return `<span class="${part.type}">${part.value}</span>`;
				}
				return part.value;
			})
			.join('');
	}

	// Format the number as a number that represents an order
	if (options?.type === 'ordinal') {
		const enOrdinalRules = new Intl.PluralRules('en-US', { type: 'ordinal' });
		const suffixes = new Map([
			['one', 'st'],
			['two', 'nd'],
			['few', 'rd'],
			['other', 'th'],
		]);
		const number = +(val || 0);
		const rule = enOrdinalRules.select(number);
		const suffix = suffixes.get(rule);
		if (!options?.html) return `${number}${suffix}`;
		return `<span class="value">${number}</span><span class="ordinal">${suffix}</span>`;
	}

	// Fallback to the built in methods ore returning a string
	if (!val) return '';
	return val.toString();
}