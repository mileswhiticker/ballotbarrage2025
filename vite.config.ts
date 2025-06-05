import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
	port: 53076,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@game': path.resolve(__dirname, 'src/game'),
			'@controllers': path.resolve(__dirname, 'src/game/controllers'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@utils': path.resolve(__dirname, 'src/utils'),
		},
	},

	base: '/ballotbarrage2025/'
})
