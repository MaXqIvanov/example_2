<template>
	<label
		:style="{ maxWidth: maxWidth }"
		class="ui-input"
	>
		<div
			v-if="label"
			class="label"
			:class="[labelClass ?? labelClass, { disabled }]"
		>
			<TypographyKTypographyBody4 :color="labelColor">{{ label }}</TypographyKTypographyBody4>

			<span
				v-if="required"
				class="required"
			>
				*
			</span>
		</div>
		<slot
			v-if="$slots['between']"
			name="between"
		/>
		<div
			class="input"
			:class="[{ error: error?.status }, { disabled }]"
			:style="{
				maxWidth: maxWidth,
				backgroundColor: backgroundColorInput,
				borderWidth: borderWidthInput,
				...(inputWrapperSpecialStyle ?? inputWrapperSpecialStyle)
			}"
		>
			<component
				:is="readonly ? 'span' : 'button'"
				v-if="$slots['left-icon']"
				class="input__icon input__icon--left"
				@click="clickLeftIconHandler"
			>
				<slot name="left-icon" />
			</component>

			<input
				:value="modelValue"
				:style="{ backgroundColor: backgroundColorInput, ...(inputSpecialStyle ?? inputSpecialStyle) }"
				:type="type === 'password' ? (isHidden ? 'password' : 'text') : type"
				:name="name"
				:placeholder="placeholder"
				:class="[
					`input_${type === 'password' ? (isHidden ? 'password' : 'text') : type}`,
					'k-typography-body-2',
					inputSpecialClass
				]"
				@blur="leaveInput($event)"
				@input="updateValue"
				@change="emit('change', $event)"
				@keypress="onKeypress"
				@paste="onPaste($event)"
				@focus="focusHadle"
				@click="clickInputHandler"
				:min="minValue"
				:maxlength="maxLenght"
				:readonly="readonly"
				:autocomplete="autocomplete"
			/>
			<div
				v-if="type === 'password'"
				class="input__hide"
				@click.prevent="changeHide"
			>
				<UiIcon
					folder="eye"
					:name="isHidden ? 'closed' : 'open'"
				/>
			</div>
			<div
				v-if="$slots['right-icon']"
				class="input__icon input__icon--right"
			>
				<slot name="right-icon" />
			</div>
		</div>
		<div
			v-if="error"
			class="ui-input_error"
		>
			<TypographyKTypographyBody5
				color="var(--red-5)"
				font-type="medium"
			>
				{{ $t(error.msg || '') }}
			</TypographyKTypographyBody5>
		</div>
		<div
			v-if="suggestions?.length && isVisibleSuggestions"
			class="suggestions"
			click.stop
		>
			<TypographyKTypographyBody3
				class="suggestions__item"
				color="var(--dark-gray)"
				font-type="bold"
				v-for="suggestion in suggestions"
				:key="typeof suggestion === 'string' ? suggestion : suggestion.key"
				@click="chooseSuggestion(suggestion)"
				>{{ typeof suggestion === 'string' ? suggestion : suggestion.key }}
			</TypographyKTypographyBody3>
		</div>
	</label>
</template>

