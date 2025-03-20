declare module 'gulp-fonter-fix' {
	interface FonterOptions {
		formats: string[]
	}
	const fonter: (options: FonterOptions) => NodeJS.ReadWriteStream
	export = fonter
}
