import ExcelJS from 'exceljs'
import { isType, clone } from 'assist-tools'

/**
 * @typedef {Object} Ctx - 上下文对象
 * @property {number} row - 当前数据所在行的下标(下标从0开始)
 * @property {number} originRow - 当前数据在 Excel 中的行(下标从0开始)
 * @property {number} index - 当前数据的下标(下标从0开始)
 * @property {number} originIndex - 当前数据在 Excel 中的列(下标从0开始)
 * @property {string} key - 当前的字段名
 * @property {string} originKey - 映射前的字段名(原始字段名)
 * @property {*} value - 当前的值
 * @property {array} rowItem - 当前行解析前的数据(数组)
 * @property {function} getRowData - 函数, 用于获取当前行解析后的数据
 * @property {function} setData - setData(key, value) 函数, 用于设置当前行数据某个字段的值
 */

/**
 * @typedef {Object} FieldFunc - 字段处理函数
 * @function
 * @property {Ctx} context - 上下文对象
 */

/**
 * @typedef {Object} Item
 * @property {string} originKey 原始字段名
 * @property {string} key 映射后的字段名
 * @property {FieldFunc} [value] 可设置为一个函数, 执行过程中会被调用, 接收一个上下文对象 [可选]
 * @property {boolean} [trim] 是否清除值两端的空白字符, 为空默认使用配置参数中的设置 [可选]
 */

export class ImportExcel {
    // 配置对象
    #options = {
        trim: true,
        onRowLoad: null
    }
    #originMapData = null // 原始配置
    #mapData = {} // 解析后的数据
    #map = {} // 映射关系
    #keys = [] // 解析后的 keys
    #workbook = null // Excel 对象
    #worksheet = [] // 读取的 Excel 数据
    #onRowLoad = null // 监听行变化时的回调

    /**
     * 
     * @param {Item[]} mapData 数据映射列表
     * @param {object} options 配置对象
     * @param {boolean} [options.trim] 是否清除值两端的空白字符, 默认为 true [可选]
     * @param {function} [options.onRowLoad] 监听行的变化, 默认为 null, 接收一个上下文对象 [可选]
     */
    constructor(mapData, options = {}) {
        this.#init(mapData, options)
        this.#workbook = new ExcelJS.Workbook()
    }

    #init(mapData, options) {
        if (!(isType(mapData) === 'object' || isType(mapData) === 'array')) {
            throw new TypeError('"mapData" must be a object or an array')
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

        this.#originMapData = mapData
        this.#options.trim = trim
        this.#options.onRowLoad = onRowLoad

        if (isType(mapData) === 'object') {
            console.warn('"mapData" does not recommend using object parsing, please use array parsing instead')
            this.#v1Parse()
        } else {
            this.#v2Parse()
        }
    }

    /**
     * 解析对象结构
     */
    #v1Parse() {
        for (const k in this.#originMapData) {
            if (!this.#originMapData.hasOwnProperty(k)) continue

            let val = this.#originMapData[k]
            if (typeof val === 'string') {
                // 参数归一化, 设置默认配置
                val = {
                    key: val,
                    value: undefined,
                    trim: this.#options.trim
                }
            } else if (isType(val) !== 'object') {
                // 非字符串, 非对象抛出错误
                throw new TypeError('property in mapData must be object or string')
            }

            // 当前字段 trim 不存在则使用配置对象中的 trim
            let { key, value, trim = this.#options.trim } = val
            if (!(typeof key === 'string' && key !== '')) {
                throw new TypeError('the "key" must be a string and cannot be empty')
            }

            if (typeof trim !== 'boolean') {
                throw new TypeError('"trim" must be a boolean')
            }

            if (typeof value === 'function') {
                // 配置为函数, 先行执行一遍赋值, 之后再转移控制权
                const func = value
                value = async (context) => {
                    this.#value(undefined, context)
                    await func(context)
                }
            } else {
                // 非函数, 包装成函数
                value = this.#value.bind(this, value)
            }

            this.#keys.push(key)
            this.#map[k] = key
            this.#mapData[key] = {
                key: k,
                value,
                trim
            }
        }
    }

    /**
     * 解析数组结构
     */
    #v2Parse() {
        for (let i = 0; i < this.#originMapData.length; i++) {
            const item = this.#originMapData[i]
            if (isType(item) !== 'object') {
                // 非对象抛出错误
                throw new TypeError('the projects of "mapData" must all be objects')
            }

            let { originKey, key, value, trim = this.#options.trim } = item
            if (!(typeof originKey === 'string' && originKey !== '')) {
                throw new TypeError('the "originKey" must be a string and cannot be empty')
            }
            if (!(typeof key === 'string' && key !== '')) {
                throw new TypeError('the "key" must be a string and cannot be empty')
            }
            if (typeof trim !== 'boolean') {
                throw new TypeError('"trim" must be a boolean')
            }

            if (typeof value === 'function') {
                // 配置为函数, 先行执行一遍赋值, 之后再转移控制权
                const func = value
                value = async (context) => {
                    this.#value(undefined, context)
                    await func(context)
                }
            } else {
                // 非函数, 包装成函数
                value = this.#value.bind(this, value)
            }

            this.#keys.push(key)
            this.#map[item.originKey] = key
            this.#mapData[key] = {
                key: item.originKey,
                value,
                trim
            }
        }
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
            this.#worksheet = []
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

    /**
     * 清除字符串数据两端空白
     * @param {*} data 任何数据
     * @returns 当数据为字符串时会返回清除两端空白后的字符串, 其他类型不作处理直接返回
     */
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
                        this.#onRowLoad && await this.#onRowLoad({
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