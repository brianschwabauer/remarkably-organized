<script lang="ts">
	import { getFirstDayOfWeek } from '$lib';
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let {
		start = new Date() as Date,
		end = new Date() as Date,
		date = new Date() as Date,
		year = date.getUTCFullYear() as number,
		links = [] as { name: string; href: string }[],
		startWeekOnSunday = false,
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
	const firstDay = $derived(getFirstDayOfWeek(`${year}-01-01`, startWeekOnSunday));
	const week = $derived(Math.floor((date.getTime() - firstDay) / 604800000) + 1);
	const day = $derived(date.getUTCDate());
	const monthName = $derived(
		new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
	);
</script>

<article id={`${year}-${month}-${day}`}>
	<SideNav
		tabs="day"
		{start}
		{end}
		{date}
		{year}
		links={disableSideNavLinks ? [] : links}
		{startWeekOnSunday}></SideNav>
	<TopNav
		{year}
		{startWeekOnSunday}
		{disableCoverPage}
		{disableYears}
		{disableQuarters}
		{disableMonths}
		{disableWeeks}
		{disableDays}
		{date}
		links={disableTopNavLinks ? [] : links} />
	{date.toLocaleDateString(undefined, {timeZone: 'UTC'})}
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
