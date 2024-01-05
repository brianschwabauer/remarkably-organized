<script lang="ts">
	import { intersect, type PlannerSettings, type Year } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { year = {} as Year, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${year.year}`} use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<SideNav
		{settings}
		tabs={settings.years.length > 1 ? 'years' : 'none'}
		timeframe={year} />
	<h1>{year.year}</h1>
	<Page {settings} display="calendar-year" timeframe={year} padding="0 2rem" />
</article>

{#if settings.yearPage.notePagesAmount > 0}
	{#each new Array(settings.yearPage.notePagesAmount) as _, i}
		<article
			id="{year.year}-pg{i + 2}"
			class="year-notes"
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav
				{settings}
				tabs={settings.years.length > 1 ? 'years' : 'months'}
				timeframe={year} />
			<TopNav {settings} timeframe={year} />
			<Page display={settings.yearPage.notePagesTemplate} {settings} timeframe={year} />
		</article>
	{/each}
{/if}

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
		&.year-notes {
			padding-top: var(--topnav-height);
		}
	}
	:global(main.side-nav-right) article {
		padding-right: var(--sidenav-width);
		padding-left: 0;
	}

	h1 {
		padding: 1.5rem 0 1rem;
		font-family: var(--font-display);
		font-size: calc(var(--font-display-size) * 3.5);
	}
	.notes {
		flex: 1;
	}
</style>
