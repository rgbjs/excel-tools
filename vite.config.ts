import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: './src/main.ts',
			name: 'excelTools',
			formats: ['es', 'cjs', 'umd', 'iife'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			}
		}
	}
})
