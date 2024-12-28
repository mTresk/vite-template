import Swiper from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css'

function initSliders() {
	if (document.querySelector('.swiper')) {
		new Swiper('.swiper', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			autoHeight: false,
			speed: 800,

			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},
			on: {},
		})
	}

	function breakpointSliderEnabler(width, callback) {
		let slider
		const breakpoint = window.matchMedia(`(max-width:${width}px)`)

		const init = function () {
			if (breakpoint.matches) {
				slider = callback()
			} else if (!breakpoint.matches && slider) {
				slider.destroy(true, true)
			}
		}

		breakpoint.addEventListener('change', init)
		init()
	}
}

window.addEventListener('DOMContentLoaded', function (e) {
	initSliders()
})
