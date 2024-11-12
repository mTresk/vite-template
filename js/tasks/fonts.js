import fs from 'fs'
import fonter from 'gulp-fonter-fix'
import ttf2woff2 from 'gulp-ttf2woff2'
import { basename as _basename, extname } from 'path'

export function otfToTtf() {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
}

export function ttfToWoff() {
	return app.gulp
		.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
		.pipe(ttf2woff2())
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
		.pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.{woff,woff2}`))
		.pipe(app.gulp.dest(`${app.path.build.fonts}`))
}

export function fonstStyle() {
	const fontsFile = `${app.path.appFolder}/scss/fonts/fonts.scss`

	fs.readdir(app.path.build.fonts, function (err, fonts) {
		if (fonts.length) {
			fs.writeFile(fontsFile, '', cb)
			let newFileOnly

			fonts.forEach((font) => {
				const ext = extname(font)
				const fontFileName = _basename(font, ext)
				const basename = fontFileName.toLowerCase()
				const fontName = fontFileName.split('-')[0] ?? basename

				if (newFileOnly !== fontFileName) {
					let fontWeight
					let fontStyle

					switch (true) {
						case basename.includes('thin'):
							fontWeight = 100
							break
						case basename.includes('extralight'):
							fontWeight = 200
							break
						case basename.includes('light'):
							fontWeight = 300
							break
						case basename.includes('medium'):
							fontWeight = 500
							break
						case basename.includes('semibold'):
							fontWeight = 600
							break
						case basename.includes('bold'):
							fontWeight = 700
							break
						case basename.includes('extrabold'):
							fontWeight = 800
							break
						case basename.includes('heavy'):
							fontWeight = 800
							break
						case basename.includes('black'):
							fontWeight = 900
							break
						default:
							fontWeight = 400
					}

					switch (true) {
						case basename.includes('normal'):
							fontStyle = 'normal'
							break
						case basename.includes('italic'):
							fontStyle = 'italic'
							break
						case basename.includes('oblique'):
							fontStyle = 'oblique'
							break
						default:
							fontStyle = 'normal'
					}

					fs.appendFile(
						fontsFile,
						`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`,
						cb
					)

					newFileOnly = fontFileName
				}
			})
		} else {
			fs.unlink(fontsFile, cb)
		}
	})
	return app.gulp.src(`${app.path.appFolder}`)
}

function cb() {}
