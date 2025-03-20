export interface IMobile {
	Android: () => RegExpMatchArray | null
	BlackBerry: () => RegExpMatchArray | null
	iOS: () => RegExpMatchArray | null
	Opera: () => RegExpMatchArray | null
	Windows: () => RegExpMatchArray | null
	any: () => boolean
}

export interface IMediaQueryItem {
	itemsArray: HTMLElement[]
	matchMedia: MediaQueryList
}

export interface IBreakpoint {
	value: string
	type: string
	item: HTMLElement
}

export interface IMediaQueryResult {
	itemsArray: HTMLElement[]
	matchMedia: MediaQueryList
}

// Расширяем глобальный интерфейс Window
declare global {
	interface Window {
		FLS?: boolean
	}
}
