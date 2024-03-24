import 'inputmask/dist/inputmask.min.js'

const selectors = document.querySelectorAll('input[name="phone"]')

if (selectors) {
	selectors.forEach((selector) => {
		let im = new Inputmask('+7 (999) 999 99 99', { showMaskOnHover: false })
		im.mask(selector)
	})
}