<script setup lang="ts">
	import { useNotificationStore } from '~/store/notification.store';

	const emit = defineEmits([
		'update:modelValue',
		'input',
		'change',
		'blur',
		'paste',
		'focus',
		'clear',
		'clickLeftIconHandler',
		'chooseSuggestion',
		'keySubmitActions'
	]);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			name?: string;
			required?: boolean;
			error?: { status: boolean; msg?: string | undefined };
			modelValue: string | number | Date | null;
			label?: string;
			labelClass?: string;
			labelColor?: string;
			cyrillicOnly?: boolean;
			numberOnly?: boolean;
			isNumberOnlyAllowDots?: boolean;
			phoneOnly?: boolean;
			type?: 'password' | 'email' | 'text' | 'time' | 'string' | 'currency' | 'tel';
			minValue?: number;
			disabled?: boolean;
			disabledText?: string;
			keyPressCodeDisabled?: number[];
			maxLenght?: number;
			maxWidth?: string;
			height?: string;
			readonly?: boolean;
			backgroundColorInput?: string;
			borderWidthInput?: string;
			inputSpecialStyle?: Record<string, string | undefined>;
			inputSpecialClass?: string;
			inputWrapperSpecialStyle?: Record<string, string | undefined>;
			suggestions?: { key: string; value: any }[] | string[];
			keysSubmit?: number[];
			autocomplete?: string;
		}>(),
		{
			maxWidth: '250px',
			height: '50px',
			backgroundColorInput: 'var(--white)',
			type: 'string',
			labelColor: 'var(--color_font_black_wite)'
		}
	);

	const isFocused = ref(false);
	const isVisibleSuggestions = ref(false);

	const updateValue = (event: Event) => {
		emit('input', event);
		const target = event.target as HTMLInputElement;
		emit('update:modelValue', target.value);
	};

	function clear() {
		emit('update:modelValue', '');
		emit('clear', '');
	}

	function onPaste(event: ClipboardEvent) {
		if (props.numberOnly || props.phoneOnly || props.type === 'currency') {
			onlyNumber(event as any);
		}

		emit('paste', event);

		if (props.cyrillicOnly) {
			const regex = /^[а-яА-ЯёЁ\s-]+$/;
			navigator.clipboard.readText().then((res: string) => {
				const copyText = res;
				if (!regex.test(copyText)) {
					clear();
					return false;
				}
			});
		}
	}

	function onlyCyrillic(evt: KeyboardEvent) {
		const regex = /^[а-яА-ЯёЁ\s-]+$/;
		const key = evt.key;
		if (!regex.test(key)) {
			evt.preventDefault();
			return false;
		}
	}

	function onlyNumber(evt: {
		key: string;
		preventDefault: CallableFunction;
		clipboardData: { getData: CallableFunction };
		originalEvent: { clipboardData: string };
	}) {
		const clipboardData = evt?.clipboardData || evt?.originalEvent?.clipboardData || null;
		const key = clipboardData?.getData('text') || evt.key;
		const string = clipboardData?.getData('text') || evt?.target?.value || '';
		const regex = props.phoneOnly
			? clipboardData?.getData('text')
				? /^[0-9+() ]+$/
				: /^[0-9+]+$/
			: props.isNumberOnlyAllowDots
				? /^[0-9.]+$/
				: /^[0-9]+$/;

		if (
			(props.isNumberOnlyAllowDots && (`${props.modelValue}`.includes('.') || string?.includes('.')) && key === '.') ||
			(`${props.modelValue}`.length === 0 && key === '.')
		) {
			evt.preventDefault();
			return false;
		}

		if (!regex.test(key)) {
			evt.preventDefault();
			return false;
		}
	}

	function onKeypress(evt: KeyboardEvent) {
		if (props.keysSubmit?.length && props.keysSubmit.includes(evt.keyCode)) {
			emit('keySubmitActions');
		}

		if (props.cyrillicOnly) {
			onlyCyrillic(evt);
		}

		if (props.numberOnly || props.phoneOnly || props.type === 'currency') {
			onlyNumber(evt as any);
		}

		if (props.keyPressCodeDisabled && props.keyPressCodeDisabled.includes(evt.keyCode)) {
			evt.preventDefault();
		}
	}

	const isHidden = ref(true);

	const changeHide = () => {
		isHidden.value = !isHidden.value;
	};

	const leaveInput = (event: Event) => {
		emit('blur', event);
		isFocused.value = false;

		if (props.numberOnly) {
			emit('update:modelValue', Number(props.modelValue));
		}
	};

	const focusHadle = (event: Event) => {
		emit('focus', event);
		isFocused.value = true;
	};

	const clickInputHandler = () => {
		if (props.disabled && props.disabledText) {
			useNotificationStore().addNewAlert(props.disabledText, 4000);
		}

		if (props.suggestions?.length) {
			isVisibleSuggestions.value = true;
			setTimeout(() => {
				document.addEventListener('click', clickOutSide);
			});
		}
	};

	const clickLeftIconHandler = () => {
		emit('clickLeftIconHandler', '');
	};

	const chooseSuggestion = (suggest: { key: string; value: any } | string) => {
		emit('chooseSuggestion', suggest);
	};

	const clickOutSide = () => {
		closeDropDown();
	};

	const closeDropDown = () => {
		isVisibleSuggestions.value = false;
		document.removeEventListener('click', clickOutSide);
	};

	if (props.suggestions !== undefined) {
		watch(
			() => props.suggestions,
			() => {
				if (isFocused.value && props.suggestions && props.suggestions?.length > 0) {
					isVisibleSuggestions.value = true;
					document.addEventListener('click', clickOutSide);
				}
			}
		);
	}
</script>
<style lang="scss" scoped>
	.ui-input {
		position: relative;

		.suggestions {
			position: absolute;
			width: 100%;
			top: 100%;
			left: 0;
			transform: translate(0px, -10px);
			background-color: var(--white);
			border-radius: 20px;
			padding: 15px 20px;
			border: 1px solid var(--gray-100);
			border-top: 0;
			border-top-right-radius: 0;
			border-top-left-radius: 0;
			z-index: 100;
			overflow-y: auto;
			max-height: 200px;
			display: flex;
			flex-direction: column;
			gap: 7px;

			&__item {
				cursor: pointer;
			}
		}

		&_error {
			position: absolute;
			bottom: -17px;
			left: 8px;
			height: 15px;
		}

		.label {
			position: relative;
			width: fit-content;
			padding-left: 5px;

			&_p-0 {
				padding-left: 0px;
			}

			.required {
				position: absolute;
				top: 0;
				right: -10px;
				font-size: 30px;
				color: var(--orange);
			}
		}
	}

	label {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.input {
		height: v-bind(height);
		align-items: center;
		overflow: hidden;
		border-radius: 12px;
		display: flex;
		gap: 8px;
		width: 100%;
		padding: 0 20px;
		border: 1px solid var(--dark-2);
		box-shadow: 0 1px 10px 0 #b8c8e039;

		&:hover {
			border: 1px solid var(--gray-100);
		}

		&:focus-within {
			border: 1px solid var(--gray-100);
		}

		&__clear {
			cursor: pointer;
		}

		&__hide {
			cursor: pointer;

			svg {
				width: 24px;
				height: 24px;
				display: block;
			}
		}

		&__icon {
			display: flex;

			&--left {
				display: flex;
				background-color: transparent;
			}
		}

		input {
			height: 100%;
			width: 100%;
			outline: none;
			border: none;
			color: var(--black);
			font-weight: 500;
			font-size: 18px;

			&::placeholder {
				color: var(--dark-gray);
			}

			&:focus::placeholder {
				color: var(--dark-gray);
			}

			&_password {
				font-size: 18px;
			}

			&:read-only {
				cursor: default;
			}
		}

		&.error {
			border: 1px solid var(--red-5);
		}

		&.disabled {
			opacity: 0.6;
			pointer-events: none;

			input {
				cursor: none;
				caret-color: transparent;
			}
		}
	}
</style>
