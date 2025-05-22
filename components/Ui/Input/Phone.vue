<template>
	<UiInput
		:modelValue="input"
		:label="label"
		:label-class="labelClass"
		:max-width="maxWidth"
		:placeholder="placeholder"
		:phone-only="true"
		:max-lenght="22"
		:height="height"
		type="tel"
		@input="inputHandler"
		@paste="pasteHandler"
	>
		<template #right-icon>
			<slot name="right-icon" />
		</template>
	</UiInput>
</template>

<script setup lang="ts">
	import type { IPhoneCode } from '~/interfaces/common';
	import { phoneCodes } from '~/const/phone';
	import { getPhoneByMaskV2 } from '~/helpers';

	const emit = defineEmits(['update:modelValue']);

	const props = withDefaults(
		defineProps<{
			modelValue: string;
			label?: string;
			labelClass?: string;
			maxWidth?: string;
			placeholder?: string;
			height?: string;
		}>(),
		{
			label: 'Номер телефона',
			labelClass: 'input__label',
			maxWidth: 'none',
			placeholder: '+7 000 000 00 00',
			height: '55px'
		}
	);

	const currentCode = ref<Array<string>>([]);
	const currentPhone = ref<string>('');
	const isNeedSearchCode = ref(true);

	const input = computed({
		get() {
			if (isNeedSearchCode.value) {
				const pasteDataTransform = props.modelValue.startsWith('+') ? props.modelValue : `+${props.modelValue}`;
				const userCode = pasteDataTransform.split('');
				let currentString = userCode[0] + userCode[1];
				let currentList = Object.values(phoneCodes)
					.filter((el: IPhoneCode) => el.phoneCode.replace(' ', '').includes(currentString))
					.map((el: IPhoneCode) => el.phoneCode);

				const saveCurrentList = currentList;
				const saveCurrentString = currentString;

				for (let i = 2; new Set(currentList).size !== 1 || new Set(currentList).size === 0; i++) {
					currentString += userCode[i];
					const list = currentList.filter((el) => el.replace(' ', '').includes(currentString));
					if (list.length === 1 && currentString.length < list[0].length) {
						continue;
					}
					currentList = list;
					if (i === 7) break;
				}

				if (saveCurrentString === '+8' && currentList.length === 0) {
					currentList = [saveCurrentList.find((list) => list === saveCurrentString) || ''];
				}

				currentCode.value = currentList;
				const prevValue = currentPhone.value;

				if (new Set(currentCode.value).size === 1 && props.modelValue.length > 1) {
					currentPhone.value = currentCode.value[0];
					let clearValue = '';

					if (props.modelValue.length < currentCode.value[0].length) {
						clearValue = currentPhone.value.replace(`${currentCode.value[0]}`, '').replace(/[^\d]/g, '');
					} else {
						clearValue = props.modelValue.replace(`${currentCode.value[0].replace('+', '')}`, '').replace(/[^\d]/g, '');
					}

					if (prevValue.length <= props.modelValue.length) {
						currentPhone.value = getPhoneByMaskV2(clearValue, currentCode.value[0]);
					} else if (!clearValue) {
						currentPhone.value = '';
						currentCode.value = [];
					} else {
						currentPhone.value = getPhoneByMaskV2(clearValue, currentCode.value[0]);
					}
				}
			} else isNeedSearchCode.value = true;
			return currentPhone.value || props.modelValue;
		},
		set() {}
	});

	const pasteHandler = (e) => {
		e.stopPropagation();
	};

	const inputHandler = (e) => {
		const value = typeof e.target?.value === 'string' ? e.target.value : e;
		const prevValue = currentPhone.value;
		currentPhone.value = value;

		if (prevValue.length > e.target.value.length) {
			emit('update:modelValue', currentPhone.value);
			e.preventDefault();
			isNeedSearchCode.value = false;
			return;
		}

		emit('update:modelValue', currentPhone.value);
	};
</script>

<style scoped lang="scss"></style>
