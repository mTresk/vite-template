import { resolve } from 'path'
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
	plugins: [
		ViteImageOptimizer({}),
		handlebars({
			partialDirectory: resolve(__dirname, 'partials'),
		}),
	],
	build: {
		minify: false,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
			},
		},
	},
	server: {
		port: 3000,
		host: '0.0.0.0',
		open: true,
	},
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler',
				silenceDeprecations: ['import'],
			},
		},
	},
})
