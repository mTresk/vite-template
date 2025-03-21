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

// Загружаем API Яндекс Карт
function loadYMaps(): Promise<typeof import('ymaps3')> {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://api-maps.yandex.ru/v3/?apikey=YOUR_API_KEY&lang=ru_RU'
        script.onload = () => {
            // @ts-ignore - ymaps3 будет доступен после загрузки скрипта
            resolve(window.ymaps3)
        }
        script.onerror = () => reject(new Error('Failed to load Yandex Maps API'))
        document.head.appendChild(script)
    })
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
        try {
            const ymaps3 = await loadYMaps()
            const { ready, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3
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
        } catch (error) {
            console.error('Failed to initialize map:', error)
        }
    }

    // Вызываем функцию с типизированным параметром
    initMap(mapRoot).then(_ => {})
}
