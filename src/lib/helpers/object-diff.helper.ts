/* eslint-disable @typescript-eslint/no-explicit-any */

/** Additional options available when calculating an object diff */
export interface ObjectDiffOptions {
	/** When true the diff will include deep object differences (recurisively) */
	enableDeepDiff?: boolean;

	/** When true the diff will include deep array differences (recurisively) */
	enableDeepArrayDiff?: boolean;
}

type DeepPartial<T> = T extends { [key: string]: any }
	? { [P in keyof T]?: DeepPartial<T[P]> }
	: T;

/** Holds the prev, next, and diff state of an object */
export interface ObjectDiff<T = never> {
	/** The previous, unchanged object state. Defaults to undefined. */
	prev: T | undefined;

	/** The next state of the object - after applying the diff edits. Defaults to undefined */
	next: T | undefined;

	/** The difference between the previous & next state. 'undefined' if there are no edits */
	diff: DeepPartial<T> | undefined;

	/**
	 * Merges the given edits with the current 'diff' and recalculates the new 'next'
	 * This is different than 'set()' because this merges the new diff with the old diff
	 */
	merge: (edits: DeepPartial<T>) => ObjectDiff<T>;

	/**
	 * Overrides the current prev/next/diff values with the given values.
	 * If a 'diff' is not provided, it will be calculated using the prev/next values
	 * If a 'next' is not provided, it will be calculated using the prev/diff values
	 */
	set: (edits: ObjectDiffSetState<T>) => ObjectDiff<T>;
}

/** Either a 'next' object state or a 'diff' state to apply to an object */
export type ObjectDiffSetState<T> = Partial<Omit<ObjectDiff<T>, 'merge' | 'set'>>;

/**
 * Calculates the next state (or difference) of an object after applying edits
 * If given a prev & next state (but no diff), it will calculatee the diff between the two objects
 * next/diff states will have their fields sanitized to work well with servers/databases
 * NOTE - This function is not designed to work with arrays
 */
export function objectDiff<T = never>(
	options?: ObjectDiffOptions & ObjectDiffSetState<T>,
): ObjectDiff<T> {
	const output = {} as ObjectDiff<T>;
	const enableDeepDiff = options?.enableDeepDiff ?? false;
	const enableDeepArrayDiff = options?.enableDeepArrayDiff ?? false;

	// Sets the prev/diff/next state and calculates the necessary object diff/next
	const set = (input: ObjectDiffSetState<T> | undefined) => {
		const hasPrev = Object.keys(input || {}).includes('prev');
		const hasDiff = Object.keys(input || {}).includes('diff');
		const hasNext = Object.keys(input || {}).includes('next');
		if (!hasPrev && !hasDiff && !hasNext) return output;
		let diff = hasDiff ? input?.diff : output.diff;
		const prev = hasPrev ? input?.prev : output.prev;
		const next = !hasDiff && hasNext ? input?.next : calcNext({ prev, diff });
		diff = calcDiff({ prev, next, enableDeepDiff, enableDeepArrayDiff });
		output.prev = prev;
		output.diff = diff;
		output.next = removeEmptyValues(next);
		return output;
	};

	// Merges the given edits with the current state
	const merge = (edits: DeepPartial<T>) => {
		const next = calcNext({ prev: output.next, diff: edits });
		return set({ next });
	};

	output.set = set;
	output.merge = merge;
	return set(options);
}

/** Returns an updated state with the given edits */
function calcNext<T>({ prev, diff }: { prev: T; diff: DeepPartial<T> | null }): T {
	// Merges two objects together - giving preference to the second object.
	const merge = (a: any, b: any): any => {
		if (b === undefined) return a;
		if (Array.isArray(b)) {
			if (!Array.isArray(a)) return b;
			return b.map((val, i) => merge(a[i], val));
		}
		if (!isPlainObject(a) || !isPlainObject(b)) return b;
		return Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).reduce(
			(final, key) => ({ ...final, [key]: merge(a[key], b[key]) }),
			{},
		);
	};
	return standardizeEmptyValues(merge(prev, diff));
}

