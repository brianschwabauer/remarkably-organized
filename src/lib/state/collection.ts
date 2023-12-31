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
	 * 'year-checkbox' - A collection of checkboxes for each day of the year
	 * 'month-checkbox' - A collection of checkboxes for each day of the month
	 */
	type:
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

	/** The start date of the collection (only applies to year-checkbox & month-checkbox) */
	start?: Date;

	/** The end date of the collection (only applies to year-checkbox & month-checkbox) */
	end?: Date;
}
