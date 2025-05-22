import type { IFinance } from '~/interfaces/finance';

export const useFinanceStore = defineStore('finance', () => {
	const nuxtApp = useNuxtApp();
	const financeList = ref<IFinance[] | null>(null);

	function $reset() {
		financeList.value = null;
	}

	/**
	 * get all finance
	 */
	const getFinance = async (opts?: { cachedTime?: number }) => {
		const { data, status } = await useCustomFetch<IFinance[]>('/api/Stat/get-finances', {
			watch: false,
			server: true
		});

		if (status.value === 'success') {
			financeList.value = data.value;
			return { data: data.value, status: status.value };
		}
	};

	return { financeList, getFinance, $reset };
});
