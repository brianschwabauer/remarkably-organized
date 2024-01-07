import iCal from 'ical.js';
import { error, json } from '@sveltejs/kit';
import type { CalendarEvent } from '$lib';
const { parse, Component, Event } = iCal;

export async function GET({ url }) {
	const calendarURL = url.searchParams.get('url');
	if (!calendarURL) throw error(400, 'No calendar URL provided');
	const response = await fetch(calendarURL).catch(() => ({}) as Response);
	if (!response.ok) throw error(500, `Couldn't fetch calendar`);
	const text = await response.text();

	const after = +(url.searchParams.get('start') || Date.UTC(new Date().getFullYear()));
	const before = +(
		url.searchParams.get('end') || Date.UTC(new Date().getFullYear() + 1, 12, 31)
	);
	const ics = parse(text);
	const comp = new Component(ics);
	const events: CalendarEvent[] = [];

	comp.getAllSubcomponents('vevent').forEach((vevent) => {
		const event = new Event(vevent);
		const name = event.summary;

		if (event.isRecurring()) {
			const iterator = event.iterator();
			const duration =
				event.startDate.icaltype === 'date'
					? 86400000
					: event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime();
			while (!iterator.complete) {
				const time = iterator.next();
				if (!time) break;
				const start = Date.UTC(
					time.year,
					time.month - 1,
					time.day,
					time.hour,
					time.minute,
					time.second,
				);
				const end = start + duration;
				if (start > before) break;
				if (end < after) continue;
				events.push({
					name,
					start: Math.floor(start / 1000),
					duration: duration === 86400000 ? undefined : Math.floor(duration / 1000),
				});
			}
		} else {
			const start = Date.UTC(
				event.startDate.year,
				event.startDate.month - 1,
				event.startDate.day,
				event.startDate.hour,
				event.startDate.minute,
				event.startDate.second,
			);
			const end = Date.UTC(
				event.endDate.year,
				event.endDate.month - 1,
				event.endDate.day,
				event.endDate.hour,
				event.endDate.minute,
				event.endDate.second,
			);
			if (end > after && start < before) {
				const duration = end - start;
				events.push({
					name,
					start: Math.floor(start / 1000),
					duration: duration === 86400000 ? undefined : Math.floor(duration / 1000),
				});
			}
		}
	});
	events.sort((a, b) => a.start - b.start);

	return json({ events });
}
