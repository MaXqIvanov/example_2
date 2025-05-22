import { joinURL } from 'ufo';

export default defineEventHandler(async (event) => {
	// Get the runtimeconfig proxy url
	const config = useRuntimeConfig();

	let proxyUrl = config.public.baseURL;
	let path = event.path;

	// check the path
	const target = joinURL(proxyUrl, path);

	if (config.public.isNeedVisibleLogReqInConsole == 'true') {
		console.log('req time');
		console.log(new Date());
		console.log(target);
	}

	// proxy it!
	return proxyRequest(event, target);
});
