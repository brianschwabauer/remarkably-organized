import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { fileURLToPath } from 'url';
const stylesPath = fileURLToPath(
	new URL('./src/lib/styles/_variables.scss', import.meta.url),
);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		scss: {
			outputStyle: 'compressed',
			renderSync: true,
			prependData: `@import '${stylesPath.replace(/\\/g, '/')}';`,
		},
	}),
	vitePlugin: {
		inspector: {
			showToggleButton: 'active',
			toggleButtonPos: 'top-right',
		},
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
	},
};

export default config;
