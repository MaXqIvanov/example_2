import { getDateInLocaleString } from '~/helpers/date';
import type { IWalletAddressDetails, IWalletDetails } from '~/interfaces/wallet';

export const useWalletStore = defineStore('wallet', () => {
	const walletDetail = ref<IWalletDetails | null>(null);
	const walletAddressDetail = ref<IWalletAddressDetails | null>(null);
	const loading = reactive({
		walletDetail: false
	});
	const { locale } = useI18n();

	function $reset() {
		walletDetail.value = null;
		walletAddressDetail.value = null;
	}

	/**
	 * get wallet detail
	 */
	const getWalletDetails = async (type?: Number) => {
		const { data, status } = await useCustomFetch<IWalletDetails>(
			'/api/Wallet/get-details',
			{
				watch: false,
				server: true,
				transform: (value) => {
					return {
						...value,
						history: value.history.map((date) => {
							return {
								...date,
								date_transform: getDateInLocaleString(date.date_in, {
									month: 'long',
									showTime: false,
									year: 'numeric',
									locale: locale.value
								})
							};
						})
					};
				},
				query: { deep: type }
			},
			{
				setLoading: (load) => {
					loading.walletDetail = load;
				}
			}
		);

		if (status.value === 'success') {
			walletDetail.value = data.value || null;
		}

		return { data: data.value, status: status.value };
	};

	/**
	 * get all bots
	 */
	const getWalletAddress = async () => {
		const { data, status } = await useCustomFetch<IWalletAddressDetails>(
			'/api/Wallet/get-address',
			{
				watch: false,
				server: true
			},
			{
				setLoading: (load) => {}
			}
		);

		if (status.value === 'success') {
			walletAddressDetail.value = data.value || null;
		}

		return { data: data.value, status: status.value };
	};

	return {
		walletDetail,
		walletAddressDetail,
		loading,
		getWalletAddress,
		$reset,
		getWalletDetails
	};
});
