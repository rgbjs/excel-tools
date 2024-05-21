import ExcelJS from 'exceljs'
import { cloneDeep } from 'lodash-es'

interface THeaderItem {
	/**
	 * 表头导出展示的值
	 */
	header: string
	/**
	 * 导出的表头字段, 用于给 content 中的数据分组
	 */
	key: string
	/**
	 * 单元格宽度(列宽) [可选]
	 */
	width: number
	[key: string]: any
}

interface TOptions {
	/**
	 * 导出的工作簿名, 默认为 "工作表1" [可选]
	 */
	sheetName?: string
	/**
	 * 导出的文件名, 默认为 "未命名" [可选]
	 */
	fileName?: string
	/**
	 * 导出的表头, 使用数组对象 [{header: "姓名", key: "name"}, {header: "性别", key: "sex"}] [可选]
	 */
	header?: THeaderItem[]
	/**
	 * 导出的内容数据, 1. 使用数组对象 [{name: '哈哈', sex: '男'}, {name: '呵呵', sex: '女'}] 会跟 表头进行映射; 2. 使用二维数组 [['哈哈', '男'], ['呵呵', '女']]
	 */
	content?: any[]
	/**
	 * 单元格是否开启文本自动换行, 默认为 true [可选]
	 */
	wrapText?: boolean
	/**
	 * 单元格文本水平排列方式, 默认为 'center' [可选]
	 */
	horizontal?: 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed'
	/**
	 * 单元格文本垂直排列方式, 默认为 'middle' [可选]
	 */
	vertical?: 'top' | 'middle' | 'bottom' | 'distributed' | 'justify'
	/**
	 * 所有单元格的格式类型, 默认为 [常规] , 具体请查看 Excel , 例如 '@' 为文本 [可选]
	 */
	numFmt?: string | '@'
	/**
	 * 钩子函数: 在实例化 Excel 之前触发, 此处可拿到解析后的 header 配置, 可以自定义修改配置和自定义实例化 Excel, 请返回修改后的实例对象 . 新版本将作出优化
	 */
	beforeCreate?: Function
	/**
	 * 钩子函数: 在实例化 Excel 之后触发, 此处可拿到实例对象, 仍可对实例对象进行修改 . 新版本将作出优化
	 */
	create?: Function
}

/**
 * 该方法仅适用于 web 端, 新版本将作出优化
 * @param options 配置选项 [可选]
 */
const exportExcel = async (options?: TOptions) => {
	const {
		fileName = '未命名',
		header = [],
		content = [],
		wrapText = true,
		horizontal = 'center',
		vertical = 'middle',
		numFmt,
		beforeCreate,
		create
	} = options

	const newHeader = cloneDeep(header).map((item) => {
		if (!item.style) item.style = {}
		if (!item.alignment)
			item.style.alignment = {
				wrapText,
				horizontal,
				vertical
			}
		if (numFmt) item.style.numFmt = numFmt

		return item
	})

	let workbook = null
	if (beforeCreate) {
		workbook = await beforeCreate({
			config: {
				headerConfig: newHeader
			},
			Workbook: ExcelJS.Workbook.bind(ExcelJS)
		})
	}

	if (!(workbook instanceof ExcelJS.Workbook)) {
		workbook = new ExcelJS.Workbook()
	}

	const worksheet = workbook.addWorksheet()
	worksheet.columns = newHeader // 表头
	worksheet.addRows(content) // 表内容

	if (create) {
		await create(workbook)
	}

	const a = document.createElement('a')
	a.download = `${fileName}.xlsx`
	const url = URL.createObjectURL(
		new Blob([await workbook.xlsx.writeBuffer()], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		})
	)
	a.href = url
	a.click()
	URL.revokeObjectURL(url)
}

export default exportExcel
