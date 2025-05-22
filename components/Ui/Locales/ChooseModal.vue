<template>
	<UiModalDefault
		v-model="isOpen"
		padding-card="27px"
		height="fit-content"
		width="calc(100% - 20px)"
		max-width="400px"
		:title="$t('modal-choose-locale')"
		:z-index="200000"
	>
		<div class="modal__wrapper">
			<div
				class="country"
				v-for="locale in i18n.locales.value"
				@click="chooseHandler(locale)"
			>
				<UiIcon
					:name="locale.code"
					folder="locales"
					width="20px"
					height="20px"
				/>
				<TypographyKTypographyBody3
					color="var(--black)"
					font-type="bold"
				>
					{{ locale.name }}
				</TypographyKTypographyBody3>
			</div>
		</div>

		<template #btn-close>
			<UiIcon
				name="close_v2"
				height="15"
				width="15"
				@click="closeHandler"
			></UiIcon>
		</template>
	</UiModalDefault>
</template>

<script setup lang="ts">
	const isOpen = defineModel('isOpen', { type: Boolean, required: true });
	const i18n = useI18n();

	const chooseHandler = (locale: (typeof i18n.locales.value)[0]) => {
		i18n.setLocale(locale.code);
		closeHandler();
	};
	const closeHandler = () => {
		isOpen.value = false;
	};
</script>

<style scoped lang="scss">
	.modal__wrapper {
		display: flex;
		gap: 10px;
		flex-direction: column;

		.country {
			display: flex;
			align-items: center;
			gap: 15px;
			width: fit-content;
			cursor: pointer;
			opacity: 0.9;
			&:hover {
				opacity: 1;
			}
		}
	}
</style>
