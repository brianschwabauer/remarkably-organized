<script lang="ts">
	import { intersect, type PlannerSettings } from '$lib';

	let { settings = {} as PlannerSettings } = $props();

	const plannerLink = $derived(
		!settings.yearPage.disable
			? `#${settings.years[0].id}`
			: !settings.quarterPage.disable
				? `#${settings.quarters[0].id}`
				: !settings.monthPage.disable
					? `#${settings.months[0].id}`
					: !settings.weekPage.disable
						? `#${settings.weeks[0].id}`
						: !settings.dayPage.disable
							? `#${settings.days[0].id}`
							: '',
	);
</script>

<article
	class:dark={settings.coverPage.darkBackground}
	id="home"
	use:intersect={{ rootMargin: '1000px 0px 1000px 0px' }}>
	<header>
		{#if settings.coverPage.title}
			<h1 class="title">{settings.coverPage.title}</h1>
		{:else if settings.years.length > 1}
			<h1 class="multi-year">
				<div class="start">
					<small>
						{settings.years[0].start.toLocaleString('default', {
							month: 'long',
							timeZone: 'UTC',
						})}
					</small>
					{settings.years[0].year}
				</div>
				<div class="separator">-</div>
				<div class="end">
					<small>
						{settings.years[settings.years.length - 1].end.toLocaleString('default', {
							month: 'long',
							timeZone: 'UTC',
						})}
					</small>
					{settings.years[settings.years.length - 1].year}
				</div>
			</h1>
		{:else}
			<h1>{settings.years[0].year}</h1>
		{/if}
		{#if settings.date.today && settings.coverPage.showCurrentDay}
			{@const quarter = Math.floor(settings.date.today.getUTCMonth() / 3) + 1}
			{@const monthName = settings.date.today.toLocaleString('default', {
				month: 'long',
				timeZone: 'UTC',
			})}
			{@const dayName = settings.date.today.toLocaleString('default', {
				weekday: 'long',
				timeZone: 'UTC',
			})}
			{@const currentWeek = Math.ceil(settings.date.today.getUTCDate() / 7)}
			{@const dateOrdinal =
				settings.date.today.getUTCDate() > 0
					? ['th', 'st', 'nd', 'rd'][
							(settings.date.today.getUTCDate() > 3 &&
								settings.date.today.getUTCDate() < 21) ||
							settings.date.today.getUTCDate() > 23
								? 0
								: settings.date.today.getUTCDate() % 10
						]
					: ''}
			<div class="actions">
				<a href="#{settings.date.today.getUTCFullYear()}">
					{settings.date.today.getUTCFullYear()}
				</a>
				<a href="#{settings.date.today.getUTCFullYear()}-q{quarter}">Q{quarter}</a>
				<a
					href="#{settings.date.today.getUTCFullYear()}-{settings.date.today.getUTCMonth() +
						1}">
					{monthName}
				</a>
				<a
					href="#{settings.date.today.getUTCFullYear()}-{settings.date.today.getUTCMonth() +
						1}-w{currentWeek}">
					{dayName}
				</a>
				<a
					href="#{settings.date.today.getUTCFullYear()}-{settings.date.today.getUTCMonth() +
						1}-{settings.date.today.getUTCDate()}">
					{settings.date.today.getUTCDate()}
					<small>{dateOrdinal}</small>
				</a>
			</div>
		{/if}
		{#if settings.collections?.length && settings.coverPage.showCollectionLinks}
			<div class="links">
				{#if plannerLink}<a href={plannerLink}>Planner</a>{/if}
				{#if plannerLink && settings.collections.length}
					<span class="separator">/</span>
				{/if}
				{#each settings.collections as collection, i (collection.id)}
					<a href="#{collection.id}">{collection.name}</a>
					{#if i !== settings.collections.length - 1}
						<span class="separator">/</span>
					{/if}
				{/each}
			</div>
		{/if}
	</header>
	{#if settings.coverPage.name || settings.coverPage.email}
		<footer>
			{settings.coverPage.name}
			<small>{settings.coverPage.email}</small>
		</footer>
	{/if}
</article>

<style lang="scss">
	header {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}
	article {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		&.dark {
			background-color: #3d3d3d;
			color: #ccc;
			h1 {
				color: white;
			}
			.actions a {
				background-color: #222;
				color: #ccc;
			}
			.links a {
				color: #ccc;
			}
		}
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		a {
			display: flex;
			padding: 0.5rem 0.75rem;
			border-radius: 10px;
			background-color: #eee;
			color: #333;
			text-decoration: none;
			gap: 0.05rem;
			small {
				color: currentColor;
			}
		}
	}
	.links {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 2rem auto 0;
		flex-wrap: wrap;
		max-width: 80%;
		a {
			display: flex;
			border-radius: 10px;
			text-decoration: none;
			gap: 0 0.05rem;
			padding: 1rem 0.75rem;
			font-weight: bold;
			margin: -.5rem 0;
		}
	}
	h1 {
		font-family: var(--font-display);
		font-size: 12rem;
		font-weight: 400;
		line-height: 1;
		text-align: center;
		margin: 0;
		padding: 0 2rem;
		text-wrap: balance;
		&.title {
			font-size: 5rem;
			font-weight: bold;
		}
		&.multi-year {
			display: flex;
			font-size: 8rem;
			line-height: 8rem;
			align-items: end;
			margin-bottom: 0.5rem;
			.separator {
				opacity: 0.5;
				font-size: 5rem;
				margin: 0 0.5rem;
			}
			.start,
			.end {
				display: flex;
				flex-direction: column;
			}
			small {
				line-height: 1rem;
				font-size: 1rem;
				font-family: var(--font);
			}
		}
	}
	footer {
		height: 15%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
