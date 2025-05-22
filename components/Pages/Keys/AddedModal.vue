<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		@save="addKeyHandler"
	>
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('keys-added-key-modal-title') }}</TypographyKTypographyBody4
		>
		<div class="wrapper">
			<UiInput
				:placeholder="$t('keys-added-key-modal-input-description-ph')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				border-width-input="0px"
				v-model="description"
			/>
			<UiInput
				:placeholder="$t('keys-added-key-modal-input-key-ph')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				border-width-input="0px"
				v-model="bybit_api_k"
			/>
			<div class="input__secret">
				<UiInput
					:placeholder="$t('keys-added-key-modal-input-secret-ph')"
					max-width="none"
					background-color-input="var(--violet-6)"
					:input-special-style="{ fontSize: '15px' }"
					border-width-input="0px"
					v-model="bybit_api_s"
				/>
			</div>
		</div>
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { useKeysStore } from '~/store/keys.store';

	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const emits = defineEmits(['add']);
	const props = withDefaults(defineProps<{}>(), {});
	const keysStore = useKeysStore();
	const description = ref('');
	const bybit_api_k = ref('');
	const bybit_api_s = ref('');

	const addKeyHandler = async () => {
		emits('add', {
			description: description.value,
			bybit_api_k: bybit_api_k.value,
			bybit_api_s: bybit_api_s.value
		});
	};
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
