<script lang="ts">
	import type { Month } from '$lib';

	let { months = [] as Month[] } = $props();
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<a href="#{month.id}" class="month">
				<h2>{month.nameLong}</h2>
			</a>
		{/each}
	</div>
{:else}
	<div class="months">
		{#each new Array(12) as _, i (i)}
			<div class="month">
				<h2>
					{new Date(new Date().setMonth(i)).toLocaleString('default', { month: 'long' })}
				</h2>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.months {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(4, 1fr);
		flex: 1;
		width: 100%;
		height: 100%;
		padding: 0 2rem 2rem;
		h2 {
			text-align: center;
			font-size: .85rem;
			padding: 0.5rem 0 0.5rem;
			font-weight: normal;
		}
	}
	.month {
		border-left: solid 1px var(--outline-low);
		border-bottom: solid 1px var(--outline-low);
		&:nth-child(3n + 1) {
			border-left: none;
		}
		&:nth-last-child(1),
		&:nth-last-child(2),
		&:nth-last-child(3) {
			border-bottom: none;
		}
	}
</style>
