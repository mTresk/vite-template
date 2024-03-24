import * as noUiSlider from 'nouislider'
import '../../../scss/base/forms/range.scss'

export function rangeInit() {
	const priceSlider = document.querySelector('#range')
	if (priceSlider) {
		let from = priceSlider.getAttribute('data-from')
		let to = priceSlider.getAttribute('data-to')

		noUiSlider.create(priceSlider, {
			start: [Number(from), Number(to)],
			connect: true,
			range: {
				min: Number(from),
				max: Number(to),
			},
		})

		const priceStart = document.querySelector('.range-fiter__input--min input')
		const priceEnd = document.querySelector('.range-fiter__input--max input')

		priceStart.value = from
		priceEnd.value = to

		priceStart.addEventListener('change', setPriceValues)
		priceEnd.addEventListener('change', setPriceValues)

		function setPriceValues() {
			let priceStartValue
			let priceEndValue
			if (priceStart.value != '') {
				priceStartValue = priceStart.value
			}
			if (priceEnd.value != '') {
				priceEndValue = priceEnd.value
			}
			priceSlider.noUiSlider.set([priceStartValue, priceEndValue])
		}

		function setValue() {
			let sliderValueNumber = priceSlider.noUiSlider.get(true)

			priceStart.value = Math.round(sliderValueNumber[0])
			priceEnd.value = Math.round(sliderValueNumber[1])
		}

		priceSlider.noUiSlider.on('slide', setValue)
	}
}
rangeInit()
