<script lang="ts">
	import { PlannerSettings, type Timeframe } from '$lib';

	let {
		timeframe = {} as Timeframe,
		settings = {} as PlannerSettings,
		tabs = 'month' as
			| 'days-this-week'
			| 'days-this-month'
			| 'days-this-year'
			| 'weeks-this-year'
			| 'weeks-this-month'
			| 'months'
			| 'quarters'
			| 'years'
			| 'none',
		numWeeksInSideNav = 15,
		numDaysInSideNav = 15,
		disableActiveIndicator = false,
	} = $props();

	const weekList = $derived(
		settings.weeks.filter(
			(week, i) =>
				week.year === timeframe.year &&
				(tabs === 'weeks-this-year' || week.month === timeframe.month) &&
				(tabs !== 'weeks-this-year' ||
					settings.weeks[i - 1]?.weekSinceYear !== week.weekSinceYear),
		),
	);
	const weekListActiveIndex = $derived(
		weekList.findIndex((week) => week.weekSinceYear === timeframe.weekSinceYear),
	);
	const startWeek = $derived(
		Math.min(
			weekList.length - numWeeksInSideNav,
			Math.ceil(Math.max(0, weekListActiveIndex - numWeeksInSideNav / 2)),
		),
	);
	const weeks = $derived(weekList.slice(startWeek, startWeek + numWeeksInSideNav));

	const dayList = $derived(
		settings.days.filter(
			(day) =>
				day.year === timeframe.year &&
				(tabs === 'days-this-week'
					? day.weekSinceYear === timeframe.weekSinceYear
					: tabs === 'days-this-month'
						? timeframe.month === day.month
						: true),
		),
	);
	const startDay = $derived(
		Math.min(
			dayList.length - numDaysInSideNav,
			Math.ceil(
				Math.max(
					0,
					(tabs === 'days-this-year'
						? timeframe.daySinceYear || 0
						: tabs === 'days-this-month'
							? timeframe.daySinceMonth || 0
							: timeframe.daySinceWeek || 0) -
						numDaysInSideNav / 2,
				),
			),
		),
	);
	const days = $derived(dayList.slice(startDay, startDay + numDaysInSideNav));
</script>

