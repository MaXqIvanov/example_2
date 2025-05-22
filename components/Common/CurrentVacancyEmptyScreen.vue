<template>
	<div class="vacancy-empty">
		<UiLoaderSquares
			v-if="vacancyLoading"
			width="150px"
			height="75px"
		/>
		<UiNavigationNotFound
			v-else
			:icon="{ folder: 'navigation-element', name: 'no-data' }"
			:custom-style-for-icon="{ maxWidth: '536px', maxHeight: '300px' }"
			title="Вакансия не найдена"
			subtitle="похоже, что-то пошло не так"
		/>
	</div>
</template>

<script setup lang="ts">
	withDefaults(
		defineProps<{
			vacancyLoading: boolean;
		}>(),
		{
			vacancyLoading: false
		}
	);
</script>

<style scoped lang="scss">
	.vacancy-empty {
		position: absolute;
		top: 0;
		left: 0;

		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
</style>
