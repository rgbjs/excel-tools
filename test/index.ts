// @ts-ignore
import { exportExcel, ImportExcel } from '../src/main.ts'

const importExcel = new ImportExcel([
	{
		originKey: '姓名',
		key: 'name'
	},
	{
		originKey: '性别',
		key: 'sex'
	},
	{
		originKey: '出生日期',
		key: 'birthDate'
	},
	{
		originKey: '手机号',
		key: 'phone'
	}
])

const init = () => {
	const template = `
        <input type="file" class="file-input">
        <button class="download">下载</button>
    `
	const app = document.querySelector('#app') as Element
	app.innerHTML = template
}
init()

const fileInput = document.querySelector('.file-input') as HTMLInputElement
let data: any[]
fileInput.addEventListener('change', async (e) => {
	const file = (e.target as HTMLInputElement).files?.[0]
	if (!file) return
	data = await importExcel.load(file)
	console.log(data)
	console.log(importExcel.info)
})

const download = document.querySelector('.download') as Element

download.addEventListener('click', () => {
	if (!data) return
	exportExcel({
		fileName: '人员数据',
		header: [
			{
				key: 'name',
				header: '姓名',
				width: 25
			},
			{
				key: 'sex',
				header: '性别',
				width: 25
			},
			{
				key: 'birthDate',
				header: '出生日期',
				width: 25
			},
			{
				key: 'phone',
				header: '手机号',
				width: 25
			}
		],
		content: data // 导出的数据
	})
})
