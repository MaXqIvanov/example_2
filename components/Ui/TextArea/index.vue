<template>
	<div class="ui-textarea">
		<div
			class="label"
			:class="[labelClass ?? labelClass]"
			v-if="label"
		>
			{{ label }}
		</div>
		<div
			class="text-area"
			:class="[{ error: error?.status }]"
			:style="{ height: height, minHeight: minHeight }"
		>
			<div
				v-if="$slots['left-icon']"
				class="input__icon input__icon--left"
				@click="clickLeftIconHandler"
			>
				<slot name="left-icon" />
			</div>
			<textarea
				:value="modelValue"
				:style="{ height: height, minHeight: minHeight }"
				:placeholder="placeholder"
				:disabled="disabled"
				@blur="leaveInput(modelValue, required, $event)"
				@input="updateValue"
				@change="emit('change', $event)"
				@keypress="onKeypress"
				@paste="onPaste($event)"
				@focus="focusHadle"
			></textarea>
			<div
				class="emoji"
				v-if="isNeedEmoji"
			>
				<UiPopoverEmojiDefault @select="selectHandler" />
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
			class="ui-textarea_error"
		>
			<TypographyKTypographyBody4 color="var(--warning-000)">
				{{ error.msg }}
			</TypographyKTypographyBody4>
		</div>
	</div>
</template>

<script setup lang="ts">
	const emit = defineEmits([
		'update:modelValue',
		'input',
		'change',
		'blur',
		'paste',
		'focus',
		'clear',
		'clickLeftIconHandler',
		'selectEmojiHandler'
	]);

	const props = withDefaults(
		defineProps<{
			placeholder?: string;
			name?: string;
			required?: boolean;
			error?: { status: boolean; msg?: string | undefined };
			modelValue: string | number;
			label?: string;
			cyrillicOnly?: boolean;
			keyPressCodeDisabled?: number[];
			labelClass?: string;
			disabled?: boolean;
			maxWidth?: string;
			height?: string;
			minHeight?: string;
			borderRadius?: string;
			autoresize?: { isEnabled: boolean; maxHeight: number; minHeight: number };
			isNeedEmoji?: boolean;
		}>(),
		{
			maxWidth: '250px',
			height: '110px',
			borderRadius: '12px'
		}
	);

	const isRequired = ref(false);
	const isFocused = ref(false);

	const selectHandler = (value: string) => {
		emit('selectEmojiHandler', value);
	};

	const checkRequire = (value: string | number, required: boolean | undefined) => {
		turnRequired(!String(value).length && required);
	};

	const turnRequired = (value: boolean | undefined) => (isRequired.value = value!);

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

	function onKeypress(evt: KeyboardEvent) {
		if (props.cyrillicOnly) {
			onlyCyrillic(evt);
		}

		if (props.keyPressCodeDisabled && props.keyPressCodeDisabled.includes(evt.keyCode)) {
			evt.preventDefault();
		}
	}

	const leaveInput = (value: string | number, required: boolean | undefined, event: Event) => {
		emit('blur', event);
		checkRequire(value, required);
		isFocused.value = false;
	};

	const focusHadle = (event: Event) => {
		emit('focus', event);
		isFocused.value = true;
	};

	const autoResizeHandler = () => {
		if (!props.autoresize?.isEnabled) return;

		const textarea = document.querySelector<HTMLTextAreaElement>('textarea');
		const minHeight = props.autoresize.minHeight;
		const maxHeight = props.autoresize.maxHeight;

		const constrain = (n: number, low: number, high: number) => {
			return Math.max(Math.min(n, high), low);
		};

		if (textarea !== null) {
			textarea.addEventListener('input', () => {
				textarea.style.setProperty('height', '0');
				textarea.style.setProperty('height', constrain(textarea.scrollHeight, minHeight, maxHeight) + 'px');
			});
		}
	};

	const clickLeftIconHandler = () => {
		emit('clickLeftIconHandler', '');
	};

	onMounted(() => {
		autoResizeHandler();
	});
</script>

<style scoped lang="scss">
	.ui-textarea {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 5px;

		.text-area {
			display: flex;
			align-items: flex-end;
			width: 100%;
			border: 1px solid var(--gray-2);
			background-color: var(--white);
			border-radius: v-bind(borderRadius);
			overflow: hidden;

			.emoji {
				position: absolute;
				bottom: 0px;
				right: 4px;
			}
		}

		.input__icon {
			&--right {
				padding: 0 15px 5px 0;
			}

			&--left {
				padding: 0 0 4px 10px;
			}
		}

		textarea {
			@include body-2;
			color: var(--black);
			height: 100%;
			width: 100%;
			outline: none;
			border: 0;
			border-radius: 12px;
			padding: 17px 22px 17px 15px;
			resize: none;

			&:disabled {
				background-color: var(--white);
				opacity: 0.7;
			}

			&::placeholder {
				@include body-2;
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

		&_error {
			position: absolute;
			bottom: -17px;
			left: 8px;
			height: 15px;
		}

		.error {
			border: 1px solid var(--warning-000);
		}
	}
</style>
