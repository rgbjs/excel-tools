## 使用指南

**安装:**

*pnpm*

```
pnpm i excel-tools
```



*yarn*

```
yarn add excel-tools
```



*npm*

```
npm i excel-tools
```



**导入:**

```js
import { ImportExcel, exportExcel } from 'excel-tools'
// 针对 vue2 无法处理 class 的问题, 此处提供了一个降级后的包
import { ImportExcel, exportExcel } from 'excel-tools/dist/vue2'
/**
* ImportExcel 用于导入 Excel 数据
* exportExcel 用于将数据导出为 Excel
*/
```





##  使用示例

**ImportExcel 语法:**

`new ImportExcel(mapData [, options])`

- mapData { Object[] } 数据映射列表

  - 数组中的每一项 item { Object }

    - originKey { string } 原始字段名
    - key { string } 映射后的字段名
    - trim { boolean } 清除值两端的空白字符, 默认值使用配置参数中的设置 [可选]
    - value { Function | any } 监听 "值" [可选]

      - 当为函数时:
      -  函数支持标记为 async , 执行器会在内部进行异步等待
      - 可接收一个上下文对象参数 ctx

        - row 当前数据所在行下标(下标从0开始)
        - originRow 当前数据在 Excel 中的行(下标从0开始)
        - index 当前数据的下标(下标从0开始)
        - originIndex 当前数据在 Excel 中的列(下标从0开始)
        - key 当前的字段名
        - originKey 映射前的字段名
        - value 当前的值
        - rowItem 当前行解析前的数据(数组)
        - getRowData() 函数, 用于获取当前行解析后的数据, 拿到的值是该 "值" 解析前的, 即还未解析到的值在**此刻**是拿不到的
        - setData(key, value) 函数, 用于设置当前行数据某个字段的值, key 为设置的字段名, value 为设置的值

      - 当不是函数时:

      - 该值会作为默认值, 即该数据的 Excel 单元格未填写时

      - 实质内部是包装成函数进行处理

        ```js
        ......
        value: (ctx) => {
        	const { key, value, setData } = context
        	if(value === undefined) {
        		setData(key, '这里是默认值 !!!')
        	}
        }
        ```

        

- options { Object } 配置对象 [可选]
  - trim  { boolean } 清除值两端的空白字符, 默认为 true [可选]
  - onRowLoad  {Function} 监听行的变化(每完成一行将调用一次) [可选]
    - 函数支持标记为 async , 执行器会在内部进行异步等待
    - 可接收一个上下文对象参数 ctx
      - row 当前数据所在行下标(下标从0开始)
      - originRow 当前数据在 Excel 中的行(下标从0开始)
      - rowItem 当前行解析前的数据(数组)
      - rowData 当前行解析后的数据(对象)
      - setData(key, value) 函数, 用于设置当前行数据某个字段的值, key 为设置的字段名, value 为设置的值

```js
import { ImportExcel } from 'excel-tools'

/**
 * 假设 Excel 中存在 "姓名" 和 "年龄" 和 "性别" 三列
 */
const importExcel = new ImportExcel(
    [
    	{
            // 原始字段名
            originKey: '姓名', 
            // 映射后的字段名
            key: 'name', 
            // 清除值两端的空白字符, 为空默认使用配置参数中的设置 [可选]
            trim: true, 
            // value 是可选的
            value(ctx) {
                // context 中的参数:
                // - row 当前数据所在行下标(下标从0开始)
                // - originRow 当前数据在 Excel 中的行(下标从0开始)
                // - index 当前数据的下标(下标从0开始)
                // - originIndex 当前数据在 Excel 中的列(下标从0开始)
                // - key 当前的字段名
                // - originKey 映射前的字段名
                // - value 当前的值
                // - rowItem 当前行解析前的数据(数组)
                // - getRowData() 函数, 用于获取当前行解析后的数据, 
                // 拿到的值是该 "值" 解析前的, 即还未解析到的值在*此刻*是拿不到的
                // - setData(key, value) 函数, 用于设置当前行数据某个字段的值
                // key 为设置的字段名, value 为设置的值

                // 当该单元格数据不存在时, 设置一个默认值
                const { key, value, setData } = context
                if(value === undefined) {
                    setData(key, '这里是默认值 !!!')
                }
        },
        {
            originKey: '性别', 
            key: 'sex', 
            // value 是可选的
            value: '这是替代值'
            // 此处 value 写法会被包装成以下形式
            // value(ctx) {
            // 	 const { key, value, setData } = context
            //   if(value === undefined) {
            //      setData(key, '这里是默认值 !!!')
            //   }
        	// }
        },
        {
            originKey: '年龄', 
            key: 'age'
        },
    ],
	// 配置对象
	{
        trim: false, // 是否清除值两端的空白字符, 默认为 true [可选]
        // 监听行的变化(每完成一行将调用一次), 接收一个上下文对象 [可选]
        onRowLoad(context) {
            // 该事件支持异步等待 => async onRowLoad() => {}
            // context 中的参数:
            // - row 当前数据所在行下标(下标从0开始)
            // - originRow 当前数据在 Excel 中的行(下标从0开始)
            // - rowItem 当前行解析前的数据(数组)
            // - rowData 当前行解析后的数据(对象)
            // - setData(key, value) 函数, 用于设置当前行数据某个字段的值
            // key为设置的字段名, value 为设置的值
        }
	}
)

// 加载一个 Excel, load() 函数传递一个文件对象(File), 返回一个 Promise
importExcel.load(file).then(res => {
    // res 解析后的结果
}).catch(err => {
    // 错误对象, 拥有两个字段: 
    // - code -2 表示传递的不是文件对象,
    // - code -1 表示文件对象不是 xlsx 类型,
    // - code 0 表示解析过程中出现了错误
    // - error Error 对象
})
```



