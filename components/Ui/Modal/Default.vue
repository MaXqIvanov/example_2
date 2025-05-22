<template>
	<teleport
		:disabled="!teleport"
		to="#teleports"
	>
		<div
			class="ui-modal"
			:class="{ open: props.modelValue }"
			@mousedown="closeModal"
			@keydown="keyDownHandler"
		>
			<div
				v-if="props.modelValue"
				class="ui-modal__wrapper"
				@mousedown.stop
				:style="{ width, height }"
			>
				<div class="modal-card">
					<div class="modal-card__top">
						<TypographyKTypographyBody2
							v-if="title"
							font-type="bold"
							color="var(--black)"
							class="title"
						>
							{{ title }}
						</TypographyKTypographyBody2>
						<div
							class="modal-card__btn-close"
							@click.stop
						>
							<slot name="btn-close" />
							<UiButtonIcon
								v-if="!$slots['btn-close']"
								padding="7px"
								@click="closeModal"
							>
								<UiIcon
									name="cross"
									width="16"
									height="16"
								/>
							</UiButtonIcon>
						</div>
					</div>

					<slot />
				</div>
			</div>
		</div>
		<div class="ui-modal__blackout"></div>
	</teleport>
</template>

<script lang="ts" setup>
	const emits = defineEmits(['update:modelValue', 'close']);

	const props = withDefaults(
		defineProps<{
			modelValue: boolean;
			width?: string;
			height?: string;
			maxWidth?: string;
			maxHeight?: string;
			title?: string;
			paddingCard?: string;
			teleport?: boolean;
			overflow?: string;
			zIndex?: number;
		}>(),
		{
			width: '100%',
			height: '100%',
			maxWidth: 'calc(100vw - 48px)',
			maxHeight: 'calc(100vh - 48px)',
			paddingCard: '27px 41px 50px 60px',
			teleport: false,
			overflow: 'hidden',
			zIndex: 10000
		}
	);

	function closeModal() {
		emits('update:modelValue', false);
		emits('close', '');
	}

	const positionY = ref<number>(0);
	const zIndexModal = computed(() => {
		return {
			blackout: props.zIndex - 1,
			modal: props.zIndex
		};
	});

	const keyDownHandler = (e: KeyboardEvent) => {
		if (e.keyCode === 27) {
			document.removeEventListener('keydown', keyDownHandler);
			closeModal();
		}
	};

	watch(
		() => props.modelValue,
		(value) => {
			if (value) {
				if (document.body.scrollHeight !== window.innerHeight) {
					document.body.style.padding = '0 calc(10px - (100vw - 100%)) 0 0';
				}
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
</script>

<style lang="scss" scoped>
	.ui-modal__blackout {
		position: fixed;
		z-index: v-bind('zIndexModal.blackout');
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		background-color: black;
		opacity: 0.2;
	}
	.ui-modal {
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: v-bind('zIndexModal.modal');
		background-color: var(--gray-3);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		pointer-events: none;
		opacity: 0;
		visibility: hidden;
		transition: all 0.2s ease-in-out;

		&.open {
			pointer-events: all;
			opacity: 1;
			visibility: visible;
		}

		&__wrapper {
			position: relative;
			width: v-bind(width);
			height: v-bind(height);
			max-height: v-bind(maxHeight);
			max-width: v-bind(maxWidth);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: $br-5;
			box-shadow:
				0 2px 4px -1px #0003,
				0 4px 5px #00000024,
				0 1px 10px #0000001f;
			overflow: v-bind(overflow);
			pointer-events: all;
			will-change: scroll-position;
		}

		.modal-card {
			display: flex;
			overflow-x: auto;
			width: 100%;
			height: 100%;
			flex-direction: column;
			overflow: v-bind(overflow);

			padding: v-bind(paddingCard);
			border-radius: $br-5;
			background-color: var(--white);

			&__top {
				display: flex;
				width: 100%;
				height: max-content;
				border-bottom: 1px solid var(--gray-3);

				justify-content: space-between;
				align-items: center;

				padding-bottom: 10px;
				margin-bottom: 10px;

				.title {
					max-width: 90%;
				}
			}

			&__btn-close {
				margin-left: auto;
			}
		}
	}
</style>
