/**
 * hidden error and warn in console for production
 */
export default defineNuxtPlugin(() => {
	if (useRuntimeConfig().public.isNeedVisibleErrorInConsole == 'false') {
		console.warn = () => {};
		console.error = () => {};
	}
});
