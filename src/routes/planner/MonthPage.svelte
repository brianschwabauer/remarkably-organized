<script lang="ts">
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let {
		start = new Date() as Date,
		end = new Date() as Date,
		date = new Date() as Date,
		year = date.getUTCFullYear() as number,
		links = [] as { name: string; href: string }[],
		disableCoverPage = false,
		disableYears = false,
		disableQuarters = false,
		disableMonths = false,
		disableWeeks = false,
		disableDays = false,
		disableTopNavLinks = false,
		disableSideNavLinks = false,
	} = $props();

	const month = $derived(
		date.getUTCFullYear() < year
			? 1
			: date.getUTCFullYear() > year
				? 12
				: date.getUTCMonth() + 1,
	);
	const monthName = $derived(
		new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
	);
</script>

<article id={`${year}-${month}`}>
	<SideNav {start} {end} {year} {date} links={disableSideNavLinks ? [] : links}></SideNav>
	<TopNav
		{disableCoverPage}
		{disableYears}
		{disableQuarters}
		{disableMonths}
		disableWeeks
		disableDays
		date={new Date(year, month - 1, 1)}
		links={disableTopNavLinks ? [] : links} />
	<div class="calendar">
		{#each Array.from({ length: new Date(year, month, 0).getUTCDate() }, (_, i) => i + 1) as day}
			<div class="day">{day}</div>
		{/each}
	</div>
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
	}
	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		grid-auto-flow: dense;
		grid-gap: 1px;
		width: 100%;
		height: 100%;
		max-width: 702px;
		max-height: 702px;
		background-color: var(--bg);
	}
	.day {
		border: solid 1px var(--outline);
	}
</style>
