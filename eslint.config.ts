import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 'tab',
        quotes: 'single',
    },
    rules: {
        'node/prefer-global/process': 0,
        'no-unused-expressions': 0,
        'style/operator-linebreak': 0,
        'style/brace-style': 0,
        'style/comma-dangle': 0,
        'no-new': 0,
        'antfu/consistent-chaining': 0,
    },
})
