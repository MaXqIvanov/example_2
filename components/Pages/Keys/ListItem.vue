<template>
	<div class="keys__list-item">
		<div class="header">
			<div class="name">
				<TypographyKTypographyBody5
					class="label"
					font-type="medium"
					color="var(--color_font_grey_grey_2)"
					>{{ $t('keys-item-title') }}</TypographyKTypographyBody5
				>
				<TypographyKTypographyBody4
					class="title"
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ item?.description }}</TypographyKTypographyBody4
				>
			</div>
			<div class="amout">
				<TypographyKTypographyBody4
					color="var(--color_icon_black_wite)"
					class="balance"
					font-type="bold"
					>{{ item.balance_usdt }}{{ baseStore.baseCurrency }}</TypographyKTypographyBody4
				>
				<!-- <UiLabelPriceChanges :title="item.balance_usdt" /> -->
			</div>
		</div>
		<div class="footer">
			<div class="key">
				<TypographyKTypographyBody5
					class="label"
					font-type="medium"
					color="var(--color_font_grey_grey_2)"
					>{{ $t('keys-item-key') }}</TypographyKTypographyBody5
				>
				<TypographyKTypographyBody4
					class="title"
					font-type="semi-bold"
					color="var(--color_font_grey_grey_3)"
					>{{ item.bybit_api_k }}</TypographyKTypographyBody4
				>
			</div>
			<div class="secret">
				<TypographyKTypographyBody5
					class="label"
					font-type="medium"
					color="var(--color_font_grey_grey_2)"
					>{{ $t('keys-item-secret') }}</TypographyKTypographyBody5
				>
				<TypographyKTypographyBody4
					class="title"
					font-type="semi-bold"
					color="var(--color_font_grey_grey_3)"
					>{{ item.bybit_api_s }}</TypographyKTypographyBody4
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import type { IKeys } from '~/interfaces/keys';
	import { useBaseStore } from '~/store/base.store';

	const baseStore = useBaseStore();
	const props = withDefaults(
		defineProps<{
			item: IKeys;
		}>(),
		{}
	);
</script>

<style scoped lang="scss">
	.keys__list-item {
		width: calc(100% - 65px);
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 5px;

		.footer {
			display: flex;
			gap: 18px;
			.key {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}
			.secret {
				display: flex;
				flex-direction: column;
				gap: 5px;
			}
		}

		.header {
			display: flex;
			justify-content: space-between;

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
