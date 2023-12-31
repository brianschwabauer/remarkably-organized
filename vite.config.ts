import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { fileURLToPath } from 'url';
const stylesPath = fileURLToPath(
	new URL('./src/lib/styles/_variables.scss', import.meta.url),
);

export default defineConfig({
	plugins: [sveltekit(), Icons({ compiler: 'svelte' })],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import '${stylesPath.replace(/\\/g, '/')}';`,
			},
		},
	},
	server: {
		fs: {
			allow: ['./src', './static'],
		},
	},
});
