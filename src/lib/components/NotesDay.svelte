<script lang="ts">
	import { type Timeframe } from '$lib';
	import Grid from './Grid.svelte';

	let { timeframe = {} as Timeframe } = $props();
</script>

{#if timeframe.daySinceMonth}
	<div class="day">
		<div class="hours">
			{#each new Array(24) as _, i (i)}
				<div class="hour">{i}:00</div>
			{/each}
		</div>
		<div class="grid">
			<Grid display="dotted-small" />
		</div>
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
	.grid {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.hours {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>
