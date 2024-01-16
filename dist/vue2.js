function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
/**
 * 依赖版本 exceljs 4.3.0
 * 依赖版本 assist-tools 0.2.1
 */

import ExcelJS from 'exceljs';
import { isType, clone } from 'assist-tools';
export { default as ExcelJS } from 'exceljs';

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
var _options = /*#__PURE__*/new WeakMap();
var _originMapData = /*#__PURE__*/new WeakMap();
var _mapData = /*#__PURE__*/new WeakMap();
var _map = /*#__PURE__*/new WeakMap();
var _keys = /*#__PURE__*/new WeakMap();
var _workbook = /*#__PURE__*/new WeakMap();
var _worksheet = /*#__PURE__*/new WeakMap();
var _onRowLoad = /*#__PURE__*/new WeakMap();
var _init = /*#__PURE__*/new WeakSet();
var _v1Parse = /*#__PURE__*/new WeakSet();
var _v2Parse = /*#__PURE__*/new WeakSet();
var _value = /*#__PURE__*/new WeakSet();
var _getSuffix = /*#__PURE__*/new WeakSet();
var _verifyFile = /*#__PURE__*/new WeakSet();
var _getData = /*#__PURE__*/new WeakSet();
var _setData = /*#__PURE__*/new WeakSet();
var _trim = /*#__PURE__*/new WeakSet();
export class ImportExcel {
  // 监听行变化时的回调

