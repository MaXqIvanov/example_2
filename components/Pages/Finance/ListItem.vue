<template>
	<div class="item">
		<div class="coin">
			<UiImage
				:src="useRuntimeConfig().public.staticUrl + '/' + item?.logo"
				:defaultNameIcon="'EMPTY'"
				:defaultFolderIcon="'crypto'"
				:alt="item?.logo"
				height="22px"
				width="22px"
				br-radius="50%"
			/>
			<TypographyKTypographyBody3
				color="var(--color_font_black_wite)"
				font-type="medium"
				class="title"
				>{{ item.coin }}</TypographyKTypographyBody3
			>
		</div>
		<TypographyKTypographyBody3
			color="var(--color_font_black_wite)"
			font-type="medium"
			class="balance__coin"
		>
			{{ item.balance_coin }}
		</TypographyKTypographyBody3>
		<TypographyKTypographyBody3
			color="var(--color_font_black_wite)"
			class="balance__usd"
			font-type="medium"
		>
			{{ item.balance_usdt }}$
		</TypographyKTypographyBody3>
	</div>
</template>

<script setup lang="ts">
	import type { IFinance } from '~/interfaces/finance';

	const props = withDefaults(
		defineProps<{
			item: IFinance;
		}>(),
		{}
	);
</script>

<style scoped lang="scss">
	.item {
		display: grid;
		gap: 10px;
		grid-template-columns: 1fr 1fr 1fr;

		.balance__coin {
			text-align: left;
		}

		.balance__usd {
		}

		.coin {
			display: flex;
			gap: 10px;
		}
	}
</style>
