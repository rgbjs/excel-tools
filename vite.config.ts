import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		target: 'es2015',
		lib: {
			entry: './src/main.ts',
			name: 'excelTools',
			formats: ['es'],
			fileName(format, entryName) {
				return `${entryName}.${format}.js`
			}
		}
	}
})
