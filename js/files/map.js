const mapRoot = document.querySelector('#map')

if (mapRoot) {
	async function initMap() {
		await ymaps3.ready
		const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3

		// Координаты центра
		const center = mapRoot.getAttribute('data-coordinates').split(',').reverse()

		// Создаем слой
		const layer = new YMapDefaultSchemeLayer({
			customization: [
				{
					tags: {
						any: ['road'],
					},
					elements: 'geometry',
					stylers: [
						{
							color: '#4E4E4E',
						},
					],
				},
				{
					tags: {
						any: ['water'],
					},
					elements: 'geometry',
					stylers: [
						{
							color: '#000000',
						},
					],
				},
				{
					tags: {
						any: ['landscape', 'admin', 'land', 'transit'],
					},
					elements: 'geometry',
					stylers: [
						{
							color: '#212121',
						},
					],
				},
				{
					tags: {
						any: ['building'],
					},
					elements: 'geometry',
					stylers: [
						{
							color: '#757474',
						},
					],
				},
			],
		})

		// Создаем карту
		const map = new YMap(mapRoot, {
			location: {
				center,
				zoom: 17,
			},
			showScaleInCopyrights: false,
		})

		// Создаем маркер
		const markerElement = document.createElement('img')
		markerElement.className = 'icon-marker'
		markerElement.src = 'images/pin.svg'
		const marker = new YMapMarker({ coordinates: center }, markerElement)

		// Добавляем элементы на карту
		map.addChild(new YMapDefaultFeaturesLayer())
		map.addChild(layer)
		map.addChild(marker)
	}

	initMap()
}
