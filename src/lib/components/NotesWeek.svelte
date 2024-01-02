<script lang="ts">
	import { formatToString, type Timeframe } from '$lib';

	let { timeframe = {} as Timeframe } = $props();
</script>

{#if timeframe.weekStart}
	<div class="week">
		{#each new Array(7) as _, i (i)}
			{@const date = new Date(timeframe.weekStart.getTime() + i * 86400000)}
			<a class="day" href="#{timeframe.year}-{timeframe.month}-{date.getUTCDate()}">
				{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })},
				{@html formatToString(date.getUTCDate(), { type: 'ordinal', html: true })}
			</a>
		{/each}
		<div class="day">Notes</div>
	</div>
{/if}

<style lang="scss">
	.week {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: repeat(4, 1fr);
		width: 100%;
		height: 100%;
		justify-items: stretch;
		align-items: stretch;
	}
	.day {
		font-size: 1.1rem;
		border-top: solid 1px var(--outline-low);
		text-align: center;
		padding: 0.5rem 0 0;
		&:nth-child(1),
		&:nth-child(2) {
			border-top: none;
		}
		&:nth-child(2n) {
			border-left: solid 1px var(--outline-low);
		}
		:global(.ordinal) {
			font-size: 0.75em;
			vertical-align: super;
		}
	}
</style>
