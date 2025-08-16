declare module 'plugin:patches' {
	const patches: {
		name: string;
		find: string;
		replace: {
			match: RegExp;
			replace: (orig: string, match: string) => string;
		};
	}[];
	export default patches;
}
