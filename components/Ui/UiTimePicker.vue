<template>
	<UiInput
		v-model="time"
		:readonly="readonly"
		:disabled="disabled"
		class="ui-time-picker"
		:placeholder="placeholder"
		:label="label"
		:labelClass="labelClass"
		:height="height"
		:max-width="maxWidth"
		:number-only="true"
		:error="error"
		:required="required"
		@input="updateValue"
		@blur="emit('blur')"
		@keypress="keyPressHandler"
		@paste="pasteHandler"
	>
		<template #right-icon>
			<UiIcon name="clock" />
		</template>
	</UiInput>
</template>

<script setup lang="ts">
	import { getValueByMask } from '~/helpers';

	const emit = defineEmits(['update:modelValue', 'blur']);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			name?: string;
			required?: boolean;
			readonly?: boolean;
			disabled?: boolean;
			error?: { status: boolean; msg?: string | undefined };
			modelValue: string;
			label?: string;
			labelClass?: string;
			maxLenght?: number;
			maxWidth?: string;
			height?: string;
			type?: 'hoursAndMinutes' | 'hoursAndMinutesAndSeconds';
		}>(),
		{
			readonly: false,
			disabled: false,
			maxWidth: '250px',
			height: '50px',
			maxLenght: 5,
			type: 'hoursAndMinutes'
		}
	);

	const time = computed({
		get() {
			return props.modelValue;
		},
		set(v) {
			if (props.type === 'hoursAndMinutes') {
				let [hours, minutes] = v.split(':');

				if (hours && Number(hours) >= 24) {
					if (hours?.length === 2) {
						const hoursSplit = hours.split('');
						hours = '0' + hoursSplit[0];
						minutes = hoursSplit[1];
					} else if (hours?.length === 3) {
						const hoursSplit = hours.split('');
						const minutesSplit = minutes?.split('');
						hours = hoursSplit[0] + hoursSplit[1];
						minutes = hoursSplit[2] + (minutesSplit?.length > 0 ? minutesSplit[0] : '');
					}
				}
				if (minutes && minutes?.length === 2 && (Number(minutes) >= 60 || Number(hours) === 24)) {
					minutes = '00';
				}
				if (Number(hours) >= 24) {
					hours = '23';
					minutes = minutes ? minutes : '59';
				}

				emit('update:modelValue', getValueByMask(`${hours}${minutes ? ':' + minutes : ''}`, '##:##', ':'));
			} else {
				let [hours, minutes, seconds] = v.split(':');
				[hours, minutes, seconds] = getValueByMask(
					`${hours}${minutes ? ':' + minutes : ''}${seconds ? ':' + seconds : ''}`,
					'##:##:##',
					':'
				).split(':');

				if (hours && Number(hours) >= 24) {
					if (hours?.length === 2) {
						const hoursSplit = hours.split('');
						hours = '0' + hoursSplit[0];
						minutes = hoursSplit[1];
					} else if (hours?.length === 3) {
						const hoursSplit = hours.split('');
						const minutesSplit = minutes?.split('');
						hours = hoursSplit[0] + hoursSplit[1];
						minutes = hoursSplit[2] + (minutesSplit?.length > 0 ? minutesSplit[0] : '');
					}
				}

				if (minutes && minutes?.length === 2 && (Number(minutes) >= 60 || Number(hours) === 24)) {
					minutes = '00';
				}
				if (Number(hours) >= 24) {
					hours = '23';
					minutes = minutes ? minutes : '59';
				}

				if (Number(seconds) > 60) {
					seconds = '59';
				}

				emit(
					'update:modelValue',
					getValueByMask(`${hours}${minutes ? ':' + minutes : ''}${seconds ? ':' + seconds : ''}`, '##:##:##', ':')
				);
			}
		}
	});

	const keyPressHandler = (event) => {
		let value = event.target.value;

		if (props.maxLenght && props.maxLenght <= event.target.value?.length) {
			event.preventDefault();
			value = value.split('');
			if (event.target.selectionStart < props.maxLenght && Number(value[event.target.selectionStart]) >= 0) {
				value[event.target.selectionStart] = `${event.key}`;
				time.value = value.join('');
			}
		}
		const saveSelectionStart = event.target.selectionStart;
		setTimeout(() => {
			if (event.target.value?.length >= props.modelValue?.length && Number(value[saveSelectionStart]) >= 0) {
				event.target.setSelectionRange(
					saveSelectionStart === 1
						? saveSelectionStart + 2
						: saveSelectionStart === 4
							? saveSelectionStart + 2
							: saveSelectionStart + 1,
					saveSelectionStart === 1
						? saveSelectionStart + 2
						: saveSelectionStart === 4
							? saveSelectionStart + 2
							: saveSelectionStart + 1
				);
			} else if (event.target.value?.length < props.modelValue?.length && Number(value[saveSelectionStart]) >= 0) {
				event.target.setSelectionRange(
					saveSelectionStart === 3 ? saveSelectionStart - 1 : saveSelectionStart - 1,
					saveSelectionStart === 3 ? saveSelectionStart - 1 : saveSelectionStart - 1
				);
			}
		});
	};

	const pasteHandler = (event) => {
		event.preventDefault();
	};

	const updateValue = (event) => {
		const saveSelectionStart = event.target.selectionStart;
		if (event.target.value?.length < props.modelValue?.length)
			setTimeout(() => {
				event.target.setSelectionRange(saveSelectionStart, saveSelectionStart);
			});
	};
</script>

<style scoped lang="scss">
	.ui-time-picker {
		display: flex;
	}
</style>
