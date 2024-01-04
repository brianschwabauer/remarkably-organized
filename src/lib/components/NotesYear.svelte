<script lang="ts">
	import type { Month, PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings, months = [] as Month[] } = $props();

	function getMonthLink(month: Month) {
		if (!settings.monthPage) return month.id;
		if (!settings.monthPage.disable) return month.id;
		if (!settings.weekPage.disable) {
			const week = settings.weeks.find(
				(week) => week.year === month.year && week.month === month.month,
			);
			return week ? week.id : '';
		}
		if (!settings.dayPage.disable) {
			const day = settings.days.find(
				(day) => day.year === month.year && day.month === month.month,
			);
			return day ? day.id : '';
		}
		return month.id;
	}
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<a href="#{getMonthLink(month)}" class="month">
				<h2>{month.nameLong}</h2>
			</a>
		{/each}
	</div>
{:else}
	<div class="months">
		{#each new Array(12) as _, i (i)}
			<div class="month">
				<h2>
					{new Date(new Date().setMonth(i)).toLocaleString('default', { month: 'long' })}
				</h2>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.months {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(4, 1fr);
		flex: 1;
		width: 100%;
		height: 100%;
		padding: 0 2rem 2rem;
		h2 {
			text-align: center;
			font-size: 0.85rem;
			padding: 0.5rem 0 0.5rem;
			font-weight: 300;
		}
	}
	.month {
		border-left: solid 1px var(--outline);
		border-bottom: solid 1px var(--outline);
		&:nth-child(3n + 1) {
			border-left: none;
		}
		&:nth-last-child(1),
		&:nth-last-child(2),
		&:nth-last-child(3) {
			border-bottom: none;
		}
	}
</style>
