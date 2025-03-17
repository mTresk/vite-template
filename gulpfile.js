import gulp from 'gulp'
import { fonstStyle, otfToTtf, ttfToWoff } from './js/tasks/fonts.js'

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
	buildFolder,
	srcFolder,
	appFolder,
}

const app = {
	gulp,
	path,
}

const fonts = gulp.series(otfToTtf, ttfToWoff, fonstStyle)

export { app, fonts }
