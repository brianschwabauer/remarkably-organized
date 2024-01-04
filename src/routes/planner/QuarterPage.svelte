<script lang="ts">
	import { intersect, type PlannerSettings, type Quarter } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { quarter = {} as Quarter, settings = {} as PlannerSettings } = $props();
</script>

<article id={quarter.id} use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<SideNav {settings} tabs="quarter" timeframe={quarter}></SideNav>
	<TopNav {settings} timeframe={quarter} />
	<Page {settings} display="calendar-quarter" timeframe={quarter} />
</article>

{#if settings.quarterPage.notePagesAmount > 0}
	{#each new Array(settings.quarterPage.notePagesAmount) as _, i}
		<article
			id="{quarter.id}-pg{i + 2}"
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav {settings} tabs="quarter" timeframe={quarter} />
			<TopNav
				{settings}
				timeframe={quarter}
				breadcrumbs={[{ href: `#${quarter.id}-${i + 2}`, name: `Page ${i + 2}` }]} />
			<Page
				display={settings.quarterPage.notePagesTemplate}
				{settings}
				timeframe={quarter} />
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
