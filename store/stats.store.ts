import type { TProfitStatKeys } from '~/const/stats';
import type { IStats, IStatsProfit, IStatsProfitResponse } from '~/interfaces/stats';

export const useStatsStore = defineStore('stats', () => {
	const nuxtApp = useNuxtApp();
	const statsList = ref<IStats | null>(null);
	const statsListProfitDetails = ref<IStatsProfit[] | null>(null);
	const timeouts: Record<string, null | NodeJS.Timeout> = { loadProfitDetails: null };

	function $reset() {
		statsList.value = null;
		statsListProfitDetails.value = null;
	}

	/**
	 * get all stat by bot
	 */
	const getStats = async (id: string) => {
		const { data, status } = await useCustomFetch<IStats>('/api/Stat/get-by-bot', {
			watch: false,
			server: true,
			query: {
				id
			}
		});

		if (status.value === 'success') {
			statsList.value = data.value;
			return { data: data.value, status: status.value };
		}
	};

	/**
	 * get stat profit details
	 */
	const getStatsProfitDetails = async (payload: { type: TProfitStatKeys }) => {
		const { data, status } = await useCustomFetch<IStatsProfitResponse>('/api/Stat/get-profit-details', {
			watch: false,
			server: true,
			query: payload
		});

		if (status.value === 'success') {
			if (timeouts?.loadProfitDetails) {
				clearTimeout(timeouts.loadProfitDetails);
			}
			if (data.value!.data?.length > 20) {
				const partData = data.value!.data.slice(0, 20);
				statsListProfitDetails.value = partData;
				timeouts.loadProfitDetails = setTimeout(() => {
					statsListProfitDetails.value = data.value!.data;
				}, 500);
			} else {
				statsListProfitDetails.value = data.value!.data;
			}
			return { data: data.value, status: status.value };
		}
	};

	return { statsList, statsListProfitDetails, getStats, getStatsProfitDetails, $reset };
});