***以下使用方式不在被推荐***

```js
import { ImportExcel } from 'excel-tools'

/**
 * 假设 Excel 中存在 "姓名" 和 "年龄" 和 "性别" 三列
 */
const importExcel = new ImportExcel({
    "姓名": "name", // 映射字段, 简写形式
    "年龄": { // 配置参数形式
        key: "age", // 映射字段
        trim: false, // 不清除两端空白, 若不设置则使用配置对象中的 trim [可选参数]
        value: "不存在" // 监听值, 内部实际会包装成函数(同下方 "性别" 设置默认值一致), 如果读取的单元格不存在值, 将用此作为默认值 [可选]
    },
    "性别": {
         key: "sex",
        // 此处事件支持异步等待 => async value() => {}
        value(context) { // 函数形式监听值, 接收一个上下文对象
            // context 中的参数:
            // - row 当前数据所在行下标(下标从0开始)
            // - originRow 当前数据在 Excel 中的行(下标从0开始)
            // - index 当前数据的下标(下标从0开始)
            // - originIndex 当前数据在 Excel 中的列(下标从0开始)
            // - key 当前的字段名
            // - originKey 映射前的字段名
            // - value 当前的值
            // - rowItem 当前行解析前的数据(数组)
            // - getRowData() 函数, 用于获取当前行解析后的数据
            // - setData(key, value) 函数, 用于设置当前行数据某个字段的值
            // key为设置的字段名, value 为设置的值
            
            // 函数设置默认值
            const { key, value, setData } = context
            if(value === undefined) {
                setData(key, '这是替代值')
            }
        }
    }
},
// 配置对象
{
	trim: false, // 是否清除值两端的空白字符, 默认为 true [可选]
    // 监听行的变化(每完成一行将调用一次), 接收一个上下文对象 [可选]
    onRowLoad(context) {
        // 该事件支持异步等待 => async onRowLoad() => {}
        // context 中的参数:
        // - row 当前数据所在行下标(下标从0开始)
        // - originRow 当前数据在 Excel 中的行(下标从0开始)
        // - rowItem 当前行解析前的数据(数组)
        // - rowData 当前行解析后的数据(对象)
        // - setData(key, value) 函数, 用于设置当前行数据某个字段的值
        // key为设置的字段名, value 为设置的值
    }
})

// 加载一个 Excel, load() 传递一个文件对象, 返回一个 Promise
importExcel.load(file).then(res => {
    // res 解析后的结果
}).catch(err => {
    // 错误对象, 拥有两个字段: 
    // - code -2 表示传递的不是文件对象,
    // - code -1 表示文件对象不是 xlsx 类型,
    // - code 0 表示解析过程中出现了错误
    // - error Error 对象
})
```



**exportExcel语法:**

`exportExcel(options)`

- options { Object } 配置对象
  - fileName { String } 导出文件的名字, 默认值为 '未命名' [可选]
  - header { Object[] } 导出文件的表头, 传递数组对象
    - key  { string } 表头字段
    - header { string } 表头字段映射的值
    - width { number } 单元格宽度 [可选]
  - content { Object[] } 需要导出的数据, 传递数组对象

```js
import { exportExcel } from 'excel-tools'

// 假如需要导出的数据如下:
const data = [
    {
        name: '小明',
        age: 17,
        age: '男'
    },
    {
        name: '小白',
        age: 18,
        age: '女'
    }
]

exportExcel({
    fileName: '人员数据',
    header: [
        {
            key: 'name',
            header: '姓名',
            width: 25
        },
        {
            key: 'age',
            header: '年龄',
            width: 24
        },
        {
            key: 'sex',
            header: '性别',
            width: 23
        }
    ],
    content: data // 导出的数据
})
```

