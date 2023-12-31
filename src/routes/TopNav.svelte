<script lang="ts">
	import { formatToString, getFirstDayOfWeek } from '$lib';
	import HomeIcon from '~icons/material-symbols-light/home-rounded';

	let {
		date = new Date() as Date,
		year = date.getUTCFullYear() as number,
		startWeekOnSunday = false,
		disableCoverPage = false,
		disableYears = false,
		disableQuarters = false,
		disableMonths = false,
		disableWeeks = false,
		disableDays = false,
		links = [] as { name: string; href: string }[],
		breadcrumbs = [] as { name: string; href: string }[],
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
	const firstDay = $derived(getFirstDayOfWeek(`${year}-01-01`, startWeekOnSunday));
	const week = $derived(Math.floor((date.getTime() - firstDay) / 604800000) + 1);
	const day = $derived(date.getUTCDate());
</script>

<nav>
	<ol class="breadcrumbs">
		{#if !disableCoverPage}
			<li><a href="#home"><HomeIcon style="margin-bottom: .15em" /></a></li>
		{/if}
		{#if !disableYears}
			<li><a href="#{year}">{year}</a></li>
		{/if}
		{#if !disableQuarters}
			<li>
				<a href="#{year}-q{quarter}">
					{disableMonths && disableWeeks && disableDays ? 'Quarter ' : 'Q'}{quarter}
				</a>
			</li>
		{/if}
		{#if !disableMonths}
			<li>
				<a href="#{year}-{month}">
					{new Date(year, month - 1).toLocaleString('default', {
						month: disableWeeks && disableDays ? 'long' : 'short',
					})}
				</a>
			</li>
		{/if}
		{#if !disableWeeks}
			<li>
				<a href="#{year}-wk{week}">
					{#if disableDays}Week{:else}WK{/if}
					{week}
				</a>
			</li>
		{/if}
		{#if !disableDays}
			<li>
				<a href="#{year}-{month}-{day}">
					{date.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' })},
					{date.toLocaleString('default', { month: 'long', timeZone: 'UTC' })}
					{@html formatToString(day, { type: 'ordinal', html: true })}
				</a>
			</li>
		{/if}
		{#if breadcrumbs?.length}
			{#each breadcrumbs as breadcrumb (breadcrumb.href)}
				<li><a href={breadcrumb.href}>{breadcrumb.name}</a></li>
			{/each}
		{/if}
	</ol>
	{#if links?.length}
		<div style="flex: 1" />
		<ol class="links">
			{#each links as link, i (link.href)}
				<li><a href={link.href}>{link.name}</a></li>
			{/each}
		</ol>
	{/if}
</nav>

<style lang="scss">
	nav {
		display: flex;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: var(--topnav-height);
		padding: 0 0 0 var(--sidenav-width);
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
					font-size: 0.85rem;
				}
				&:last-child {
					padding-right: 0.5rem;
				}
			}
			a {
				font-size: 1rem;
				color: var(--text-low);
				padding: 0 0.35rem;
				font-family: var(--font-display);
				display: flex;
				height: 100%;
				align-items: center;
				line-height: 100%;
				:global(svg) {
					font-size: 0.85em;
				}
				:global(.value) {
					margin-left: 0.25rem;
				}
				:global(.ordinal) {
					color: currentColor;
					padding: 0 0 0.35em 0.1em;
					font-size: 0.75em;
					margin-left: -0.1rem;
				}
			}
		}

		ol.breadcrumbs {
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			height: 100%;
			font-size: 1.35rem;
			li {
				display: flex;
				align-items: center;
				height: 100%;
				&:not(:last-child)::after {
					content: '/';
					color: var(--text-low);
					font-size: 0.65em;
				}
				&:first-child {
					a {
						padding-left: 1rem;
					}
				}
				&:last-child {
					a {
						color: var(--text-high);
						font-size: 1.35rem;
					}
				}
			}
			a {
				font-size: 1.35rem;
				color: var(--text-low);
				padding: 0 0.35rem;
				font-family: var(--font-display);
				display: flex;
				height: 100%;
				align-items: center;
				line-height: 100%;
				:global(svg) {
					font-size: 0.85em;
				}
				:global(.value) {
					margin-left: 0.25rem;
				}
				:global(.ordinal) {
					color: currentColor;
					padding: 0 0 0.35em 0.1em;
					font-size: 0.75em;
					margin-left: -0.1rem;
				}
			}
		}
	}
</style>
