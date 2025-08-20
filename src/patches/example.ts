import { Patch } from '@placecharity/framework-types';

export default {
	name: 'examplePatch',
	find: 'backend.wplace.live',
	replace: {
		match: /$/,
		replace: () => "console.log('Example Patch!');",
	},
} as Patch;
