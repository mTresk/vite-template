import Swiper, { Navigation } from 'swiper'
import 'swiper/css'

function initSliders() {
	if (document.querySelector('.swiper')) {
		new Swiper('.swiper', {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			slidesPerView: 1,
			spaceBetween: 0,
			autoHeight: true,
			speed: 800,

			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},
			on: {},
		})
	}
}

window.addEventListener('DOMContentLoaded', function (e) {
	initSliders()
})
