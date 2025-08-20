import { PluginDefinition } from '@placecharity/framework-types';
import patches from 'plugin:patches';

export default {
	patches,
	init() {
		console.log('Example Plugin Initialized!');
	},
	load() {
		console.log('Example Plugin Loaded!');
	},
} as PluginDefinition;
