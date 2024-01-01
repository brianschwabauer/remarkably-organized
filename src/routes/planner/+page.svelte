<script lang="ts">
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import SettingsIcon from '~icons/fa/cog';
	import LoadingIcon from '~icons/eos-icons/bubble-loading';
	import { untrack } from 'svelte';
	import CoverPage from './CoverPage.svelte';
	import MonthPage from './MonthPage.svelte';
	import YearPage from './YearPage.svelte';
	import QuarterPage from './QuarterPage.svelte';
	import WeekPage from './WeekPage.svelte';
	import { getFirstDayOfWeek } from '$lib';
	import DayPage from './DayPage.svelte';
	import CollectionPages from './CollectionPages.svelte';
	import { browser } from '$app/environment';
	import HelpModal from './HelpModal.svelte';
	let { data } = $props();
	const { today, aspectRatio, sidebarWidth, topbarHeight } = data;

	let showLinksOnCoverPage = $state(data.showLinksOnCoverPage);
	let showLinksOnSideNav = $state(data.showLinksOnSideNav);
	let showLinksOnTopNav = $state(data.showLinksOnTopNav);
	let startWeekOnSunday = $state(data.startWeekOnSunday);
	let disableCoverPage = $state(data.disableCoverPage);
	let disableYears = $state(data.disableYears);
	let disableQuarters = $state(data.disableQuarters);
	let disableMonths = $state(data.disableMonths);
	let disableWeeks = $state(data.disableWeeks);
	let disableDays = $state(data.disableDays);

	let collections = $state(data.collections);
	let name = $state(data.name);
	let email = $state(data.email);
	let start = $state(data.start);
	let end = $state(data.end);
	let links = $derived(
		collections.map((collection) => ({
			name: collection.name,
			href: `#${collection.id}`,
		})),
	);

	let showHelp = $state($page.url.searchParams.get('help') !== '0');
	let showMenu = $state(true);
	let showAdvancedSettings = $state(false);
	let loadPages = $state(!browser && $page.url.searchParams.get('help') === '0');
	$effect(() => {
		if (!showHelp) {
			setTimeout(() => (loadPages = true), 180);
		}
	});

	$effect(() => {
		const url = new URL(untrack(() => $page.url));
		url.searchParams.set('name', name);
		url.searchParams.set('email', email);
		url.searchParams.set('start', `${start.getTime()}`);
		url.searchParams.set('end', `${end.getTime()}`);
		url.searchParams.set('collections', JSON.stringify(collections));
		if (showLinksOnCoverPage) {
			url.searchParams.set('showLinksOnCoverPage', '1');
		} else {
			url.searchParams.delete('showLinksOnCoverPage');
		}
		if (startWeekOnSunday) {
			url.searchParams.set('startWeekOnSunday', '1');
		} else {
			url.searchParams.delete('startWeekOnSunday');
		}
		if (showLinksOnSideNav) {
			url.searchParams.set('showLinksOnSideNav', '1');
		} else {
			url.searchParams.set('showLinksOnSideNav', '0');
		}
		if (showLinksOnTopNav) {
			url.searchParams.set('showLinksOnTopNav', '1');
		} else {
			url.searchParams.delete('showLinksOnTopNav');
		}
		replaceState(url, {});
	});

	function onStartDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.value) return;
		const date = new Date(target.value);
		date.setUTCHours(0, 0, 0, 0);
		start = date;
	}
	function onEndDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.value) return;
		const date = new Date(target.value);
		date.setUTCHours(0, 0, 0, 0);
		end = date;
	}

	function onHelpClose() {
		showHelp = false;
		const url = new URL($page.url);
		url.searchParams.set('help', '0');
		replaceState(url, {});
	}
</script>

<svelte:head>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
		@page {
			size: 702px 936px;
			margin: 0;
		}
	</style>
</svelte:head>

