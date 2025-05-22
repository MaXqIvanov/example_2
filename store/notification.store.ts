import { AlertsTypes } from '~/const/notification';
import { getUniqueIdSimple } from '~/helpers';
import type { TAlert, TNotification } from '~/interfaces/notifications';
import { useBaseStore } from './base.store';

export const useNotificationStore = defineStore('notification', () => {
	const baseStore = useBaseStore();
	const notifications = ref<TNotification[]>([]);
	const countGetErrorNotification = ref(0);
	const alerts = ref<TAlert[]>([]);
	const timeouts = ref<Record<string | number, NodeJS.Timeout>>({});
	const loading = ref<Record<string, any>>({
		deleteAllNotificationBtn: false,
		deleteNotification: {}
	});

	function $reset() {
		alerts.value = [];
		notifications.value = [];
	}

	const deleteNotification = async (id: string) => {
		const { data, status } = await useCustomFetch<boolean>(
			'/api/Notifications/mark-as-readed',
			{
				server: false,
				method: 'put',
				body: [id]
			},

			{
				setLoading: (load) => {
					loading.value.deleteNotification = { id: load };
				}
			}
		);

		if (data.value === true) {
			notifications.value = notifications.value.filter((notification) => notification.id !== id);
		}
	};

	const deleteAllNotification = async () => {
		const { data, status } = await useCustomFetch<boolean>(
			'/api/Notifications/mark-all-as-readed',
			{
				server: false,
				method: 'put'
			},
			{
				setLoading: (load) => {
					loading.value.deleteAllNotificationBtn = load;
				}
			}
		);

		if (data.value === true) {
			notifications.value = [];
		}
	};

	const getNotifications = async () => {
		const { data, status } = await useCustomFetch<TNotification[]>(
			'/api/Notifications/for-organization',
			{
				lazy: true,

				onResponse: ({ response }) => {
					baseStore.isLoading = false;
					if (response.status > 400) {
						countGetErrorNotification.value += 1;
					} else {
						countGetErrorNotification.value = 0;
						notifications.value = response._data;
					}
				}
			},
			{
				isDisabledErrroMessage: countGetErrorNotification.value > 1 ? true : false
			}
		);

		if (status.value === 'success' && data.value) {
			notifications.value = data.value;
		} else {
			countGetErrorNotification.value += 1;
		}
	};

	// alerts

	const addNewAlert = (message: string, timeDead: number = 1000, type: AlertsTypes = AlertsTypes.FAILURE) => {
		const id = getUniqueIdSimple();
		alerts.value.push({ id: id, message, type });
		deleteAlert(id, timeDead);
	};

	const deleteAlert = (id: number, timeDead: number, isNeedClearAll?: boolean) => {
		timeouts.value[id] = setTimeout(() => {
			if (isNeedClearAll) {
				alerts.value = [];
				return;
			}
			alerts.value = alerts.value.filter((alert) => alert.id !== id);
		}, timeDead);
	};

	const cancelAutomaticAlertRemoval = (id: number) => {
		clearTimeout(timeouts.value[id]);
	};

	return {
		alerts,
		notifications,
		loading,
		countGetErrorNotification,
		$reset,
		addNewAlert,
		deleteAlert,
		deleteNotification,
		deleteAllNotification,
		getNotifications,
		cancelAutomaticAlertRemoval
	};
});
