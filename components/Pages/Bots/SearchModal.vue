<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		height="unset"
		min-height-body="unset"
		:is-need-fixed-modal-with-if-else-block="false"
		left-position-default="calc(50% - 0px)"
		@save="searchHandler"
	>
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('bots-modal-search-title') }}</TypographyKTypographyBody4
		>
		<UiInput
			:placeholder="$t('bots-modal-search-input-placeholder')"
			max-width="none"
			class="input__search"
			background-color-input="var(--violet-6)"
			:input-special-style="{ fontSize: '15px' }"
			border-width-input="0px"
			:keys-submit="[13]"
			@key-submit-actions="searchHandler"
			v-model="search"
		>
			<template
				#right-icon
				v-if="search"
			>
				<UiIcon
					name="close_v2"
					class="clear-icon"
					@click="clearSearchHandler"
				/>
			</template>
		</UiInput>
		<div
			class="sort-list"
			v-if="false"
		>
			<div
				class="item"
				v-for="item in sortList"
			>
				<TypographyKTypographyBody4
					color="var(--gray-2)"
					class="title"
					font-type="medium"
					:class="{ title__active: sort === item.title }"
					@click="selectSortItemHandler(item)"
				>
					{{ item.title }}
				</TypographyKTypographyBody4>
			</div>
		</div>
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { useBotsStore } from '~/store/bots.store';
	const emits = defineEmits(['searchHandler']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });

	const props = withDefaults(defineProps<{}>(), {});
	const botsStore = useBotsStore();

	const search = ref(botsStore.searchPattern);
	const sort = ref<string | null>(null);
	const sortList = ref([{ key: '', title: 'Сортировать по описаню' }]);

	const selectSortItemHandler = (item: (typeof sortList.value)[0]) => {
		sort.value = item.title;
	};

	const clearSearchHandler = () => {
		search.value = '';
	};

	const searchHandler = async () => {
		emits('searchHandler', search.value);
		modelValue.value = false;
	};
</script>

<style scoped lang="scss">
	.clear-icon {
		height: 12px;
		width: 12px;
		margin-right: -10px;
		cursor: pointer;
	}
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.sort-list {
			margin-top: 24px;
			display: flex;
			flex-direction: column;
			gap: 12px;
			.item {
				cursor: pointer;

				.title {
					color: var(--gray-5);
					transition: all linear 0.1s;
					&__active {
						font-weight: 700;
						color: var(--black);
					}
				}
			}
		}

		.input__search {
			margin-top: 20px;
		}
	}
</style>
