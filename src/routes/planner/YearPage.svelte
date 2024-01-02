<script lang="ts">
	import type { PlannerSettings, Year } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';

	let { year = {} as Year, settings = {} as PlannerSettings } = $props();
</script>

<article id={`${year.year}`}>
	<SideNav
		{settings}
		tabs={settings.years.length > 1 ? 'year' : 'none'}
		timeframe={year} />
	<h1>{year.year}</h1>
	<Page {settings} display="navigate-year" timeframe={year} padding="0 2rem" />
</article>

{#if settings.yearPage.notePagesAmount > 0}
	{#each new Array(settings.yearPage.notePagesAmount) as _, i}
		<article>
			<SideNav
				{settings}
				tabs={settings.years.length > 1 ? 'year' : 'month'}
				timeframe={year} />
			<h1>{year.year}</h1>
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
	}

	h1 {
		font-size: 3.5rem;
		padding: 1.5rem 0 1rem;
	}
	.notes {
		flex: 1;
	}
</style>
