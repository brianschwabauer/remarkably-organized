<script lang="ts">
	import { type CalendarEvent, type Timeframe, getWeek } from '$lib';
	import Grid from './Grid.svelte';

	let {
		timeframe = {} as Timeframe,
		events = [] as CalendarEvent[],
		startWeekOnSunday = false,
		showWeekLinks = false,
		useWeekSinceYear = false,
		showNotes = true,
	} = $props();
</script>

{#if timeframe?.month}
	{@const numDaysBeforeStart =
		(timeframe.start.getUTCDay() + 7 - (startWeekOnSunday ? 0 : 1)) % 7}
	<div class="month" class:with-weeks={showWeekLinks} class:with-notes={showNotes}>
		{#if showWeekLinks}
			{@const numWeeks =
				Math.floor(
					(timeframe.end.getTime() - timeframe.weekStart.getTime()) / 604800000,
				) + 1}
			{#each new Array(numWeeks) as _, i (i)}
				{@const date = new Date(timeframe.weekStart.getTime() + i * 604800000)}
				{@const week = getWeek(date, startWeekOnSunday)}
				<a href="#{week.id}" class="week" class:last-week={i === numWeeks - 1}>
					{#if !useWeekSinceYear && week.year && week.month && week.month !== timeframe.month}
						{new Date(Date.UTC(week.year, week.month)).toLocaleString('default', {
							month: 'short',
						})}
					{/if}
					Week {useWeekSinceYear ? week.weekSinceYear : week.weekSinceMonth}
				</a>
			{/each}
		{/if}
		{#each new Array(numDaysBeforeStart) as _, i (i)}
			{@const date = new Date(
				timeframe.start.getTime() + (i - numDaysBeforeStart) * 86400000,
			)}
			<a
				class="day"
				href="#{date.getUTCFullYear()}-{date.getUTCMonth() + 1}-{date.getUTCDate()}">
			</a>
		{/each}
		{#each new Array(timeframe.end.getUTCDate()) as _, day (day)}
			<a
				href="#{timeframe.year}-{timeframe.month}-{day + 1}"
				class="day"
				class:border-top={day >
					(6 - timeframe.start.getUTCDay() + 7 + (startWeekOnSunday ? 0 : 1)) % 7}>
				<div class="date">
					<small>
						{new Date(timeframe.start.getTime() + day * 86400000).toLocaleString(
							'default',
							{ weekday: 'short', timeZone: 'UTC' },
						)}
					</small>
					{day + 1}
				</div>
				<div class="events">
					{#each events.filter((event) => !event.duration && event.start * 1000 === timeframe.start.getTime() + day * 86400000) as event}
						<div class="event">
							{event.name}
						</div>
					{/each}
				</div>
			</a>
		{/each}
		{#each new Array((6 - timeframe.end.getUTCDay() + 7 + (startWeekOnSunday ? 0 : 1)) % 7) as _, i (i)}
			{@const date = new Date(timeframe.end.getTime() + (i + 1) * 86400000)}
			<a
				class="day border-top"
				href="#{date.getUTCFullYear()}-{date.getUTCMonth() + 1}-{date.getUTCDate()}">
			</a>
		{/each}
	</div>
	{#if showNotes}
		<div class="notes">
			<h3>Notes</h3>
			<Grid display="dotted" />
		</div>
	{/if}
{/if}

<style lang="scss">
	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-auto-rows: 1fr;
		grid-auto-flow: dense;
		&.with-weeks {
			grid-template-columns: 2rem repeat(7, 1fr);
		}
		width: 100%;
		height: 100%;
		justify-items: stretch;
		align-items: stretch;
		grid-gap: 0px;
		padding: 0 1rem 1rem;
		&.with-notes {
			height: 50%;
			padding: 0 1rem 0;
		}
		.week {
			grid-column: 1;
			writing-mode: vertical-lr;
			text-orientation: mixed;
			transform: rotate(180deg);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.8em;
			color: rgba(0, 0, 0, 0.75);
			border-top: solid 1px var(--outline);
			border-left: solid 1px var(--outline-high);
			margin-bottom: -1px;
			&.last-week {
				border-top: none;
				margin-bottom: 0px;
			}
		}
		.day {
			display: flex;
			flex-direction: column;
			justify-content: start;
			font-size: 1.05em;
			font-weight: var(--font-weight-light);
			border-left: solid 1px var(--outline);
			line-height: 1;
			&.border-top {
				border-top: solid 1px var(--outline);
			}
			small {
				font-size: 0.65em;
				opacity: 1;
				color: currentColor;
				margin: 0.1rem 0.2rem 0 0;
			}
			.date {
				margin: 0.5rem 0.5rem -0.25rem 0;
				display: flex;
				justify-content: end;
				align-items: start;
			}
		}
		.events {
			display: flex;
			flex-direction: column;
			gap: 0.35rem;
			justify-content: space-evenly;
			flex: 1;
			.event {
				font-size: 0.5em;
				text-align: center;
				padding: 0 0.25rem;
				text-wrap: balance;
			}
		}
		&:not(.with-weeks) {
			.day {
				&:nth-child(7n + 1) {
					border-left: none;
				}
			}
		}
	}
	.notes {
		text-align: center;
		border-top: solid 1px var(--outline);
		width: 100%;
		height: 50%;
		padding: 0;
		h3 {
			font-size: 0.9em;
			font-weight: var(--font-weight-light);
			margin: 0.55rem 0 0.55rem;
		}
	}
</style>
