import { TConfig, TOptions } from './types/structure.js';
import { TanyObj } from './types/ctx.js';

/**
 * 导入 Excel 构造器
 */
declare class ImportExcel {
    #private;
    /**
     * 创建一个导入 Excel 实例
     * @param config 配置列表
     * @param options 配置选项
     */
    constructor(config: TConfig, options?: TOptions);
    get keys(): string[];
    get map(): TanyObj;
    get mapData(): TOptions;
    get info(): {
        workbook: TanyObj;
        worksheet: unknown[][];
        parseData: TanyObj[];
    };
    /**
     * 加载 xlsx 文件
     * @param file 文件对象
     * @param len 截取掉(舍去)头部数据的长度(如表头, 描述等前几条不需要的数据), 默认为 2
     * @returns 如果发生错误, 将返回一个对象, 其中 code 表示错误类型, error 为错误对象
     * code -2 表示参数不是文件类型, -1 表示文件类型不是 xlsx , 0 Excel 解析过程中发生错误
     */
    load(file: File, len?: number): Promise<TanyObj[]>;
}
export default ImportExcel;
