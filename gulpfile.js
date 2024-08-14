import gulp from 'gulp'
import { otfToTtf, ttfToWoff, fonstStyle } from './js/tasks/fonts.js'

const buildFolder = `./public`
const srcFolder = `./src`
const appFolder = `.`

const path = {
	build: {
		fonts: `${buildFolder}/fonts/`,
	},
	src: {
		fonts: `${srcFolder}/fonts/*.*`,
	},
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	appFolder: appFolder,
}

global.app = {
	gulp: gulp,
	path: path,
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fonstStyle)

export { fonts }
