const str = 'hello world'
const file = new File([str], '测试')

file.text().then(res => console.log(res))