const map = document.querySelector('#map')

if (map) {
	function mapInit() {
		ymaps.ready(init)
		function init() {
			const center = map.getAttribute('data-coordinates').split(',')
			let contactMap = new ymaps.Map('map', {
				center: center,
				zoom: 17,
				controls: [],
			})
			contactMap.geoObjects.add(
				new ymaps.Placemark(
					center,
					{},
					{
						iconLayout: 'default#imageWithContent',
						iconImageHref: 'img/pin.svg',
						iconImageSize: [30, 30],
						iconImageOffset: [-15, -25],
					}
				)
			)

			contactMap.controls.remove('geolocationControl') // удаляем геолокацию
			contactMap.controls.remove('searchControl') // удаляем поиск
			contactMap.controls.remove('trafficControl') // удаляем контроль трафика
			contactMap.controls.remove('typeSelector') // удаляем тип
			contactMap.controls.remove('fullscreenControl') // удаляем кнопку перехода в полноэкранный режим
			contactMap.controls.remove('rulerControl') // удаляем контрол правил
			contactMap.behaviors.disable(['scrollZoom']) // отключаем скролл карты (опционально)
		}
	}

	mapInit()
}
