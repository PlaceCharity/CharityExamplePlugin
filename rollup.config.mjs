import fs from 'fs';
import path from 'path';
import { defineConfig } from 'rollup';

import commonjsPlugin from '@rollup/plugin-commonjs';
import esbuildPlugin from 'rollup-plugin-esbuild';
import jsonPlugin from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';

import { readPackageUp } from 'read-package-up';
const { packageJson } = await readPackageUp();

export default defineConfig([
	{
		input: 'src/index.ts',
		plugins: [
			{
				name: 'manifest',
				buildStart() {
					const manifest = JSON.parse(fs.readFileSync('src/manifest.json', 'utf-8'));
					if (!packageJson.contributors) packageJson.contributors = [];
					this.emitFile({
						type: 'asset',
						fileName: 'manifest.json',
						source: JSON.stringify({
							id: manifest.id,
							name: manifest.name,
							version: packageJson.version,
							authors: [...packageJson.author.name.split(',').map((a) => a.trim()), ...packageJson.contributors.map((c) => c.name)],
							...manifest
						}, null, '\t'),
					});
				}
			},
			replacePlugin({
				values: {
					'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
				},
				preventAssignment: true,
			}),
			resolvePlugin({ browser: false, extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'] }),
			commonjsPlugin(),
			jsonPlugin(),
			{
				name: 'patches',
				async resolveId(id) {
					if (id === 'plugin:patches') return id;
					return null;
				},
				async load(id) {
					if (id === 'plugin:patches') {
						if (!fs.existsSync(path.resolve('src/patches'))) return `export default [];`;
						const files = (await fs.promises.readdir(path.resolve('src/patches'))).filter(f => f.endsWith('.ts'));
						const imports = files.map((p, i) => `import patch${i} from "./src/patches/${p}";`).join('\n');
						const exportArray = `[${files.map((_, i) => `patch${i}`).join(', ')}]`;
						return `${imports}\nexport default ${exportArray};`;
					}
				}
			},
			esbuildPlugin({ minify: true }),
		],
		output: {
			format: 'iife',
			file: 'dist/index.js',
			indent: false,
		},
		onwarn(warning, warn) {
			if (warning.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') return;
			warn(warning);
		},
	},
]);
