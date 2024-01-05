<script lang="ts">
	import { getFirstDayOfWeek, type Timeframe } from '$lib';

	let {
		timeframe = {} as Timeframe,
		startWeekOnSunday = false,
		showWeekLinks = false,
		useWeekSinceYear = false,
	} = $props();

	const yearStart = $derived(
		getFirstDayOfWeek(
			Date.UTC(timeframe.year || new Date().getFullYear(), 0, 1),
			startWeekOnSunday,
		),
	);
</script>

{#if timeframe?.month}
	<div class="month" class:with-weeks={showWeekLinks}>
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
			<a
				href="#{timeframe.year}-{timeframe.month}-{day + 1}"
				class="day"
				class:border-top={day >
					(6 - timeframe.start.getUTCDay() + 7 + (startWeekOnSunday ? 0 : 1)) % 7}>
				<small>
					{new Date(timeframe.start.getTime() + day * 86400000).toLocaleString(
						'default',
						{ weekday: 'short', timeZone: 'UTC' },
					)}
				</small>
				{day + 1}
			</a>
		{/each}
		{#each new Array((6 - timeframe.end.getUTCDay() + 7 + (startWeekOnSunday ? 0 : 1)) % 7) as _, i (i)}
			<div class="day border-top"></div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.month {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
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
		.week {
			grid-column: 1;
			writing-mode: vertical-lr;
			text-orientation: mixed;
			transform: rotate(180deg);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.75rem;
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
			justify-content: end;
			font-size: 1rem;
			font-weight: 300;
			border-left: solid 1px var(--outline);
			line-height: 1;
			padding: 0.5rem;
			&.border-top {
				border-top: solid 1px var(--outline);
			}
			small {
				font-size: 0.65rem;
				opacity: 1;
				color: currentColor;
				margin: 0.2rem 0.2rem 0 0;
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
</style>
