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
		//hidden
	};

	/**
	 * get all bots by search parameter
	 */
	const getBotsBySearch = async (search: string) => {
		//hidden
	};

	/**
	 * get current bot info
	 */
	const getCurrentBotInfo = async (id: string, isNeedLoad: boolean = true) => {
		//hidden
	};

	/**
	 * get current bot info for edit
	 */
	const getCurrentBotInfoForEdit = async (id: string, isNeedLoad: boolean = true) => {
		//hidden
	};

	/**
	 * added new bot
	 */
	const addBot = async (payload: IBotsAction) => {
		//hidden
	};

	/**
	 * update bot
	 */
	const updateBot = async (payload: IBotsAction) => {
		//hidden
	};

	/**
	 * delete new bot
	 */
	const deleteBot = async (id: string) => {
		//hidden
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
		//hidden
	};

	/**
	 * start-deal for first step
	 */
	const startDealForFirstStep = async (guid: string) => {
		//hidden
	};

	/**
	 * stop all bots
	 */
	const stopAllBotsHandler = async () => {
		//hidden
	};

	/**
	 * stop and sell bot
	 */
	const stopAndSellAllForBot = async (guid: string) => {
		//hidden
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
