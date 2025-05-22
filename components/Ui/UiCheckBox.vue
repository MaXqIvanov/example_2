<template>
	<label
		class="ui-checkbox"
		:class="{ disable: props.disable, 'ui-checkbox_error': error?.status }"
		:style="{ maxWidth: maxWidth }"
		@click="chooseItem"
	>
		<div
			v-if="label"
			class="label"
			:class="[labelClass ?? labelClass, { disabled }]"
		>
			{{ label }}

			<span
				v-if="required"
				class="required"
			>
				*
			</span>
		</div>
		<div class="ui-checkbox__inner">
			<input
				v-model="isChecked"
				class="ui-checkbox__native"
				type="checkbox"
			/>
			<div class="ui-checkbox__bg">
				<svg
					class="ui-checkbox__svg"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						class="ui-checkbox__truthy"
						fill="none"
						d="M1.73,12.91 8.1,19.28 22.79,4.59"
					/>
					<path
						class="ui-checkbox__indet"
						d="M4,14H20V10H4"
					/>
				</svg>
			</div>
			<div class="q-checkbox__label">
				<slot />
			</div>
		</div>
	</label>
</template>

<script setup lang="ts">
	const emits = defineEmits(['update:modelValue', 'chooseItem', 'change']);

	const props = withDefaults(
		defineProps<{
			modelValue?: boolean;
			disable?: boolean;
			maxWidth?: string;
			error?: { status: boolean; msg: string };
			isCheckedProps?: boolean;
			label?: string;
			required?: boolean;
			labelClass?: string;
			disabled?: boolean;
		}>(),
		{
			isCheckedProps: undefined
		}
	);

	const isChecked = computed({
		get() {
			if (props.isCheckedProps !== undefined) {
				return props.isCheckedProps;
			}
			return props.modelValue;
		},
		set(v) {
			emits('update:modelValue', v);
			emits('change', v);
		}
	});

	const chooseItem = () => {
		emits('chooseItem', props.modelValue);
	};
</script>

<style scoped lang="scss">
	.label {
		position: relative;
		width: fit-content;

		.required {
			position: absolute;
			top: 0;
			right: -10px;
			font-size: 30px;
			color: var(--orange);
		}
	}
	.ui-checkbox {
		display: flex;

		flex-direction: column;
		gap: 8px;
		cursor: pointer;

		&.disable {
			pointer-events: none;
			opacity: 0.7;
		}

		&__inner {
			display: flex;
			gap: 10px;
			align-items: center;
		}

		&__bg {
			border: 1px solid var(--dark-2);
			background: var(--white);
			border-radius: 8px;
			width: 24px;
			min-width: 24px;
			height: 24px;
		}

		&__truthy {
			stroke: var(--white);
			stroke-width: 4.12px;
			stroke-dashoffset: 25.78334;
			stroke-dasharray: 25.78334;
		}

		&__native {
			display: none;
		}

		&__indet {
			fill: var(--black-100);
			transform: rotate(-280deg) scale(0);
			transform-origin: 50% 50%;
		}

		&__svg {
			display: block;
			padding: 3px;
			padding-top: 2px;
		}

		&_error {
			.ui-checkbox__bg {
				border: 2px solid var(--warning-000);
			}
		}

		input:checked + &__bg {
			background: var(--primary);

			box-shadow: 0px 1px 2px 0px #b8c8e039;

			path {
				stroke-dashoffset: 0;
				transition: stroke-dashoffset 0.18s cubic-bezier(0.4, 0, 0.6, 1) 0ms;
			}
		}
	}
</style>
