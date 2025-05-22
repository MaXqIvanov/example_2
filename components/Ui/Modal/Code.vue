<template>
	<UiModalDefault
		v-model="isOpen"
		:width="props.width"
		:height="props.height"
		padding-card="27px 41px 37px 60px"
	>
		<div class="ui-modal__phone-code">
			<div class="title">
				<TypographyKTypographyH4 font-type="bold">{{ title }}</TypographyKTypographyH4>
			</div>
			<div
				class="inputs"
				ref="phoneCode"
			>
				<UiInput
					v-model="code[index]"
					v-for="(digit, index) in countCell"
					:key="digit"
					:max-lenght="1"
					max-width="45px"
					height="45px"
					@input="handleInput(index)"
					@keydown.backspace="handleBackspace(index)"
					@keydown.left="handleLeft(index)"
					@keydown.right="handleRight(index)"
				></UiInput>
			</div>
		</div>
		<UiButton
			:color="ButtonType.primary"
			@click="submitCodeHandler"
			>Отправить</UiButton
		>
	</UiModalDefault>
</template>

<script lang="ts" setup>
	import { focusCampo } from '~/helpers';
	import { ButtonType } from '~/interfaces/ui';
	import { useNotificationStore } from '~/store/notification.store';

	const emits = defineEmits(['update:modelValue', 'submit']);

	const isOpen = defineModel('isOpen', { type: Boolean, required: true });

	const props = withDefaults(
		defineProps<{
			width?: string;
			height?: string;
			maxWidth?: string;
			title?: string;
			countCell?: number;
		}>(),
		{
			width: '100%',
			height: '100%',
			maxWidth: 'calc(100vw - 48px)',
			countCell: 6
		}
	);

	const code = ref(Array(6).fill(''));
	const phoneCode = ref<HTMLInputElement | null>(null);
	const notification = useNotificationStore();

	const handleInput = (index: number) => {
		if (!phoneCode.value) return;
		const currentElem = phoneCode.value.children[index];
		const nextElem = phoneCode.value.children[index + 1];
		if (currentElem && nextElem) {
			setTimeout(() => {
				const currentElemValue = currentElem.querySelector('input')?.value;

				if (currentElemValue?.length === 1 && index < props.countCell - 1) {
					focusCampo(nextElem.querySelector('input'));
				}
			});
		}
	};

	const handleBackspace = (index: number) => {
		if (!phoneCode.value) return;
		if (index > 0 && !code.value[index]) {
			const prevElem = phoneCode.value.children[index - 1];
			prevElem.querySelector('input')?.focus();
		}
	};

	const handleLeft = (index: number) => {
		if (!phoneCode.value) return;
		if (index <= props.countCell - 1 && index > 0) {
			const prevElem = phoneCode.value.children[index - 1];
			const input = prevElem.querySelector('input');
			focusCampo(input);
		}
	};

	const handleRight = (index: number) => {
		if (!phoneCode.value) return;
		if (index >= 0 && index < props.countCell - 1) {
			const currentElem = phoneCode.value.children[index];
			const inputCurrent = currentElem.querySelector('input');
			if (inputCurrent?.selectionStart === 0) {
				focusCampo(inputCurrent);
				return;
			}
			const prevElem = phoneCode.value.children[index + 1];
			prevElem.querySelector('input')?.focus();
		}
	};

	const clearAllFileds = () => {
		code.value = Array(6).fill('');
	};

	const submitCodeHandler = () => {
		if (code.value.find((value) => !value) !== undefined) {
			notification.addNewAlert('Не все поля заполнены', 3500);
			return;
		}
		emits('submit', code.value, clearAllFileds);
	};
</script>
<style>
	.ui-modal__phone-code {
		input {
			text-align: center;
		}
	}
</style>
<style lang="scss" scoped>
	.ui-button {
		margin-top: 30px;
	}

	.ui-modal {
		&__phone-code {
			display: flex;
			flex-direction: column;
			gap: 5px;
			.title {
			}
			.inputs {
				display: flex;
				gap: 10px;
				margin-top: 20px;
			}
		}
	}
</style>
