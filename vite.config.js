// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	base : "/logo/",
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				arabic1: resolve(__dirname, 'arabic-1/index.html'),
				arabic2: resolve(__dirname, 'arabic-2/index.html'),
				flat1: resolve(__dirname, 'flat-1/index.html'),
				flat2: resolve(__dirname, 'flat-2/index.html'),
				grid1: resolve(__dirname, 'grid-1/index.html'),
				grid2: resolve(__dirname, 'grid-2/index.html'),
				grid3: resolve(__dirname, 'grid-3/index.html'),
				grid4: resolve(__dirname, 'grid-4/index.html'),
				grid5: resolve(__dirname, 'grid-5/index.html'),
				ribbon1: resolve(__dirname, 'ribbon-1/index.html'),
				ribbon2: resolve(__dirname, 'ribbon-2/index.html'),
				scrollTrigger: resolve(__dirname, 'scroll-trigger/index.html'),
			},
		},
	},
})