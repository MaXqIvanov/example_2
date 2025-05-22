<template>
	<div
		class="locales"
		v-if="i18n.locales.value?.length > 1"
	>
		<UiIcon
			:name="i18n.locale.value"
			folder="locales"
			@click="openChooseModal"
			class="locale"
		/>
		<TypographyKTypographyBody3
			:color="localeColor"
			font-type="bold"
			class="locale"
			@click="openChooseModal"
			>{{ curLocale }}</TypographyKTypographyBody3
		>
		<UiLocalesChooseModal
			v-model:is-open="isNeedOpenModalInfoHedging"
			v-if="isNeedOpenModalInfoHedging"
		/>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			localeColor: string;
		}>(),
		{
			localeColor: 'var(--white)'
		}
	);

	const i18n = useI18n();
	const isNeedOpenModalInfoHedging = ref(false);
	const curLocale = computed(() => {
		return i18n.locales.value.find((locale) => locale.code === i18n.locale.value)?.name;
	});
	const openChooseModal = () => {
		isNeedOpenModalInfoHedging.value = true;
	};
</script>

<style scoped lang="scss">
	.locales {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.locale {
		cursor: pointer;
	}
</style>
