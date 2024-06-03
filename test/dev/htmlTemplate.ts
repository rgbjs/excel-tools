const div = document.createElement('div')
const template = `
<input type="file" class="file-input" />
<button class="download">下载</button>
`

div.innerHTML = template
const input = div.querySelector('.file-input') as HTMLInputElement
const button = div.querySelector('.download') as HTMLButtonElement
document.body.appendChild(div)
export default {
	container: div,
	input,
	button
}
