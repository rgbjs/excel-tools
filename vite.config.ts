import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: './src/main.js',
			name: 'EventBus',
			formats: ['es', 'cjs', 'umd', 'iife'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			}
		}
	}
})
