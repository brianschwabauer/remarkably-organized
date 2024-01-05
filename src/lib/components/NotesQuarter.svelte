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
			<div class="month">
				<a href="#{getMonthLink(month)}"><h2>{month.nameLong}</h2></a>
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	.months {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding: 0 3rem 0;
		h2 {
			text-align: center;
			font-size: 1em;
			font-weight: var(--font-weight-light);
			padding: 0.5rem 0;
		}
	}
	.month {
		display: flex;
		flex: 1;
		align-items: start;
		justify-content: center;
		width: 100%;
		border-top: solid 1px var(--outline);
	}
</style>
