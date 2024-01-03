<script lang="ts">
	import Grid from './Grid.svelte';
</script>

<div class="day">
	<div class="hours">
		{#each new Array(17) as _, i (i)}
			{@const hour = i + 5}
			<div class="hour">
				<span>
					{hour % 12 === 0 ? 12 : hour % 12}
					<small>{hour < 12 ? 'am' : 'pm'}</small>
				</span>
			</div>
		{/each}
	</div>
	<div class="grid">
		<Grid display="dotted" />
	</div>
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
		top: 32px;
		right: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		color: var(--text-low);
		.hour {
			display: flex;
			justify-content: center;
			align-items: start;
			height: 48px;
			span {
				background-color: white;
				padding: 0.5rem;
				font-size: 0.7rem;
				z-index: 1;
				display: block;
				small {
					font-size: 0.6rem;
				}
			}
		}
	}
</style>
