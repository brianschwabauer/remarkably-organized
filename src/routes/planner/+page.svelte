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
	import DayPage from './DayPage.svelte';
	import CollectionPages from './CollectionPages.svelte';
	import HelpModal from './HelpModal.svelte';
	import { browser } from '$app/environment';
	let { data } = $props();
	const { settings } = data;

	const pageTemplates = [
		{ name: 'Blank Page', value: 'blank' },
		{ name: 'Dotted Grid - Small', value: 'dotted-small' },
		{ name: 'Dotted Grid - Medium', value: 'dotted' },
		{ name: 'Dotted Grid - Large', value: 'dotted-large' },
		{ name: 'Grid - Small', value: 'grid-small' },
		{ name: 'Grid - Medium', value: 'grid' },
		{ name: 'Grid - Large', value: 'grid-large' },
		{ name: 'Lined - Small', value: 'lined-small' },
		{ name: 'Lined - Medium', value: 'lined' },
		{ name: 'Lined - Large', value: 'lined-large' },
		{ name: 'Numbered - Small', value: 'numbered-small' },
		{ name: 'Numbered - Medium', value: 'numbered' },
		{ name: 'Numbered - Large', value: 'numbered-large' },
		{ name: 'Notes - Yearly', value: 'notes-year' },
		{ name: 'Notes - Quarterly', value: 'notes-quarter' },
		{ name: 'Notes - Monthly', value: 'notes-month' },
		{ name: 'Notes - Weekly', value: 'notes-week' },
		{ name: 'Notes - Daily', value: 'notes-day' },
		{ name: 'Habit Checkboxes - Year', value: 'checkbox-year' },
		{ name: 'Habit Checkboxes - Month', value: 'checkbox-month' },
	];

	function getAvailablePageTemplates(
		location: 'collection' | 'year' | 'month' | 'quarter' | 'week' | 'day',
	) {
		if (location === 'collection') return pageTemplates;
		return pageTemplates.filter((t) => {
			if (!t.value.startsWith('notes') && !t.value.startsWith('checkbox')) return true;
			const timeframe = t.value.split('-')[1];
			return location === timeframe;
		});
	}

	let showHelp = $state($page.url.searchParams.get('help') !== '0');
	let showMenu = $state(true);
	let showAdvancedSettings = $state(false);
	let loadPages = $state(
		$page.url.searchParams.get('help') === '0' &&
			(browser || $page.url.searchParams.get('load') === '1'),
	);

	let settingsUrlInitialized = false;
	$effect(() => {
		const url = new URL(untrack(() => $page.url));
		if (settings.edits) {
			url.searchParams.set('settings', JSON.stringify(settings.edits));
			replaceState(url, {});
		} else if (settingsUrlInitialized) {
			url.searchParams.delete('settings');
			replaceState(url, {});
		}
		settingsUrlInitialized = true;
	});

	function onStartDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.value) return;
		try {
			const date = new Date(target.value);
			date.setUTCHours(0, 0, 0, 0);
			if (date.getTime()) settings.date.start = date;
		} catch (error) {
			// ignore
		}
	}
	function onEndDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.value) return;
		try {
			const date = new Date(target.value);
			date.setUTCHours(0, 0, 0, 0);
			if (date.getTime()) settings.date.end = date;
		} catch (error) {
			// ignore
		}
	}
	function onCollectionDateChange(index: number, e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target.value || !settings.collections[index]) return;
		try {
			const date = new Date(target.value);
			date.setUTCHours(0, 0, 0, 0);
			if (date.getTime()) settings.collections[index].start = date;
		} catch (error) {
			// ignore
		}
	}

	function onHelpClose() {
		showHelp = false;
		const url = new URL($page.url);
		url.searchParams.set('help', '0');
		replaceState(url, {});
		setTimeout(() => (loadPages = true), 180);
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
					max={settings.date.end.toISOString().slice(0, 10)}
					value={settings.date.start.toISOString().slice(0, 10)}
					on:change={onStartDateChange} />
			</fieldset>
			<fieldset>
				<label for="end">End Date</label>
				<input
					type="date"
					placeholder="End Date"
					id="end"
					min={settings.date.start.toISOString().slice(0, 10)}
					value={settings.date.end.toISOString().slice(0, 10)}
					on:change={onEndDateChange} />
			</fieldset>
			<div class="checkbox">
				<input
					type="checkbox"
					bind:checked={settings.date.startWeekOnSunday}
					id="startWeekOnSunday" />
				<label for="startWeekOnSunday">Start Week on Sunday</label>
			</div>

			{#if showAdvancedSettings}
				<h3>Cover Page</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.coverPage.disable}
						id="disableCoverPage" />
					<label for="disableCoverPage">Disable Cover Page</label>
				</div>
				{#if !settings.coverPage.disable}
					<fieldset>
						<label for="coverPageTitle">Cover Page Title</label>
						<input
							type="text"
							placeholder="Cover Page Title"
							id="coverPageTitle"
							bind:value={settings.coverPage.title} />
					</fieldset>
					<fieldset>
						<label for="name">Contact Name</label>
						<input
							type="text"
							placeholder="Name"
							id="name"
							bind:value={settings.coverPage.name} />
					</fieldset>
					<fieldset>
						<label for="email">Contact Email/Phone</label>
						<input
							type="text"
							placeholder="Contact Email/Phone"
							id="email"
							bind:value={settings.coverPage.email} />
					</fieldset>
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.coverPage.showCollectionLinks}
							id="coverPageShowCollectionLinks" />
						<label for="coverPageShowCollectionLinks">Show Links to Collections</label>
					</div>
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.coverPage.darkBackground}
							id="coverPageDarkBackground" />
						<label for="coverPageDarkBackground">Dark Background</label>
					</div>
				{/if}

				<h3>Yearly View</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.yearPage.disable}
						id="yearPageDisable" />
					<label for="yearPageDisable">Disable Yearly View</label>
				</div>
				{#if !settings.yearPage.disable}
					<fieldset>
						<label for="yearNotePagesAmount">Additional Note Pages</label>
						<input
							type="number"
							placeholder="Additional Note Pages"
							id="yearNotePagesAmount"
							min="0"
							step="1"
							bind:value={settings.yearPage.notePagesAmount} />
					</fieldset>
					{#if settings.yearPage.notePagesAmount > 0}
						<fieldset>
							<label for="yearNotePagesTemplate">Additional Note Pages Template</label>
							<select
								id="yearNotePagesTemplate"
								bind:value={settings.yearPage.notePagesTemplate}>
								{#each getAvailablePageTemplates('year') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
						</fieldset>
					{/if}
				{/if}

				<h3>Quarterly View</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.quarterPage.disable}
						id="quarterPageDisable" />
					<label for="quarterPageDisable">Disable Quarterly View</label>
				</div>
				{#if !settings.quarterPage.disable}
					<fieldset>
						<label for="quarterNotePagesAmount">Additional Note Pages</label>
						<input
							type="number"
							placeholder="Additional Note Pages"
							id="quarterNotePagesAmount"
							min="0"
							step="1"
							bind:value={settings.quarterPage.notePagesAmount} />
					</fieldset>
					{#if settings.quarterPage.notePagesAmount > 0}
						<fieldset>
							<label for="quarterNotePagesTemplate">Additional Note Pages Template</label>
							<select
								id="quarterNotePagesTemplate"
								bind:value={settings.quarterPage.notePagesTemplate}>
								{#each getAvailablePageTemplates('quarter') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
						</fieldset>
					{/if}
				{/if}

				<h3>Monthly View</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.monthPage.disable}
						id="monthPageDisable" />
					<label for="monthPageDisable">Disable Monthly View</label>
				</div>
				{#if !settings.monthPage.disable}
					<fieldset>
						<label for="monthNotePagesAmount">Additional Note Pages</label>
						<input
							type="number"
							placeholder="Additional Note Pages"
							id="monthNotePagesAmount"
							min="0"
							step="1"
							bind:value={settings.monthPage.notePagesAmount} />
					</fieldset>
					{#if settings.monthPage.notePagesAmount > 0}
						<fieldset>
							<label for="monthNotePagesTemplate">Additional Note Pages Template</label>
							<select
								id="monthNotePagesTemplate"
								bind:value={settings.monthPage.notePagesTemplate}>
								{#each getAvailablePageTemplates('month') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
						</fieldset>
					{/if}
				{/if}

				<h3>Weekly View</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.weekPage.disable}
						id="weekPageDisable" />
					<label for="weekPageDisable">Disable Weekly View</label>
				</div>
				{#if !settings.weekPage.disable}
					<fieldset>
						<label for="weekPageTemplate">Week Page Template</label>
						<select id="weekPageTemplate" bind:value={settings.weekPage.template}>
							{#each getAvailablePageTemplates('week') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
					</fieldset>
					<fieldset>
						<label for="weekNotePagesAmount">Additional Note Pages</label>
						<input
							type="number"
							placeholder="Additional Note Pages"
							id="weekNotePagesAmount"
							min="0"
							step="1"
							bind:value={settings.weekPage.notePagesAmount} />
					</fieldset>
					{#if settings.weekPage.notePagesAmount > 0}
						<fieldset>
							<label for="weekNotePagesTemplate">Additional Note Pages Template</label>
							<select
								id="weekNotePagesTemplate"
								bind:value={settings.weekPage.notePagesTemplate}>
								{#each getAvailablePageTemplates('week') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
						</fieldset>
					{/if}
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.weekPage.useWeekSinceYear}
							id="useWeekSinceYear" />
						<label for="useWeekSinceYear">Use week number from start of year</label>
					</div>
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.weekPage.useWeekNumbersInSideNav}
							id="useWeekNumbersInSideNav" />
						<label for="useWeekNumbersInSideNav">Show week numbers in side bar</label>
					</div>
				{/if}

				<h3>Daily View</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.dayPage.disable}
						id="dayPageDisable" />
					<label for="dayPageDisable">Disable Daily View</label>
				</div>
				{#if !settings.dayPage.disable}
					<fieldset>
						<label for="dayPageTemplate">Day Page Template</label>
						<select id="dayPageTemplate" bind:value={settings.dayPage.template}>
							{#each getAvailablePageTemplates('day') as template (template.value)}
								<option value={template.value}>{template.name}</option>
							{/each}
						</select>
					</fieldset>
					<fieldset>
						<label for="dayNotePagesAmount">Additional Note Pages</label>
						<input
							type="number"
							placeholder="Additional Note Pages"
							id="dayNotePagesAmount"
							min="0"
							step="1"
							bind:value={settings.dayPage.notePagesAmount} />
					</fieldset>
					{#if settings.dayPage.notePagesAmount > 0}
						<fieldset>
							<label for="dayNotePagesTemplate">Additional Note Pages Template</label>
							<select
								id="dayNotePagesTemplate"
								bind:value={settings.dayPage.notePagesTemplate}>
								{#each getAvailablePageTemplates('day') as template (template.value)}
									<option value={template.value}>{template.name}</option>
								{/each}
							</select>
						</fieldset>
					{/if}
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.dayPage.showOnlyThisWeekInSideNav}
							id="showOnlyThisWeekInSideNav" />
						<label for="showOnlyThisWeekInSideNav">Show only this week in side bar</label>
					</div>
				{/if}

				<h3>Sidebar Navigation</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.sideNav.disable}
						id="sideNavDisable" />
					<label for="sideNavDisable">Disable Sidebar</label>
				</div>
				{#if !settings.sideNav.disable}
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.sideNav.showCollectionLinks}
							id="sideNavShowCollectionLinks" />
						<label for="sideNavShowCollectionLinks">Show Links to Collections</label>
					</div>
				{/if}

				<h3>Topbar Navigation</h3>
				<div class="checkbox">
					<input
						type="checkbox"
						bind:checked={settings.topNav.disable}
						id="topNavDisable" />
					<label for="topNavDisable">Disable Topbar</label>
				</div>
				{#if !settings.topNav.disable}
					<div class="checkbox">
						<input
							type="checkbox"
							bind:checked={settings.topNav.showCollectionLinks}
							id="topNavShowCollectionLinks" />
						<label for="topNavShowCollectionLinks">Show Links to Collections</label>
					</div>
				{/if}

				<h3>Collections</h3>
				<div class="collections">
					{#each settings.collections as collection, i (collection.id)}
						<fieldset>
							<label for="">Collection {i + 1}</label>
							<input type="text" bind:value={collection.name} placeholder="Name" />
							<fieldset style="margin-top: 1rem;">
								<label for="collection-{collection.id}-type">Page Template</label>
								<select id="collection-{collection.id}-type" bind:value={collection.type}>
									{#each pageTemplates as template}
										<option value={template.value}>{template.name}</option>
									{/each}
								</select>
							</fieldset>
							<fieldset style="margin-top: 1rem;">
								<label for="numIndexPages">Number of Index Pages</label>
								<input
									type="number"
									placeholder="Number of Index Pages"
									id="numIndexPages"
									min="1"
									step="1"
									bind:value={collection.numIndexPages} />
							</fieldset>
							<fieldset style="margin-top: 1rem;">
								<label for="numPagesPerItem">Number of Pages Per Item</label>
								<input
									type="number"
									placeholder="Number of Pages Per Item"
									id="numPagesPerItem"
									min="1"
									step="1"
									bind:value={collection.numPagesPerItem} />
							</fieldset>
							{#if collection.type.startsWith('numbered') || collection.type.startsWith('lined')}
								<fieldset style="margin-top: 1rem;">
									<label for="columns">Columns</label>
									<input
										type="number"
										placeholder="Columns"
										id="columns"
										min="1"
										step="1"
										bind:value={collection.columns} />
								</fieldset>
							{/if}
							{#if collection.type.startsWith('notes') || collection.type.startsWith('checkbox') || collection.type.startsWith('navigate')}
								<fieldset style="margin-top: 1rem;">
									<label for="start">Collection Date</label>
									<input
										type="date"
										placeholder="Collection Date"
										id="start"
										value={!collection.start
											? ''
											: collection.start.toISOString().slice(0, 10)}
										on:change={(e) => onCollectionDateChange(i, e)} />
								</fieldset>
							{/if}
							<button
								type="button"
								on:click={() => settings.collections.splice(i, 1)}
								style:color="var(--error)">
								Remove Collection
							</button>
						</fieldset>
					{/each}
					<button
						type="button"
						on:click={() =>
							settings.collections.push({
								name: 'Notes',
								id: `${Date.now()}`,
								total: 40,
								type: 'blank',
								numIndexPages: 1,
								numPagesPerItem: 1,
								columns: 1,
							})}>
						Add New Collection
					</button>
				</div>
			{:else}
				<button
					type="button"
					style="margin: 1rem 0;"
					on:click={() => (showAdvancedSettings = true)}>
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
	style:--doc-height="{702 * (1 / (settings.design.aspectRatio || 1))}px"
	style:--sidenav-width="{settings.sideNav.disable ? 0 : settings.sideNav.width}px"
	style:--topnav-height="{settings.topNav.disable ? 0 : settings.topNav.height}px">
	{#if !loadPages}
		<article
			style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
			<h1 style="margin-bottom: 2rem;">Loading...</h1>
			<LoadingIcon font-size="3rem" />
		</article>
	{/if}
	{#if !settings.coverPage.disable && loadPages}
		<CoverPage {settings} />
	{/if}
	{#if !settings.yearPage.disable && loadPages}
		{#each settings.years as year, i}
			<YearPage {settings} {year} />
		{/each}
	{/if}
	{#if !settings.quarterPage.disable && loadPages}
		{#each settings.quarters as quarter, i (i)}
			<QuarterPage {settings} {quarter} />
		{/each}
	{/if}
	{#if !settings.monthPage.disable && loadPages}
		{#each settings.months as month, i (i)}
			<MonthPage {settings} {month} />
		{/each}
	{/if}
	{#if !settings.weekPage.disable && loadPages}
		{#each settings.weeks as week, i (i)}
			<WeekPage {settings} {week} />
		{/each}
	{/if}
	{#if !settings.dayPage.disable && loadPages}
		{#each settings.days as day, i (i)}
			<DayPage {settings} {day} />
		{/each}
	{/if}
	{#if loadPages}
		{#each settings.collections as collection (collection.id)}
			<CollectionPages {settings} {collection} />
		{/each}
	{/if}
</main>

<style lang="scss">
	@media screen {
		main {
			overflow-y: auto;
			overflow-x: hidden;
			max-width: 100vw;
			max-height: 100vh;
		}
	}
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
		width: 400px;
		max-width: calc(100vw - 2rem);
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
			color: var(--text);
		}
		h3 {
			position: sticky;
			top: 4rem;
			background-color: var(--bg);
			color: var(--text);
			padding: 1rem 0;
			margin-top: 1rem;
			margin-bottom: -1rem;
		}
		.checkbox {
			margin: 0 0 0 0.5rem;
		}
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
