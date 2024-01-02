<script lang="ts">
	import type { PlannerSettings, Year } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { year = {} as Year, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${year.year}`}>
	<SideNav
		{settings}
		tabs={settings.years.length > 1 ? 'year' : 'month'}
		timeframe={year} />
	Year {year.year}
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
