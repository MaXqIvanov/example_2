<template>
	<component
		:is="href && !disabled ? NuxtLink : 'button'"
		:type="href ? null : 'button'"
		:to="href ? href : null"
		:target="external ? '_blank' : null"
		:class="[
			'btn-icon',
			{ 'btn-icon--border': borderColor },
			{ 'btn-icon--badge': badge },
			{ btn__disabled: disabled }
		]"
		@click="href ? null : clickHandler()"
	>
		<span
			v-if="badge"
			class="btn-icon__badge"
		>
			{{ badgeValue }}
		</span>
		<span
			v-if="customBadge !== undefined"
			class="btn-icon__custom-badge"
		>
			{{ customBadge }}
		</span>
		<slot />
		<div
			class="flare"
			:style="{ background: colorSpinner }"
			v-if="isLoading"
		></div>
	</component>
</template>

<script setup lang="ts">
	import { NuxtLink } from '#components';

	type Props = {
		href?: string;
		external?: boolean;
		badge?: number;
		customBadge?: string;
		background?: string;
		padding?: string;
		icon_color?: string;
		borderRadius?: string;
		borderColor?: string;
		isLoading?: boolean;
		colorSpinner?: string;
		disabled?: boolean;
		badgeControlPosition?: { top?: string; left?: string; bottom?: string; right?: string };
	};

	const props = withDefaults(defineProps<Props>(), {
		background: 'var(--blue-light)',
		icon_color: 'var(--violet)',
		borderRadius: '10px',
		padding: '12px',
		disabled: false,
		badgeControlPosition() {
			return { top: '20%', left: '46%', bottom: 'unset', right: 'unset' };
		}
	});

	const emit = defineEmits(['click']);

	const clickHandler = () => {
		if (props.isLoading || props.disabled) return;
		emit('click');
	};

	const badgeValue = computed(() => {
		if (props.badge) return props.badge <= 99 ? +props.badge : '99+';
	});
</script>

<style scoped lang="scss">
	.btn {
		&__disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
	}

	.btn-icon {
		position: relative;
		display: flex;
		width: max-content;
		justify-content: center;
		align-items: center;

		padding: v-bind(padding);

		border: none;
		border-radius: v-bind(borderRadius);
		background-color: v-bind(background);
		color: v-bind(icon_color);

		transition-property: background-color, color;
		transition-duration: 0.35s;
		transition-timing-function: ease;

		&--border {
			border: 1px solid v-bind(borderColor);
		}

		&__custom-badge {
			position: absolute;
			top: 0%;
			right: -5px;
			transform: translate(-50%, -50%);
			background-color: var(--primary);
			width: 7px;
			height: 7px;
			border-radius: 50%;
		}

		&__badge {
			position: absolute;
			left: v-bind('badgeControlPosition?.left');
			top: v-bind('badgeControlPosition?.top');
			right: v-bind('badgeControlPosition?.right');
			bottom: v-bind('badgeControlPosition?.bottom');

			width: max-content;
			height: fit-content;

			display: flex;
			justify-content: center;
			align-items: center;

			padding: 5px 5px;
			border-radius: $br-4;

			font-size: 9px;
			font-weight: 600;
			line-height: 5px;
			color: var(--white);
			background-color: var(--orange);
		}
	}

	svg {
		width: 16px;
		height: 16px;

		transition-property: color;
		transition-duration: 0.35s;
		transition-timing-function: ease;
	}

	.btn-icon .flare {
		position: absolute;
		opacity: 0.8;
		top: 0;
		height: 100%;
		width: 50%;
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
