import { getCashedDataAfterTime } from '~/helpers/cache';
import type { IKeys, IKeysAction } from '~/interfaces/keys';

export const useKeysStore = defineStore('keys', () => {
	const nuxtApp = useNuxtApp();
	const keyList = ref<IKeys[] | null>(null);

	function $reset() {
		keyList.value = null;
	}

	/**
	 * get all keys
	 */
	const getKeys = async (opts?: { cachedTime?: number }) => {
		const { data, status } = await useCustomFetch<IKeys[]>('/api/token/get-my', {
			watch: false,
			server: true
		});

		if (status.value === 'success') {
			keyList.value = data.value;
			return { data: data.value, status: status.value };
		}
	};

	/**
	 * added new key
	 */
	const addKey = async (payload: IKeysAction) => {
		const { data, status } = await useCustomFetch<IKeysAction>('/api/token/add', {
			watch: false,
			server: true,
			method: 'POST',
			body: { ...payload }
		});

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}
	};

	/**
	 * update key
	 */
	const updateKey = async (payload: IKeysAction) => {
		const { data, status } = await useCustomFetch<IKeysAction>('/api/token/update', {
			watch: false,
			server: true,
			method: 'PUT',
			query: { key: payload?.guid },
			body: { ...payload }
		});

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}
	};

	/**
	 * delete new key
	 */
	const deleteKey = async (id: string) => {
		const { data, status } = await useCustomFetch<IKeysAction>('/api/token/delete', {
			watch: false,
			server: false,
			method: 'DELETE',
			query: { id: id },
			body: {}
		});

		if (status.value === 'success') {
			return { data: data.value, status: status.value };
		}
	};

	return { keyList, getKeys, addKey, updateKey, deleteKey, $reset };
});
