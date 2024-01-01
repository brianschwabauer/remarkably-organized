<script lang="ts">
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let {
		start = new Date() as Date,
		end = new Date() as Date,
		date = new Date() as Date,
		year = 0,
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
	const quarter = $derived(
		date.getUTCFullYear() < year
			? 1
			: date.getUTCFullYear() > year
				? 4
				: Math.floor((month - 1) / 3) + 1,
	);
</script>

<article id={`${year}-q${quarter}`}>
	<SideNav
		{start}
		{end}
		{year}
		{date}
		tabs="quarter"
		links={disableSideNavLinks ? [] : links}></SideNav>
	<TopNav
		{disableCoverPage}
		{disableYears}
		{disableQuarters}
		disableMonths
		disableWeeks
		disableDays
		links={disableTopNavLinks ? [] : links}
		{date} />
	Quarter {quarter}
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-left: var(--sidenav-width);
	}
</style>
