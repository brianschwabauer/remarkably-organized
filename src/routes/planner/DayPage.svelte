<script lang="ts">
	import { type Day, PlannerSettings } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { day = {} as Day, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${day.id}`}>
	<SideNav tabs="day" {settings} timeframe={day}></SideNav>
	<TopNav {settings} timeframe={day} />
	<Page {settings} display="notes-day" timeframe={day} />
</article>

{#if settings.dayPage.notePagesAmount > 0}
	{#each new Array(settings.dayPage.notePagesAmount) as _, i}
		<article>
			<SideNav {settings} tabs="day" timeframe={day} />
			<TopNav {settings} timeframe={day} />
			<Page display={settings.dayPage.notePagesTemplate} {settings} timeframe={day} />
		</article>
	{/each}
{/if}

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
		padding-top: var(--topnav-height);
	}
</style>
