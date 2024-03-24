import Scrollbar from 'smooth-scrollbar'

if (document.querySelectorAll('[data-scrollbar]').length) {
	document.querySelectorAll('[data-scrollbar]').forEach((scrollBlock) => {
		Scrollbar.init(scrollBlock, {
			alwaysShowTracks: true,
		})
	})
}
