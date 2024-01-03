<script lang="ts">
	import { type Timeframe } from '$lib';
	import Grid from './Grid.svelte';

	let { timeframe = {} as Timeframe } = $props();
</script>

{#if timeframe.daySinceMonth}
	<div class="day">
		<div class="hours">
			{#each new Array(14) as _, i (i)}
				{@const hour = i + 6}
				<div class="hour">
					{hour % 12 === 0 ? 12 : hour % 12}
					<small>{hour < 12 ? 'am' : 'pm'}</small>
				</div>
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
		top: 22px;
		left: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: var(--text-low);
		padding: 2px 0 40px;
		.hour {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: start;
			padding: 0 1rem;
			font-size: 0.7rem;
			small {
				font-size: 0.6rem;
			}
		}
	}
</style>
