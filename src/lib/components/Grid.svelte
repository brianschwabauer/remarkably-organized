<script lang="ts">
	import type { Collection } from '$lib';

	let {
		display = 'dotted' as Collection['type'],
		columns = undefined as number | undefined,
		lines = undefined as number | undefined,
		majorSize = 10,
		minorSize = 5,
		aspectRatio = 1.5,
	} = $props();

	const cols = $derived(
		columns ??
			(display === 'lined' ||
			display === 'lined-large' ||
			display === 'numbered' ||
			display === 'numbered-large'
				? 1
				: display === 'dotted' || display === 'grid'
					? 30
					: 20),
	);
	const numLines = $derived(lines ?? (display.endsWith('large') ? 30 : 40));
</script>

{#if display === 'dotted' || display === 'dotted-large'}
	<div class="dots" style:--cols={cols}>
		{#each new Array(cols * cols * aspectRatio) as _, i (i)}
			<div
				class="dot"
				class:last-col={i % cols === cols - 1}
				class:major-col={(i % cols) % majorSize === 0}
				class:major-row={i % (cols * majorSize) < cols}
				class:minor-col={(i % cols) % minorSize === 0}
				class:minor-row={i % (cols * minorSize) < cols}
				class:wrap-major={cols % majorSize === 0}
				class:wrap-minor={cols % minorSize === 0}>
			</div>
		{/each}
	</div>
{/if}

{#if display === 'grid' || display === 'grid-large'}
	<div class="grid" style:--cols={cols}>
		{#each new Array(cols * cols * aspectRatio) as _, i (i)}
			<div
				class="line"
				class:last-col={i % cols === cols - 1}
				class:major-col={(i % cols) % majorSize === 0}
				class:major-row={i % (cols * majorSize) < cols}
				class:minor-col={(i % cols) % minorSize === 0}
				class:minor-row={i % (cols * minorSize) < cols}
				class:wrap-major={cols % majorSize === 0}
				class:wrap-minor={cols % minorSize === 0}>
			</div>
		{/each}
	</div>
{/if}

{#if display === 'lined' || display === 'lined-large' || display === 'numbered' || display === 'numbered-large'}
	<div class="lined" style:--cols={cols} style:--lines={numLines}>
		{#each new Array(numLines * cols) as _, i (i)}
			{#if display === 'numbered' || display === 'numbered-large'}
				<div class="line">{i + 1}&#41;</div>
			{:else}
				<div class="line"></div>
			{/if}
		{/each}
	</div>
{/if}

<style lang="scss">
	.dots {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		padding: 0 calc(100% / var(--cols));
		--dot-size: 1px;
		--minor-dot-size: 2px;
		--major-dot-size: 2px;
		--dot-color: rgba(0, 0, 0, 0.75);
		--minor-dot-color: rgba(0, 0, 0, 0.35);
		--major-dot-color: rgba(0, 0, 0, 0.65);
	}
	.dot {
		width: 100%;
		aspect-ratio: 1;
		position: relative;
		&::before {
			display: block;
			content: '';
			border-radius: 100%;
			width: var(--dot-size);
			height: var(--dot-size);
			background-color: var(--dot-color);
		}
		&.last-col {
			&::after {
				display: block;
				content: '';
				border-radius: 100%;
				width: var(--dot-size);
				height: var(--dot-size);
				background-color: var(--dot-color);
				position: absolute;
				right: 0;
			}
			&.wrap-minor.minor-row {
				&::after {
					width: var(--minor-dot-size);
					height: var(--minor-dot-size);
					background-color: var(--minor-dot-color);
				}
			}
			&.wrap-major.major-row {
				&::after {
					width: var(--major-dot-size);
					height: var(--major-dot-size);
					background-color: var(--major-dot-color);
				}
			}
		}
		&.minor-row.minor-col {
			&::before {
				width: var(--minor-dot-size);
				height: var(--minor-dot-size);
				background-color: var(--minor-dot-color);
			}
		}
		&.major-row.major-col {
			&::before {
				width: var(--major-dot-size);
				height: var(--major-dot-size);
				background-color: var(--major-dot-color);
			}
		}
	}
	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		padding: 0 calc(100% / var(--cols));
		--line-size: 1px;
		--minor-line-size: 2px;
		--major-line-size: 2px;
		--line-color: rgba(0, 0, 0, 0.2);
		--minor-line-color: rgba(0, 0, 0, 0.15);
		--major-line-color: rgba(0, 0, 0, 0.2);
		.line {
			width: 100%;
			aspect-ratio: 1;
			position: relative;
			border-left: solid var(--line-size) var(--line-color);
			border-top: solid var(--line-size) var(--line-color);
			&.last-col {
				border-right: solid var(--line-size) var(--line-color);
				&.wrap-minor {
					border-right: solid var(--minor-line-size) var(--minor-line-color);
				}
				&.wrap-major {
					border-right: solid var(--major-line-size) var(--major-line-color);
				}
			}
			&.minor-col {
				border-left: solid var(--minor-line-size) var(--minor-line-color);
			}
			&.minor-row {
				border-top: solid var(--minor-line-size) var(--minor-line-color);
			}
			&.major-col {
				border-left: solid var(--major-line-size) var(--major-line-color);
			}
			&.major-row {
				border-top: solid var(--major-line-size) var(--major-line-color);
			}
		}
	}

	.lined {
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: repeat(var(--cols), 1fr);
		grid-template-rows: repeat(var(--lines), 1fr);
		flex: 1;
		width: 100%;
		font-weight: lighter;
		height: 100%;
		padding: 0 0 calc(100% / var(--lines));
		gap: 0 1rem;
		.line {
			color: var(--text);
			border-bottom: solid 1px var(--outline-low);
			display: flex;
			align-items: end;
			font-size: 0.75rem;
			align-items: center;
		}
	}
</style>
