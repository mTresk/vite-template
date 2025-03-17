import datepicker from 'js-datepicker'
import { flsModules } from '../modules.js'
import 'js-datepicker/src/datepicker'

if (document.querySelector('[data-datepicker]')) {
	const picker = datepicker('[data-datepicker]', {
		customDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
		customMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
		overlayButton: 'Применить',
		overlayPlaceholder: 'Год (4 цифры)',
		startDay: 1,
		formatter: (input, date) => {
			const value = date.toLocaleDateString()
			input.value = value
		},
	})
	flsModules.datepicker = picker
}