{#if showHelp}<HelpModal onClose={onHelpClose} />{/if}

{#if showMenu}
	<div class="menu" transition:slide={{ duration: 200 }}>
		<h2>Settings</h2>
		<form>
			<fieldset>
				<label for="start">Start Date</label>
				<input
					type="date"
					placeholder="Start Date"
					id="start"
					max={end.toISOString().slice(0, 10)}
					value={start.toISOString().slice(0, 10)}
					on:change={onStartDateChange} />
			</fieldset>
			<fieldset>
				<label for="end">End Date</label>
				<input
					type="date"
					placeholder="End Date"
					id="end"
					min={start.toISOString().slice(0, 10)}
					value={end.toISOString().slice(0, 10)}
					on:change={onEndDateChange} />
			</fieldset>
			<fieldset>
				<label for="name">Name</label>
				<input type="text" placeholder="Name" id="name" bind:value={name} />
			</fieldset>
			<fieldset>
				<label for="email">Contact Info</label>
				<input type="text" placeholder="Contact Info" id="email" bind:value={email} />
			</fieldset>
			{#if showAdvancedSettings}
				<h3>Collections</h3>
				<div class="collections">
					{#each collections as collection, i (collection.id)}
						<fieldset>
							<label for="">Collection {i + 1}</label>
							<input type="text" bind:value={collection.name} placeholder="Name" />
							<select bind:value={collection.type}>
								<option value="blank">Blank Page</option>
								<option value="dotted">Dotted Grid</option>
								<option value="dotted-large">Dotted Grid - Large</option>
								<option value="grid">Grid</option>
								<option value="grid-large">Grid - Large</option>
								<option value="lined">Lined</option>
								<option value="lined-large">Lined - Large</option>
								<option value="numbered">Numbered</option>
								<option value="numbered-large">Numbered - Large</option>
								<option value="year-checkbox">Habit Checkboxes - Year</option>
								<option value="month-checkbox">Habit Checkboxes - Month</option>
							</select>
							<fieldset style="margin-top: 1rem;">
								<label for="numIndexPages">Number of Index Pages</label>
								<input
									type="number"
									placeholder="Number of Index Pages"
									id="numIndexPages"
									bind:value={collection.numIndexPages} />
							</fieldset>
							<fieldset style="margin-top: 1rem;">
								<label for="numPagesPerItem">Number of Pages Per Item</label>
								<input
									type="number"
									placeholder="Number of Pages Per Item"
									id="numPagesPerItem"
									bind:value={collection.numPagesPerItem} />
							</fieldset>
							{#if collection.type === 'numbered' || collection.type === 'numbered-large' || collection.type === 'lined' || collection.type === 'lined-large'}
								<fieldset style="margin-top: 1rem;">
									<label for="columns">Columns</label>
									<input
										type="number"
										placeholder="Columns"
										id="columns"
										bind:value={collection.columns} />
								</fieldset>
							{/if}
							<button
								type="button"
								on:click={() => collections.splice(i, 1)}
								style:color="var(--error)">
								Remove Collection
							</button>
						</fieldset>
					{/each}
					<button
						type="button"
						on:click={() =>
							collections.push({
								name: 'Notes',
								id: `${Date.now()}`,
								total: 20,
								type: 'blank',
							})}>
						Add New Collection
					</button>
				</div>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={showLinksOnCoverPage}
						id="showLinksOnCoverPage" />
					<label for="showLinksOnCoverPage">Show Collections on Cover Page</label>
				</div>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={showLinksOnSideNav}
						id="showLinksOnSideNav" />
					<label for="showLinksOnSideNav">Show Collections on Sidebar</label>
				</div>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={showLinksOnTopNav}
						id="showLinksOnTopNav" />
					<label for="showLinksOnTopNav">Show Collections on Topbar</label>
				</div>
				<h3>Toggles</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={startWeekOnSunday}
						id="startWeekOnSunday" />
					<label for="startWeekOnSunday">Start Week on Sunday</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableCoverPage} id="disableCoverPage" />
					<label for="disableCoverPage">Disable Cover Page</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableYears} id="disableYears" />
					<label for="disableYears">Disable Years</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableQuarters} id="disableQuarters" />
					<label for="disableQuarters">Disable Quarters</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableMonths} id="disableMonths" />
					<label for="disableMonths">Disable Months</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableWeeks} id="disableWeeks" />
					<label for="disableWeeks">Disable Weeks</label>
				</div>
				<div class="checkbox">
					<input type="checkbox" bind:checked={disableDays} id="disableDays" />
					<label for="disableDays">Disable Days</label>
				</div>
			{:else}
				<button type="button" on:click={() => (showAdvancedSettings = true)}>
					Advanced Settings
				</button>
			{/if}
		</form>
		<div class="actions">
			<button class="export" on:click={() => window.print()}>Print to PDF</button>
		</div>
	</div>
{/if}
<button on:click={() => (showMenu = !showMenu)} class="menu-trigger">
	<SettingsIcon />
