// 上下文类型

export interface TanyObj {
	[key: string]: any
}

/**
 * 监听 value 上下文对象
 */
export interface TValueCtx {
	/**
	 * 当前数据所在行下标(下标从0开始)
	 */
	row: number
	/**
	 * 当前数据在 Excel 中的行(下标从0开始)
	 */
	originRow: number
	/**
	 * 当前数据的下标(下标从0开始)
	 */
	index: number
	/**
	 * 当前数据在 Excel 中的列(下标从0开始)
	 */
	originIndex: number
	/**
	 * 当前的字段名
	 */
	key: string
	/**
	 * 映射前的字段名(原始字段名)
	 */
	originKey: string
	/**
	 * 当前的值
	 */
	value: any
	/**
	 * 当前行解析前的数据(数组)
	 */
	rowItem: any[]
	/**
	 * 函数, 用于获取当前行解析后的数据
	 */
	getRowData: () => TanyObj
	/**
	 * setData(key, value) 函数, 用于设置当前行数据某个字段的值
	 */
	setData: (key: string, value: any) => void
}

/**
 * 监听行变化上下文对象
 */
export interface TOnRowLoadCtx {
	/**
	 * 当前数据所在行下标(下标从0开始)
	 */
	row: number
	/**
	 * 当前数据在 Excel 中的行(下标从0开始)
	 */
	originRow: number
	/**
	 * 当前行解析前的数据(数组)
	 */
	rowItem: any[]
	/**
	 * 当前行解析后的数据(对象)
	 */
	rowData: TanyObj
	/**
	 * setData(key, value) 函数, 用于设置当前行数据某个字段的值
	 */
	setData: (key: string, value: any) => void
}
