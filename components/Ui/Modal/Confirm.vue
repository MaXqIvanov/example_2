<template>
	<div class="modal__confirm">
		<TypographyKTypographyBody3
			color="var(--black)"
			class="title"
		>
			{{ title }}
		</TypographyKTypographyBody3>
		<div class="actions">
			<UiButton
				:color="ButtonType.outline"
				:size="ButtonSizeType.small"
				@click="closeModal"
				>Отмена</UiButton
			>
			<UiButton
				:color="ButtonType.primary"
				:size="ButtonSizeType.small"
				:is-loading="isLoading"
				@click="saveHandler"
				>{{ btnConfirmTitle }}</UiButton
			>
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
			title: string;
			zIndex?: number;
			customPadding?: string;
			maxWidth?: string;
			isLoading?: boolean;
			btnConfirmTitle?: string;
		}>(),
		{
			zIndex: 10000,
			customPadding: '20px',
			maxWidth: '300px',
			btnConfirmTitle: 'Принять'
		}
	);

	const closeModal = () => {
		emits('update:modelValue', false);
	};

	const saveHandler = () => {
		emits('save', '');
	};

	const zIndexForModal = computed(() => {
		return { blackout: props.zIndex - 1, modal: props.zIndex };
	});
</script>

<style scoped lang="scss">
	.blackout {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: v-bind('zIndexForModal.blackout');
		background-color: var(--blackout);
	}

	.modal__confirm {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		position: fixed;
		max-width: v-bind(maxWidth);
		width: calc(100% - 40px);
		border-radius: 20px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		right: 0px;
		z-index: v-bind('zIndexForModal.modal');
		background-color: var(--white);
		padding: v-bind(customPadding);
		overflow: auto;

		.title {
			line-height: 22px;
		}

		.actions {
			display: flex;
			gap: 10px;
			width: 100%;
			margin-top: 30px;

			button {
				width: 100%;
			}
		}
	}
</style>
