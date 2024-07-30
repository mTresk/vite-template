import NiceSelect from 'nice-select2'

function initSelects() {
	const selects = document.querySelectorAll('[data-select]')

	if (selects) {
		selects.forEach((select) => {
			new NiceSelect(select, {
				placeholder: select.dataset.placeholder,
			})
		})
	}
}

window.addEventListener('DOMContentLoaded', function (e) {
	initSelects()
})
