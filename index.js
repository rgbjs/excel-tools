/**
 * 依赖版本 exceljs 4.3.0
 * 依赖版本 assist-tools 0.0.2
 */

import ExcelJS from 'exceljs'
import { isType, clone } from 'assist-tools'

/**
 * @typedef {Object} item
 * @property {string} key 映射的字段名
 * @property {*} [value] 数据不存在时的默认值, 可设置为一个函数, 执行过程中会被调用, 接收一个上下文对象 [可选]
 * @property {boolean} [trim] 是否清除值两端的空白字符, 为空默认使用配置参数中的设置 [可选]
 */

export class ImportExcel {
    #mapData = {}
    #map = {}
    #keys = []
    #workbook = null
    #worksheet = [] // 读取的 Excel 数据
    #onRowLoad = null // 监听行变化时的回调

    /**
     * 
     * @param {Object.<string,item>} mapData 数据映射表
     * @param {object} options 配置对象
     * @param {boolean} [options.trim] 否清除值两端的空白字符, 默认为 true [可选]
     * @param {function} [options.onRowLoad] 监听行的变化, 默认为 null, 接收一个上下文对象 [可选]
     */
    constructor(mapData, options = {}) {
        if (isType(mapData) !== 'object') {
            throw new TypeError('"mapData" must be a object')
        }

        if (isType(options) !== 'object') {
            throw new TypeError('"options" must be a object')
        }

        const { trim = true, onRowLoad = null } = options
        if (typeof trim !== 'boolean') {
            throw new TypeError('"trim" must be a boolean')
        }

        if (!(typeof onRowLoad === 'function' || isType(onRowLoad) === 'null')) {
            throw new TypeError('"onRowLoad" must be a function')
        }

        this.#onRowLoad = onRowLoad

        for (const k in mapData) {
            if (!mapData.hasOwnProperty(k)) continue
            let val = mapData[k]

            if (typeof val === 'string') {
                val = {
                    key: val,
                    value: undefined,
                    trim
                }
            } else if (isType(val) !== 'object') {
                throw new TypeError('property in mapData must be object or string')
            }

            // 当前字段 trim 不存在则使用配置对象中的 trim
            let { key, value, trim: _trim = trim } = val
            if (!(typeof key === 'string' && key !== '')) {
                throw new TypeError('the "key" must be a string and cannot be empty')
            }

            if (typeof value === 'function') {
                // 函数, 先行执行一遍赋值, 之后再转移控制权
                const f = value
                value = (context) => {
                    this.#value(undefined, context)
                    f(context)
                }
            } else {
                // 非函数, 包装成函数
                value = this.#value.bind(this, value)
            }

            if (typeof _trim !== 'boolean') {
                throw new TypeError('"trim" must be a boolean')
            }

            this.#keys.push(key)
            this.#map[k] = key
            this.#mapData[key] = {
                key: k,
                value,
                trim: _trim
            }
        }