/** Returns the edits that need to be made to the server to update it's state */
function calcDiff<T>(
	options: { prev: T; next: T } & ObjectDiffOptions,
): DeepPartial<T> | undefined {
	const { enableDeepDiff, enableDeepArrayDiff } = options;
	const prev: any = options.prev;
	const next: any = options.next;
	if (prev === next) return undefined;
	if (next !== null && (!isPlainObject(prev) || !isPlainObject(next))) {
		if (!Array.isArray(next) || !enableDeepArrayDiff) return <any>next;
		const diffs = next.map((a, i) =>
			calcDiff({
				prev: Array.isArray(prev) ? prev[i] : undefined,
				next: a,
				enableDeepDiff,
				enableDeepArrayDiff,
			}),
		);
		if (diffs.every((diff) => diff === undefined)) return undefined;
		return <any>diffs.map((diff, i) => {
			if (diff !== undefined) return diff;
			return Array.isArray(next[i]) ? [] : isPlainObject(next[i]) ? {} : next[i];
		});
	}
	const edits: any = {};
	Array.from(new Set([...Object.keys(prev || {}), ...Object.keys(next || {})]))
		.filter((key) => hasValueChanged(prev[key], next?.[key] ?? null))
		.forEach((key: string) => {
			const nextVal = next?.[key] ?? null;
			if (enableDeepDiff && nextVal !== null) {
				edits[key] =
					calcDiff({
						prev: prev[key],
						next: nextVal,
						enableDeepDiff,
						enableDeepArrayDiff,
					}) ?? null;
			} else {
				edits[key] = nextVal;
			}
		});
	return Object.keys(edits).length > 0 ? edits : undefined;
}

/** Returns true if the value should be treated as an empty value */
function isEmpty(val: any): boolean {
	return (
		val === undefined ||
		val === null ||
		val === '' ||
		Number.isNaN(val) ||
		val === Infinity ||
		val === -Infinity ||
		(Array.isArray(val) && val.length === 0) ||
		(isPlainObject(val) && Object.values(val).every((v) => isEmpty(v)))
	);
}

/** Returns whether the given value is a plain object (not an array or date or null) */
function isPlainObject(val: any): boolean {
	return (
		typeof val === 'object' &&
		!(val instanceof Date) &&
		!Array.isArray(val) &&
		val !== null
	);
}

/**
 * Returns a new object with empty values converted to null (null, undefined, empty objects/arrays/strings)
 * Empty array values are converted to empty strings '' - for Firebase to not remove array elements
 * This does not mutate the original object - everything is immutable
 */
function standardizeEmptyValues(obj: any): any {
	if (isEmpty(obj)) return null;
	if (typeof obj !== 'object' || obj instanceof Date) return obj;

	// If the object is an array, loop through each value, looking for empty values/objects
	if (Array.isArray(obj)) {
		return obj.map((arrayValue) => standardizeEmptyValues(arrayValue) ?? '');
	}
	return Object.keys(obj).reduce(
		(prev, key: string) => ({ ...prev, [key]: standardizeEmptyValues(obj[key]) }),
		{},
	);
}

/** Recursively iterates over an object an removes empty values. Returns a new object */
function removeEmptyValues(obj: any): any {
	if (isEmpty(obj)) return null;
	if (typeof obj !== 'object' || obj instanceof Date) return obj;
	if (Array.isArray(obj)) return obj.map((v) => removeEmptyValues(v) ?? '');

	return Object.keys(obj).reduce((prev: any, key: string) => {
		const val = removeEmptyValues(obj[key]);
		if (val !== null) prev[key] = val;
		return prev;
	}, {});
}

/**
 * Recursively looks through two objects to see if the second object has attributes that are different
 * When 'B' has an empty value, this is ignored - except when 'A's value is not empty
 */
function hasValueChanged(a: any, b: any): boolean {
	if (isEmpty(a) && isEmpty(b)) return false;
	if (a instanceof Date && b instanceof Date) return a.getTime() !== b.getTime();
	if (typeof a !== 'object' || typeof b !== 'object') return a !== b;
	if (a === null || b === null) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		return (
			a.length !== b.length ||
			a.some((val, index) => {
				return hasValueChanged(val, b[index]);
			})
		);
	}
	if (Array.isArray(a) || Array.isArray(b)) return true;
	return Array.from(new Set([...Object.keys(a), ...Object.keys(b)])).some((key) =>
		hasValueChanged(a[key], b[key]),
	);
}

/** Helper functions used to calculate deep diffs on objects */
export const objectDiffHelpers = {
	removeEmptyValues,
	standardizeEmptyValues,
	hasValueChanged,
	isPlainObject,
	isEmpty,
	calcNext,
	calcDiff,
} as const;
