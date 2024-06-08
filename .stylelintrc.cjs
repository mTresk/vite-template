/* eslint-env node */
module.exports = {
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-config-recommended-vue',
		'stylelint-config-recess-order',
		'stylelint-prettier',
	],
	rules: {
		'at-rule-no-unknown': null,
		'media-query-no-invalid': null,
		'selector-class-pattern': null,
		'scss/dollar-variable-pattern': null,
		'no-invalid-position-at-import-rule': null,
		'no-descending-specificity': null,
	},
	ignoreFiles: ['scss/libs/gallery/**/*.scss'],
}
