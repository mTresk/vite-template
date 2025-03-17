import * as noUiSlider from 'nouislider'
import '../../../scss/base/forms/range.scss'

export function rangeInit() {
	const priceSlider = document.querySelector('[data-range-slider]')
	if (priceSlider) {
		const from = priceSlider.getAttribute('data-range-slider-from')
		const to = priceSlider.getAttribute('data-range-slider-to')

		noUiSlider.create(priceSlider, {
			start: [Number(from), Number(to)],
			connect: true,
			range: {
				min: Number(from),
				max: Number(to),
			},
		})

		const priceStart = document.querySelector('[data-range-slider-min]')
		const priceEnd = document.querySelector('[data-range-slider-max]')

		priceStart.value = from
		priceEnd.value = to

		priceStart.addEventListener('change', setPriceValues)
		priceEnd.addEventListener('change', setPriceValues)

		function setPriceValues() {
			let priceStartValue
			let priceEndValue
			if (priceStart.value !== '') {
				priceStartValue = priceStart.value
			}
			if (priceEnd.value !== '') {
				priceEndValue = priceEnd.value
			}
			priceSlider.noUiSlider.set([priceStartValue, priceEndValue])
		}

		function setValue() {
			const sliderValueNumber = priceSlider.noUiSlider.get(true)

			priceStart.value = Math.round(sliderValueNumber[0])
			priceEnd.value = Math.round(sliderValueNumber[1])
		}

		priceSlider.noUiSlider.on('slide', setValue)
	}
}
rangeInit()
