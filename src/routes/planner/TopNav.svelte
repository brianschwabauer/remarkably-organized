<script lang="ts">
	import { formatToString, PlannerSettings, type Timeframe } from '$lib';
	import HomeIcon from '~icons/material-symbols-light/home-rounded';

	let {
		timeframe = {} as Timeframe,
		settings = {} as PlannerSettings,
		breadcrumbs = [] as { name: string; href: string }[],
	} = $props();

	const showYearBreadcrumb = $derived(!settings.yearPage.disable && timeframe.year);
	const showQuarterBreadcrumb = $derived(
		!settings.quarterPage.disable && timeframe.year && timeframe.quarter,
	);
	const showMonthBreadcrumb = $derived(
		!settings.monthPage.disable && timeframe.year && timeframe.month,
	);
	const showWeekBreadcrumb = $derived(
		!settings.weekPage.disable &&
			timeframe.year &&
			timeframe.month &&
			timeframe.weekSinceYear,
	);
	const showDayBreadcrumb = $derived(
		!settings.dayPage.disable &&
			timeframe.year &&
			timeframe.month &&
			timeframe.daySinceMonth,
	);

	const font = $derived(settings.design.fontDisplay);
	const fontAdjustments = new Map([
		['Bebas Neue', '-.07em'],
		['Acme', '-.05em'],
		['Anton', '-.03em'],
		['Indie Flower', '-.12em'],
		['Just Another Hand', '-.12em'],
		['Lilita One', '-.07em'],
		['Lobster', '-.07em'],
		['Montserrat', '-.07em'],
		['Permanent Marker', '-.03em'],
		['Playfair Display', '.03em'],
		['Poppins', '-.06em'],
		['Rancho', '-.02em'],
		['Roboto', '-.06em'],
		['Roboto Condensed', '-.06em'],
		['Satisfy', '-.17em'],
		['Shadows Into Light Two', '-.05em'],
	]);
</script>

{#if !settings.topNav.disable}
	<nav>
		<ol class="breadcrumbs">
			<li>
				<a href="#home" class="home">
					<HomeIcon
						width="1.35rem"
						height="1.35rem"
						style={fontAdjustments.get(font)
							? `transform: translateY(${fontAdjustments.get(font)})`
							: null} />
				</a>
			</li>
			{#if showYearBreadcrumb}
				<li><a href="#{timeframe.year}">{timeframe.year}</a></li>
			{/if}
			{#if showQuarterBreadcrumb}
				<li>
					<a href="#{timeframe.year}-q{timeframe.quarter}">
						{!showWeekBreadcrumb && !showMonthBreadcrumb && !showDayBreadcrumb
							? 'Quarter '
							: 'Q'}{timeframe.quarter}
					</a>
				</li>
			{/if}
			{#if showMonthBreadcrumb}
				<li>
					<a href="#{timeframe.year}-{timeframe.month}">
						{timeframe.start.toLocaleString('default', {
							month: !showWeekBreadcrumb && !showDayBreadcrumb ? 'long' : 'short',
							timeZone: 'UTC',
						})}
					</a>
				</li>
			{/if}
			{#if showWeekBreadcrumb}
				<li>
					<a href="#{timeframe.year}-{timeframe.month}-wk{timeframe.weekSinceMonth}">
						{#if settings.weekPage.useWeekSinceYear}
							{#if !showYearBreadcrumb && !showMonthBreadcrumb}
								{timeframe.year}
							{/if}
						{:else if !showDayBreadcrumb && !showMonthBreadcrumb}
							{timeframe.start.toLocaleString('default', {
								month: 'long',
								timeZone: 'UTC',
							})}
						{:else if !showMonthBreadcrumb}
							{timeframe.start.toLocaleString('default', {
								month: 'short',
								timeZone: 'UTC',
							})}
						{/if}
						{#if !showDayBreadcrumb}Week{:else}WK{/if}
						{settings.weekPage.useWeekSinceYear
							? timeframe.weekSinceYear
							: timeframe.weekSinceMonth}
					</a>
				</li>
			{/if}
			{#if showDayBreadcrumb}
				<li>
					<a href="#{timeframe.year}-{timeframe.month}-{timeframe.daySinceMonth}">
						{timeframe.start.toLocaleString('default', {
							weekday: 'short',
							timeZone: 'UTC',
						})},
						{timeframe.start.toLocaleString('default', {
							month: !breadcrumbs.length ? 'long' : 'short',
							timeZone: 'UTC',
						})}
						{@html formatToString(timeframe.daySinceMonth, {
							type: 'ordinal',
							html: true,
						})}
					</a>
				</li>
			{/if}
			{#if breadcrumbs?.length}
				{#each breadcrumbs as breadcrumb (breadcrumb.href)}
					<li><a href={breadcrumb.href}>{breadcrumb.name}</a></li>
				{/each}
			{/if}
		</ol>
		<div style="flex: 1" />
		{#if settings.topNav.showCollectionLinks && settings.collections?.length}
			<ol class="links">
				{#each settings.collections as collection, i (collection.id)}
					<li><a href="#{collection.id}">{collection.name}</a></li>
				{/each}
			</ol>
		{/if}
	</nav>
{/if}

<style lang="scss">
	:global(main.side-nav-right) nav {
		padding: 0 var(--sidenav-width) 0 0;
	}
	nav {
		display: flex;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: var(--topnav-height);
		padding: 0 0 0 var(--sidenav-width);
		font-family: var(--font-display);
		font-size: var(--font-display-size);
		ol.links {
			list-style: none;
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			height: 100%;
			li {
				display: flex;
				align-items: center;
				height: 100%;
				&:not(:last-child)::after {
					content: '/';
					color: var(--text-low);
					font-size: 0.85em;
					font-family: var(--font-display);
				}
				&:last-child {
					padding-right: 0.75rem;
				}
			}
			a {
				font-size: 1em;
				color: var(--text-low);
				padding: 0 0.25rem;
				font-family: var(--font-display);
				line-height: 1;
				:global(svg) {
					font-size: 0.85em;
				}
				:global(.ordinal) {
					color: currentColor;
					font-size: 0.75em;
					vertical-align: top;
				}
			}
		}

		ol.breadcrumbs {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			height: 100%;
			font-size: 1.2em;
			li {
				display: flex;
				align-items: center;
				height: 100%;
				&:not(:last-child)::after {
					content: '/';
					color: var(--text-low);
					font-size: .8em;
					opacity: 0.8;
					font-family: var(--font-display);
				}
				&:first-child {
					a {
						padding-left: 1rem;
					}
				}
				&:last-child {
					a {
						color: var(--text-high);
						// font-size: 1.1em;
					}
				}
			}
			a {
				font-size: 1em;
				color: var(--text);
				padding: 0 0.35rem;
				font-family: var(--font-display);
				line-height: 1;
				&.home {
					display: flex;
					height: 100%;
					align-items: center;
					color: var(--text-low);
				}
				:global(svg) {
					font-size: 1em;
				}
				:global(.ordinal) {
					color: currentColor;
					font-size: 0.75em;
					vertical-align: top;
				}
			}
		}
	}
</style>
