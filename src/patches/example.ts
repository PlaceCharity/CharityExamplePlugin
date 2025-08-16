export default {
	name: 'example-patch',
	find: 'backend.wplace.live',
	replace: {
		match: /$/,
		replace: () => "console.log('Example Patch!');",
	},
};
