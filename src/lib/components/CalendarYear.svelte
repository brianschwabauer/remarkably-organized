<script lang="ts">
	import type { Month } from '$lib';

	let { months = [] as Month[], startWeekOnSunday = false } = $props();
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<a href="#{month.id}" class="month">
				<h2>{month.nameLong}</h2>
				<div class="days">
					{#if startWeekOnSunday}
						<div class="label">Su</div>
					{/if}
					<div class="label">Mo</div>
					<div class="label">Tu</div>
					<div class="label">We</div>
					<div class="label">Th</div>
					<div class="label">Fr</div>
					<div class="label">Sa</div>
					{#if !startWeekOnSunday}
						<div class="label">Su</div>
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
		gap: .5rem 1.5rem;
		flex: 1;
		width: 100%;
		height: 100%;
		padding: 0 1.5rem 2.5rem;
		h2 {
			font-size: 1;
			text-align: center;
			font-size: 1.1rem;
			font-weight: normal;
			padding: 0 0 0.5rem;
		}
	}
	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		justify-items: center;
		align-items: center;
		grid-gap: 0.15rem 0.25rem;
		.label {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.65rem;
			font-weight: bold;
			color: var(--text-low);
		}
		.day {
			font-size: 0.9rem;
			font-weight: 300;
		}
	}
</style>
