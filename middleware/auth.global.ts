import RouterNameSpace from '~/const/router';
import { useProfileStore } from '~/store/profile.store';

export default defineNuxtRouteMiddleware((to, from) => {
	if (to.meta.auth === false) return;
	const userStore = useProfileStore();

	switch (true) {
		case !userStore.isLoggedIn && !to.path.includes('/authorization'): {
			return navigateTo({
				path: RouterNameSpace.routerRedirectNoLoggedIn,
				replace: true
			});
		}
		case userStore.isLoggedIn && to.path.includes('/authorization'): {
			return navigateTo({
				path: RouterNameSpace.routerRedirectIsLoggedIn,
				replace: true
			});
		}
		default:
			break;
	}
});
