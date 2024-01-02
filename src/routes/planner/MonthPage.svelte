<script lang="ts">
	import type { Month, PlannerSettings } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { month = {} as Month, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${month.id}`}>
	<SideNav tabs="month" {settings} timeframe={month}></SideNav>
	<TopNav {settings} timeframe={month} />
	<div class="calendar">
		{#each Array.from({ length: month.end.getUTCDate() }, (_, i) => i + 1) as day}
			<div class="day">{day}</div>
		{/each}
	</div>
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
	}
	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		grid-auto-flow: dense;
		grid-gap: 1px;
		width: 100%;
		height: 100%;
		max-width: 702px;
		max-height: 702px;
		background-color: var(--bg);
	}
	.day {
		border: solid 1px var(--outline);
	}
</style>
