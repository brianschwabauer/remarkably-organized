<div class="day">
	{#each new Array(24) as _, i (i)}
		<div class="hour-label">
			{#if i > 0}
				{i === 12 ? 12 : i % 12}
				<small>{i < 11 ? 'AM' : 'PM'}</small>
			{:else}
				12
				<small>AM</small>
			{/if}
		</div>
	{/each}
	{#each new Array(24) as _, i (i)}
		<div class="hour"></div>
	{/each}
</div>

<style lang="scss">
	.day {
		display: grid;
		grid-template-columns: 2.5rem 1fr;
		grid-template-rows: repeat(24, 1fr);
		width: 100%;
		height: 100%;
		justify-items: stretch;
		align-items: stretch;
		grid-auto-flow: column;
		padding: 1rem 1rem 0 0;
	}
	.hour {
		border-top: solid 1px var(--outline);
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
