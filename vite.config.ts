import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: ['es2020']
	},
	optimizeDeps: { esbuildOptions: { target: 'es2020' } }
});
