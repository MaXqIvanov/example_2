<template>
	<div
		ref="reference"
		class="popover__btn-wrapper"
		@click="hoverOpening ? null : togglePopover()"
		@mouseenter="hoverOpening ? openPopover() : null"
		@mouseleave="hoverOpening ? closePopover() : null"
	>
		<slot
			v-if="$slots['button']"
			name="button"
		/>

		<UiButtonIcon
			v-else
			:background="buttonColor"
			:icon_color="iconColor"
			class="btn-open"
		>
			<UiIcon
				name="more"
				width="16"
				height="16"
				:color="iconColor"
			/>
		</UiButtonIcon>
	</div>

	<transition
		name="fade"
		:duration="{ enter: 500, leave: hidePopover ? 0 : 500 }"
	>
		<div
			v-if="isOpen"
			ref="floating"
			:style="floatingStyles"
			class="popover__wrapper"
		>
			<UiCard
				tag-type="div"
				class="popover__card"
			>
				<UiButtonIcon
					v-if="hasCloseButton"
					background="var(--blue-light)"
					icon_color="var(--violet)"
					class="btn-close"
					@click="closePopover"
				>
					<UiIcon
						name="cross"
						width="16"
						height="16"
					/>
				</UiButtonIcon>
				<slot
					name="body"
					:close="closePopover"
				/>
			</UiCard>
		</div>
	</transition>
</template>

<script setup lang="ts">
	import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
	import { onClickOutside } from '@vueuse/core';

	const props = withDefaults(
		defineProps<{
			position?:
				| 'top'
				| 'top-start'
				| 'top-end'
				| 'bottom'
				| 'bottom-start'
				| 'bottom-end'
				| 'right'
				| 'right-start'
				| 'right-end'
				| 'left'
				| 'left-start'
				| 'left-end';
			hoverOpening?: boolean;
			hidePopover?: boolean; // for manual mode
			padding?: string;
			hasCloseButton?: boolean;
			isDisabled?: boolean;
			skid?: string;
			offsetDistance?: string;
			zIndex?: string;
			btnOpenBackgroundColor?: {
				open: string;
				closed: string;
			};
			btnOpenIconColor?: {
				open: string;
				closed: string;
			};
		}>(),
		{
			hoverOpening: false,
			hidePopover: false,
			position: 'bottom-start',
			padding: '29px 41px 37px 39px',
			hasCloseButton: false,
			skid: '22',
			offsetDistance: '20',
			zIndex: '9999',
			btnOpenBackgroundColor: {
				open: 'var(--blue)',
				closed: 'var(--blue-light)'
			},
			btnOpenIconColor: {
				open: 'var(--white)',
				closed: 'var(--violet)'
			}
		}
	);

	// styles
	const iconColor = computed(() => (isOpen.value ? props.btnOpenIconColor.open : props.btnOpenIconColor.closed));
	const buttonColor = computed(() =>
		isOpen.value ? props.btnOpenBackgroundColor.open : props.btnOpenBackgroundColor.closed
	);

	//floating

	const reference = ref<HTMLElement | null>(null);
	const floating = ref<HTMLElement | null>(null);
	const isOpen = ref(false);

	const { floatingStyles } = useFloating(reference, floating, {
		open: isOpen,
		whileElementsMounted: autoUpdate,
		strategy: 'absolute',
		middleware: [flip(), shift(), offset({ mainAxis: +props.offsetDistance, crossAxis: -1 * +props.skid })],
		placement: props.position
	});

	// show controls

	let timeout: number | null = null;

	const openPopover = () => {
		if (props.hoverOpening) {
			timeout = window.setTimeout(() => (isOpen.value = true), 500);
		} else {
			isOpen.value = true;
		}
	};
	const closePopover = () => {
		if (props.hoverOpening) {
			if (timeout) {
				window.clearTimeout(timeout);
			}
			isOpen.value = false;
		} else {
			isOpen.value = false;
		}
	};
	const togglePopover = () => {
		if (isOpen.value) closePopover();
		else openPopover();
	};

	onClickOutside(floating, () => closePopover(), { ignore: [reference] });

	watch(
		() => props.hidePopover,
		() => {
			if (isOpen.value && floating.value && props.hidePopover) {
				closePopover();
			}
		}
	);
</script>

<style scoped lang="scss">
	.popover {
		&__wrapper {
			z-index: v-bind(zIndex);
		}

		&__card {
			width: max-content;
			padding: v-bind(padding);

			border-radius: $br-5;
			box-shadow: 0 10px 50px 0 #12114533;
			background-color: var(--white);
		}

		&_disabled {
			.actions {
				opacity: 0.5;
			}
		}

		&__btn-wrapper {
			width: max-content;
			height: max-content;
			display: flex;
		}

		.btn-open {
			&:deep(svg) {
				width: 16px;
				height: 16px;
			}
		}

		.btn-close {
			position: absolute;
			top: 24px;
			right: 35px;

			padding: 4.5px;

			&:deep(svg) {
				width: 24px;
				height: 24px;
			}
		}
	}
</style>
