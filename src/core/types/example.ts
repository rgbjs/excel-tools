// 实例类型

import { TOnRowLoadCtx, TValueCtx } from './ctx'

/**
 * 配置对象
 */
export interface TOptions {
	/**
	 * 清除值两端的空白字符
	 */
	trim?: boolean
	/**
	 *  监听行的变化(每完成一行将调用一次), 接收一个上下文对象 [可选]
	 * - 支持异步等待
	 * @param ctx 上下文对象
	 */
	onRowLoad: (ctx: TOnRowLoadCtx) => void | Promise<void>
}

/**
 * 解析后的配置
 */
export interface TParseConfig {
	/**
	 * 映射字段
	 */
	key: string
	/**
	 * 清除值两端的空白字符
	 */
	trim: boolean
	/**
	 * 监听 "值"
	 * - 支持异步等待
	 * @param ctx 上下文对象
	 */
	value?: (ctx: TValueCtx) => void | Promise<void>
}
