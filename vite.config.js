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
				flat1: resolve(__dirname, 'flat-1/index.html'),
			},
		},
	},
})