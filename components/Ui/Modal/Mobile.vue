<template>
	<div
		class="modal__mobile"
		@keydown="keyDownHandler"
	>
		<div class="modal__mobile__body">
			<slot />
			<UiIcon
				class="icon__close"
				name="close_v2"
				height="15"
				width="15"
				color="var(--color_icon_black_wite)"
				@click="closeModal"
			/>
		</div>
		<div
			class="custom-actions"
			v-if="$slots['custom-actions']"
		>
			<slot name="custom-actions" />
		</div>
		<div
			class="actions"
			v-else
		>
			<div class="wrapper">
				<slot name="custom-btn" />
				<UiButton
					:color="ButtonType.outline"
					class="btn__cancel"
					:class="{ btn__fw: !isNeedBtnSave && isHorizontal }"
					@click="closeModal"
				>
					<TypographyKTypographyBody4
						color="var(--color_button_font_bottomsheet)"
						font-type="bold"
						>{{ $t('modal-mobile-btn-cancel') }}</TypographyKTypographyBody4
					>
				</UiButton>
				<UiButton
					:color="colorBtn"
					:size="ButtonSizeType.b_xl"
					:is-loading="isLoadingBtnSave"
					colorSpinner="linear-gradient(90deg, rgba(0, -1, 0, 0.05), rgba(0, 0, 0, 0.15))"
					class="btn__save"
					@click="saveHandler"
					v-if="isNeedBtnSave"
				>
					<TypographyKTypographyBody3
						color="var(--white)"
						font-type="bold"
						>{{ titleBtnSave || $t('modal-mobile-btn-save') }}</TypographyKTypographyBody3
					></UiButton
				>
			</div>
		</div>
	</div>
	<div
		class="blackout"
		@click="closeModal"
	></div>
</template>

<script setup lang="ts">
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';

	const emits = defineEmits(['update:modelValue', 'save']);

	const props = withDefaults(
		defineProps<{
			modelValue: boolean;
			height: string;
			isNeedBtnSave?: boolean;
			titleBtnSave?: string;
			colorBtnSave?: ButtonType;
			isLoadingBtnSave?: boolean;
			isNeedFixedModalWithIfElseBlock?: boolean;
			leftPositionDefault?: string;
			isDontNeedCloseWhenSave?: boolean;
			minHeightBody?: string;
			zIndex?: number;
			customPadding?: string;
			btnsDirection?: string;
			isNeedOverlay?: boolean;
		}>(),
		{
			height: 'calc(100% - 60px)',
			colorBtnSave: ButtonType.primary,
			isNeedBtnSave: true,
			isNeedFixedModalWithIfElseBlock: true,
			minHeightBody: '250px',
			zIndex: 100,
			customPadding: '30px 28px 20px 28px',
			btnsDirection: 'horizontal',
			isNeedOverlay: true
		}
	);

	const colorBtn = computed(() => props.colorBtnSave);
	const positionY = ref<number>(0);
	const leftPositionModal = ref(props.leftPositionDefault || 'calc(50%)');
	const isHorizontal = computed(() => props.btnsDirection === 'horizontal');
	const btnsStyle = computed(() => {
		return {
			gridRow: isHorizontal.value ? '1fr' : '1fr 1fr',
			gridColumn: isHorizontal.value ? 'repeat(auto-fill, minmax(48%, 1fr))' : '1fr'
		};
	});

	const closeModal = () => {
		emits('update:modelValue', false);
	};

	const saveHandler = () => {
		emits('save', '');
		if (!props.isDontNeedCloseWhenSave) {
			emits('update:modelValue', false);
		}
	};

	const keyDownHandler = (e: KeyboardEvent) => {
		if (e.keyCode === 27) {
			document.removeEventListener('keydown', keyDownHandler);
			closeModal();
		}
	};

	const zIndexForModal = computed(() => {
		return { blackout: props.zIndex - 1, modal: props.zIndex };
	});
	const modalUiSettings = computed(() => {
		return {
			blackout: props.isNeedOverlay ? 'var(--blackout)' : 'transparent'
		};
	});

	onMounted(() => {
		if (!props.isNeedFixedModalWithIfElseBlock) {
			watch(
				() => props.modelValue,
				(value) => {
					if (value) {
						// if (document.body.scrollHeight !== window.innerHeight) {
						// 	document.body.style.padding = '0 calc(10px - (100vw - 100%)) 0 0';
						// }
						document.addEventListener('keydown', keyDownHandler);
						positionY.value = window.pageYOffset;
						document.body.style.position = 'fixed';
						document.body.style.height = '100%';
						document.body.style.top = `-${positionY.value}px`;
					} else if (value === false) {
						document.removeEventListener('keydown', keyDownHandler);
						document.body.style.removeProperty('position');
						document.body.style.removeProperty('top');
						document.body.style.removeProperty('height');
						document.body.style.removeProperty('padding');
						window.scroll(0, positionY.value || 0);
						positionY.value = 0;
					}
				}
			);

			return;
		}

		document.addEventListener('keydown', keyDownHandler);
		positionY.value = window.pageYOffset;
		document.body.style.position = 'fixed';
		document.body.style.height = '100%';
		document.body.style.top = `-${positionY.value}px`;
	});

	onUnmounted(() => {
		if (!props.isNeedFixedModalWithIfElseBlock) return;

		document.removeEventListener('keydown', keyDownHandler);
		document.body.style.removeProperty('position');
		document.body.style.removeProperty('top');
		document.body.style.removeProperty('height');
		document.body.style.removeProperty('padding');
		window.scroll(0, positionY.value || 0);
		positionY.value = 0;
	});
</script>

<style scoped lang="scss">
	.btn__fw {
		width: 200%;
	}
	.blackout {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: v-bind('zIndexForModal.blackout');
		background-color: v-bind('modalUiSettings.blackout');
		opacity: 1;
	}

	.modal__mobile {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: fixed;
		max-width: calc(800px - 10px);
		width: calc(100% - 10px);
		border-radius: 20px 20px 0px 0px;
		height: v-bind(height);
		bottom: 0px;
		left: v-bind(leftPositionModal);
		transform: translate(-50%, 0px);
		right: 0px;
		z-index: v-bind('zIndexForModal.modal');
		background-color: var(--color_overlay);
		padding: v-bind(customPadding);
		overflow: auto;

		&__body {
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: auto;
			padding-right: 10px;
			margin-right: -10px;
			margin-top: 10px;
			min-height: v-bind(minHeightBody);
		}

		.actions {
			margin-top: 25px;

			.wrapper {
				display: grid;
				grid-gap: 10px;
				grid-template-columns: v-bind('btnsStyle.gridColumn');
				grid-template-rows: v-bind('btnsStyle.gridRow');

				.btn__save {
				}
				.btn__cancel {
					height: 48px;
					border-color: var(--color_button_font_bottomsheet);
				}
			}
		}

		.icon__close {
			position: absolute;
			top: 15px;
			right: 15px;
			cursor: pointer;
		}

		@media (max-width: 815px) {
			left: 50%;
		}

		@media (max-width: 350px) {
			padding: 39px 18px 29px 18px;
		}
	}

	.modal__mobile::-webkit-scrollbar {
		width: 0px; /* в основном для вертикальных полос прокрутки */
		height: 5px; /* в основном для горизонтальных полос прокрутки */
	}

	.modal__mobile::-webkit-scrollbar-thumb {
		/* плашка-бегунок */
		background-color: var(--orange);
		border-radius: 4px;
		border: 0px solid var(--orange);
	}

	.modal__mobile::-webkit-scrollbar-track {
		/* фон */
		background: var(--blue-6);
	}
</style>
