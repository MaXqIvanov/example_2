<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:z-index="10000"
	>
		<!-- :height="height" -->
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('bots-modal-choose-exchange') }}</TypographyKTypographyBody4
		>
		<div class="choose-exchange__body">
			<div class="wrapper">
				<div
					class="item"
					v-for="[key, value] in listExchange"
					:key="value"
					@click="chooseItem(key)"
				>
					{{ value }}
				</div>
			</div>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { IExchange } from '~/interfaces/dictionaries';
	import { useDictionariesStore } from '~/store/dictionaries.store';

	const emits = defineEmits(['chooseItem']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			height: string;
		}>(),
		{ height: 'calc(100% - 119px)' }
	);

	const dictionariesStore = useDictionariesStore();

	const listExchange = computed(() => dictionariesStore.exchangeList || []);

	const chooseItem = (item: IExchange) => {
		emits('chooseItem', item);
		modelValue.value = false;
	};

	dictionariesStore.getExchanges();
</script>

<style scoped lang="scss">
	.choose-exchange__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
		border: 1px solid var(--purple-3);
		border-radius: 15px;
		height: 100%;
		padding: 10px;

		.wrapper {
			display: flex;
			flex-direction: column;
			gap: 20px;
			overflow-y: auto;
			padding: 10px 22px 10px 22px;

			.item {
				cursor: pointer;
				transition: background-color linear 0.02s;
				color: var(--color_font_black_wite);
				&:hover {
					background-color: var(--color_field_bottomsheet);
					padding: 10px 12px;
					margin: -10px -12px;
					border-radius: 12px;
					color: black;
				}
			}
		}
	}
</style>
