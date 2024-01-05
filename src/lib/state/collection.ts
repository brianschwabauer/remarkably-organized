/**
 * The type of collection. This is used to determine how to display the collection.
 * 'blank' - A collection of freeform items (useful for notes, etc.)
 * 'grid' - Each page in the collection will have a grid printed on it
 * 'dotted' - Each page in the collection will have a grid of dots printed on it
 * 'lined' - Each page in the collection will be printed with lines
 * 'habit-year' - A collection of checkboxes for each day of the year
 */
export type PageTemplate =
	| 'blank'
	| 'grid'
	| 'grid-small'
	| 'grid-large'
	| 'dotted'
	| 'dotted-small'
	| 'dotted-large'
	| 'lined'
	| 'lined-small'
	| 'lined-large'
	| 'numbered'
	| 'numbered-small'
	| 'numbered-large'
	| 'todo'
	| 'todo-small'
	| 'todo-large'
	| 'calendar-year'
	| 'calendar-quarter'
	| 'calendar-month'
	| 'agenda-week'
	| 'agenda-day'
	| 'notes-year'
	| 'notes-quarter'
	| 'notes-month'
	| 'notes-week'
	| 'notes-week-columns'
	| 'notes-week-rows'
	| 'notes-day'
	| 'habit-year-by-week'
	| 'habit-year-by-month';

export interface Collection {
	/** The URL friendly slug used to link & id the collection */
	id: string;

	/** The user-displayed name of the collection (used in navbar) */
	name: string;

	/**
	 * The type of collection. This is used to determine how to display the collection.
	 * 'blank' - A collection of freeform items (useful for notes, etc.)
	 * 'grid' - Each page in the collection will have a grid printed on it
	 * 'dotted' - Each page in the collection will have a grid of dots printed on it
	 * 'lined' - Each page in the collection will be printed with lines
	 * 'habit-year' - A collection of checkboxes for each day of the year
	 */
	type: PageTemplate;

	/** The total amount of items allowed in the collection */
	total: number;

	/** The number of columns (used for grids/lined/numbered) */
	columns?: number;

	/** The number of lines to show (used for lined/number) */
	lines?: number;

	/** The number of index pages for the collection (makes more collection pages too) */
	numIndexPages?: number;

	/** The number of pages each item in the collection has */
	numPagesPerItem?: number;
}
