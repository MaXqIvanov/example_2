import type { IBotChangeStateReq, IBots, IBotsAction, IBotStartDealReq } from '~/interfaces/bots';
import { useBaseStore } from './base.store';

export const useBotsStore = defineStore('bots', () => {
	const nuxtApp = useNuxtApp();
	const baseStore = useBaseStore();
	const botList = ref<IBots[] | null>(null);
	const searchPattern = ref('');
	const currentBot = ref<IBots | null>(null);
	const loading = reactive<Record<string, boolean>>({
		getBots: false,
		currentBot: false,
		currentBotEdit: false,
		changeStatus: false,
		stopSell: false,
		flag_upper_price: false,
		use_hedging: false,
		use_limit_order_sell: false,
		stopAllBotsHandler: false,
		stopAndSellAllForBot: false
	});

	function $reset() {
		botList.value = null;
	}

	/**
	 * get all bots
	 */
	const getBots = async (isNeedLoad = true) => {
		const { data, status } = await useCustomFetch<IBots[]>(
			'/api/bot/get-all',
			{
				watch: false,
				server: true
			},
			{
				setLoading: (load) => {
					if (!isNeedLoad) return;
					loading.getBots = load;
				}
			}
		);

		if (status.value === 'success') {
			botList.value = data.value;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * get all bots by search parameter
	 */
	const getBotsBySearch = async (search: string) => {
		if (search === '') {
			searchPattern.value = search;
			getBots();
			return;
		}
		const { data, status } = await useCustomFetch<IBots[]>(
			'/api/bot/find',
			{
				watch: false,
				server: true,
				method: 'POST',
				query: { pattern: search },
				body: {}
			},
			{
				setLoading: (load) => {
					loading.getBots = load;
				}
			}
		);

		if (status.value === 'success') {
			botList.value = data.value;
			searchPattern.value = search;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * get current bot info
	 */
	const getCurrentBotInfo = async (id: string, isNeedLoad: boolean = true) => {
		const { data, status } = await useCustomFetch<IBots>(
			'/api/bot/get-detail',
			{
				watch: false,
				query: { id },
				onResponse: ({ response }) => {
					baseStore.isLoading = false;
					loading.currentBot = false;

					if (response.status >= 400) return;
					currentBot.value = response._data;
				}
			},
			{
				setLoading: (load) => {
					if (!isNeedLoad) return;
					loading.currentBot = load;
				}
			}
		);

		if (status.value === 'success') {
			currentBot.value = data.value;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * get current bot info for edit
	 */
	const getCurrentBotInfoForEdit = async (id: string, isNeedLoad: boolean = true) => {
		const { data, status } = await useCustomFetch<IBots>(
			'/api/bot/get-edit-detail',
			{
				watch: false,
				server: true,
				query: { id }
			},
			{
				setLoading: (load) => {
					if (!isNeedLoad) return;
					loading.currentBotEdit = load;
				}
			}
		);

		if (status.value === 'success') {
			// todo need check response this method and maybe return below row
			// currentBot.value = data.value;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * added new bot
	 */
	const addBot = async (payload: IBotsAction) => {
		const { data, status } = await useCustomFetch<IBotsAction>('/api/bot/add', {
			watch: false,
			server: true,
			method: 'POST',
			body: { ...payload }
		});

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * update bot
	 */
	const updateBot = async (payload: IBotsAction) => {
		const { data, status } = await useCustomFetch<IBotsAction>('/api/bot/update', {
			watch: false,
			server: true,
			method: 'PUT',
			query: { key: payload?.guid },
			body: { ...payload }
		});

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * delete new bot
	 */
	const deleteBot = async (id: string) => {
		const { data, status } = await useCustomFetch<IBotsAction>('/api/bot/delete', {
			watch: false,
			server: false,
			method: 'DELETE',
			query: { id: id },
			body: {}
		});

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * stop/start bot
	 */
	const changeStateBot = async (id: string) => {
		const { data, status } = await useCustomFetch<IBotChangeStateReq>(
			'/api/Bot/change-state',
			{
				watch: false,
				server: true,
				query: { id }
			},
			{
				setLoading: (load) => {
					loading.changeStatus = load;
				}
			}
		);

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { status: status.value };
	};

	/**
	 * allow sell bot handler
	 */
	const stopSellBotHandler = async (id: string, action: boolean) => {
		const { data, status } = await useCustomFetch<IBots[]>(
			'/api/bot/stop-sell',
			{
				watch: false,
				server: true,
				query: { id, action }
			},
			{
				setLoading: (load) => {
					loading.stopSell = load;
				}
			}
		);

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { status: status.value };
	};

	/**
	 * allow sell bot handler
	 */
	const changeExtensionHandler = async (id: string, code: string, action: boolean) => {
		const { data, status } = await useCustomFetch<IBots[]>(
			'/api/bot/set-extension',
			{
				watch: false,
				server: true,
				method: 'POST',
				query: { id, code, action }
			},
			{
				setLoading: (load) => {
					loading[code] = load;
				}
			}
		);

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { status: status.value };
	};

	/**
	 * start-deal for first step
	 */
	const startDealForFirstStep = async (guid: string) => {
		const { data, status } = await useCustomFetch<IBotStartDealReq>('/api/Bot/start-deal', {
			watch: false,
			server: true,
			retry: false,
			query: { id: guid }
		});

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * stop all bots
	 */
	const stopAllBotsHandler = async () => {
		const { data, status } = await useCustomFetch<IBots[]>(
			'/api/bot/stop-all-bots',
			{
				watch: false,
				server: true,
				method: 'POST'
			},
			{
				setLoading: (load) => {
					loading.stopAllBotsHandler = load;
				}
			}
		);

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { status: status.value };
	};

	/**
	 * stop and sell bot
	 */
	const stopAndSellAllForBot = async (guid: string) => {
		const { data, status } = await useCustomFetch<{ msg: string }>(
			'/api/bot/stop-and-sell-all',
			{
				watch: false,
				server: true,
				query: { id: guid },
				method: 'POST'
			},
			{
				setLoading: (load) => {
					loading.stopAndSellAllForBot = load;
				}
			}
		);

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}

		return { status: status.value };
	};

	return {
		botList,
		currentBot,
		loading,
		searchPattern,
		getBots,
		getBotsBySearch,
		addBot,
		updateBot,
		deleteBot,
		changeStateBot,
		getCurrentBotInfo,
		getCurrentBotInfoForEdit,
		stopSellBotHandler,
		startDealForFirstStep,
		changeExtensionHandler,
		stopAllBotsHandler,
		stopAndSellAllForBot,
		$reset
	};
});
