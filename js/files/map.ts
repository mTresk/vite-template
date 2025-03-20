// Типы для Yandex Maps API
interface YMapLocation {
	center: number[]
	zoom: number
}

interface YMapOptions {
	location: YMapLocation
	showScaleInCopyrights: boolean
}

interface YMapMarkerOptions {
	coordinates: number[]
}

// Объявляем типы API как модуль
declare module 'ymaps3' {
	export class YMap {
		constructor(element: HTMLElement, options: YMapOptions)
		addChild(child: any): void
	}

	export class YMapDefaultSchemeLayer {
		constructor(options: any)
	}

	export class YMapDefaultFeaturesLayer {
		constructor()
	}

	export class YMapMarker {
		constructor(options: YMapMarkerOptions, element: HTMLElement)
	}

	export const ready: Promise<void>
}

// Ищем корневой элемент карты
const mapRoot = document.querySelector<HTMLElement>('[data-map]')

// Инициализируем карту только если элемент найден
if (mapRoot) {
	// Создаем функцию инициализации с типизированным параметром root
	async function initMap(root: HTMLElement) {
		const { ready, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = await import('ymaps3')
		await ready

		// Координаты центра
		const coordinates = root.getAttribute('data-coordinates')
		if (!coordinates) {
			console.error('Missing data-coordinates attribute')
			return
		}

		// Преобразуем строковые координаты в числовые
		const center: number[] = coordinates.split(',').reverse().map(Number)

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
		const map = new YMap(root, {
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

	// Вызываем функцию с типизированным параметром
	initMap(mapRoot)
}
