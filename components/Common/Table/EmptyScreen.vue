<template>
	<div :class="['empty', { 'empty--data': props.type === 'no-data' }]">
		<UiNavigationNotFound
			v-if="emptyMessage"
			:icon="emptyMessage.icon"
			:title="emptyMessage.title"
			:subtitle="emptyMessage.subtitle"
			:is-need-btn="emptyMessage.isNeedBtn"
			:custom-style-for-icon="{ maxHeight: '530px' }"
			@click="emptyMessage.isNeedBtn ? emit('clearSearch') : null"
		/>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			type: 'empty-search' | 'no-data';
			noDataTitle: string;
			noDataSubtitle: string;
		}>(),
		{}
	);

	const emit = defineEmits(['clearSearch']);

	const emptyMessage = computed(() => {
		if (props.type === 'empty-search')
			return {
				title: 'Поиск не дал результатов',
				subtitle: 'возможно неправильно ввели запрос',
				icon: {
					name: 'search-empty',
					folder: 'navigation-element'
				},
				isNeedBtn: true
			};
		else
			return {
				title: props.noDataTitle,
				subtitle: props.noDataSubtitle,
				icon: {
					name: 'no-data',
					folder: 'navigation-element'
				},
				isNeedBtn: false
			};
	});
</script>

<style scoped lang="scss">
	.empty {
		width: 90%;
		height: 80%;
		display: flex;

		@media (max-height: 1200px) {
			& .not-found {
				flex-direction: row;
				gap: 0;
			}

			&:deep(.not-found__text) {
				width: 90%;
			}
		}

		&--data {
			& .not-found {
				flex-direction: row;
				gap: 0;

				&:deep(.not-found__text) {
					width: 80%;
					align-items: flex-start;
				}

				&:deep(.title) {
					text-align: left;
				}

				&:deep(.subtitle) {
					text-align: left;
				}
			}
		}
	}
</style>
