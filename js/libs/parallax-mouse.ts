import { FLS } from '../files/functions.js'
import { flsModules } from '../files/modules.js'
import type { IMousePRLXConfig, IParallaxMouseElement } from '../types.js'

class MousePRLX {
    private config: IMousePRLXConfig

    constructor(props: Partial<IMousePRLXConfig>) {
        const defaultConfig: IMousePRLXConfig = {
            init: true,
            logging: false,
        }
        this.config = Object.assign(defaultConfig, props)
        if (this.config.init) {
            const paralaxMouse: NodeListOf<IParallaxMouseElement> = document.querySelectorAll('[data-prlx-mouse]')
            if (paralaxMouse.length) {
                this.paralaxMouseInit(paralaxMouse)
                this.setLogging(`Проснулся, слежу за объектами: (${paralaxMouse.length})`)
            } else {
                this.setLogging('Нет ни одного объекта. Сплю...zzZZZzZZz...')
            }
        }
    }

    private paralaxMouseInit(paralaxMouse: NodeListOf<IParallaxMouseElement>): void {
        paralaxMouse.forEach((el: IParallaxMouseElement) => {
            const paralaxMouseWrapper: Element | null = el.closest('[data-prlx-mouse-wrapper]')

            // Коэф. X
            const paramСoefficientX: number = el.dataset.prlxCx ? +el.dataset.prlxCx : 100
            // Коэф. У
            const paramСoefficientY: number = el.dataset.prlxCy ? +el.dataset.prlxCy : 100
            // Напр. Х
            const directionX: number = el.hasAttribute('data-prlx-dxr') ? -1 : 1
            // Напр. У
            const directionY: number = el.hasAttribute('data-prlx-dyr') ? -1 : 1
            // Скорость анимации
            const paramAnimation: number = el.dataset.prlxA ? +el.dataset.prlxA : 50

            // Объявление переменных
            let positionX: number = 0
            let positionY: number = 0
            let coordXprocent: number = 0
            let coordYprocent: number = 0

            setMouseParallaxStyle()

            // Проверяем наличие родителя, в котором будет считываться положение мыши
            if (paralaxMouseWrapper) {
                mouseMoveParalax(paralaxMouseWrapper)
            } else {
                mouseMoveParalax()
            }

            function setMouseParallaxStyle(): void {
                const distX: number = coordXprocent - positionX
                const distY: number = coordYprocent - positionY
                positionX = positionX + (distX * paramAnimation) / 1000
                positionY = positionY + (distY * paramAnimation) / 1000
                el.style.cssText = `transform: translate3D(${(directionX * positionX) / (paramСoefficientX / 10)}%,${(directionY * positionY) / (paramСoefficientY / 10)}%,0);`
                requestAnimationFrame(setMouseParallaxStyle)
            }

            function mouseMoveParalax(wrapper: Element | Window = window): void {
                wrapper.addEventListener('mousemove', (e: Event) => {
                    const mouseEvent = e as MouseEvent
                    const offsetTop: number = el.getBoundingClientRect().top + window.scrollY
                    if (offsetTop >= window.scrollY || offsetTop + el.offsetHeight >= window.scrollY) {
                        // Получение ширины и высоты блока
                        const parallaxWidth: number = window.innerWidth
                        const parallaxHeight: number = window.innerHeight
                        // Ноль посередине
                        const coordX: number = mouseEvent.clientX - parallaxWidth / 2
                        const coordY: number = mouseEvent.clientY - parallaxHeight / 2
                        // Получаем проценты
                        coordXprocent = (coordX / parallaxWidth) * 100
                        coordYprocent = (coordY / parallaxHeight) * 100
                    }
                })
            }
        })
    }

    // Логгирование в консоль
    private setLogging(message: string): void {
        this.config.logging ? FLS(`[PRLX Mouse]: ${message}`) : null
    }
}

flsModules.mousePrlx = new MousePRLX({})

export { MousePRLX }
