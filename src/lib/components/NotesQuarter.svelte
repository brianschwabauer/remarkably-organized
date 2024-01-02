<script lang="ts">
	import type { Month } from '$lib';

	let { months = [] as Month[] } = $props();
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<div class="month">
				<a href="#{month.id}"><h2>{month.nameLong}</h2></a>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.months {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 0 3rem 0;
		h2 {
			font-size: 1;
			text-align: center;
			font-size: 1.2rem;
			font-weight: normal;
			padding: 0.5rem 0;
		}
	}
	.month {
		display: flex;
		flex: 1;
		align-items: start;
		justify-content: center;
		width: 100%;
		border-top: solid 1px var(--outline-low);
	}
</style>
