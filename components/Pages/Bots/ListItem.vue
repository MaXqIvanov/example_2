<template>
	<div class="bots__list-item">
		<div class="header">
			<UiImage
				:src="itemLogo"
				:alt="item.crypt_pair"
				:defaultNameIcon="'EMPTY'"
				:defaultFolderIcon="'crypto'"
				height="22px"
				width="22px"
				br-radius="50%"
			/>
			<div class="name">
				<TypographyKTypographyBody5
					class="label"
					font-type="medium"
					color="var(--color_font_grey_grey_2)"
					>{{ $t('bots-item-title') }}</TypographyKTypographyBody5
				>
				<TypographyKTypographyBody4
					class="title"
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ item?.description }}</TypographyKTypographyBody4
				>
			</div>
		</div>
		<div class="footer">
			<div class="value">
				<TypographyKTypographyBody4
					color="var(--color_font_currency)"
					font-type="bold"
				>
					{{ coinName.first }}
				</TypographyKTypographyBody4>
				<div class="amout">
					<TypographyKTypographyBody4
						color="var(--color_font_black_wite)"
						class="balance"
						font-type="bold"
						>{{ item.coins }}</TypographyKTypographyBody4
					>
					<!-- <UiLabelPriceChanges
						:arrow-direction="item.value1?.changeDirection"
						:title="item.value1?.change"
					/> -->
				</div>
			</div>
			<div class="value">
				<TypographyKTypographyBody4
					color="var(--color_font_currency)"
					font-type="bold"
				>
					{{ coinName.second }}
				</TypographyKTypographyBody4>
				<div class="amout">
					<TypographyKTypographyBody4
						color="var(--color_font_black_wite)"
						class="balance"
						font-type="bold"
						>{{ item.sum_in_position }}{{ baseStore.baseCurrency }}</TypographyKTypographyBody4
					>
					<UiLabelPriceChanges :title="item?.cur_pnl" />
				</div>
			</div>
		</div>
		<div class="additional-info">
			<TypographyKTypographyBody6
				class="title"
				color="var(--color_font_black_wite)"
				font-type="semi-bold"
			>
				<div
					class="dot"
					:style="{ backgroundColor: getStatusConfig.color }"
				></div>
				{{ getStatusConfig.title }}</TypographyKTypographyBody6
			>
			<TypographyKTypographyBody6
				class="title"
				color="var(--color_font_black_wite)"
				font-type="semi-bold"
			>
				<div
					class="dot"
					:style="{ backgroundColor: getSellConfig.color }"
				></div>
				{{ getSellConfig.title }}</TypographyKTypographyBody6
			>
			<div class="steps">
				<TypographyKTypographyBody5
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ getStep }}</TypographyKTypographyBody5
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { IBots } from '~/interfaces/bots';
	import { useDictionariesStore } from '~/store/dictionaries.store';
	import { getValueWithPlusOrMinus } from '~/helpers/transform';
	import { useBaseStore } from '~/store/base.store';
	import { getSplitPairToken } from '~/helpers/currency';

	const props = withDefaults(
		defineProps<{
			item: IBots;
		}>(),
		{}
	);

	const dictionariesStore = useDictionariesStore();
	const { t } = useI18n();
	const baseStore = useBaseStore();

	const coinName = computed(() => {
		return getSplitPairToken(props.item.crypt_pair);
	});

	const getStep = computed(() => {
		if (props.item?.amount_steps == 0) {
			return ``;
		}
		return `${t('bots-item-step-title')} ${props.item.cur_step} ${t('bots-item-step-title-of')} ${props.item.amount_steps}`;
	});

	const itemLogo = computed(() => useRuntimeConfig().public.staticUrl + '/' + props.item?.logo);

	const getStatusConfig = computed(() =>
		props.item.is_enable
			? { title: t('bots-item-indicator-launched'), color: 'var(--primary)' }
			: { title: t('bots-item-indicator-stopped'), color: 'var(--crimson)' }
	);

	const getSellConfig = computed(() =>
		props.item.allow_sell
			? { title: t('bots-item-indicator-sells'), color: 'var(--primary)' }
			: { title: t('bots-item-indicator-sells'), color: 'var(--crimson)' }
	);
</script>

<style scoped lang="scss">
	.bots__list-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 5px;

		.additional-info {
			display: flex;
			gap: 16px;
			padding-bottom: 5px;

			.title {
				display: flex;
				align-items: center;
				gap: 6px;

				.dot {
					height: 6px;
					width: 6px;
					min-width: 6px;
					border-radius: 50%;
				}
			}
		}

		.footer {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 0px 18px;
			padding-bottom: 0px;
			.pnl {
				display: flex;
				gap: 2px;
			}
			.value {
				display: flex;
				align-items: center;
				gap: 10px;

				.amout {
					display: flex;
					align-items: center;
					gap: 7px;
				}
			}
		}

		.header {
			display: flex;
			gap: 5px;

			.amout {
				display: flex;
				gap: 6px;
				align-items: center;
			}
			.name {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}
		}
	}
</style>
