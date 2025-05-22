export const useBaseStore = defineStore('base', () => {
	const config = useRuntimeConfig();
	const isLoadMap = ref(false);
	const isHiddenAdsBlock = ref(false);
	const baseCurrency = ref('$');
	const theme = ref(config.public.appVersion === 'VIP' ? 'dark' : 'light');
	const isLoading = ref(false);
	const breadCrumbs = computed<
		Record<string, { title: string; link: string | null; linkActive: boolean; afterLinkActive: string | boolean }>
	>(() => {
		return {};
	});
	const isDarkMode = computed(() => theme.value === 'dark');

	function $reset() {
		isHiddenAdsBlock.value = false;
	}

	const initializationApp = () => {};

	return {
		initializationApp,
		$reset,
		theme,
		isDarkMode,
		isLoading,
		isHiddenAdsBlock,
		isLoadMap,
		breadCrumbs,
		baseCurrency
	};
});
