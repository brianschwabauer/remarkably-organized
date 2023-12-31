<script lang="ts">
	import SideNav from './SideNav.svelte';
	import TopNav from './TopNav.svelte';

	let {
		year = 0,
		start = new Date() as Date,
		end = new Date() as Date,
		links = [] as { name: string; href: string }[],
		disableCoverPage = false,
		disableYears = false,
		disableTopNavLinks = false,
		disableSideNavLinks = false,
	} = $props();
</script>

<article id={`${year}`}>
	<SideNav
		{start}
		{end}
		{year}
		links={disableSideNavLinks ? [] : links}
		tabs={start.getUTCFullYear() !== end.getUTCFullYear() ? 'year' : 'month'}></SideNav>
	Year {year}
</article>

<style lang="scss">
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>
