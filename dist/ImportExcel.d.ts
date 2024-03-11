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
declare class ImportExcel {
    #private;
    /**
     *
     * @param {Item[]} mapData 数据映射列表
     * @param {object} options 配置对象
     * @param {boolean} [options.trim] 是否清除值两端的空白字符, 默认为 true [可选]
     * @param {function} [options.onRowLoad] 监听行的变化, 默认为 null, 接收一个上下文对象 [可选]
     */
    constructor(mapData: any, options?: {});
    get keys(): any[];
    get map(): {};
    get mapData(): {};
    get info(): {
        workbook: any;
        worksheet: any[];
        parseData: any;
    };
    /**
     * 加载 xlsx 文件
     * @param {File} file 文件对象
     * @param {number} len 截取掉(舍去)头部数据的长度(如表头, 描述等前几条不需要的数据), 默认为 2
     * @returns {Promise.<object[]>} 如果发生错误, 将返回一个对象, 其中 code 表示错误类型, error 为错误对象
     * code -2 表示参数不是文件类型, -1 表示文件类型不是 xlsx , 0 Excel 解析过程中发生错误
     */
    load(file: any, len?: number): Promise<unknown>;
}
export default ImportExcel;
