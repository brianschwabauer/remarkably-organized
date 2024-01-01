<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let { onClose = (() => {}) as () => void } = $props();

	function handleKeyup(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keyup={handleKeyup} />

<div class="help-modal">
	<div class="help" transition:scale={{ duration: 150 }}>
		<h2>How to Use Planner Generator</h2>
		<p>
			Use the settings panel to customize the planner to your liking. The preview of the
			planner will be updated live. The URL of the page will also be updated. You can
			share this URL with others to show them your planner.
		</p>
		<p>
			You can change the start and end dates of the planner. For example, you can create a
			planner that starts in August 2024 and ends in July 2025.
		</p>
		<p>
			You can also add "collections" to the planner. Think of a collection as a group of
			note pages with an index page for easy navigation. By default there is a collection
			called "Notes" and "Goals". You can add more collections of different designs - like
			lined pages, dotted pages, etc.
		</p>
		<p>
			When you are ready to download the planner as a PDF, use the built in Chrome print
			dialog. Make sure to select "Save as PDF" as the destination.
		</p>
		<div class="actions">
			<button on:click={onClose}>Get Started</button>
		</div>
	</div>
	<div class="help-bg" transition:fade={{ duration: 150 }}></div>
</div>

<style lang="scss">
	.help-modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
		.help {
			background-color: white;
			padding: 2rem 2rem 1rem;
			border-radius: 30px;
			max-width: min(100vw, 550px);
			max-height: 90vh;
			width: 100%;
			position: relative;
			z-index: 100;
			overflow-y: scroll;
			overflow-x: hidden;
			@include scrollbar;
			&::-webkit-scrollbar-track-piece:start {
				margin-top: 30px;
			}
			&::-webkit-scrollbar-track-piece:end {
				margin-bottom: 30px;
			}
			h2 {
				margin: 0 0 1rem;
				font-size: 2rem;
			}
			p {
				margin: 0.5rem 0;
			}
			.actions {
				position: sticky;
				bottom: -1rem;
				background-color: white;
				margin-top: 1rem;
				padding: 1rem 0;
			}
			button {
				width: 100%;
				padding: 1rem;
				font-size: 1.5rem;
				background-color: #333333;
				color: white;
				border-radius: 999px;
				&:hover {
					background-color: #000000;
				}
			}
		}
		.help-bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
			background-color: rgba(0, 0, 0, 0.75);
			@supports (backdrop-filter: blur(10px)) {
				background-color: rgba(0, 0, 0, 0.35);
				backdrop-filter: blur(10px);
			}
		}
	}
</style>
