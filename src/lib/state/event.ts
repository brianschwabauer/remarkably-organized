export interface CalendarEvent {
	/** The epoch timestamp (in seconds) when the event starts */
	start: number;

	/** The length of time of the event (in seconds). This is undefined for day-long events */
	duration?: number;

	/** The name of the event */
	name: string;
}
