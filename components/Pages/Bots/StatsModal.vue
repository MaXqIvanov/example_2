<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
	>
		<!-- 		:height="height" -->
		<div class="header">
			<TypographyKTypographyBody3
				color="var(--black)"
				font-type="bold"
				>{{ $t('bots-modal-stats-title') }}</TypographyKTypographyBody3
			>
			<!-- <UiDatePicker
				v-model="datePeriod"
				:date-picker-unique-id="'date-picker-stats-block'"
				:isRanged="true"
				:calendar-count="2"
				class="date-picker"
			>
				<UiInput
					:readonly="true"
					labelClass="input__label"
					:modelValue="''"
					background-color-input="transparent"
					:inputSpecialStyle="{
						color: 'var(--violet)',
						width: '0px'
					}"
					:inputWrapperSpecialStyle="{
						display: 'flex',
						justifyContent: 'center',
						gap: '0px',
						backgroundColor: 'transparent',
						height: '33px',
						border: '1px solid var(--purple)',
						padding: '10px 20px',
						borderRadius: '15px',
						cursor: 'pointer'
					}"
					:inputSpecialClass="'k-typography-body-2-bold'"
					max-width="100%"
				>
					<template #left-icon>
						<div class="content">
							<UiIcon
								name="calendar_v2"
								color="var(--purple)"
								height="14"
								width="14"
							/>
							<TypographyKTypographyBody6
								color="var(--purple)"
								font-type="bold"
							>
								Выбрать период
							</TypographyKTypographyBody6>
						</div>
					</template>
				</UiInput>
			</UiDatePicker> -->
		</div>
		<div class="info">
			<div class="info__header">
				<TypographyKTypographyBody5
					color="var(--gray-6)"
					font-type="medium"
					>{{ $t('bots-modal-stats-name') }}</TypographyKTypographyBody5
				>
				<div class="info__wrapper">
					<TypographyKTypographyBody4
						color="var(--black)"
						font-type="semi-bold"
						>{{ stats?.description }}</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						color="var(--violet-2)"
						font-type="semi-bold"
						>({{ coinName?.first }})</TypographyKTypographyBody4
					>
					<UiImage
						:src="useRuntimeConfig().public.staticUrl + '/' + item?.logo"
						:defaultNameIcon="'EMPTY'"
						:defaultFolderIcon="'crypto'"
						:alt="item?.logo"
						height="22px"
						width="22px"
						br-radius="50%"
					/>
				</div>
			</div>
			<div class="stats">
				<div class="item">
					<TypographyKTypographyBody5
						color="var(--gray-6)"
						font-type="medium"
						class="title"
						>Profit, USDT</TypographyKTypographyBody5
					>
					<TypographyKTypographyBody4
						color="var(--violet-2)"
						font-type="bold"
						class="value"
						>{{ stats?.amount_profit }}</TypographyKTypographyBody4
					>
				</div>
				<div class="item">
					<TypographyKTypographyBody5
						color="var(--gray-6)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-stats-count-deal') }}</TypographyKTypographyBody5
					>
					<TypographyKTypographyBody4
						color="var(--violet-2)"
						font-type="bold"
						class="value"
						>{{ stats?.count_deals }}</TypographyKTypographyBody4
					>
				</div>
			</div>
		</div>

		<div class="body">
			<div
				class="stats__item"
				v-for="stat in stats?.history"
				v-if="stats?.history?.length"
			>
				<div class="item__data">
					<TypographyKTypographyBody5
						color="var(--gray-6)"
						font-type="medium"
					>
						{{ getDateInLocaleString(stat.sell_dt, { month: 'long', locale: locale }) }}
					</TypographyKTypographyBody5>
				</div>
				<div class="item__info">
					<TypographyKTypographyBody4
						color="var(--black)"
						font-type="bold"
					>
						{{ stat.profit_usdt }}$
					</TypographyKTypographyBody4>
					<UiLabelPriceChanges
						:title="stat.procent"
						:is-need-percent="true"
					/>
				</div>
			</div>
			<div
				class="stats__empty"
				v-else
			>
				<TypographyKTypographyBody4
					color="var(--black)"
					font-type="bold"
					>Статистики по боту нет</TypographyKTypographyBody4
				>
			</div>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { IBots } from '~/interfaces/bots';
	import { useStatsStore } from '~/store/stats.store';
	import { getDateInLocaleString } from '~/helpers/date';
	import { getSplitPairToken } from '~/helpers/currency';

	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const { locale } = useI18n();
	const props = withDefaults(
		defineProps<{
			height: string;
			item: IBots;
		}>(),
		{ height: 'calc(100% - 119px)' }
	);

	const statsStore = useStatsStore();
	const datePeriod = ref();
	const item = computed(() => props.item);
	const coinName = computed(() => getSplitPairToken(props.item.crypt_pair || ''));

	const getStatsHandler = async () => {
		const response = await statsStore.getStats(item.value.guid);
	};

	const stats = computed(() => statsStore.statsList || null);

	getStatsHandler();
</script>

<style scoped lang="scss">
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.content {
			display: flex;
			align-items: center;
			gap: 7px;
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: -1px;
			border-bottom: 1px solid var(--violet-5);
			padding-bottom: 14px;
			margin-bottom: 13px;
			padding-right: 10px;
		}
		.info {
			border-bottom: 1px solid var(--gray-5);
			padding-bottom: 10px;
			margin-bottom: 23px;

			.stats {
				display: flex;
				flex-direction: column;
				gap: 10px;
				margin-top: 10px;

				.item {
					display: flex;
					justify-content: space-between;
					gap: 5px;
				}
			}

			&__header {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				gap: 5px;
			}

			&__wrapper {
				display: flex;
				align-items: center;
				margin-top: -4px;
				gap: 5px;
			}
		}
		.body {
			height: calc(100% - 140px);
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			gap: 10px;
			padding-right: 10px;
			margin-right: -10px;

			.stats__item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 10px;
				padding-bottom: 10px;
				border-bottom: 1px solid var(--blue-12);

				.item__info {
					display: flex;
					align-items: center;
					gap: 9px;
				}
			}
		}
	}
</style>
