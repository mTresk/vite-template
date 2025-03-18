import Inputmask from 'inputmask'

const selectors = document.querySelectorAll('input[name="phone"]')

if (selectors.length) {
	selectors.forEach((selector) => {
		const im = new Inputmask('+7 (999) 999 99 99', { showMaskOnHover: false })
		im.mask(selector)
	})
}
