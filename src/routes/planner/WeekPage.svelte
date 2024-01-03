<script lang="ts">
	import { PlannerSettings, intersect, type Week } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { week = {} as Week, settings = {} as PlannerSettings } = $props();
</script>

<article id={week.id} use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<SideNav tabs="week" {settings} timeframe={week}></SideNav>
	<TopNav {settings} timeframe={week} />
	<Page {settings} display={settings.weekPage.template} timeframe={week} />
</article>

{#if settings.weekPage.notePagesAmount > 0}
	{#each new Array(settings.weekPage.notePagesAmount) as _, i}
		<article
			id="{week.id}-{i + 2}"
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav {settings} tabs="week" timeframe={week} />
			<TopNav
				{settings}
				timeframe={week}
				breadcrumbs={[{ href: `#${week.id}-${i + 2}`, name: `Page ${i + 2}` }]} />
			<Page display={settings.weekPage.notePagesTemplate} {settings} timeframe={week} />
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
