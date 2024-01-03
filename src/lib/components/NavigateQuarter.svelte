<script lang="ts">
	import type { Month } from '$lib';

	let { months = [] as Month[], startWeekOnSunday = false } = $props();
</script>

{#if months.length}
	<div class="months">
		{#each months as month (month.id)}
			<div class="month">
				<a href="#{month.id}" class="calendar">
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
									: month.start.getUTCDay() + (startWeekOnSunday ? 1 : 0)}>
								{day + 1}
							</div>
						{/each}
					</div>
				</a>
				<div class="notes"></div>
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
		padding: 0 2rem 0;
		h2 {
			font-size: 1;
			text-align: center;
			font-size: .85rem;
			font-weight: normal;
			padding: 0 0 0.5rem;
		}
	}
	.month {
		display: flex;
		flex: 1;
		align-items: start;
		width: 100%;
		border-bottom: solid 1px var(--outline-low);
		padding: 1rem 0 0;
		&:last-child {
			border-bottom: none;
		}
	}
	.notes {
		flex: 1;
	}
	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(6, 1fr);
		justify-items: center;
		align-items: center;
		gap: 0.15rem .55rem;
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
			font-weight: lighter;
		}
	}
</style>
