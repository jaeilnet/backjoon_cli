// @ts-check

module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
		},
	],
	parserOptions: {
		ecmaVersion: '2022',
		sourceType: 'module',
	},
	rules: {
		'@typescript-eslint/strict-boolean-expressions': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
	},
	ignorePatterns: ['./lib/template/*'],
};
