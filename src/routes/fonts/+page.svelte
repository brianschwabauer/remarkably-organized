<script lang="ts">
	import { fonts } from './fonts';

	const selectedFontsQuery = $derived(
		new URLSearchParams(
			fonts.map((font) => ['family', `${font.name}:wght@100;200;300;400;500;600;700`]),
		).toString(),
	);
	const googleFontURL = $derived(
		`https://fonts.googleapis.com/css2?display=swap&${selectedFontsQuery}`,
	);
	const googleFontImport = $derived(
		googleFontURL ? `@import url("${googleFontURL}");` : '',
	);
</script>

<svelte:head>
	{#if googleFontImport}
		{@html `<style type="text/css">${googleFontImport}</style>`}
	{/if}
</svelte:head>

{#each fonts as font (font.name)}
	<div class="font">
		<div
			class="font-display"
			style:font-family={font.name}
			style:font-size="{font.size}em">
			<span style="font-weight:{font.boldWeight}">
				{new Date().toLocaleDateString('default', {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</span>
			<span style="font-weight:{font.normalWeight}">
				{new Date().toLocaleDateString('default', {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</span>
			<span style="font-weight:{font.lightWeight}">
				<!-- {font.name} -->
				{new Date().toLocaleDateString('default', {
					weekday: 'long',
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</span>
		</div>
	</div>
{/each}

<style lang="scss">
	:global(body) {
		background-color: white;
	}
	.font {
		font-size: 2rem;
		margin: 1rem 0 0 2rem;
	}
	.font-display {
		display: flex;
		gap: 0 3rem;
	}
</style>
