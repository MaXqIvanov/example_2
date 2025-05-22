<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		@save="editHandler"
	>
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('keys-edit-key-modal-title') }}</TypographyKTypographyBody4
		>
		<div class="wrapper">
			<UiInput
				:placeholder="$t('keys-edit-key-modal-input-description-ph')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				border-width-input="0px"
				v-model="description"
			/>
			<UiInput
				:placeholder="$t('keys-edit-key-modal-input-key-ph')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				border-width-input="0px"
				:disabled="true"
				v-model="bybit_api_k"
			/>
			<div class="input__secret">
				<UiInput
					:placeholder="$t('keys-edit-key-modal-input-secret-ph')"
					max-width="none"
					background-color-input="var(--violet-6)"
					:input-special-style="{ fontSize: '15px' }"
					border-width-input="0px"
					:disabled="true"
					v-model="bybit_api_s"
				/>
				<!-- <TypographyKTypographyBody5
					color="var(--gray-6)"
					font-type="medium"
					>Введите секрет не более 20 символов</TypographyKTypographyBody5
				> -->
			</div>
		</div>
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { IKeys } from '~/interfaces/keys';

	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const emits = defineEmits(['edit']);
	const props = withDefaults(defineProps<{ item: IKeys }>(), {});
	const description = ref('');
	const bybit_api_k = ref('');
	const bybit_api_s = ref('');

	const editHandler = () => {
		emits('edit', { ...props.item, description: description.value });
	};

	onMounted(() => {
		description.value = props.item.description;
		bybit_api_k.value = props.item.bybit_api_k;
		bybit_api_s.value = props.item.bybit_api_s;
	});
</script>

<style scoped lang="scss">
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.input__secret {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-bottom: -10px;
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			gap: 7px;
			margin-top: 20px;
		}
	}
</style>
