import Scrollbar from 'smooth-scrollbar'

const scrollBlocks = document.querySelectorAll('[data-scrollbar]')

if (scrollBlocks.length) {
	scrollBlocks.forEach((scrollBlock) => {
		Scrollbar.init(scrollBlock, {
			alwaysShowTracks: true,
			continuousScrolling: false,
		})
	})
}
