<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		height="unset"
		min-height-body="unset"
		:zIndex="1000"
		:is-need-fixed-modal-with-if-else-block="false"
		left-position-default="calc(50% - 5px)"
	>
		<div class="wrapper">
			<TypographyKTypographyBody4
				color="var(--color_font_black_wite)"
				font-type="bold"
				>{{ $t('bots-modal-settings-delete-title') }}</TypographyKTypographyBody4
			>
			<TypographyKTypographyBody5
				class="description"
				color="var(--gray-5)"
				font-type="medium"
			>
				{{ $t('bots-modal-settings-delete-subtitle') }}
			</TypographyKTypographyBody5>
			<UiButton
				:color="ButtonType.delete"
				class="btn__delete"
				@click="deleteHandler"
				>{{ $t('bots-modal-settings-delete-btn') }}</UiButton
			>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { IBotSteps } from '~/interfaces/botSteps';
	import { ButtonType } from '~/interfaces/ui';

	const emits = defineEmits(['delete']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			stepInfo: { step: IBotSteps; index: number };
		}>(),
		{}
	);

	const deleteHandler = () => {
		emits('delete', props.stepInfo);
	};
</script>

<style scoped lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.modal__mobile {
		display: flex;
		flex-direction: column;

		z-index: 10000;

		.description {
			margin-top: 10px;
		}

		.btn__delete {
			margin-top: 20px;
			width: 100%;
			max-width: 400px;
			justify-self: center;
		}
	}
</style>
