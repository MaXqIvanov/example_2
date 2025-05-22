<template>
	<div class="trades-result">
		<div class="trades-result__header">
			<TypographyKTypographyH2
				color="var(--white)"
				font-weight="bold"
				>{{ getBalance }} USDT</TypographyKTypographyH2
			>
		</div>
		<div class="trades-result__actions">
			<UiTabsTab
				:isActiveTab="typeProfitStat === type.key"
				v-for="type in profitTypesBtn"
				:key="type.key"
				@click="changeActiveTab(type)"
			>
				<TypographyKTypographyBody5 font-type="bold">
					{{ $t(type.title) }}
				</TypographyKTypographyBody5>
			</UiTabsTab>
		</div>
		<div
			class="trades-result__list"
			v-if="!isLoadingStatsList"
		>
			<PagesTradesProfitCardStats
				:items="listProfitStats"
				:type="typeProfitStat"
			/>
		</div>
		<div
			v-else
			class="trades-result__empty"
		>
			<UiLoader
				color="var(--primary)"
				:circle-width="2"
				:radius="20"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { PROFIT_STAT_TYPE } from '~/const/stats';
	import { useProfileStore } from '~/store/profile.store';
	import { useStatsStore } from '~/store/stats.store';

	definePageMeta({
		customColorBg: 'transparent'
	});

	const statsStore = useStatsStore();
	const profileStore = useProfileStore();
	const isLoadingStatsList = ref(false);
	const router = useRouter();
	const typeProfitStat = ref(PROFIT_STAT_TYPE.Day.key);
	const listProfitStats = computed(() => {
		return statsStore.statsListProfitDetails;
	});
	const getBalance = computed(() => profileStore.profileInfo?.sum_usdt);
	const profitTypesBtn = computed(() => Object.values(PROFIT_STAT_TYPE).map((type) => type));

	const getStatsProfitDetails = () => {
		isLoadingStatsList.value = true;
		statsStore.getStatsProfitDetails({ type: typeProfitStat.value }).finally(() => (isLoadingStatsList.value = false));
	};
	const changeActiveTab = (type: (typeof profitTypesBtn.value)[0]) => {
		typeProfitStat.value = type.key;
		getStatsProfitDetails();
	};

	getStatsProfitDetails();

	onUnmounted(() => {
		statsStore.$reset();
	});
</script>

<style scoped lang="scss">
	.trades-result {
		flex-direction: column;
		display: flex;
		align-items: center;
		height: 100%;

		&__empty {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}

		&__list {
			display: flex;
			flex-direction: column;
			margin-top: 25px;
			width: 100%;
		}

		&__actions {
			display: grid;
			width: 100%;
			gap: 30px;
			margin-top: 40px;
			grid-template-columns: 1fr 1fr 1fr;
			border-bottom: 1px solid var(--violet-5);
			padding-bottom: 16px;

			@media (max-width: $md) {
				gap: 10px;
			}
		}

		&__header {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 16px;
			margin-top: 40px;
		}
	}
</style>
