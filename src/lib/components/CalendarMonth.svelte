<script lang="ts">
	import { getFirstDayOfWeek, type CalendarEvent, type Timeframe } from '$lib';
	import Grid from './Grid.svelte';

	let {
		timeframe = {} as Timeframe,
		events = [] as CalendarEvent[],
		startWeekOnSunday = false,
		showWeekLinks = false,
		useWeekSinceYear = false,
		showNotes = true,
	} = $props();

	const yearStart = $derived(
		getFirstDayOfWeek(
			Date.UTC(timeframe.year || new Date().getFullYear(), 0, 1),
			startWeekOnSunday,
		),
	);
</script>

{#if timeframe?.month}
	<div class="month" class:with-weeks={showWeekLinks} class:with-notes={showNotes}>
		{#if showWeekLinks}
			{@const numWeeks =
				Math.floor(
					(timeframe.end.getTime() - timeframe.weekStart.getTime()) / 604800000,
				) + 1}
			{@const weekSinceYear =
				Math.floor((timeframe.weekStart.getTime() - yearStart) / 604800000) + 1}
			{#each new Array(numWeeks) as _, i (i)}
				<a
					href="#{timeframe.year}-{timeframe.month}-wk{i + 1}"
					class="week"
					class:last-week={i === numWeeks - 1}>
					Week {useWeekSinceYear ? weekSinceYear + i : i + 1}
				</a>
			{/each}
		{/if}
		{#each new Array((timeframe.start.getUTCDay() + 7 - (startWeekOnSunday ? 0 : 1)) % 7) as _, i (i)}
			<div class="day"></div>
		{/each}
		{#each new Array(timeframe.end.getUTCDate()) as _, day (day)}
			{@const dayEvents = events.filter(
				(event) =>
					!event.duration &&
					event.start * 1000 === timeframe.start.getTime() + day * 86400000,
			)}
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
				{#if dayEvents.length}
					<div class="events">
						{#each dayEvents as event, i (`${event.start}-${event.name}-${i}`)}
							<div class="event">
								{event.name}
							</div>
						{/each}
					</div>
				{/if}
			</a>
		{/each}
		{#each new Array((6 - timeframe.end.getUTCDay() + 7 + (startWeekOnSunday ? 0 : 1)) % 7) as _, i (i)}
			<div class="day border-top"></div>
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
				margin: 0.5rem 0.5rem -.25rem 0;
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
