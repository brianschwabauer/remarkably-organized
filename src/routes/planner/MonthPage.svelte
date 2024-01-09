<script lang="ts">
	import { intersect, type Month, type PlannerSettings } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { month = {} as Month, settings = {} as PlannerSettings } = $props();
</script>

<article id={month.id} use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<SideNav tabs="months" {settings} timeframe={month}></SideNav>
	<TopNav {settings} timeframe={month} />
	<Page {settings} display={settings.monthPage.template} timeframe={month} />
</article>

{#if settings.monthPage.notePagesAmount > 0}
	{#each new Array(settings.monthPage.notePagesAmount) as _, i}
		<article
			id="{month.id}-pg{i + 2}"
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav {settings} tabs="months" timeframe={month} />
			<TopNav
				{settings}
				timeframe={month}
				breadcrumbs={[{ href: `#${month.id}-pg${i + 2}`, name: `Page ${i + 2}` }]} />
			<Page display={settings.monthPage.notePagesTemplate} {settings} timeframe={month} />
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
	:global(main.side-nav-right) article {
		padding-right: var(--sidenav-width);
		padding-left: 0;
	}
</style>