        this.#workbook = new ExcelJS.Workbook()
    }

    get keys() {
        return clone(this.#keys)
    }

    get map() {
        return clone(this.#map)
    }

    get mapData() {
        return clone(this.#mapData)
    }

    #value(val, context) {
        const { key, value = val, setData } = context
        setData(key, value)
    }

    /**
     * 传入一个路径, 返回其后缀, 若无后缀将返回空字符串
     * @param {string} path 路径
     * @returns {string} 
     */
    #getSuffix(path) {
        const i = path.lastIndexOf('.')
        return path.substring(i + 1)
    }

    /** 
     * 验证文件是否为 xlsx
     * @returns {object} 其中 code 为 -2 表示不是文件类型, -1 表示文件不是 xlsx
     */
    #verifyFile(file) {
        if (!(file instanceof File)) {
            return {
                code: -2,
                error: new TypeError('The parameter passed in is not a file type')
            }
        }
        const fileType = this.#getSuffix(file.name)
        if (fileType !== 'xlsx') {
            return {
                code: -1,
                error: new TypeError('The file is not "xlsx"')
            }
        }
        return {
            code: 1,
            error: null
        }
    }

    /**
     * 传入 Excel 的 ArrayBuffer 形式数据, 返回读取后的结果数据
     * @param {ArrayBuffer} buf ArrayBuffer
     */
    async #getData(buf) {
        try {
            const sheel = await this.#workbook.xlsx.load(buf)
            const worksheet = sheel.getWorksheet(1)
            worksheet.eachRow((row) => {
                this.#worksheet.push(row.values)
            })
            return this.#worksheet
        } catch (error) {
            throw {
                code: 0,
                error
            }
        }
    }

    #setData(rowData, key, value) {
        rowData[key] = value
    }

    #trim(data) {
        if (typeof data === 'string') return data.trim()
        return data
    }

    /**
     * 加载 xlsx 文件
     * @param {File} file 文件对象
     * @param {number} len 截取掉(舍去)头部数据的长度(如表头, 描述等前几条不需要的数据), 默认为 2
     * @returns {Promise.<object[]>} 如果发生错误, 将返回一个对象, 其中 code 表示错误类型, error 为错误对象
     * code -2 表示参数不是文件类型, -1 表示文件类型不是 xlsx , 0 Excel 解析过程中发生错误
     */
    async load(file, len = 2) {
        const checking = this.#verifyFile(file)
        if (checking.code !== 1) {
            throw checking
        }

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.onload = async () => {
                try {
                    await this.#getData(fileReader.result)

                    let data = []
                    // 去除首列空洞项
                    this.#worksheet.forEach(item => {
                        data.push(item.slice(1))
                    })

                    // 去除前面几行, 如表头, 描述等
                    data = data.slice(len)
                    const result = []
                    // 根据配置对数据进行处理
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i]
                        const rowData = {}
                        for (let j = 0; j < this.keys.length; j++) {
                            const key = this.keys[j]
                            const { trim, key: originKey, value: handle } = this.#mapData[key]
                            const value = trim ? this.#trim(item[j]) : item[j]
                            await handle({
                                row: i, // 当前数据所在行下标
                                index: j, // 当前数据的下标
                                originRow: i + len, // 当前数据在 Excel 中的行
                                originIndex: j + 1, // 当前数据在 Excel 中的列
                                key,
                                originKey,
                                value,
                                get rowItem() {
                                    return clone(item) // 当前行解析前的数据
                                },
                                getRowData() {
                                    return clone(rowData) // 当前行解析后的数据
                                },
                                setData: this.#setData.bind(this, rowData)
                            })
                        }

                        result.push(rowData)

                        // 监听行变化时
                        this.#onRowLoad && this.#onRowLoad({
                            row: i, // 当前数据所在行下标
                            originRow: i + len, // 当前数据在 Excel 中的行
                            get rowItem() {
                                return clone(item) // 当前行解析前的数据
                            },
                            get rowData() {
                                return clone(rowData) // 当前行解析前的数据
                            },
                            setData: this.#setData.bind(this, rowData)
                        })
                    }

                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            }

            fileReader.readAsArrayBuffer(file)
        })
    }
}


/**
 * @typedef {Object} header
 * @property {String} header 表头导出展示的值
 * @property {String} key 表头映射的字段
 */

/**
 * 将数据导出为 Excel(xlsx)
 * - **fileName** 导出文件的名字, 默认值为 '未命名' [可选]
 * - **header** `object[]` 导出文件的表头, 传递数组对象, header 为导出展示的值, key 为内容所关联的键, 
 * 示例: [{header: '姓名', key: 'name'}, {header: '性别', key: 'sex'}, {...}] , 其中还可传递 width: <Number> 来设置单元格宽度
 * - **content** `object[]` 导出文件的内容, 传递数组对象, 
 * 示例: [{name: '哈哈', sex: '男'}, {name: '呵呵', sex: '女'}, {name: '嘿嘿', sex: '未知'}]
 * @param {object} options 配置对象
 * @param {string} [options.fileName] 
 * @param {Array.<header>} options.header 
 * @param {object[]} options.content 
 */
export const exportExcel = async (options) => {
    const { fileName = '未命名', header = [], content = [] } = options
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet()
    worksheet.columns = header // 表头
    worksheet.addRows(content) // 表内容

    const a = document.createElement("a")
    a.download = `${fileName}.xlsx`
    const url = URL.createObjectURL(new Blob([await workbook.xlsx.writeBuffer()], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }))
    a.href = url
    a.click()
    URL.revokeObjectURL(url)
}
