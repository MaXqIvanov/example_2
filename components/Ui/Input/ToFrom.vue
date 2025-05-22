<template>
	<label
		:style="{ maxWidth: maxWidth }"
		class="ui-input"
	>
		<div
			v-if="label"
			class="label"
			:class="[labelClass ?? labelClass]"
		>
			{{ label }}
		</div>
		<div class="wrapper">
			<div
				class="input input__to"
				:class="[{ error_to: error?.status }, { disabled }]"
				:style="{ maxWidth: maxWidth, height: height }"
			>
				<div
					v-if="$slots['left-icon']"
					class="input__icon input__icon--left"
					@click.prevent="clickLeftIconHandler"
				>
					<slot name="left-icon" />
				</div>

				<input
					v-model="fromValue"
					:type="type === 'password' ? (isHidden ? 'password' : 'text') : type"
					:name="name"
					:placeholder="placeholderTo"
					:class="[`input_${type === 'password' ? (isHidden ? 'password' : 'text') : type}`]"
					@blur="leaveInput($event)"
					@change="emit('change', $event)"
					@keypress="onKeypress"
					@focus="focusHadle"
					:min="minValue"
					:readonly="readonly"
				/>
				<div
					v-if="type === 'password'"
					class="input__hide"
					@click.prevent="changeHide"
				>
					<UiIcon
						folder="eye"
						:name="isHidden ? 'open' : 'closed'"
					/>
				</div>
				<div
					v-if="$slots['right-icon']"
					class="input__icon input__icon--right"
				>
					<slot name="right-icon" />
				</div>
			</div>
			<div class="separate-line"></div>
			<div
				class="input input__from"
				:class="[{ error_from: error?.status }, { disabled }]"
				:style="{ maxWidth: maxWidth, height: height }"
			>
				<div
					v-if="$slots['left-icon']"
					class="input__icon input__icon--left"
					@click.prevent="clickLeftIconHandler"
				>
					<slot name="left-icon" />
				</div>

				<input
					v-model="toValue"
					:type="type === 'password' ? (isHidden ? 'password' : 'text') : type"
					:name="name"
					:placeholder="placeholderFrom"
					:class="[`input_${type === 'password' ? (isHidden ? 'password' : 'text') : type}`]"
					@blur="leaveInput($event)"
					@change="emit('change', $event)"
					@keypress="onKeypress"
					@focus="focusHadle"
					:min="minValue"
					:readonly="readonly"
				/>
				<div
					v-if="type === 'password'"
					class="input__hide"
					@click.prevent="changeHide"
				>
					<UiIcon
						folder="eye"
						:name="isHidden ? 'open' : 'closed'"
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
				<TypographyKTypographyBody4 color="var(--warning-000)">
					{{ error.msg }}
				</TypographyKTypographyBody4>
			</div>
		</div>
	</label>
</template>

<script setup lang="ts">
	const emit = defineEmits([
		'update:to',
		'update:from',
		'input',
		'change',
		'blur',
		'paste',
		'focus',
		'clear',
		'clickLeftIconHandler'
	]);

	const toValue = defineModel('to', { type: Number });
	const fromValue = defineModel('from', { type: Number });

	const props = withDefaults(
		defineProps<{
			placeholderTo?: string;
			placeholderFrom?: string;
			name?: string;
			required?: boolean;
			error?: { status: boolean; msg?: string | undefined };
			label?: string;
			labelClass?: string;
			type?: 'password' | 'email' | 'number';
			minValue?: number;
			disabled?: boolean;
			keyPressCodeDisabled?: number[];
			maxWidth?: string;
			height?: string;
			readonly?: boolean;
			validator?: CallableFunction;
		}>(),
		{
			maxWidth: '250px',
			height: '50px'
		}
	);

	const isFocused = ref(false);

	function onKeypress(evt: KeyboardEvent) {
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
	};

	const focusHadle = (event: Event) => {
		emit('focus', event);
		isFocused.value = true;
	};

	const clickLeftIconHandler = () => {
		emit('clickLeftIconHandler', '');
	};
</script>
<style lang="scss" scoped>
	.ui-input {
		position: relative;

		&_error {
			position: absolute;
			bottom: -17px;
			left: 8px;
		}
	}

	.wrapper {
		position: relative;
		display: flex;

		.input__to {
			border-right: 0;
			-webkit-clip-path: inset(0px 0px -5px 0px);
			clip-path: inset(0px 0px -5px 0px);
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;

			&:hover {
				border-right: 0;
			}

			&:focus-within {
				border-right: 0;
			}
		}

		.separate-line {
			position: absolute;
			top: 50%;
			height: 30%;
			left: 50%;
			width: 1px;
			background-color: var(--gray-200);
			transform: translate(-50%, -50%);
		}

		.input__from {
			border-left: 0;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;

			&:hover {
				border-left: 0;
			}

			&:focus-within {
				border-left: 0;
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
		align-items: center;
		background: var(--white);
		border-radius: 14px;
		display: flex;
		gap: 8px;
		width: 100%;
		padding: 0 12px;
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
				width: 18px;
				height: 18px;
				display: block;
			}
		}

		&__icon--left {
			display: flex;
			cursor: pointer;
		}

		input {
			height: 100%;
			width: 100%;
			outline: none;
			border: none;
			@include body-2;
			color: var(--black);

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

		&.error {
			&_to {
				border: 1px solid var(--warning-000);
				border-right: 0;
				-webkit-clip-path: inset(0px 0px -5px 0px);
				clip-path: inset(0px 0px -5px 0px);
			}

			&_from {
				border: 1px solid var(--warning-000);
				border-left: 0;
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}

		&.disabled {
			opacity: 0.8;
			pointer-events: none;
		}
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none; // Yeah, yeah everybody write about it
	}

	input[type='number'],
	input[type='number']:hover,
	input[type='number']:focus {
		appearance: none;
		-moz-appearance: textfield;
	}
</style>
