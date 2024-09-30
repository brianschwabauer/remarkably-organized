<script lang="ts">
	import type { Month, PlannerSettings } from '$lib';

	let {
		settings = {} as PlannerSettings,
		months = [] as Month[],
		startWeekOnSunday = false,
	} = $props();

	function getMonthLink(month: Month) {
		if (!settings.monthPage) return month.id;
		if (!settings.monthPage.disable) return month.id;
		if (!settings.weekPage.disable) {
			const week = settings.weeks.find(
				(week) => week.month === month.month && week.year === month.year,
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


	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	function getShortWeekdayNames(lang) {
		let days = [];
	  	for (let d = new Date(2023,5,12), i=7; i; --i) {
	    		days.push(d.toLocaleString(lang, {weekday:'short'}));
	    		d.setDate(d.getDate() + 1);
	  	}
	  	return days;
	}

	function monday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[0])
        }

	function tuesday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[1])
        }

	function wednesday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[2])
        }

	function thursday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[3])
        }

	function friday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[4])
        }

	function saturday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[5])
        }

	function sunday() {
	   	return capitalizeFirstLetter(getShortWeekdayNames("default")[6])
        }
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<a href="#{getMonthLink(month)}" class="month">
				<h2>{month.nameLong}</h2>
				<div class="days">
					{#if startWeekOnSunday}
						<div class="label">{ sunday() }</div>
					{/if}
					<div class="label">{ monday() }</div>
					<div class="label">{ tuesday() }</div>
					<div class="label">{ wednesday() }</div>
					<div class="label">{ thursday() }</div>
					<div class="label">{ friday() }</div>
					<div class="label">{ saturday() }</div>
					{#if !startWeekOnSunday}
						<div class="label">{ sunday() }</div>
					{/if}
					{#each new Array(month.end.getUTCDate()) as _, day}
						<div
							class="day"
							style:grid-column={day > 0
								? null
								: ((month.start.getUTCDay() - (startWeekOnSunday ? 0 : 1) + 7) % 7) + 1}>
							{day + 1}
						</div>
					{/each}
				</div>
			</a>
		{/each}
	</div>
{/if}

<style lang="scss">
	.months {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(4, 1fr);
		align-items: start;
		gap: 0rem 1.5rem;
		flex: 1;
		width: 100%;
		height: 100%;
		padding: 0 1.5rem 3.5rem;
		h2 {
			text-align: center;
			font-size: 1.2em;
			font-weight: var(--font-weight-normal);
			padding: 0 0 0.25rem;
			line-height: 1.2rem;
		}
	}
	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		justify-items: center;
		align-items: center;
		gap: 0.15rem 0.25rem;
		.label {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.65em;
			font-weight: var(--font-weight-bold);
			color: var(--text-low);
		}
		.day {
			font-size: 1.1em;
			font-weight: var(--font-weight-light);
			line-height: 1.3rem;
		}
	}
</style>