{#if !settings.sideNav.disable}
	<nav class:right={!settings.sideNav.leftSide}>
		{#if tabs !== 'none'}
			<ol class="tabs">
				{#if tabs === 'years' && settings.years.length > 1}
					{#each settings.years as year (year.id)}
						<li class="year">
							<a
								href="#{year.id}"
								class:active={!disableActiveIndicator && timeframe.year === year.year}>
								{year.year}
							</a>
						</li>
					{/each}
				{/if}
				{#if tabs === 'quarters'}
					{#each settings.quarters as quarter (quarter.id)}
						{#if quarter.year === timeframe.year}
							<li class="quarter">
								<a
									href="#{quarter.id}"
									class:active={!disableActiveIndicator &&
										timeframe.quarter === quarter.quarter}>
									{quarter.nameShort}
								</a>
							</li>
						{/if}
					{/each}
				{/if}
				{#if tabs === 'months'}
					{#each settings.months as month (month.id)}
						{#if month.year === timeframe.year}
							<li class="month">
								<a
									href="#{month.id}"
									class:active={!disableActiveIndicator &&
										timeframe.month === month.month}>
									{month.nameShort}
								</a>
							</li>
						{/if}
					{/each}
				{/if}
				{#if tabs === 'weeks-this-year' || tabs === 'weeks-this-month'}
					{#each weeks as week, i (week.id)}
						{@const isActive =
							!disableActiveIndicator && timeframe.weekSinceYear === week.weekSinceYear}
						{@const isNextWeekInMonth = weeks[i + 1]?.month === timeframe.month}
						{@const isNextWeekActive =
							!disableActiveIndicator &&
							weeks[i + 1]?.weekSinceYear === timeframe.weekSinceYear}
						{@const isPreviousWeekInMonth = weeks[i - 1]?.month === timeframe.month}
						{@const isPreviousWeekActive =
							!disableActiveIndicator &&
							weeks[i - 1]?.weekSinceYear === timeframe.weekSinceYear}
						{@const shouldHighlight =
							!isActive && timeframe.month === week.month && tabs === 'weeks-this-year'}
						{@const highlightStart =
							shouldHighlight && isNextWeekInMonth && !isNextWeekActive}
						{@const highlightEnd =
							shouldHighlight && isPreviousWeekInMonth && !isPreviousWeekActive}
						<li class="week">
							<a
								href="#{week.id}"
								class:active={isActive}
								class:highlight={shouldHighlight}
								class:highlight-start={highlightStart && !highlightEnd}
								class:highlight-middle={highlightStart && highlightEnd}
								class:highlight-end={highlightEnd && !highlightStart}>
								<small>
									{settings.weekPage.useWeekNumbersInSideNav
										? 'WK'
										: week.start.toLocaleString('default', {
												month: 'short',
												timeZone: 'UTC',
											})}
								</small>
								{!settings.weekPage.useWeekNumbersInSideNav
									? week.start.getUTCDate()
									: settings.weekPage.useWeekSinceYear
										? week.weekSinceYear
										: week.weekSinceMonth}
							</a>
						</li>
					{/each}
				{/if}
				{#if tabs === 'days-this-year' || tabs === 'days-this-month' || tabs === 'days-this-week'}
					{#each days as day, i (day.id)}
						{#if day.year === timeframe.year}
							{@const isActive =
								!disableActiveIndicator && timeframe.daySinceYear === day.daySinceYear}
							{@const isSaturday = day.start.getUTCDay() === 6}
							{@const isSunday = day.start.getUTCDay() === 0}
							{@const isWeekend = isSaturday || isSunday}
							{@const shouldHighlight =
								!isActive && isWeekend && tabs !== 'days-this-week'}
							{@const highlightStart =
								shouldHighlight && isSaturday && i < days.length - 1}
							{@const highlighEnd = shouldHighlight && isSunday && i > 0}
							<li class="day">
								<a
									href="#{day.id}"
									class:active={isActive}
									class:highlight={shouldHighlight}
									class:highlight-start={highlightStart}
									class:highlight-end={highlighEnd}>
									<span class="weekday">
										{day.start.toLocaleString('default', {
											weekday: 'short',
											timeZone: 'UTC',
										})}
									</span>
									{day.daySinceMonth}
								</a>
							</li>
						{/if}
					{/each}
				{/if}
			</ol>
		{/if}
		<div class="spacer"></div>
		{#if settings.sideNav.showCollectionLinks && settings.collections.length}
			<ol class="links">
				{#each [...settings.collections].reverse() as collection, i (collection.id)}
					<li><a href="#{collection.id}">{collection.name}</a></li>
					{#if i !== settings.collections.length - 1}
						<li class="separator">/</li>
					{/if}
				{/each}
			</ol>
		{/if}
	</nav>
{/if}

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
		font-family: var(--font-display);
		font-size: var(--font-display-size);
		&.right {
			left: auto;
			right: 0;
		}
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
		&.quarter {
			a {
				font-size: 1.3em;
				line-height: 1.3rem;
			}
		}
		&.week {
			a {
				font-size: 1.25em;
				line-height: 1.3rem;
			}
			small {
				color: currentColor;
				line-height: 1.3rem;
				font-size: 0.6em;
				margin-right: 0.15em;
			}
		}
		&.day {
			.weekday {
				line-height: 1.3rem;
				font-size: 0.55em;
				margin-right: 0.25em;
				opacity: 0.7;
			}
			a {
				font-size: 1.25em;
				line-height: 1.3rem;
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
			font-size: 1.1em;
			line-height: 1.5rem;
			position: relative;
			border-radius: var(--radius);
			&.active {
				background-color: var(--bg);
				color: var(--text-high);
			}
		}
		a.highlight {
			--tab-background: #cccccc;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			background-color: var(--tab-background);
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
				box-shadow: var(--tab-background) -1px var(--radius) 0px 0px;
			}
			&::after {
				right: 0;
				bottom: calc(-2 * var(--radius));
				border-top-left-radius: 0;
				border-top-right-radius: var(--radius);
				box-shadow: var(--tab-background) -1px calc(-1 * var(--radius)) 0px 0px;
			}
			&.highlight-start,
			&.highlight-middle {
				border-bottom-left-radius: 0;
			}
			&.highlight-end,
			&.highlight-middle {
				border-top-left-radius: 0;
			}
		}
		a.active {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
			box-shadow: 1px 0 var(--bg);
			z-index: 1;
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
	nav.right ol.tabs > li {
		padding: 0 2px 0 0;
		a.highlight {
			border-top-right-radius: var(--radius);
			border-bottom-right-radius: var(--radius);
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			&::before {
				right: unset;
				top: calc(-2 * var(--radius));
				left: 0;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				border-bottom-left-radius: var(--radius);
				box-shadow: var(--tab-background) 0px var(--radius) 0px 0px;
			}
			&::after {
				right: unset;
				left: 0;
				bottom: calc(-2 * var(--radius));
				border-top-right-radius: 0;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				border-top-left-radius: var(--radius);
				box-shadow: var(--tab-background) 0px calc(-1 * var(--radius)) 0px 0px;
			}
			&.highlight-start,
			&.highlight-middle {
				border-bottom-right-radius: 0;
			}
			&.highlight-end,
			&.highlight-middle {
				border-top-right-radius: 0;
			}
		}
		a.active {
			border-top-right-radius: var(--radius);
			border-bottom-right-radius: var(--radius);
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			box-shadow: -1px 0 var(--bg);
			&::before {
				right: unset;
				top: calc(-2 * var(--radius));
				left: 0;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				border-bottom-left-radius: var(--radius);
				box-shadow: var(--bg) -1px var(--radius) 0px 0px;
			}
			&::after {
				right: unset;
				left: 0;
				bottom: calc(-2 * var(--radius));
				border-top-right-radius: 0;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				border-top-left-radius: var(--radius);
				box-shadow: var(--bg) -1px calc(-1 * var(--radius)) 0px 0px;
			}
		}
	}

	ol.links > li {
		writing-mode: vertical-lr;
		text-orientation: mixed;
		transform: rotate(180deg);
		line-height: var(--sidenav-width);
		a {
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
		opacity: 0.8;
	}
</style>
