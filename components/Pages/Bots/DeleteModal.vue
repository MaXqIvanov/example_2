<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		height="unset"
		min-height-body="unset"
	>
		<div class="wrapper">
			<TypographyKTypographyBody4
				color="var(--color_font_black_wite)"
				font-type="bold"
				>{{ $t('bots-modal-delete-title') }}</TypographyKTypographyBody4
			>
			<TypographyKTypographyBody5
				class="description"
				color="var(--color_font_battomsheet_tooltip)"
				font-type="medium"
			>
				{{ $t('bots-modal-delete-placeholder') }}
			</TypographyKTypographyBody5>
			<UiButton
				:color="ButtonType.delete"
				class="btn__delete"
				@click="deleteHandler"
				>{{ $t('bots-modal-delete-btn') }}</UiButton
			>
		</div>

		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { ButtonType } from '~/interfaces/ui';

	const emits = defineEmits(['delete']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });

	const deleteHandler = () => {
		emits('delete', '');
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
