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
			<div
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
			</div>
		{/each}
	</div>
{/if}

{#if groupBy === 'month'}
	<div class="year-by-month">
		{#each new Array(12) as _, month}
			<div class="month" style:grid-column={month + 1}>
				{new Date(2000, month).toLocaleString('default', {
					month: 'short',
					timeZone: 'UTC',
				})}
			</div>
		{/each}
		{#each new Array(numDays) as _, day}
			{@const date = new Date(yearStart.getTime() + day * 86400000)}
			<div class="day" class:first-row={date.getUTCDate() === 1}>
				<div class="weekday">
					{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })}
				</div>
				<div class="date">
					{@html formatToString(date.getUTCDate(), { type: 'ordinal', html: true })}
				</div>
			</div>
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
			font-size: 0.7rem;
			font-weight: bold;
			opacity: 0.65;
		}
		.day {
			display: flex;
			flex-direction: column;
			font-weight: lighter;
			align-items: center;
			justify-content: center;
			border-bottom: solid 1px var(--outline-low);
			border-left: solid 1px var(--outline-low);
			line-height: 1;

			&.last-col {
				border-right: solid 1px var(--outline-low);
			}
			&:last-child {
				border-right: solid 1px var(--outline-low);
			}
			&.first-row {
				border-top: solid 1px var(--outline-low);
			}
			&.second-week {
				border-left: solid 2px var(--outline);
			}

			.month {
				font-size: 0.45rem;
				opacity: 0.65;
			}
			.date {
				font-size: 0.8rem;
				font-weight: normal;
				opacity: 0.9;
				line-height: 0.7rem;
				:global(.ordinal) {
					font-size: 0.45rem;
					vertical-align: super;
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
			font-size: 0.7rem;
			font-weight: bold;
			opacity: 0.65;
			grid-row: 1;
			border-bottom: solid 1px var(--outline-low);
		}
		.day {
			display: flex;
			font-weight: lighter;
			align-items: center;
			justify-content: center;
			border-left: solid 1px var(--outline-low);
			border-right: solid 1px var(--outline-low);
			border-bottom: solid 1px var(--outline-low);
			line-height: 1;
			gap: 0 0.15rem;

			&.first-row {
				grid-row: 2;
			}

			.weekday {
				font-size: 0.5rem;
				opacity: 0.65;
			}
			.date {
				font-size: 0.8rem;
				font-weight: normal;
				opacity: 0.9;
				line-height: 0.7rem;
				:global(.ordinal) {
					font-size: 0.45rem;
					vertical-align: super;
				}
			}
		}
	}
</style>
