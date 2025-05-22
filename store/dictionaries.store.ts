import type { ICoin, IExchange } from '~/interfaces/dictionaries';

export const useDictionariesStore = defineStore('dictionaries', () => {
	const nuxtApp = useNuxtApp();
	const exchangeList = ref<Map<string, IExchange> | null>(null);
	const coinList = ref<Map<string, ICoin> | null>(null);
	/**
	 * get all exchanges list
	 */
	const getExchanges = async () => {
		const { data, status } = await useCustomFetch<any>('/api/Stock/get-all', {
			watch: false,
			server: true,

			transform(data: IExchange[]): Map<string, string> {
				return new Map(
					data.map((obj) => {
						return [obj.id, obj.value];
					})
				);
			},

			getCachedData(key) {
				const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				if (!data || !data?.size) return;
				return data;
			}
		});

		if (status.value === 'success') {
			exchangeList.value = data.value;
		}
	};

	/**
	 * get all coins list
	 */
	const getCoins = async () => {
		const { data, status } = await useCustomFetch<any>('/api/Coin/get-all', {
			watch: false,
			server: true,

			transform(data: IExchange[]): Map<string, { id: string; logo: string; value: string }> {
				return new Map(
					data.map((obj) => {
						return [obj.id, obj];
					})
				);
			},

			getCachedData(key) {
				const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
				if (!data || !data?.size) return;
				return data;
			}
		});

		if (status.value === 'success') {
			coinList.value = data.value;
		}
	};

	return {
		exchangeList,
		coinList,
		getCoins,
		getExchanges
	};
});
