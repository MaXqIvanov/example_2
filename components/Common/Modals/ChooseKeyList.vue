<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:z-index="10000"
	>
		<!-- 		:height="height" -->
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('bots-modal-choose-key') }}</TypographyKTypographyBody4
		>
		<div class="choose-exchange__body">
			<div class="wrapper">
				<div
					class="item"
					v-for="item in keyList"
					:key="item.guid"
					@click="chooseItem(item)"
				>
					{{ item.description }}
				</div>
			</div>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { ICoin } from '~/interfaces/dictionaries';
	import { useKeysStore } from '~/store/keys.store';

	const emits = defineEmits(['chooseItem']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			height: string;
			isNeedLoadList: boolean;
		}>(),
		{ height: 'calc(100% - 119px)', isNeedLoadList: false }
	);

	const keysStore = useKeysStore();

	const keyList = computed(() => keysStore.keyList || []);

	const getKeysHandler = async () => {
		if (!props.isNeedLoadList) return;
		await keysStore.getKeys();
	};

	const chooseItem = (item: ICoin) => {
		emits('chooseItem', item);
		modelValue.value = false;
	};

	getKeysHandler();
</script>

<style scoped lang="scss">
	.choose-exchange__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
		border: 1px solid var(--purple-3);
		border-radius: 15px;
		height: calc(100% - 35px);
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
