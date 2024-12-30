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
					<small>{hour < 12 ? 'AM' : 'PM'}</small>
				</span>
			</div>
		{/each}
	</div>
	<div class="grid">
		<Grid display="dotted" />
	</div>
</div>

<style lang="scss">
	.day {
		font-size: 1.1em;
		border-top: solid 1px var(--outline);
		text-align: center;
		padding: 0.5rem 0 0;
		&:nth-child(1),
		&:nth-child(2) {
			border-top: none;
		}
		&:nth-child(2n) {
			border-left: solid 1px var(--outline);
		}
		:global(.ordinal) {
			font-size: 0.75em;
			vertical-align: super;
		}
	}
	.grid {
		position: absolute;
		top: 0.5rem;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.hours {
		position: absolute;
		top: 41px;
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
				font-size: 0.7em;
				z-index: 1;
				display: block;
				small {
					font-size: 0.6em;
				}
			}
		}
	}
</style>
