<script lang="ts">
	import { type Day, PlannerSettings } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { day = {} as Day, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${day.id}`}>
	<SideNav tabs="day" {settings} timeframe={day}></SideNav>
	<TopNav {settings} timeframe={day} />
	{day.start.toLocaleDateString(undefined, { timeZone: 'UTC' })}
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
