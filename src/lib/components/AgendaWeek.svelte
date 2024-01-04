<script lang="ts">
	import { formatToString, getFirstDayOfWeek, type Timeframe } from '$lib';

	let { timeframe = {} as Timeframe, startWeekOnSunday = false } = $props();

	const weekStart = $derived(
		new Date(getFirstDayOfWeek(timeframe.start, startWeekOnSunday)),
	);
</script>

<div class="week">
	<div class="hour-label"></div>
	{#each new Array(24) as _, i (i)}
		<div class="hour-label">
			{#if i > 0}
				{i === 12 ? 12 : i % 12}
				<small>{i < 11 ? 'AM' : 'PM'}</small>
			{/if}
		</div>
	{/each}
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
		{#each new Array(24) as _, i (i)}
			<div
				class="hour"
				class:active={timeframe.month === date.getUTCMonth() + 1 &&
					timeframe.daySinceMonth === date.getUTCDate()}>
			</div>
		{/each}
	{/each}
</div>

<style lang="scss">
	.week {
		display: grid;
		grid-template-columns: 2.5rem repeat(7, 1fr);
		grid-template-rows: 1.5rem repeat(24, 1fr);
		width: 100%;
		height: 100%;
		justify-items: stretch;
		align-items: stretch;
		grid-auto-flow: column;
		padding: 0 1rem 0 0;
	}
	.day {
		font-size: 0.9rem;
		text-align: center;
		font-weight: 300;

		:global(.ordinal) {
			font-size: 0.75em;
			vertical-align: text-top;
		}
	}
	.hour {
		border-top: solid 1px var(--outline);
		border-left: solid 1px var(--outline);
		&.active {
			background-color: rgba(0, 0, 0, 0.04);
		}
	}
	.day ~ .day ~ .day ~ .day ~ .day ~ .day ~ .day ~ .hour {
		border-right: solid 1px var(--outline);
	}
	.day
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour
		+ .hour {
		border-bottom: solid 1px var(--outline);
	}
	.hour-label {
		text-align: center;
		grid-column: 1;
		font-weight: 300;
		font-size: 0.7rem;
		color: var(--text-low);
		margin-top: -0.5rem;
		small {
			color: currentColor;
			font-size: 0.6em;
		}
	}
</style>
