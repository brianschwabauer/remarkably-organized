<script lang="ts">
	import { formatToString, getFirstDayOfWeek } from '$lib';

	let {
		today = new Date() as Date,
		start = new Date() as Date,
		end = new Date() as Date,
		date = new Date() as Date,
		year = date.getUTCFullYear() as number,
		startWeekOnSunday = false,
		tabs = 'month' as 'day' | 'week' | 'month' | 'quarter' | 'year' | 'none',
		links = [] as { name: string; href: string }[],
		numWeeksInSideNav = 15,
		numDaysInSideNav = 15,
		disableActiveIndicator = false,
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
	const day = $derived(date.getUTCDate());
	const startMonth = $derived(
		start.getUTCFullYear() === year ? start.getUTCMonth() + 1 : 1,
	);
	const endMonth = $derived(end.getUTCFullYear() === year ? end.getUTCMonth() + 1 : 12);
	const startQuarter = $derived(Math.floor((startMonth - 1) / 3) + 1);
	const endQuarter = $derived(Math.floor((endMonth - 1) / 3) + 1);
	const firstFullWeek = $derived(getFirstDayOfWeek(`${year}-01-01`, startWeekOnSunday));
	const lastFullWeek = $derived(
		year === end.getUTCFullYear() ? end.getTime() : new Date(`${year}-12-31`).getTime(),
	);
	const week = $derived(Math.floor((date.getTime() - firstFullWeek) / 604800000) + 1);
	const numWeeks = $derived(Math.floor((lastFullWeek - firstFullWeek) / 604800000) + 1);
	const startWeek = $derived(
		Math.min(
			numWeeks - numWeeksInSideNav,
			Math.ceil(Math.max(0, week - numWeeksInSideNav / 2)),
		),
	);
	const numDays = $derived(
		date.getUTCFullYear() === end.getUTCFullYear() &&
			date.getUTCMonth() === end.getUTCMonth()
			? end.getUTCDate()
			: new Date(year, month, 0).getUTCDate(),
	);
	const startDay = $derived(
		Math.min(
			numDays - numDaysInSideNav,
			Math.ceil(Math.max(0, day - numDaysInSideNav / 2)),
		),
	);
</script>

<nav>
	{#if tabs !== 'none'}
		<ol class="tabs">
			{#if tabs === 'year' && start.getUTCFullYear() !== end.getUTCFullYear()}
				{#each Array.from({ length: end.getUTCFullYear() - start.getUTCFullYear() + 1 }, (_, i) => i + start.getUTCFullYear()) as y}
					<li>
						<a href="#{y}" class:active={!disableActiveIndicator && year === y}>{y}</a>
					</li>
				{/each}
			{/if}
			{#if tabs === 'quarter'}
				{#if startQuarter <= 1 && endQuarter >= 1}
					<li>
						<a href="#{year}-q1" class:active={!disableActiveIndicator && quarter === 1}>
							Q1
						</a>
					</li>
				{/if}
				{#if startQuarter <= 2 && endQuarter >= 2}
					<li>
						<a href="#{year}-q2" class:active={!disableActiveIndicator && quarter === 2}>
							Q2
						</a>
					</li>
				{/if}
				{#if startQuarter <= 3 && endQuarter >= 3}
					<li>
						<a href="#{year}-q3" class:active={!disableActiveIndicator && quarter === 3}>
							Q3
						</a>
					</li>
				{/if}
				{#if startQuarter <= 4 && endQuarter >= 4}
					<li>
						<a href="#{year}-q4" class:active={!disableActiveIndicator && quarter === 4}>
							Q4
						</a>
					</li>
				{/if}
			{/if}
			{#if tabs === 'month'}
				{#if startMonth <= 1 && endMonth >= 1}
					<li>
						<a href="#{year}-1" class:active={!disableActiveIndicator && month === 1}>
							Jan
						</a>
					</li>
				{/if}
				{#if startMonth <= 2 && endMonth >= 2}
					<li>
						<a href="#{year}-2" class:active={!disableActiveIndicator && month === 2}>
							Feb
						</a>
					</li>
				{/if}
				{#if startMonth <= 3 && endMonth >= 3}
					<li>
						<a href="#{year}-3" class:active={!disableActiveIndicator && month === 3}>
							Mar
						</a>
					</li>
				{/if}
				{#if startMonth <= 4 && endMonth >= 4}
					<li>
						<a href="#{year}-4" class:active={!disableActiveIndicator && month === 4}>
							Apr
						</a>
					</li>
				{/if}
				{#if startMonth <= 5 && endMonth >= 5}
					<li>
						<a href="#{year}-5" class:active={!disableActiveIndicator && month === 5}>
							May
						</a>
					</li>
				{/if}
				{#if startMonth <= 6 && endMonth >= 6}
					<li>
						<a href="#{year}-6" class:active={!disableActiveIndicator && month === 6}>
							Jun
						</a>
					</li>
				{/if}
				{#if startMonth <= 7 && endMonth >= 7}
					<li>
						<a href="#{year}-7" class:active={!disableActiveIndicator && month === 7}>
							Jul
						</a>
					</li>
				{/if}
				{#if startMonth <= 8 && endMonth >= 8}
					<li>
						<a href="#{year}-8" class:active={!disableActiveIndicator && month === 8}>
							Aug
						</a>
					</li>
				{/if}
				{#if startMonth <= 9 && endMonth >= 9}
					<li>
						<a href="#{year}-9" class:active={!disableActiveIndicator && month === 9}>
							Sep
						</a>
					</li>
				{/if}
				{#if startMonth <= 10 && endMonth >= 10}
					<li>
						<a href="#{year}-10" class:active={!disableActiveIndicator && month === 10}>
							Oct
						</a>
					</li>
				{/if}
				{#if startMonth <= 11 && endMonth >= 11}
					<li>
						<a href="#{year}-11" class:active={!disableActiveIndicator && month === 11}>
							Nov
						</a>
					</li>
				{/if}
				{#if startMonth <= 12 && endMonth >= 12}
					<li>
						<a href="#{year}-12" class:active={!disableActiveIndicator && month === 12}>
							Dec
						</a>
					</li>
				{/if}
			{/if}
			{#if tabs === 'week'}
				{#each new Array(Math.min(numWeeks, numWeeksInSideNav)) as _, i}
					{@const w = startWeek + i + 1}
					<li class="week">
						<a href="#{year}-wk{w}" class:active={!disableActiveIndicator && week === w}>
							<small>WK</small>
							{w}
						</a>
					</li>
				{/each}
			{/if}
			{#if tabs === 'day'}
				{#each new Array(Math.min(numDays, numDaysInSideNav)) as _, i}
					{@const d = startDay + i + 1}
					<li class="day">
						<a
							href="#{year}-{month}-{d}"
							class:active={!disableActiveIndicator && day === d}>
							<span class="weekday">
								{new Date(year, month, d).toLocaleString('default', { weekday: 'short' })}
							</span>
							{d}
						</a>
					</li>
				{/each}
			{/if}
		</ol>
	{/if}
	<div class="spacer"></div>
	{#if links?.length}
		<ol class="links">
			{#each [...links].reverse() as link, i (link.href)}
				<li><a href={link.href}>{link.name}</a></li>
				{#if i !== links.length - 1}
					<li class="separator">/</li>
				{/if}
			{/each}
		</ol>
	{/if}
</nav>

<style lang="scss">
	nav {
		display: flex;
		align-items: center;
		flex-direction: column;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: var(--sidenav-width);
		padding: var(--sidenav-width) 0 0;
		background-color: var(--nav-bg);
	}
	.spacer {
		flex: 1;
	}
	ol {
		list-style: none;
		padding: 0;
		width: 100%;
		margin: 0;
	}
	ol.tabs > li {
		padding: 0;
		margin: 0;
		width: 100%;
		padding: 0 0 0 2px;
		&.week {
			a {
				font-size: 1.1rem;
				line-height: 100%;
			}
			small {
				color: currentColor;
				line-height: 100%;
				font-size: 0.65em;
				margin-right: 0.15em;
			}
		}
		&.day {
			.weekday {
				line-height: 100%;
				font-size: 0.55em;
				margin-right: 0.25em;
				opacity: 0.7;
			}
			a {
				font-size: 1.2rem;
				line-height: 100%;
			}
		}
		a {
			--radius: 10px;
			text-decoration: none;
			width: 100%;
			display: flex;
			text-align: center;
			align-items: center;
			justify-content: center;
			padding: 0.75rem 0;
			color: var(--text-low);
			font-family: var(--font-display);
			font-size: 1rem;
			position: relative;
			border-radius: var(--radius);
			&.active {
				background-color: var(--bg);
				color: var(--text-high);
			}
		}
		a.active {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			box-shadow: 1px 0 var(--bg);
			&::before,
			&::after {
				content: '';
				height: calc(2 * var(--radius));
				width: var(--radius);
				position: absolute;
			}
			&::before {
				right: 0;
				top: calc(-2 * var(--radius));
				border-top-right-radius: 0;
				border-bottom-right-radius: var(--radius);
				box-shadow: var(--bg) 1px var(--radius) 0px 0px;
			}
			&::after {
				right: 0;
				bottom: calc(-2 * var(--radius));
				border-top-left-radius: 0;
				border-top-right-radius: var(--radius);
				box-shadow: var(--bg) 1px calc(-1 * var(--radius)) 0px 0px;
			}
		}
	}

	ol.links > li {
		writing-mode: vertical-lr;
		text-orientation: mixed;
		transform: rotate(180deg);
		line-height: var(--sidenav-width);
		a {
			font-family: var(--font-display);
			text-decoration: none;
			color: var(--text-low);
			display: block;
			height: 100%;
			padding: 0.5rem 0;
			font-size: 1rem;
		}
		&:last-child {
			a {
				padding-top: 1rem;
			}
		}
		&:first-child {
			a {
				padding-bottom: 1rem;
			}
		}
	}
	li.separator {
		margin: 0;
		color: var(--text-low);
		opacity: 0.6;
	}
</style>
