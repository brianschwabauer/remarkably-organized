<script lang="ts">
	import { formatToString, getFirstDayOfWeek, type Timeframe } from '$lib';

	let {
		timeframe = {} as Timeframe,
		startWeekOnSunday = false,
		display = 'grid' as 'grid' | 'columns' | 'rows',
	} = $props();

	const weekStart = $derived(
		timeframe.weekStart || new Date(getFirstDayOfWeek(new Date(), startWeekOnSunday)),
	);
</script>

<div class="week {display}">
	{#each new Array(7) as _, i (i)}
		{@const date = new Date(weekStart.getTime() + i * 86400000)}
		{#if timeframe.weekStart}
			<a
				class="day"
				href="#{date.getUTCFullYear()}-{date.getUTCMonth() + 1}-{date.getUTCDate()}">
				{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })}
				{@html formatToString(date.getUTCDate(), { type: 'ordinal', html: true })}
			</a>
		{:else}
			<div class="day">
				{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })}
			</div>
		{/if}
	{/each}
	<div class="day notes">Notes</div>
</div>

<style lang="scss">
	.week {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(4, 1fr);
		width: 100%;
		height: 100%;
		justify-items: stretch;
		align-items: stretch;

		&.columns {
			grid-template-columns: repeat(7, 1fr);
			grid-template-rows: 1fr;
			.notes {
				display: none;
			}
			.day {
				border-top: none;
				&:not(:first-child) {
					border-left: solid 1px var(--outline);
				}
			}
		}
		&.rows {
			grid-template-columns: 1fr;
			grid-template-rows: repeat(7, 1fr);
			.notes {
				display: none;
			}
		}
		&.grid {
			.day {
				&:nth-child(1),
				&:nth-child(2) {
					border-top: none;
				}
				&:nth-child(2n) {
					border-left: solid 1px var(--outline);
				}
			}
		}
	}
	.day {
		font-size: 0.9em;
		border-top: solid 1px var(--outline);
		text-align: center;
		padding: 0.5rem 0 0;
		font-weight: var(--font-weight-light);

		:global(.ordinal) {
			font-size: 0.75em;
			vertical-align: text-top;
		}
	}
</style>
