import type { IBotStepAction, IBotSteps } from '~/interfaces/botSteps';

export const useBotStepsStore = defineStore('bot-steps', () => {
	const nuxtApp = useNuxtApp();
	const botStepsList = ref<IBotSteps[] | null>(null);
	const loading = reactive({
		getBotSteps: false,
		actionBotSteps: false
	});

	function $reset() {
		botStepsList.value = null;
	}

	/**
	 * get all steps
	 */
	const getBotSteps = async (guid: string, isNeedLoad: boolean = true) => {
		const { data, status } = await useCustomFetch<IBotSteps[]>(
			'/api/botSteps/get-steps',
			{
				watch: false,
				server: true,
				query: { botGuid: guid }
			},
			{
				setLoading: (load) => {
					if (isNeedLoad) loading.getBotSteps = load;
				}
			}
		);

		if (status.value === 'success') {
			botStepsList.value = data.value;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * added new bot step
	 */
	const addBotStep = async (payload: IBotStepAction) => {
		const { data, status } = await useCustomFetch<IBotSteps>(
			'/api/botSteps/add',
			{
				watch: false,
				server: true,
				method: 'POST',
				body: { ...payload }
			},
			{
				setLoading: (load) => {
					loading.actionBotSteps = load;
				}
			}
		);

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * added new bot step list
	 */
	const addBotStepList = async (payload: IBotSteps[]) => {
		const { data, status } = await useCustomFetch<IBotSteps>(
			'/api/botSteps/add-list',
			{
				watch: false,
				server: true,
				method: 'POST',
				body: payload
			},
			{
				setLoading: (load) => {
					loading.actionBotSteps = load;
				}
			}
		);

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * update bot step
	 */
	const updateBotStep = async (payload: IBotSteps) => {
		const { data, status } = await useCustomFetch<IBotSteps>(
			'/api/botSteps/update',
			{
				watch: false,
				server: true,
				method: 'PUT',
				query: { id: payload?.guid },
				body: { ...payload }
			},
			{
				setLoading: (load) => {
					loading.actionBotSteps = load;
				}
			}
		);

		if (status.value === 'success') {
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * delete new bot
	 */
	const deleteBotStep = async (id: string) => {
		const { data, status } = await useCustomFetch<IBotSteps>('/api/botSteps/delete', {
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

	return {
		botStepsList,
		loading,
		getBotSteps,
		addBotStep,
		addBotStepList,
		updateBotStep,
		deleteBotStep,
		$reset
	};
});
