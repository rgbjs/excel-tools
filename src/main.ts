export { default as ExcelJS } from 'exceljs'
// @ts-ignore
export { default as ImportExcel } from './ImportExcel.js'
// @ts-ignore
export { default as exportExcel } from './exportExcel.js'
// @ts-ignore
import ImportExcel from './ImportExcel.js'

const importExcel = new ImportExcel([
	{
		originKey: '啊',
		key: 'a'
	}
])
console.log(importExcel)
