<script lang="ts">
	import type { Collection } from '$lib';
	import Grid from '$lib/components/Grid.svelte';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let {
		start = new Date() as Date,
		end = new Date() as Date,
		date = start as Date,
		year = date.getUTCFullYear() as number,
		collection = undefined as undefined | Collection,
		links = [] as { name: string; href: string }[],
		startWeekOnSunday = false,
		disableCoverPage = false,
		disableYears = false,
		disableMonths = false,
		disableTopNavLinks = false,
		disableSideNavLinks = false,
	} = $props();
</script>

{#if collection}
	{#each new Array(collection.numIndexPages) as _, indexPage (indexPage)}
		<article
			id={`${indexPage === 0 ? collection.id : collection.id + `-${indexPage + 1}`}`}>
			<TopNav
				{disableCoverPage}
				disableYears
				disableQuarters
				disableMonths
				disableWeeks
				disableDays
				links={disableTopNavLinks ? [] : links}
				breadcrumbs={[{ name: collection.name, href: `#${collection.id}` }]}
				{date} />
			<SideNav
				{start}
				{end}
				{year}
				{date}
				disableActiveIndicator
				links={disableSideNavLinks ? [] : links}
				tabs={!disableMonths ? 'month' : 'none'}></SideNav>
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
					id={`${collection.id}-${item + 1}${itemPage === 0 ? '' : `-${itemPage + 1}`}`}>
					<TopNav
						{disableCoverPage}
						disableYears
						disableQuarters
						disableMonths
						disableWeeks
						disableDays
						links={disableTopNavLinks ? [] : links}
						breadcrumbs={[
							{ name: collection.name, href: `#${collection.id}` },
							{
								name: `${item + 1}${itemPage === 0 ? '' : `-${itemPage + 1}`}`,
								href: `#${collection.id}-${item + 1}`,
							},
						]}
						{date} />
					<SideNav
						{start}
						{end}
						{year}
						{date}
						disableActiveIndicator
						links={disableSideNavLinks ? [] : links}
						tabs={!disableMonths ? 'month' : 'none'}></SideNav>
					<div class="collection {collection.type}">
						{#if collection.type === 'month-checkbox'}
							<!-- Month Checkbox -->
						{:else if collection.type === 'year-checkbox'}
							<!-- Year Checkbox -->
						{:else if collection.type === 'lined' || collection.type === 'lined-large'}
							<Grid
								display={collection.type}
								columns={collection.columns}
								lines={collection.lines} />
						{:else if collection.type === 'numbered' || collection.type === 'numbered-large'}
							<Grid
								display={collection.type}
								columns={collection.columns}
								lines={collection.lines} />
						{:else if collection.type !== 'blank'}
							<Grid display={collection.type} />
						{/if}
					</div>
				</article>
			{/each}
		{/each}
	{/if}
{/if}

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
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
		&:not(.lined):not(.lined-large) {
			padding-top: 0.5rem;
		}
		&.lined,
		&.lined-large {
			padding: 0 2rem 1rem;
		}
		&.numbered,
		&.numbered-large {
			padding: 0 2rem 1rem;
		}
	}
</style>
