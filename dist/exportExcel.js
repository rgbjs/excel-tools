import ExcelJS from 'exceljs';
import { cloneDeep } from 'lodash-es';
/**
 * @typedef Header
 * @property {String} header 表头导出展示的值
 * @property {String} key 导出的表头字段, 用于给 content 中的数据分组
 * @property {number} [width] 单元格宽度(列宽) [可选]
 * @property {*} [更多配置] 更多配置请参考 exceljs 官方文档
 */
/**
 * @typedef Content
 * @property {*} [prop1] 参数1
 * @property {*} [prop2] 参数2
 * @property {*} [更多属性] ...
 */
/**
 * @typedef ExportExcel 配置对象
 * @property {string} [options.sheetName] 导出的工作簿名, 默认为 "工作表1" [可选]
 * @property {string} [options.fileName] 导出的文件名, 默认为 "未命名" [可选]
 * @property {Header[]} options.header 导出的表头, 使用数组对象 [{header: "姓名", key: "name"}, {header: "性别", key: "sex"}]
 * @property {Content[]} options.content 导出的内容数据, 使用数组对象 [{name: '哈哈', sex: '男'}, {name: '呵呵', sex: '女'}]
 * @property {boolean} wrapText 单元格是否开启文本自动换行, 默认为 true [可选]
 * @property {'left'|'center'|'right'|'fill'|'justify'|'centerContinuous'|'distributed'} horizontal 单元格文本水平排列方式, 默认为 'center' [可选]
 * @property {'top'|'middle'|'bottom'|'distributed'|'justify'} vertical 单元格文本垂直排列方式, 默认为 'middle' [可选]
 * @property {string} numFmt 所有单元格的格式类型, 默认为 [常规] , 具体请查看 Excel , 例如 '@' 为文本 [可选]
 * @property {Function} beforeCreate 钩子函数: 在实例化 Excel 之前触发, 此处可拿到解析后的 header 配置, 可以自定义修改配置和自定义实例化 Excel
 * - 如果返回的是一个 Excel 实例, 那么内部将替换原有的实例, 如果非 Excel 实例将被抛弃, 但 header 配置的修改仍可生效 .
 * @property {Function} create 钩子函数: 在实例化 Excel 之后触发, 此处可拿到实例对象, 仍可对实例对象进行修改 .
 */
/**
 * @param {ExportExcel} options
 */
const exportExcel = async (options) => {
    const { fileName = '未命名', header = [], content = [], wrapText = true, horizontal = 'center', vertical = 'middle', numFmt, beforeCreate, create } = options;
    const newHeader = cloneDeep(header).map(item => {
        if (!item.style)
            item.style = {};
        if (!item.alignment)
            item.style.alignment = {
                wrapText,
                horizontal,
                vertical
            };
        if (numFmt)
            item.style.numFmt = numFmt;
        return item;
    });
    let workbook = null;
    if (beforeCreate) {
        workbook = await beforeCreate({
            config: {
                headerConfig: newHeader
            },
            Workbook: ExcelJS.Workbook.bind(ExcelJS)
        });
    }
    if (!(workbook instanceof ExcelJS.Workbook)) {
        workbook = new ExcelJS.Workbook();
    }
    const worksheet = workbook.addWorksheet();
    worksheet.columns = newHeader; // 表头
    worksheet.addRows(content); // 表内容
    if (create) {
        await create(workbook);
    }
    const a = document.createElement("a");
    a.download = `${fileName}.xlsx`;
    const url = URL.createObjectURL(new Blob([await workbook.xlsx.writeBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
};
export default exportExcel;