</button>

<main
	style:--doc-width="{702}px"
	style:--doc-height="{702 * (1 / (aspectRatio || 1))}px"
	style:--sidenav-width="{sidebarWidth}px"
	style:--topnav-height="{topbarHeight}px">
	{#if !loadPages}
		<article
			style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
			<h1 style="margin-bottom: 2rem;">Loading...</h1>
			<LoadingIcon font-size="3rem" />
		</article>
	{/if}
	{#if !disableCoverPage && loadPages}
		<CoverPage {name} {email} {start} {end} links={showLinksOnCoverPage ? links : []} />
	{/if}
	{#if !disableYears && loadPages}
		{#each new Array(end.getUTCFullYear() - start.getUTCFullYear() + 1) as _, i}
			{@const year = start.getUTCFullYear() + i}
			<YearPage
				{year}
				{start}
				{end}
				{disableCoverPage}
				{disableYears}
				{links}
				disableSideNavLinks={!showLinksOnSideNav}
				disableTopNavLinks={!showLinksOnTopNav} />
		{/each}
	{/if}
	{#if !disableQuarters && loadPages}
		{#each new Array(end.getUTCFullYear() - start.getUTCFullYear() + 1) as _, i}
			{@const year = start.getUTCFullYear() + i}
			{@const startQuarter = i === 0 ? Math.floor(start.getUTCMonth() / 3) + 1 : 1}
			{@const endQuarter =
				year === end.getUTCFullYear() ? Math.floor(end.getUTCMonth() / 3) + 1 : 4}
			{#each new Array(endQuarter - startQuarter + 1) as _, i}
				{@const month = (startQuarter + i - 1) * 3}
				<QuarterPage
					{start}
					{end}
					{year}
					date={new Date(year, month, 1)}
					{disableCoverPage}
					{disableDays}
					{disableMonths}
					{disableQuarters}
					{disableWeeks}
					{disableYears}
					disableSideNavLinks={!showLinksOnSideNav}
					disableTopNavLinks={!showLinksOnTopNav}
					{links} />
			{/each}
		{/each}
	{/if}
	{#if !disableMonths && loadPages}
		{#each new Array(end.getUTCFullYear() - start.getUTCFullYear() + 1) as _, i}
			{@const year = start.getUTCFullYear() + i}
			{@const startMonth = i === 0 ? start.getUTCMonth() + 1 : 1}
			{@const endMonth = year === end.getUTCFullYear() ? end.getUTCMonth() + 1 : 12}
			{#each new Array(endMonth - startMonth + 1) as _, i}
				{@const month = startMonth + i}
				<MonthPage
					{start}
					{end}
					{year}
					date={new Date(year, month - 1, 1)}
					{disableCoverPage}
					{disableDays}
					{disableMonths}
					{disableQuarters}
					{disableWeeks}
					{disableYears}
					disableSideNavLinks={!showLinksOnSideNav}
					disableTopNavLinks={!showLinksOnTopNav}
					{links} />
			{/each}
		{/each}
	{/if}
	{#if !disableWeeks && loadPages}
		{#each new Array(end.getUTCFullYear() - start.getUTCFullYear() + 1) as _, i}
			{@const year = start.getUTCFullYear() + i}
			{@const firstDay =
				year === start.getUTCFullYear()
					? getFirstDayOfWeek(start, startWeekOnSunday)
					: getFirstDayOfWeek(`${year}-01-01`, startWeekOnSunday)}
			{@const lastDay =
				year === end.getUTCFullYear()
					? end.getTime()
					: new Date(`${year}-12-31`).getTime()}
			{@const numWeeks = Math.floor((lastDay - firstDay) / 604800000) + 1}
			{#each new Array(numWeeks) as _, i}
				<WeekPage
					{start}
					{end}
					{year}
					date={new Date(firstDay + i * 604800000)}
					{disableCoverPage}
					{disableDays}
					{disableMonths}
					{disableQuarters}
					{disableWeeks}
					{disableYears}
					{startWeekOnSunday}
					disableSideNavLinks={!showLinksOnSideNav}
					disableTopNavLinks={!showLinksOnTopNav}
					{links} />
			{/each}
		{/each}
	{/if}
	{#if !disableDays && loadPages}
		{#each new Array(end.getUTCFullYear() - start.getUTCFullYear() + 1) as _, i}
			{@const year = start.getUTCFullYear() + i}
			{@const startDay = i === 0 ? start.getTime() : new Date(`${year}-01-01`).getTime()}
			{@const endDay =
				year === end.getUTCFullYear()
					? end.getTime()
					: new Date(`${year}-12-31`).getTime()}
			{@const numDays = Math.floor((endDay - startDay) / 86400000) + 1}
			{#each new Array(numDays) as _, i}
				<DayPage
					{start}
					{end}
					{year}
					date={new Date(startDay + i * 86400000)}
					{disableCoverPage}
					{disableDays}
					{disableMonths}
					{disableQuarters}
					{disableWeeks}
					{disableYears}
					disableSideNavLinks={!showLinksOnSideNav}
					disableTopNavLinks={!showLinksOnTopNav}
					{startWeekOnSunday}
					{links} />
			{/each}
		{/each}
	{/if}
	{#if loadPages}
		{#each collections as collection (collection.id)}
			<CollectionPages
				{start}
				{end}
				{disableCoverPage}
				{disableYears}
				{disableMonths}
				disableSideNavLinks={!showLinksOnSideNav}
				disableTopNavLinks={!showLinksOnTopNav}
				{collection}
				{startWeekOnSunday}
				{links} />
		{/each}
	{/if}
</main>

<style lang="scss">
	:global(main > article) {
		display: block;
		position: relative;
		background-color: var(--bg);
		width: var(--doc-width);
		height: var(--doc-height);
		content-visibility: auto;
		contain-intrinsic-size: 1px var(--doc-height);
	}

	.menu-trigger {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		z-index: 10;
		background-color: var(--bg);
		color: currentColor;
		border-radius: 100%;
		width: 3.5rem;
		height: 3.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.35em;
		box-shadow: var(--shadow-4);
		cursor: pointer;
		&:hover {
			color: black;
		}
	}
	.menu {
		position: fixed;
		bottom: 5rem;
		right: 1rem;
		background-color: var(--bg);
		z-index: 10;
		width: 350px;
		max-width: 100vw;
		max-height: 80vh;
		border-radius: var(--radius-5);
		box-shadow: var(--shadow-4);
		padding: 0 2rem 1rem;
		overflow-y: auto;
		overflow-x: hidden;
		@include scrollbar;
		&::-webkit-scrollbar-track-piece:start {
			margin-top: var(--radius-5);
		}
		&::-webkit-scrollbar-track-piece:end {
			margin-bottom: var(--radius-5);
		}
		h2 {
			position: sticky;
			top: 0;
			background-color: var(--bg);
			padding: 2rem 0 1rem;
		}
		h3 {
			position: sticky;
			top: 4rem;
			background-color: var(--bg);
			padding: 1rem 0;
			margin-bottom: -1rem;
		}
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 0;
		fieldset {
			border: none;
			display: flex;
			flex-direction: column;
			padding: 0;
			label {
				font-size: 0.75rem;
				font-weight: 300;
				margin: 0 0 0.1rem 0.25rem;
			}
		}
	}
	.actions {
		position: sticky;
		bottom: -1rem;
		background-color: white;
		width: 100%;
		padding: 1rem 0;
	}
	button.export {
		background-color: var(--action);
		color: var(--action-text);
		width: 100%;
		border-radius: 999px;
		padding: 0.75rem 1rem;
		font-size: 1.25rem;
		&:hover {
			background-color: var(--action-high);
			color: var(--action-text-high);
		}
	}
	.collections {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		select {
			margin: 0.5rem 0 0;
		}
		button {
			margin: 0.5rem 0 0;
		}
	}
	@media print {
		.menu,
		.menu-trigger {
			display: none;
		}
	}
</style>
