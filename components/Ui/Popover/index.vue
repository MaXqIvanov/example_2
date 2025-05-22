<template>
	<Popper
		:show="isManualMode ? showPopper : null"
		:hover="hoverOpening"
		:openDelay="hoverOpening && !isManualMode ? 500 : 0"
		:closeDelay="0"
		:placement="position"
		:offsetDistance="offsetDistance"
		:offsetSkid="skid"
		:z-index="zIndex"
		@open:popper="
			isOpen = true;
			emit('open', '');
		"
		@close:popper="
			isOpen = false;
			emit('close', '');
		"
		:class="{ popover_disabled: isDisabled }"
		:disabled="isDisabled"
	>
		<div
			class="actions"
			ref="openButton"
			@click="isManualMode && !hoverOpening ? togglePopper() : null"
			@mouseenter="isManualMode && hoverOpening ? openPopper() : null"
			@mouseleave="isManualMode && hoverOpening ? closePopper() : null"
		>
			<template v-if="$slots['button']">
				<slot
					name="button"
					class="btn-open"
					:buttonColor="buttonColor"
					:iconColor="iconColor"
				/>
			</template>
			<UiButtonIcon
				v-else
				:background="buttonColor"
				:icon_color="iconColor"
				:class="['btn-open', { 'btn-open--opened': isOpen }]"
			>
				<UiIcon
					name="more"
					width="16"
					height="16"
					:color="iconColor"
				/>
			</UiButtonIcon>
		</div>

		<template
			v-if="isManualMode ? showPopper : true"
			#content="{ close }"
		>
			<UiCard
				tag-type="div"
				class="popover__card"
				ref="content"
			>
				<UiButtonIcon
					v-if="hasCloseButton"
					background="var(--blue-light)"
					icon_color="var(--violet)"
					class="btn-close"
					@click="close"
				>
					<UiIcon
						name="cross"
						width="16"
						height="16"
					/>
				</UiButtonIcon>
				<slot
					name="body"
					:close="close"
				/>
			</UiCard>
		</template>
	</Popper>
</template>

<script setup lang="ts">
	import Popper from 'vue3-popper/dist/popper.esm';
	import { onClickOutside } from '@vueuse/core';

	const emit = defineEmits(['open', 'close']);

	type Props = {
		position?:
			| 'auto'
			| 'auto-start'
			| 'auto-end'
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
		isManualMode?: boolean;
		closePopper?: boolean; // for manual mode
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
	};

	const props = withDefaults(defineProps<Props>(), {
		hoverOpening: false,
		isManualMode: false,
		closePopper: false,
		position: 'left-start',
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
	});

	const isOpen = ref(false);

	const skid = computed(() => {
		if (props.position.includes('start')) return `-${props.skid}`;
		if (props.position.includes('end')) return props.skid;
		return 0;
	});

	const iconColor = computed(() => (isOpen.value ? props.btnOpenIconColor.open : props.btnOpenIconColor.closed));
	const buttonColor = computed(() =>
		isOpen.value ? props.btnOpenBackgroundColor.open : props.btnOpenBackgroundColor.closed
	);

	// manual control
	const showPopper = ref(false);

	const openButton = ref<HTMLElement | null>(null);
	const content = ref<HTMLElement | null>(null);

	let timeout: number | null = null;

	const openPopper = () => {
		if (props.hoverOpening) {
			timeout = window.setTimeout(() => (showPopper.value = true), 500);
		} else {
			showPopper.value = true;
		}
	};

	const closePopper = () => {
		if (props.hoverOpening) {
			if (timeout) {
				window.clearTimeout(timeout);
			}
			showPopper.value = false;
		} else {
			showPopper.value = false;
		}
	};

	const togglePopper = () => (showPopper.value = !showPopper.value);

	onClickOutside(content, () => (props.isManualMode ? closePopper() : null), { ignore: [openButton] });
	watch(
		() => props.closePopper,
		() => {
			if (props.isManualMode) {
				if (props.closePopper) closePopper();
			}
		}
	);
</script>

<style scoped lang="scss">
	.popover {
		&__card {
			position: relative;
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
</style>
