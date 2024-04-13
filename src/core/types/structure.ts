/**
 * 构造实例需要的类型
 */

import { TOnRowLoadCtx, TValueCtx } from './ctx'

/**
 * 配置列表 item
 */
export interface TConfigItem {
	/**
	 * 原始字段名
	 */
	originKey: string
	/**
	 * 映射后的字段名
	 */
	key: string
	/**
	 * 清除值两端的空白字符, 默认值使用配置选项(options)中的设置 [可选]
	 */
	trim?: boolean
	/**
	 * 监听 "值"
	 * - 支持异步等待
	 * @param ctx 上下文对象
	 */
	value?: (ctx: TValueCtx) => any | any
}

/**
 * 对象模式配置 item : 仅作向后兼容
 */
interface TObjConfigItem {
	/**
	 * 映射字段
	 */
	key: string
	/**
	 * 清除值两端的空白字符, 默认值使用配置选项(options)中的设置 [可选]
	 */
	trim?: boolean
	/**
	 * 监听 "值"
	 * - 支持异步等待
	 * @param ctx 上下文对象
	 */
	value?: (ctx: TValueCtx) => any | any
}

/**
 * 对象模式配置: 仅作向后兼容
 */
export type TObjConfig = {
	[key: string]: TObjConfigItem
}

/**
 *  配置列表
 */
export type TConfig = TConfigItem[] | TObjConfig

/**
 * 配置选项
 */
export interface TOptions {
	/**
	 * 是否清除值两端的空白字符, 默认为 true [可选]
	 */
	trim?: boolean
	/**
	 *  监听行的变化(每完成一行将调用一次), 接收一个上下文对象 [可选]
	 * - 支持异步等待
	 * @param ctx 上下文对象
	 */
	onRowLoad?: (ctx: TOnRowLoadCtx) => void
}
