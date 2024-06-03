import dom from './htmlTemplate'
import { exportExcel } from '../../src/main'

dom.button.onclick = () => {
	exportExcel({
		fileName: '测试导出',
		header: [
			{
				key: 'name',
				header: '姓名',
				width: 20
			},
			{
				key: 'sex',
				header: '性别',
				width: 20
			}
		],
		content: [
			['哈哈', '男'],
			['呵呵', '女']
		]
	})
}
