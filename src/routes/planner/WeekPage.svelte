<script lang="ts">
	import { PlannerSettings, type Week } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { week = {} as Week, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${week.id}`}>
	<SideNav tabs="week" {settings} timeframe={week}></SideNav>
	<TopNav {settings} timeframe={week} />
	Week {settings.weekPage.useWeekSinceYear ? week.weekSinceYear : week.weekSinceMonth}
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
