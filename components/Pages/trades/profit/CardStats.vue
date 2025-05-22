<template>
	<div
		class="card-stats__list-item"
		v-for="item in items"
		:key="item.date_in"
	>
		<div class="list-item__header">
			<TypographyKTypographyBody4
				color="var(--white)"
				font-weight="medium"
				class="date"
				>{{ getDate(item.date_in) }}</TypographyKTypographyBody4
			>
			<TypographyKTypographyBody4 color="var(--gray-8)"
				>{{ $t('profit-page-count-deal') }} {{ item._count }}</TypographyKTypographyBody4
			>
		</div>
		<div class="list-item__card">
			<div class="card__wrapper">
				<div class="list-item__title">
					<UiIcon
						name="referall-new"
						color="var(--color-icon-white-gold)"
						folder="balance"
					/>
					<TypographyKTypographyBody4
						font-type="bold"
						color="var(--white)"
					>
						{{ $t(currentTitleByType) }}
					</TypographyKTypographyBody4>
				</div>
				<div class="list-item__right">
					<TypographyKTypographyBody4
						font-type="bold"
						:color="item.summ >= 0 ? 'var(--primary-2)' : 'var(--red-5)'"
					>
						{{ getValueWithPlusOrMinus(item.summ) }} USDT
					</TypographyKTypographyBody4>
					<div
						class="drop-items"
						v-if="item.items"
						@click="addedInDropDownActiveItem(item)"
					>
						<UiIcon
							name="arrow"
							height="10px"
							:rotation="dropDownActive?.[item.date_in] ? 180 : 0"
							color="var(--white)"
						/>
					</div>
				</div>
			</div>
			<div
				class="details"
				v-if="item.items && dropDownActive?.[item.date_in]"
			>
				<div
					class="detail"
					v-for="detail in item.items"
					:key="detail.date_create || detail.coin"
				>
					<TypographyKTypographyBody4
						font-type="semi-bold"
						color="var(--gray-8)"
						>{{ detail.coin }}</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						font-type="semi-bold"
						:color="detail.profit_usdt >= 0 ? 'var(--green-9)' : 'var(--red-6)'"
						>{{ getValueWithPlusOrMinus(detail.profit_usdt) }} USDT</TypographyKTypographyBody4
					>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { PROFIT_STAT_TYPE, type TProfitStatKeys } from '~/const/stats';
	import type { IStatsProfit } from '~/interfaces/stats';
	import { getValueWithPlusOrMinus } from '~/helpers/transform';
	import { getDateInLocaleString } from '~/helpers/date';

	const props = withDefaults(
		defineProps<{
			items: IStatsProfit[] | null;
			type: TProfitStatKeys;
		}>(),
		{}
	);
	const { locale } = useI18n();

	const getDate = (date: string) => {
		if (date.length < 5) {
			return `${date} г.`;
		} else if (date.length <= 7) {
			return getDateInLocaleString(date, {
				month: 'long',
				year: 'numeric',
				day: false,
				showTime: false,
				locale: locale.value
			});
		}
		return getDateInLocaleString(date, { month: 'long', year: 'numeric', showTime: false, locale: locale.value });
	};

	const dropDownActive = ref<Record<string, boolean>>({});

	const addedInDropDownActiveItem = (item: IStatsProfit) => {
		if (dropDownActive.value?.[item.date_in]) {
			delete dropDownActive.value?.[item.date_in];
			return;
		}
		dropDownActive.value = { ...dropDownActive.value, [item.date_in]: true };
	};

	const currentTitleByType = computed(() => {
		switch (props.type) {
			case PROFIT_STAT_TYPE.Day.key:
				return 'profit-page-profit-for-day';
			case PROFIT_STAT_TYPE.Month.key:
				return 'profit-page-profit-for-month';
			case PROFIT_STAT_TYPE.Year.key:
				return 'profit-page-profit-for-year';
			default:
				return '';
		}
	});
</script>

<style scoped lang="scss">
	.card-stats__list-item {
		margin-bottom: 20px;

		.list-item__header {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 7px 18px;

			.date {
				text-transform: uppercase;
			}
		}

		.list-item__card {
			position: relative;
			display: flex;
			flex-direction: column;
			padding: 16px 10px;

			.details {
				display: flex;
				flex-direction: column;
				padding: 20px 36px 0px 36px;

				.detail {
					display: flex;
					justify-content: space-between;
					padding-bottom: 20px;
					margin-bottom: 10px;
					border-bottom: 1px solid #e8e5ed;

					&:last-child {
						border-bottom: 0px;
						margin-bottom: 0px;
						padding-bottom: 0px;
					}
				}
			}

			.card__wrapper {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.list-item__right {
				display: flex;
				gap: 11px;
				align-items: center;

				.drop-items {
					cursor: pointer;
					padding: 5px;
					margin: -5px;
				}
			}

			.list-item__title {
				display: flex;
				justify-content: center;
				align-items: center;
				gap: 8px;
			}

			&::after {
				content: '';
				position: absolute;
				background-color: #bab6c3f0;
				mix-blend-mode: soft-light;
				width: 100%;
				height: 100%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				opacity: 58%;
				border-radius: 15px;
				z-index: -1;
			}
		}
	}
</style>
