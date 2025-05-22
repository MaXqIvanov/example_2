<template>
	<UiInput
		v-model="input"
		:label="label"
		:label-class="labelClass"
		:max-width="maxWidth"
		:placeholder="placeholder"
		:phone-only="true"
		:max-lenght="22"
		:height="height"
		@input="inputHandler"
		@paste="pasteHandler"
	>
		<template #right-icon>
			<slot name="right-icon" />
		</template>
	</UiInput>
</template>

<script setup lang="ts">
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
			label: 'Зарплата за смену',
			labelClass: 'input__label',
			maxWidth: 'none',
			placeholder: 'Введите сумму',
			height: '55px'
		}
	);

	const input = computed({
		get() {
			let value = new Intl.NumberFormat('ru-RU').format(Number(props.modelValue));

			if (value == '0') return '';
			return value;
		},
		set(value: string) {
			const currentValue = value.replaceAll(' ', '');

			if (value.length % 4 == 0 && currentValue.length >= props.modelValue.length) {
				focusPosition.value += 1;
			} else if (value.length % 4 == 0 && currentValue.length < props.modelValue.length) {
				focusPosition.value -= 1;
			}
			new Promise((res) => {
				emit('update:modelValue', currentValue);
				res('');
			}).then(() => {
				targetValue.value?.target.setSelectionRange(focusPosition.value, focusPosition.value);
			});
		}
	});

	const focusPosition = ref(0);
	const targetValue = ref(null);

	const pasteHandler = (e) => {
		e.stopPropagation();
	};

	const inputHandler = (e) => {
		focusPosition.value = e.target.selectionStart;
		targetValue.value = e;
	};
</script>

<style scoped lang="scss"></style>
