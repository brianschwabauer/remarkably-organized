<script lang="ts">
	import { formatToString, getFirstDayOfWeek, type Timeframe } from '$lib';

	let {
		timeframe = {} as Timeframe,
		startWeekOnSunday = false,
		groupBy = 'week' as 'week' | 'month',
	} = $props();

	const yearStart = $derived(
		timeframe.weekStart ||
			new Date(
				getFirstDayOfWeek(
					Date.UTC(timeframe?.year || new Date().getUTCFullYear()),
					startWeekOnSunday,
				),
			),
	);
	const yearEnd = $derived(
		timeframe.end ||
			new Date(Date.UTC(timeframe?.year || new Date().getUTCFullYear(), 11, 31)),
	);
	const numWeeks = $derived(
		Math.floor((yearEnd.getTime() - yearStart.getTime()) / 604800000) + 1,
	);
	const numDays = $derived(
		Math.floor((yearEnd.getTime() - yearStart.getTime()) / 86400000) + 1,
	);
</script>

{#if groupBy === 'week'}
	<div class="year-by-week">
		{#each new Array(14) as _, day}
			<div class="weekday">
				{new Date(yearStart.getTime() + day * 86400000).toLocaleString('default', {
					weekday: 'short',
					timeZone: 'UTC',
				})}
			</div>
		{/each}
		{#each new Array(numDays) as _, day}
			{@const date = new Date(yearStart.getTime() + day * 86400000)}
			<a
				href="#{date.getUTCFullYear()}-{date.getUTCMonth() + 1}-{date.getUTCDate()}"
				class="day"
				class:first-row={day < 14}
				class:last-col={day % 14 === 13}
				class:second-week={day % 14 === 7}>
				<div class="date">
					{@html formatToString(date.getUTCDate(), { type: 'ordinal', html: true })}
				</div>
				<div class="month">
					{date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })}
				</div>
			</a>
		{/each}
	</div>
{/if}

{#if groupBy === 'month'}
	<div class="year-by-month">
		{#each new Array(12) as _, month}
			<div class="month" style:grid-column={month + 1}>
				{new Date(Date.UTC(2000, month)).toLocaleString('default', {
					month: 'short',
					timeZone: 'UTC',
				})}
			</div>
		{/each}
		{#each new Array(numDays) as _, day}
			{@const date = new Date(yearStart.getTime() + day * 86400000)}
			<a
				href="#{date.getUTCFullYear()}-{date.getUTCMonth() + 1}-{date.getUTCDate()}"
				class="day"
				class:first-row={date.getUTCDate() === 1}>
				<div class="weekday">
					{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })}
				</div>
				<div class="date">
					{@html formatToString(date.getUTCDate(), { type: 'ordinal', html: true })}
				</div>
			</a>
		{/each}
	</div>
{/if}

<style lang="scss">
	.year-by-week {
		display: grid;
		grid-template-columns: repeat(14, 1fr);
		padding: 0 2rem 2rem;
		height: 100%;
		.weekday {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.7em;
			font-weight: var(--font-weight-bold);
			opacity: 0.65;
		}
		.day {
			display: flex;
			flex-direction: column;
			font-weight: var(--font-weight-light);
			align-items: center;
			justify-content: center;
			border-bottom: solid 1px var(--outline);
			border-left: solid 1px var(--outline);
			line-height: 1;
			gap: 0.1rem 0;

			&.last-col {
				border-right: solid 1px var(--outline);
			}
			&:last-child {
				border-right: solid 1px var(--outline);
			}
			&.first-row {
				border-top: solid 1px var(--outline);
			}
			&.second-week {
				border-left: solid 2px var(--outline-high);
			}

			.month {
				font-size: 0.45em;
				opacity: 1;
				font-weight: var(--font-weight-normal);
			}
			.date {
				font-size: 1em;
				font-weight: var(--font-weight-normal);
				opacity: 0.9;
				line-height: 0.7rem;
				:global(.ordinal) {
					font-size: 0.45em;
					vertical-align: super;
					margin-left: .05rem;
				}
			}
		}
	}

	.year-by-month {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: repeat(32, 1fr);
		padding: 0 2rem 2rem;
		height: 100%;
		.month {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.7em;
			font-weight: var(--font-weight-bold);
			opacity: 0.65;
			grid-row: 1;
			border-bottom: solid 1px var(--outline);
		}
		.day {
			display: flex;
			font-weight: var(--font-weight-light);
			align-items: center;
			justify-content: center;
			border-left: solid 1px var(--outline);
			border-right: solid 1px var(--outline);
			border-bottom: solid 1px var(--outline);
			line-height: 1;
			gap: 0 0.2rem;

			&.first-row {
				grid-row: 2;
			}

			.weekday {
				font-size: 0.5em;
				opacity: 1;
				font-weight: var(--font-weight-normal);
			}
			.date {
				font-size: 1em;
				font-weight: var(--font-weight-normal);
				opacity: 0.9;
				line-height: 0.7em;
				:global(.ordinal) {
					font-size: 0.45em;
					vertical-align: super;
				}
			}
		}
	}
</style>
