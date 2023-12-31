<script lang="ts">
	let {
		name = '',
		email = '',
		start = new Date() as Date,
		end = new Date() as Date,
		today = undefined as Date | undefined,
		dark = true,
		links = [] as { name: string; href: string }[],
	} = $props();
</script>

<article class:dark id="home">
	<header>
		{#if start.getUTCFullYear() !== end.getUTCFullYear()}
			<h1 class="multi-year">
				<div class="start">
					<small>
						{start.toLocaleString('default', { month: 'long', timeZone: 'UTC' })}
					</small>
					{start.getUTCFullYear()}
				</div>
				<div class="separator">-</div>
				<div class="end">
					<small>
						{end.toLocaleString('default', { month: 'long', timeZone: 'UTC' })}
					</small>
					{end.getUTCFullYear()}
				</div>
			</h1>
		{:else}
			<h1>{start.getUTCFullYear()}</h1>
		{/if}
		{#if today}
			{@const quarter = Math.floor(today.getUTCMonth() / 3) + 1}
			{@const monthName = today.toLocaleString('default', {
				month: 'long',
				timeZone: 'UTC',
			})}
			{@const dayName = today.toLocaleString('default', {
				weekday: 'long',
				timeZone: 'UTC',
			})}
			{@const currentWeek = Math.ceil(today.getUTCDate() / 7)}
			{@const dateOrdinal =
				today.getUTCDate() > 0
					? ['th', 'st', 'nd', 'rd'][
							(today.getUTCDate() > 3 && today.getUTCDate() < 21) ||
							today.getUTCDate() > 23
								? 0
								: today.getUTCDate() % 10
						]
					: ''}
			<div class="actions">
				<a href="#{today.getUTCFullYear()}">{today.getUTCFullYear()}</a>
				<a href="#{today.getUTCFullYear()}-q{quarter}">Q{quarter}</a>
				<a href="#{today.getUTCFullYear()}-{today.getUTCMonth() + 1}">{monthName}</a>
				<a href="#{today.getUTCFullYear()}-{today.getUTCMonth() + 1}-w{currentWeek}">
					{dayName}
				</a>
				<a
					href="#{today.getUTCFullYear()}-{today.getUTCMonth() + 1}-{today.getUTCDate()}">
					{today.getUTCDate()}
					<small>{dateOrdinal}</small>
				</a>
			</div>
		{/if}
		{#if links?.length}
			<div class="links">
				{#each links as link, i (link.href)}
					<a href={link.href}>{link.name}</a>
					{#if i !== links.length - 1}
						<span class="separator">/</span>
					{/if}
				{/each}
			</div>
		{/if}
	</header>
	{#if name || email}
		<footer>
			{name}
			<small>{email}</small>
		</footer>
	{/if}
</article>

<style lang="scss">
	header {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
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
		margin: 2rem 0 0;
		a {
			display: flex;
			border-radius: 10px;
			text-decoration: none;
			gap: 0.05rem;
			padding: 1rem 1rem;
		}
	}
	h1 {
		font-family: var(--font-display);
		font-size: 12rem;
		font-weight: 400;
		line-height: 1;
		text-align: center;
		margin: 0;
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
