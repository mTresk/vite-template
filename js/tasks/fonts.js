import fs from 'node:fs'
import { basename as _basename, extname } from 'node:path'
import Fontmin from 'fontmin'

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

// Создаем папку, если её нет
async function ensureDirectoryExists(dir) {
    try {
        await fs.promises.access(dir)
    } catch {
        await fs.promises.mkdir(dir, { recursive: true })
    }
}

// Конвертируем OTF в TTF
async function convertOtfToTtf() {
    console.log('Converting OTF to TTF...')
    const otfFiles = await fs.promises
        .readdir(`${srcFolder}/fonts`)
        .then((files) => files.filter((file) => file.endsWith('.otf')))
        .catch(() => [])

    if (otfFiles.length === 0) {
        console.log('No OTF files found')
        return
    }

    for (const file of otfFiles) {
        console.log(`Converting ${file}...`)
        const inputPath = `${srcFolder}/fonts/${file}`
        const outputPath = `${srcFolder}/fonts/${file.replace('.otf', '.ttf')}`

        try {
            const fontmin = new Fontmin().src(inputPath).dest(`${srcFolder}/fonts/`).use(Fontmin.ttf2ttf())

            await new Promise((resolve, reject) => {
                fontmin.run((err, files) => {
                    if (err) {
                        console.error(`Error converting ${file}:`, err)
                        reject(err)
                    } else {
                        console.log(`Converted ${file} to TTF`)
                        resolve()
                    }
                })
            })
        } catch (error) {
            console.error(`Error processing ${file}:`, error)
        }
    }
}

// Конвертируем TTF в WOFF/WOFF2
async function convertTtfToWoff() {
    console.log('Converting TTF to WOFF/WOFF2...')
    const ttfFiles = await fs.promises
        .readdir(`${srcFolder}/fonts`)
        .then((files) => files.filter((file) => file.endsWith('.ttf')))
        .catch(() => [])

    if (ttfFiles.length === 0) {
        console.log('No TTF files found')
        return
    }

    await ensureDirectoryExists(path.build.fonts)

    for (const file of ttfFiles) {
        console.log(`Converting ${file}...`)
        const inputPath = `${srcFolder}/fonts/${file}`
        const fontName = _basename(file, '.ttf')

        try {
            // Конвертируем в WOFF
            const woffFontmin = new Fontmin().src(inputPath).dest(path.build.fonts).use(Fontmin.ttf2woff())

            await new Promise((resolve, reject) => {
                woffFontmin.run((err, files) => {
                    if (err) {
                        console.error(`Error converting ${file} to WOFF:`, err)
                        reject(err)
                    } else {
                        console.log(`Converted ${file} to WOFF`)
                        resolve()
                    }
                })
            })

            // Конвертируем в WOFF2
            const woff2Fontmin = new Fontmin().src(inputPath).dest(path.build.fonts).use(Fontmin.ttf2woff2())

            await new Promise((resolve, reject) => {
                woff2Fontmin.run((err, files) => {
                    if (err) {
                        console.error(`Error converting ${file} to WOFF2:`, err)
                        reject(err)
                    } else {
                        console.log(`Converted ${file} to WOFF2`)
                        resolve()
                    }
                })
            })
        } catch (error) {
            console.error(`Error processing ${file}:`, error)
        }
    }

    // Удаляем TTF файлы из папки public/fonts
    console.log('Cleaning up TTF files from public/fonts...')
    try {
        const publicFonts = await fs.promises.readdir(path.build.fonts)
        const ttfFilesToRemove = publicFonts.filter((file) => file.endsWith('.ttf'))

        for (const file of ttfFilesToRemove) {
            await fs.promises.unlink(`${path.build.fonts}${file}`)
            console.log(`Removed ${file} from public/fonts`)
        }
    } catch (error) {
        console.error('Error cleaning up TTF files:', error)
    }
}

// Генерируем SCSS файл
async function generateFontsScss() {
    console.log('Generating fonts.scss...')
    const fontsFile = `${appFolder}/scss/fonts/fonts.scss`

    try {
        const fonts = await fs.promises.readdir(path.build.fonts)

        if (fonts.length) {
            await fs.promises.writeFile(fontsFile, '')
            let newFileOnly

            for (const font of fonts) {
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

                    await fs.promises.appendFile(
                        fontsFile,
                        `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`
                    )

                    newFileOnly = fontFileName
                }
            }
        } else {
            try {
                await fs.promises.unlink(fontsFile)
            } catch (error) {
                // Файл может не существовать, игнорируем ошибку
            }
        }
    } catch (error) {
        console.error('Error generating fonts.scss:', error)
    }
}

// Основная функция
async function processFonts() {
    try {
        await convertOtfToTtf()
        await convertTtfToWoff()
        await generateFontsScss()
        console.log('Fonts processing completed successfully!')
    } catch (error) {
        console.error('Error processing fonts:', error)
        process.exit(1)
    }
}

// Запускаем обработку
processFonts()
