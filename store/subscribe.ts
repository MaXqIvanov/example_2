import type { ISubscribeDetail, ISubscribeReq } from '~/interfaces/subscribe';
import { useNotificationStore } from './notification.store';
import { AlertsTypes } from '~/const/notification';
import { useProfileStore } from './profile.store';

export const useSubscribeStore = defineStore('subscribe', () => {
	const notificationStore = useNotificationStore();
	const profileStore = useProfileStore();
	const subscribeDetail = ref<ISubscribeDetail | null>(null);
	const loading = reactive({
		activateSubscribe: false,
		getSubscribeDetail: false
	});

	function $reset() {
		subscribeDetail.value = null;
	}

	/**
	 * get subscribe detail
	 */
	const getSubscribeDetails = async () => {
		const { data, status } = await useCustomFetch<ISubscribeReq>(
			'/api/Wallet/get-subscription',
			{
				watch: false,
				server: true
			},
			{
				setLoading: (load) => {
					loading.getSubscribeDetail = load;
				}
			}
		);

		if (status.value === 'success') {
			subscribeDetail.value = data.value?.data || null;

			if (profileStore.profileInfo?.subscription_status) profileStore.profileInfo.subscription_status = true;
		}

		return { data: data.value?.data, status: status.value };
	};

	/**
	 * get subscribe detail
	 */
	const activateSubscribe = async () => {
		const { data, status } = await useCustomFetch<ISubscribeReq>(
			'/api/Wallet/activate-subscription',
			{
				watch: false,
				server: true
			},
			{
				setLoading: (load) => {
					loading.activateSubscribe = load;
				}
			}
		);

		if (status.value === 'success') {
			getSubscribeDetails();
		}

		return { data: data.value?.data, status: status.value };
	};

	return {
		subscribeDetail,
		loading,
		$reset,
		getSubscribeDetails,
		activateSubscribe
	};
});
