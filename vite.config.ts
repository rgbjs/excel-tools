import fs from 'fs'
import path from 'path'
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
	plugins: [
		dts({
			afterBuild(emittedFiles) {
				const rootPath = path.resolve()

				const reg = /\\/g
				const p = path.join(rootPath, '/dist/main.d.ts').replace(reg, '/')
				const content = emittedFiles.get(p) as string
				// 向后兼容
				fs.writeFileSync(
					path.join(rootPath, '/dist/main.es.js'),
					fs.readFileSync(path.join(rootPath, '/dist/main.js'))
				)
				fs.writeFileSync(path.join(rootPath, '/dist/main.es.d.ts'), content)
				fs.writeFileSync(
					path.join(rootPath, '/dist/vue2.js'),
					fs.readFileSync(path.join(rootPath, '/dist/main.js'))
				)
				fs.writeFileSync(path.join(rootPath, '/dist/vue2.d.ts'), content)
			}
		})
	]
})
