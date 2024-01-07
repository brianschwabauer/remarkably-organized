<script lang="ts">
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import { backOut, backIn } from 'svelte/easing';
	import { toastState } from './toast.state.svelte';

	/** Whether the background color should be the accent/primary/brand color. */
	export let accent = false;

	/** The css style string added to the component from the parent */
	export let style: string | null = null;

	/** Specifies a custom class name for the container element */
	let className = '';
	export { className as class };
</script>

{#if toastState.list.length}
	<section class="toast-group {className}" style:--max-chars="{120}ch" {style}>
		{#each toastState.list as toast (toast.id)}
			<output
				class="toast"
				class:success={toast.level === 'success'}
				class:error={toast.level === 'error'}
				class:accent
				aria-live="polite"
				id="toast-{toast.id}"
				animate:flip={{ easing: backOut, duration: 300 }}
				in:scale|global={{ easing: backOut, duration: 300, start: 0.5 }}
				out:scale|global={{ easing: backIn, duration: 150, start: 0 }}>
				{toast.message}
			</output>
		{/each}
	</section>
{/if}

<style lang="scss">
	.toast-group {
		--layer: 10;
		--bg: var(--action);
		--text: var(--action-text);
		--shadow: var(--shadow-2);
		position: fixed;
		z-index: var(--layer);

		inset-block-end: 0;
		inset-inline: 0;
		padding-block-end: max(5vh, calc(var(--page-bottom-padding, 0px) + 1vh));

		display: grid;
		justify-items: center;
		justify-content: center;
		gap: 1vh;

		/* optimizations */
		pointer-events: none;
	}

	.toast {
		background-color: var(--bg);
		color: var(--text);
		box-shadow: var(--shadow);
		border-radius: var(--radius-round);
		font-size: 1rem;
		max-width: min(calc(var(--max-chars) / 2.35), calc(90vw - 6ch));
		padding: 0.75rem 3ch;
		line-height: 1.25;
		box-sizing: content-box;
		word-break: break-all;

		&.error {
			background-color: var(--error);
			color: var(--error-text);
		}
		&.success {
			background-color: var(--success);
			color: var(--success-text);
		}
		&.accent {
			background-color: var(--accent);
			color: var(--accent-text);
		}
	}
</style>
