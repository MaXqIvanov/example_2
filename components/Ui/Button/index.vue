<template>
	<button
		class="ui-button button h5"
		:class="{
			[type]: !!type,
			[`button-${color}`]: !!color,
			'button--disabled': disabled,
			'button--disabled_control': disabledControl,
			[`button--outlined`]: outline,
			[size]: !!size
		}"
		:style="{ borderColor: borderColor, padding: buttonPadding, ...(customStyle ?? customStyle) }"
		@click="onClickHandler"
	>
		<slot
			v-if="$slots.before && !isLoading"
			name="before"
		/>
		<template v-if="label && !isSpinnerLoading">
			{{ label }}
		</template>
		<slot />
		<slot name="after" />
		<div
			class="flare"
			v-if="isLoading"
			:style="{ background: colorSpinner }"
		></div>
		<template v-else-if="isSpinnerLoading">
			<UiLoader
				:radius="10"
				:color="colorSpinner || '#E1E5F0'"
				:circle-width="2"
			/>
		</template>
	</button>
</template>

<script setup lang="ts">
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useRouter } from '#imports';

	type Props = {
		label?: string;
		color?: string;
		colorSpinner?: string;
		backgroundColor?: string;
		borderColor?: string;
		type?: ButtonType;
		external?: boolean;
		to?: string | object;
		disabled?: boolean;
		disabledControl?: boolean;
		size?: ButtonSizeType;
		outline?: boolean;
		isLoading?: boolean;
		isSpinnerLoading?: boolean;
		buttonPadding?: string;
		customStyle?: Record<string, string>;
		href?: string;
	};

	const emit = defineEmits(['click']);

	const props = withDefaults(defineProps<Props>(), {
		type: ButtonType.primary,
		size: ButtonSizeType.big,
		backgroundColor: 'transparent'
	});

	const router = useRouter();

	function onClickHandler() {
		if (props.isLoading || props.isSpinnerLoading) return;

		emit('click');
		if (props.to) {
			router.push(props.to);
		}
	}
</script>

<style scoped lang="scss">
	.button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: v-bind(backgroundColor);
		border: 0;
		font-size: 14px;
		outline: 0;
		position: relative;
		transition:
			background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1),
			opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
		cursor: pointer;
		border-radius: 12px;
		font-weight: 600;
		padding-left: 32px;
		padding-right: 32px;
		overflow: hidden;

		&.b_xxl {
			height: 60px;
			min-height: 60px;
			padding: 4px 32px;
			@include body-1-bold;
		}

		&.b_xl {
			height: 50px;
			padding: 4px 32px;
		}

		&.big {
			height: 40px;
			padding: 4px 32px;
		}

		&.small {
			height: 32px;
			padding: 6px 24px;
		}

		&.extra_small {
			height: 20px;
		}

		.medium {
			@include body-2;
		}

		&-outline {
			background-color: transparent;
			border: 1px solid var(--color-btn-outline);
			border-radius: 15px;
		}

		&-outline-v2 {
			background-color: transparent;
			border: 1px solid var(--outline);
			border-radius: 15px;
		}

		&-variant5 {
			color: var(--violet);
			background-color: var(--blue-light-5);

			&:hover {
				transition: all linear 0.3s;
				opacity: 0.8;
			}
		}

		&-variant6 {
			color: var(--white);
			background-color: var(--blue);

			&:hover {
				transition: all linear 0.3s;
				opacity: 0.9;
			}
		}

		&-blue-light {
			color: var(--violet);
			background-color: var(--blue-light);
		}

		&-underline {
			border-bottom: 1px solid var(--black);
			width: fit-content;
			padding-left: 0;
			padding-right: 0;
			border-radius: 0;
		}

		&--outlined {
			border-width: 1px;
			border-style: solid;

			&:hover {
				transition: all linear 0.3s;
				opacity: 0.85;
			}
		}

		&-primary {
			background-color: var(--btn-primary-v2);
			background-image: var(--btn-bg);
			background-size: cover;
			color: var(--white);

			&:hover {
				transition: all linear 0.3s;
				opacity: 0.85;
			}
		}

		&-delete {
			background: var(--crimson);
			color: var(--white);

			&:hover {
				transition: all linear 0.3s;
				opacity: 0.9;
			}
		}

		&--disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;

			&_control {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: all;

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	.button--disabled.button-white {
		opacity: 1;
		color: var(--var-blue-400);
		border: 1px solid var(--var-blue-400);
	}

	.button--disabled.button-create-btn {
		opacity: 1;
		background-color: var(--var-white-200);
		color: var(--var-white-400) !important;
	}

	.button--disabled_control.button-primary {
		opacity: 0.5;
	}

	.button--disabled.button-primary {
		opacity: 0.7;
	}

	.button .flare {
		position: absolute;
		opacity: 0.65;
		top: 0;
		height: 100%;
		width: 15%;
		transform: skewX(-45deg); // Наклон
		left: -10%;
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.4));
		animation: flareAnimation 1s infinite ease-out; // Время и тип анимации можно менять
	}

	@keyframes flareAnimation {
		0% {
			left: -10%;
		}
		100% {
			left: 110%;
		}
	}
</style>
