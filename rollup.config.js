import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';

/**
 * @type {import('rollup').RollupOptions}
 */

const config = {
	input: 'lib/index.ts',
	output: {
		dir: 'dist',
		format: 'es',
		name: 'main',
	},
	plugins: [typescript(), nodeResolve(), terser(), json(), common()],
};

export default config;
