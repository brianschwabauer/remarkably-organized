<script lang="ts">
	import { intersect, type Month, type PlannerSettings } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { month = {} as Month, settings = {} as PlannerSettings } = $props();
</script>

<article id={month.id} use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<SideNav tabs="month" {settings} timeframe={month}></SideNav>
	<TopNav {settings} timeframe={month} />
	<Page {settings} display="notes-month" timeframe={month} />
</article>

{#if settings.monthPage.notePagesAmount > 0}
	{#each new Array(settings.monthPage.notePagesAmount) as _, i}
		<article
			id="{month.id}-{i + 2}"
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav {settings} tabs="month" timeframe={month} />
			<TopNav {settings} timeframe={month} />
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
</style>