  /**
   * 
   * @param {Item[]} mapData 数据映射列表
   * @param {object} options 配置对象
   * @param {boolean} [options.trim] 是否清除值两端的空白字符, 默认为 true [可选]
   * @param {function} [options.onRowLoad] 监听行的变化, 默认为 null, 接收一个上下文对象 [可选]
   */
  constructor(_mapData2, _options2 = {}) {
    /**
     * 清除字符串数据两端空白
     * @param {*} data 任何数据
     * @returns 当数据为字符串时会返回清除两端空白后的字符串, 其他类型不作处理直接返回
     */
    _classPrivateMethodInitSpec(this, _trim);
    _classPrivateMethodInitSpec(this, _setData);
    /**
     * 传入 Excel 的 ArrayBuffer 形式数据, 返回读取后的结果数据
     * @param {ArrayBuffer} buf ArrayBuffer
     */
    _classPrivateMethodInitSpec(this, _getData);
    /** 
     * 验证文件是否为 xlsx
     * @returns {object} 其中 code 为 -2 表示不是文件类型, -1 表示文件不是 xlsx
     */
    _classPrivateMethodInitSpec(this, _verifyFile);
    /**
     * 传入一个路径, 返回其后缀, 若无后缀将返回空字符串
     * @param {string} path 路径
     * @returns {string} 
     */
    _classPrivateMethodInitSpec(this, _getSuffix);
    _classPrivateMethodInitSpec(this, _value);
    /**
     * 解析数组结构
     */
    _classPrivateMethodInitSpec(this, _v2Parse);
    /**
     * 解析对象结构
     */
    _classPrivateMethodInitSpec(this, _v1Parse);
    _classPrivateMethodInitSpec(this, _init);
    // 配置对象
    _classPrivateFieldInitSpec(this, _options, {
      writable: true,
      value: {
        trim: true,
        onRowLoad: null
      }
    });
    _classPrivateFieldInitSpec(this, _originMapData, {
      writable: true,
      value: null
    });
    // 原始配置
    _classPrivateFieldInitSpec(this, _mapData, {
      writable: true,
      value: {}
    });
    // 解析后的数据
    _classPrivateFieldInitSpec(this, _map, {
      writable: true,
      value: {}
    });
    // 映射关系
    _classPrivateFieldInitSpec(this, _keys, {
      writable: true,
      value: []
    });
    // 解析后的 keys
    _classPrivateFieldInitSpec(this, _workbook, {
      writable: true,
      value: null
    });
    // Excel 对象
    _classPrivateFieldInitSpec(this, _worksheet, {
      writable: true,
      value: []
    });
    // 读取的 Excel 数据
    _classPrivateFieldInitSpec(this, _onRowLoad, {
      writable: true,
      value: null
    });
    _classPrivateMethodGet(this, _init, _init2).call(this, _mapData2, _options2);
    _classPrivateFieldSet(this, _workbook, new ExcelJS.Workbook());
  }
  get keys() {
    return clone(_classPrivateFieldGet(this, _keys));
  }
  get map() {
    return clone(_classPrivateFieldGet(this, _map));
  }
  get mapData() {
    return clone(_classPrivateFieldGet(this, _mapData));
  }
  /**
   * 加载 xlsx 文件
   * @param {File} file 文件对象
   * @param {number} len 截取掉(舍去)头部数据的长度(如表头, 描述等前几条不需要的数据), 默认为 2
   * @returns {Promise.<object[]>} 如果发生错误, 将返回一个对象, 其中 code 表示错误类型, error 为错误对象
   * code -2 表示参数不是文件类型, -1 表示文件类型不是 xlsx , 0 Excel 解析过程中发生错误
   */
  async load(file, len = 2) {
    const checking = _classPrivateMethodGet(this, _verifyFile, _verifyFile2).call(this, file);
    if (checking.code !== 1) {
      throw checking;
    }
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        try {
          await _classPrivateMethodGet(this, _getData, _getData2).call(this, fileReader.result);
          let data = [];
          // 去除首列空洞项
          _classPrivateFieldGet(this, _worksheet).forEach(item => {
            data.push(item.slice(1));
          });

          // 去除前面几行, 如表头, 描述等
          data = data.slice(len);
          const result = [];
          // 根据配置对数据进行处理
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const rowData = {};
            for (let j = 0; j < this.keys.length; j++) {
              const key = this.keys[j];
              const {
                trim,
                key: originKey,
                value: handle
              } = _classPrivateFieldGet(this, _mapData)[key];
              const value = trim ? _classPrivateMethodGet(this, _trim, _trim2).call(this, item[j]) : item[j];
              await handle({
                row: i,
                // 当前数据所在行下标
                index: j,
                // 当前数据的下标
                originRow: i + len,
                // 当前数据在 Excel 中的行
                originIndex: j + 1,
                // 当前数据在 Excel 中的列
                key,
                originKey,
                value,
                get rowItem() {
                  return clone(item); // 当前行解析前的数据
                },
                getRowData() {
                  return clone(rowData); // 当前行解析后的数据
                },
                setData: _classPrivateMethodGet(this, _setData, _setData2).bind(this, rowData)
              });
            }
            result.push(rowData);

            // 监听行变化时
            _classPrivateFieldGet(this, _onRowLoad) && (await _classPrivateFieldGet(this, _onRowLoad).call(this, {
              row: i,
              // 当前数据所在行下标
              originRow: i + len,
              // 当前数据在 Excel 中的行
              get rowItem() {
                return clone(item); // 当前行解析前的数据
              },
              get rowData() {
                return clone(rowData); // 当前行解析前的数据
              },
              setData: _classPrivateMethodGet(this, _setData, _setData2).bind(this, rowData)
            }));
          }
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
}

/**
 * @typedef {Object} Header
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
 * @param {Array.<Header>} options.header 
 * @param {object[]} options.content 
 */
function _init2(mapData, options) {
  if (!(isType(mapData) === 'object' || isType(mapData) === 'array')) {
    throw new TypeError('"mapData" must be a object or an array');
  }
  if (isType(options) !== 'object') {
    throw new TypeError('"options" must be a object');
  }
  const {
    trim = true,
    onRowLoad = null
  } = options;
  if (typeof trim !== 'boolean') {
    throw new TypeError('"trim" must be a boolean');
  }
  if (!(typeof onRowLoad === 'function' || isType(onRowLoad) === 'null')) {
    throw new TypeError('"onRowLoad" must be a function');
  }
  _classPrivateFieldSet(this, _originMapData, mapData);
  _classPrivateFieldGet(this, _options).trim = trim;
  _classPrivateFieldGet(this, _options).onRowLoad = onRowLoad;
  if (isType(mapData) === 'object') {
    console.warn('"mapData" does not recommend using object parsing, please use array parsing instead');
    _classPrivateMethodGet(this, _v1Parse, _v1Parse2).call(this);
  } else {
    _classPrivateMethodGet(this, _v2Parse, _v2Parse2).call(this);
  }
}
function _v1Parse2() {
  for (const k in _classPrivateFieldGet(this, _originMapData)) {
    if (!_classPrivateFieldGet(this, _originMapData).hasOwnProperty(k)) continue;
    let val = _classPrivateFieldGet(this, _originMapData)[k];
    if (typeof val === 'string') {
      // 参数归一化, 设置默认配置
      val = {
        key: val,
        value: undefined,
        trim: _classPrivateFieldGet(this, _options).trim
      };
    } else if (isType(val) !== 'object') {
      // 非字符串, 非对象抛出错误
      throw new TypeError('property in mapData must be object or string');
    }

    // 当前字段 trim 不存在则使用配置对象中的 trim
    let {
      key,
      value,
      trim = _classPrivateFieldGet(this, _options).trim
    } = val;
    if (!(typeof key === 'string' && key !== '')) {
      throw new TypeError('the "key" must be a string and cannot be empty');
    }
    if (typeof trim !== 'boolean') {
      throw new TypeError('"trim" must be a boolean');
    }
    if (typeof value === 'function') {
      // 配置为函数, 先行执行一遍赋值, 之后再转移控制权
      const func = value;
      value = async context => {
        _classPrivateMethodGet(this, _value, _value2).call(this, undefined, context);
        await func(context);
      };
    } else {
      // 非函数, 包装成函数
      value = _classPrivateMethodGet(this, _value, _value2).bind(this, value);
    }
    _classPrivateFieldGet(this, _keys).push(key);
    _classPrivateFieldGet(this, _map)[k] = key;
    _classPrivateFieldGet(this, _mapData)[key] = {
      key: k,
      value,
      trim
    };
  }
}
function _v2Parse2() {
  for (let i = 0; i < _classPrivateFieldGet(this, _originMapData).length; i++) {
    const item = _classPrivateFieldGet(this, _originMapData)[i];
    if (isType(item) !== 'object') {
      // 非对象抛出错误
      throw new TypeError('the projects of "mapData" must all be objects');
    }
    let {
      originKey,
      key,
      value,
      trim = _classPrivateFieldGet(this, _options).trim
    } = item;
    if (!(typeof originKey === 'string' && originKey !== '')) {
      throw new TypeError('the "originKey" must be a string and cannot be empty');
    }
    if (!(typeof key === 'string' && key !== '')) {
      throw new TypeError('the "key" must be a string and cannot be empty');
    }
    if (typeof trim !== 'boolean') {
      throw new TypeError('"trim" must be a boolean');
    }
    if (typeof value === 'function') {
      // 配置为函数, 先行执行一遍赋值, 之后再转移控制权
      const func = value;
      value = async context => {
        _classPrivateMethodGet(this, _value, _value2).call(this, undefined, context);
        await func(context);
      };
    } else {
      // 非函数, 包装成函数
      value = _classPrivateMethodGet(this, _value, _value2).bind(this, value);
    }
    _classPrivateFieldGet(this, _keys).push(key);
    _classPrivateFieldGet(this, _map)[item.originKey] = key;
    _classPrivateFieldGet(this, _mapData)[key] = {
      key: item.originKey,
      value,
      trim
    };
  }
}
function _value2(val, context) {
  const {
    key,
    value = val,
    setData
  } = context;
  setData(key, value);
}
function _getSuffix2(path) {
  const i = path.lastIndexOf('.');
  return path.substring(i + 1);
}
function _verifyFile2(file) {
  if (!(file instanceof File)) {
    return {
      code: -2,
      error: new TypeError('The parameter passed in is not a file type')
    };
  }
  const fileType = _classPrivateMethodGet(this, _getSuffix, _getSuffix2).call(this, file.name);
  if (fileType !== 'xlsx') {
    return {
      code: -1,
      error: new TypeError('The file is not "xlsx"')
    };
  }
  return {
    code: 1,
    error: null
  };
}
async function _getData2(buf) {
  try {
    const sheel = await _classPrivateFieldGet(this, _workbook).xlsx.load(buf);
    const worksheet = sheel.getWorksheet(1);
    _classPrivateFieldSet(this, _worksheet, []);
    worksheet.eachRow(row => {
      _classPrivateFieldGet(this, _worksheet).push(row.values);
    });
    return _classPrivateFieldGet(this, _worksheet);
  } catch (error) {
    throw {
      code: 0,
      error
    };
  }
}
function _setData2(rowData, key, value) {
  rowData[key] = value;
}
function _trim2(data) {
  if (typeof data === 'string') return data.trim();
  return data;
}
export const exportExcel = async options => {
  const {
    fileName = '未命名',
    header = [],
    content = []
  } = options;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet();
  worksheet.columns = header; // 表头
  worksheet.addRows(content); // 表内容

  const a = document.createElement("a");
  a.download = `${fileName}.xlsx`;
  const url = URL.createObjectURL(new Blob([await workbook.xlsx.writeBuffer()]));
  a.href = url;
  a.click();
  URL.revokeObjectURL(url);
};