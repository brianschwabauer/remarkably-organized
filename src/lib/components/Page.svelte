<script lang="ts">
	import type { Collection, PlannerSettings, Timeframe } from '$lib';
	import Grid from './Grid.svelte';
	import NotesMonth from './NotesMonth.svelte';
	import NavigateQuarter from './NavigateQuarter.svelte';
	import NavigateYear from './NavigateYear.svelte';
	import NotesQuarter from './NotesQuarter.svelte';
	import NotesYear from './NotesYear.svelte';
	import NotesWeek from './NotesWeek.svelte';
	import NotesDay from './NotesDay.svelte';

	let {
		display = 'dotted' as Collection['type'],
		timeframe = {} as Timeframe,
		settings = {} as PlannerSettings,
		columns = undefined as number | undefined,
		lines = undefined as number | undefined,
		aspectRatio = 1.5,
		padding = null as string | null,
	} = $props();

	const size = $derived(
		display.endsWith('large') ? 'large' : display.endsWith('small') ? 'small' : 'medium',
	);
	const cols = $derived(
		display.startsWith('lined') || display.startsWith('numbered')
			? columns ?? 1
			: size === 'small'
				? 30
				: size === 'medium'
					? 25
					: 20,
	);
	const numLines = $derived(
		lines ?? (size === 'small' ? 40 : size === 'medium' ? 35 : 30),
	);
</script>

<div class="page {display.split('-')[0]}" style:padding>
	{#if display === 'notes-year'}
		<NotesYear months={settings.months.filter((m) => m.year === timeframe.year)} />
	{:else if display === 'navigate-year'}
		<NavigateYear
			months={settings.months.filter((m) => m.year === timeframe.year)}
			startWeekOnSunday={settings.date.startWeekOnSunday} />
	{:else if display === 'navigate-quarter'}
		<NavigateQuarter
			months={settings.months.filter(
				(m) => m.year === timeframe.year && m.quarter === timeframe.quarter,
			)}
			startWeekOnSunday={settings.date.startWeekOnSunday} />
	{:else if display === 'notes-quarter'}
		<NotesQuarter
			months={settings.months.filter(
				(m) => m.year === timeframe.year && m.quarter === timeframe.quarter,
			)} />
	{:else if display === 'notes-month'}
		<NotesMonth
			{timeframe}
			startWeekOnSunday={settings.date.startWeekOnSunday}
			showWeekLinks={!settings.weekPage.disable} />
	{:else if display === 'notes-week'}
		<NotesWeek {timeframe} />
	{:else if display === 'notes-day'}
		<NotesDay {timeframe} />
	{:else if display.startsWith('lined')}
		<Grid {display} columns={cols} lines={numLines} {aspectRatio} />
	{:else if display.startsWith('numbered')}
		<Grid {display} columns={cols} lines={numLines} {aspectRatio} />
	{:else if display.startsWith('grid')}
		<Grid {display} {aspectRatio} />
	{:else if display.startsWith('dotted')}
		<Grid {display} {aspectRatio} />
	{/if}
</div>

<style lang="scss">
	.page {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;

		&:not(.lined) {
			padding-top: 0.5rem;
		}
		&.dotted {
			height: calc(100% - 2rem);
		}
		&.grid {
			height: calc(100% - 2rem);
		}
		&.lined {
			padding: 0 2rem 1rem;
		}
		&.numbered {
			padding: 0 2rem 1rem;
		}
	}
</style>