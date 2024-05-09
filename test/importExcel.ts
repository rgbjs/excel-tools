import dom from './testTemplate'
import { ImportExcel } from '../src/main'

const importExcel = new ImportExcel([
	{
		key: 'name',
		originKey: '姓名'
	},
	{
		key: 'sex',
		originKey: '性别'
	}
])

dom.input.addEventListener('change', (e) => {
	const file = (e.currentTarget as HTMLInputElement).files?.[0]
	if (!file) return

	importExcel.load(file, 0).then((result) => {
		console.log('result => ', result)
	})
})

// @ts-ignore
window.importExcel = importExcel
console.log('实例: ', importExcel)
