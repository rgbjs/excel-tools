import dom from './htmlTemplate.js'
import { ImportExcel } from '../../dist/main.js'

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
	const file = e.currentTarget.files?.[0]
	if (!file) return

	importExcel.load(file, 0).then((result) => {
		console.log('result => ', result)
	})
})

window.importExcel = importExcel
console.log('实例: ', importExcel)
