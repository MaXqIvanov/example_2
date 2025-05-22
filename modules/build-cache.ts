import { defineNuxtModule } from 'nuxt/kit';

export default defineNuxtModule({
	setup(options, nuxt) {
		const timestamp = Date.now().toString();
		process.env.NUXT_BUILD_TIMESTAMP = timestamp;
		nuxt.options.runtimeConfig.public.NUXT_BUILD_TIMESTAMP = timestamp;
		nuxt.hook('build:before', () => {});
	}
});
