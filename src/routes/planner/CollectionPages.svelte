<script lang="ts">
	import { type Collection, type PlannerSettings, getTimeframe, intersect } from '$lib';
	import Page from '$lib/components/Page.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let { collection = {} as Collection, settings = {} as PlannerSettings } = $props();
	const year = $derived(settings.years[0]);
</script>

{#if collection}
	{#each new Array(collection.numIndexPages) as _, indexPage (indexPage)}
		<article
			id={`${indexPage === 0 ? collection.id : collection.id + `-${indexPage + 1}`}`}
			use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
			<SideNav
				tabs={!settings.monthPage.disable ? 'month' : 'none'}
				{settings}
				timeframe={year}
				disableActiveIndicator></SideNav>
			<TopNav
				{settings}
				breadcrumbs={[{ name: collection.name, href: `#${collection.id}` }]} />
			<div class="collection-index">
				{#each new Array(collection.total) as _, i (i)}
					<a
						href="#{collection.id}-{i + 1 + indexPage * collection.total}"
						class="collection-item">
						{i + 1 + indexPage * collection.total}&#41;
					</a>
				{/each}
			</div>
		</article>
	{/each}
	{#if collection.total}
		{#each new Array(collection.total * Math.max(1, collection.numIndexPages || 1)) as _, item (item)}
			{#each new Array(Math.max(1, collection.numPagesPerItem || 1)) as _, itemPage (itemPage)}
				<article
					id={`${collection.id}-${item + 1}${itemPage === 0 ? '' : `-${itemPage + 1}`}`}
					use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
					<SideNav
						tabs={!settings.monthPage.disable ? 'month' : 'none'}
						{settings}
						timeframe={year}
						disableActiveIndicator />
					<TopNav
						{settings}
						breadcrumbs={[
							{ name: collection.name, href: `#${collection.id}` },
							{
								name: `${item + 1}${itemPage === 0 ? '' : `-${itemPage + 1}`}`,
								href: `#${collection.id}-${item + 1}`,
							},
						]} />
					<Page
						display={collection.type}
						{settings}
						columns={collection.columns}
						lines={collection.lines}
						timeframe={!collection.start
							? undefined
							: getTimeframe(
									collection.start.getUTCFullYear(),
									collection.start.getUTCMonth() + 1,
									collection.start.getUTCDate(),
								)} />
				</article>
			{/each}
		{/each}
	{/if}
{/if}

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
		padding-top: var(--topnav-height);
	}
	.collection-index {
		display: grid;
		grid-auto-flow: column;
		// grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-template-rows: repeat(20, 1fr);
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 0 2rem;
		flex: 1;
		width: 100%;
		padding: 0rem 2rem 2.25rem;
		font-weight: lighter;
		.collection-item {
			color: var(--text);
			border-bottom: solid 1px var(--outline-low);
			display: flex;
			align-items: end;
			padding-bottom: 0.2rem;
		}
	}
	.collection {
		width: 100%;
		height: 100%;
		overflow: hidden;

		&:not(.lined):not(.lined-large) {
			padding-top: 0.5rem;
		}
		&.dotted {
			height: calc(100% - 2rem);
		}
		&.grid {
			height: calc(100% - 2rem);
		}
		&.lined {
			padding: 0 2rem 1rem;
		}
		&.numbered {
			padding: 0 2rem 1rem;
		}
	}
</style>
