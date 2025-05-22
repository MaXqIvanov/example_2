import { getActivePinia, type Pinia, type Store } from 'pinia';

interface ExtendedPinia extends Pinia {
	_s: Map<string, Store>;
}
export const useResetStore = (): Record<string | 'all', () => void> => {
	const pinia = getActivePinia() as ExtendedPinia;

	if (!pinia) {
		throw new Error('There is no stores');
	}

	const resetStores: Record<string, () => void> = {};

	pinia._s.forEach((store, name) => {
		resetStores[name] = () => {
			try {
				store.$reset();
			} catch (error) {}
		};
	});

	resetStores.all = () => {
		const nuxtApp = useNuxtApp();
		nuxtApp.payload.data = {};
		nuxtApp.static.data = {};
		pinia._s.forEach((store) => {
			try {
				store.$reset();
			} catch (error) {}
		});
	};

	return resetStores;
};
