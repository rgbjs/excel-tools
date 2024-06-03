import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
	build: {
		target: 'es2015',
		lib: {
			entry: process.env.VITE_APP_PATH || './src/main.ts',
			name: 'excelTools',
			formats: ['es'],
			fileName: 'main'
		}
	},
	plugins: [dts()]
})
