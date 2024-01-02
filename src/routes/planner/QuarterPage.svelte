<script lang="ts">
	import type { PlannerSettings, Quarter } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { quarter = {} as Quarter, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${quarter.id}`}>
	<SideNav {settings} tabs="quarter" timeframe={quarter}></SideNav>
	<TopNav {settings} timeframe={quarter} />
	Quarter {quarter.quarter}
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
	}
</style>
