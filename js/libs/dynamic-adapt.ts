interface DynamicAdaptObject {
    element: HTMLElement
    parent: HTMLElement
    destination: HTMLElement
    breakpoint: string
    place: string
    index: number
}

type AdaptType = 'min' | 'max'

class DynamicAdapt {
    private type: AdaptType
    private оbjects: DynamicAdaptObject[]
    private daClassname: string
    private nodes: HTMLElement[]
    private mediaQueries: string[]

    constructor(type: AdaptType) {
        this.type = type
    }

    init(): void {
        // массив объектов
        this.оbjects = []
        this.daClassname = '_dynamic_adapt_'
        // массив DOM-элементов
        this.nodes = [...document.querySelectorAll('[data-da]')] as HTMLElement[]

        // наполнение оbjects объктами
        this.nodes.forEach((node) => {
            const data = node.dataset.da?.trim() || ''
            const dataArray = data.split(',')
            const оbject: DynamicAdaptObject = {
                element: node,
                parent: node.parentNode as HTMLElement,
                destination: document.querySelector(dataArray[0].trim()) as HTMLElement,
                breakpoint: dataArray[1] ? dataArray[1].trim() : '767',
                place: dataArray[2] ? dataArray[2].trim() : 'last',
                index: this.indexInParent(node.parentNode as HTMLElement, node),
            }
            this.оbjects.push(оbject)
        })

        this.arraySort(this.оbjects)

        // массив уникальных медиа-запросов
        this.mediaQueries = this.оbjects
            .map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
            .filter((item, index, self) => self.indexOf(item) === index)

        // навешивание слушателя на медиа-запрос
        // и вызов обработчика при первом запуске
        this.mediaQueries.forEach((media) => {
            const mediaSplit = media.split(',')
            const matchMedia = window.matchMedia(mediaSplit[0])
            const mediaBreakpoint = mediaSplit[1]

            // массив объектов с подходящим брейкпоинтом
            const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
            matchMedia.addEventListener('change', () => {
                this.mediaHandler(matchMedia, оbjectsFilter)
            })
            this.mediaHandler(matchMedia, оbjectsFilter)
        })
    }

    // Основна функция
    private mediaHandler(matchMedia: MediaQueryList, оbjects: DynamicAdaptObject[]): void {
        if (matchMedia.matches) {
            оbjects.forEach((оbject) => {
                this.moveTo(оbject.place, оbject.element, оbject.destination)
            })
        } else {
            оbjects.forEach(({ parent, element, index }) => {
                if (element.classList.contains(this.daClassname)) {
                    this.moveBack(parent, element, index)
                }
            })
        }
    }

    // Функция перемещения
    private moveTo(place: string, element: HTMLElement, destination: HTMLElement): void {
        element.classList.add(this.daClassname)
        if (place === 'last' || place >= destination.children.length.toString()) {
            destination.append(element)
            return
        }
        if (place === 'first') {
            destination.prepend(element)
            return
        }
        destination.children[Number.parseInt(place)].before(element)
    }

    // Функция возврата
    private moveBack(parent: HTMLElement, element: HTMLElement, index: number): void {
        element.classList.remove(this.daClassname)
        if (parent.children[index] !== undefined) {
            parent.children[index].before(element)
        } else {
            parent.append(element)
        }
    }

    // Функция получения индекса внутри родителя
    private indexInParent(parent: HTMLElement, element: HTMLElement): number {
        return [...parent.children].indexOf(element)
    }

    // Функция сортировки массива по breakpoint и place
    // по возрастанию для this.type = min
    // по убыванию для this.type = max
    private arraySort(arr: DynamicAdaptObject[]): void {
        if (this.type === 'min') {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return -1
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return 1
                    }
                    return 0
                }
                return Number.parseInt(a.breakpoint) - Number.parseInt(b.breakpoint)
            })
        } else {
            arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) {
                        return 0
                    }
                    if (a.place === 'first' || b.place === 'last') {
                        return 1
                    }
                    if (a.place === 'last' || b.place === 'first') {
                        return -1
                    }
                    return 0
                }
                return Number.parseInt(b.breakpoint) - Number.parseInt(a.breakpoint)
            })
        }
    }
}

const da = new DynamicAdapt('max')
da.init()
