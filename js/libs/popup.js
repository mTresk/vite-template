import { isMobile, bodyLockStatus, bodyLock, bodyUnlock, bodyLockToggle, FLS } from '../files/functions.js'
import { flsModules } from '../files/modules.js'

class Popup {
	constructor(options) {
		let config = {
			logging: true,
			init: true,
			// Для кнопок
			attributeOpenButton: 'data-popup', // Атрибут для кнопки, которая вызывает попап
			attributeCloseButton: 'data-close', // Атрибут для кнопки, которая закрывает попап
			// Для сторонних объектов
			fixElementSelector: '[data-lp]', // Атрибут для элементов с левым паддингом (которые fixed)
			// Для объекта попапа
			vkAttribute: 'data-popup-vk', // Атрибут для кода vk
			vkPlaceAttribute: 'data-popup-vk-place', // Атрибут для вставки ролика vk
			setAutoplayVk: true,
			// Изменение классов
			classes: {
				popup: 'popup',
				// popupWrapper: 'popup__wrapper',
				popupContent: 'popup__content',
				popupActive: 'popup_show', // Добавляется для попапа, когда он открывается
				bodyActive: 'popup-show', // Добавляется для боди, когда попап открыт
			},
			focusCatch: true, // Фокус внутри попапа зациклен
			closeEsc: true, // Закрытие по ESC
			bodyLock: true, // Блокировка скролла
			hashSettings: {
				location: true, // Хэш в адресной строке
				goHash: true, // Переход по наличию в адресной строке
			},
			on: {
				// События
				beforeOpen: function () {},
				afterOpen: function () {},
				beforeClose: function () {},
				afterClose: function () {},
			},
		}
		this.vkCode
		this.isOpen = false
		// Текущее окно
		this.targetOpen = {
			selector: false,
			element: false,
		}
		// Предыдущее открытое
		this.previousOpen = {
			selector: false,
			element: false,
		}
		// Последнее закрытое
		this.lastClosed = {
			selector: false,
			element: false,
		}
		this._dataValue = false
		this.hash = false

		this._reopen = false
		this._selectorOpen = false

		this.lastFocusEl = false
		this._focusEl = [
			'a[href]',
			'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
			'button:not([disabled]):not([aria-hidden])',
			'select:not([disabled]):not([aria-hidden])',
			'textarea:not([disabled]):not([aria-hidden])',
			'area[href]',
			'iframe',
			'object',
			'embed',
			'[contenteditable]',
			'[tabindex]:not([tabindex^="-"])',
		]
		//this.options = Object.assign(config, options);
		this.options = {
			...config,
			...options,
			classes: {
				...config.classes,
				...options?.classes,
			},
			hashSettings: {
				...config.hashSettings,
				...options?.hashSettings,
			},
			on: {
				...config.on,
				...options?.on,
			},
		}
		this.bodyLock = false
		this.options.init ? this.initPopups() : null
	}
	initPopups() {
		this.popupLogging(`Проснулся`)
		this.eventsPopup()
	}
	eventsPopup() {
		// Клик на всем документе
		document.addEventListener(
			'click',
			function (e) {
				// Клик по кнопке "открыть"
				const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`)
				if (buttonOpen) {
					e.preventDefault()
					this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton)
						? buttonOpen.getAttribute(this.options.attributeOpenButton)
						: 'error'
					this.vkCode = buttonOpen.getAttribute(this.options.vkAttribute)
						? buttonOpen.getAttribute(this.options.vkAttribute)
						: null
					if (this._dataValue !== 'error') {
						if (!this.isOpen) this.lastFocusEl = buttonOpen
						this.targetOpen.selector = `${this._dataValue}`
						this._selectorOpen = true
						this.open()
						return
					} else this.popupLogging(`Ой, не заполнен атрибут у  ${buttonOpen.classList}`)

					return
				}
				// Закрытие на пустом месте (popup__wrapper) и кнопки закрытия (popup__close) для закрытия
				const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`)
				if (buttonClose || (!e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen)) {
					e.preventDefault()
					this.close()
					return
				}
			}.bind(this)
		)
		// Закрытие по ESC
		document.addEventListener(
			'keydown',
			function (e) {
				if (this.options.closeEsc && e.which == 27 && e.code === 'Escape' && this.isOpen) {
					e.preventDefault()
					this.close()
					return
				}
				if (this.options.focusCatch && e.which == 9 && this.isOpen) {
					this._focusCatch(e)
					return
				}
			}.bind(this)
		)
	}
	open(selectorValue) {
		if (bodyLockStatus) {
			// Если перед открытием попапа был режим lock
			this.bodyLock = document.documentElement.classList.contains('lock') && !this.isOpen ? true : false

			// Если ввести значение селектора (селектор настраивается в options)
			if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
				this.targetOpen.selector = selectorValue
				this._selectorOpen = true
			}
			if (this.isOpen) {
				this._reopen = true
				this.close()
			}
			if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector
			if (!this._reopen) this.previousActiveElement = document.activeElement

			this.targetOpen.element = document.querySelector(this.targetOpen.selector)

			if (this.targetOpen.element) {
				// Vk
				if (this.vkCode) {
					const codeVideo = this.vkCode
					const urlVideo = `https://vk.ru/video_ext.php?oid=-${codeVideo}&autoplay=1`
					const iframe = document.createElement('iframe')
					iframe.setAttribute('allowfullscreen', '')
					const autoplay = this.options.setAutoplayVk ? 'autoplay;' : ''
					iframe.setAttribute('allow', `${autoplay}; encrypted-media`)
					iframe.setAttribute('src', urlVideo)
					this.targetOpen.element.querySelector(`[${this.options.vkPlaceAttribute}]`).appendChild(iframe)
				}

				// До открытия
				this.options.on.beforeOpen(this)
				// Создаем свое событие после открытия попапа
				document.dispatchEvent(
					new CustomEvent('beforePopupOpen', {
						detail: {
							popup: this,
						},
					})
				)

				this.targetOpen.element.classList.add(this.options.classes.popupActive)
				document.documentElement.classList.add(this.options.classes.bodyActive)

				if (!this._reopen) {
					!this.bodyLock ? bodyLock() : null
				} else this._reopen = false

				this.targetOpen.element.setAttribute('aria-hidden', 'false')

				// Запоминаю это открытое окно. Оно будет последним открытым
				this.previousOpen.selector = this.targetOpen.selector
				this.previousOpen.element = this.targetOpen.element

				this._selectorOpen = false

				this.isOpen = true

				setTimeout(() => {
					this._focusTrap()
				}, 50)

				// После открытия
				this.options.on.afterOpen(this)
				// Создаем свое событие после открытия попапа
				document.dispatchEvent(
					new CustomEvent('afterPopupOpen', {
						detail: {
							popup: this,
						},
					})
				)
				this.popupLogging(`Открыл попап`)
			} else this.popupLogging(`Ой ой, такого попапа нет. Проверьте корректность ввода. `)
		}
	}
	close(selectorValue) {
		if (selectorValue && typeof selectorValue === 'string' && selectorValue.trim() !== '') {
			this.previousOpen.selector = selectorValue
		}
		if (!this.isOpen || !bodyLockStatus) {
			return
		}
		// До закрытия
		this.options.on.beforeClose(this)
		// Создаем свое событие перед закрытием попапа
		document.dispatchEvent(
			new CustomEvent('beforePopupClose', {
				detail: {
					popup: this,
				},
			})
		)

		// Vk
		if (this.vkCode) {
			if (this.targetOpen.element.querySelector(`[${this.options.vkPlaceAttribute}]`))
				this.targetOpen.element.querySelector(`[${this.options.vkPlaceAttribute}]`).innerHTML = ''
		}
		this.previousOpen.element.classList.remove(this.options.classes.popupActive)
		// aria-hidden
		this.previousOpen.element.setAttribute('aria-hidden', 'true')
		if (!this._reopen) {
			document.documentElement.classList.remove(this.options.classes.bodyActive)
			!this.bodyLock ? bodyUnlock() : null
			this.isOpen = false
		}
		// После закрытия
		this.options.on.afterClose(this)
		// Создаем свое событие после закрытия попапа
		document.dispatchEvent(
			new CustomEvent('afterPopupClose', {
				detail: {
					popup: this,
				},
			})
		)

		setTimeout(() => {
			this._focusTrap()
		}, 50)

		this.popupLogging(`Закрыл попап`)
	}

	_focusCatch(e) {
		const focusable = this.targetOpen.element.querySelectorAll(this._focusEl)
		const focusArray = Array.prototype.slice.call(focusable)
		const focusedIndex = focusArray.indexOf(document.activeElement)

		if (e.shiftKey && focusedIndex === 0) {
			focusArray[focusArray.length - 1].focus()
			e.preventDefault()
		}
		if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
			focusArray[0].focus()
			e.preventDefault()
		}
	}
	_focusTrap() {
		const focusable = this.previousOpen.element.querySelectorAll(this._focusEl)
		if (!this.isOpen && this.lastFocusEl) {
			this.lastFocusEl.focus()
		} else {
			focusable[0].focus()
		}
	}
	// Функция вывода в консоль
	popupLogging(message) {
		this.options.logging ? FLS(`[Попап]: ${message}`) : null
	}
}
// Запускаем и добавляем в объект модулей
flsModules.popup = new Popup({})
