<template>
	<UiModalMobile
		v-model="modelValue"
		:is-need-fixed-modal-with-if-else-block="false"
		class="modal__mobile"
	>
		<TypographyKTypographyBody4
			color="var(--black)"
			font-type="bold"
			>СОРТИРОВКА ПОИСК</TypographyKTypographyBody4
		>
		<UiInput
			placeholder="Поиск по названию..."
			max-width="none"
			class="input__search"
			background-color-input="var(--violet-6)"
			:input-special-style="{ fontSize: '15px' }"
			border-width-input="0px"
			v-model="search"
		/>
		<div class="sort-list">
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
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(defineProps<{}>(), {});
	const search = ref('');
	const sort = ref<string | null>(null);
	const sortList = ref([
		{ key: '', title: 'Сортировать по описаню' },
		{ key: '', title: 'Сортировать по ключам' },
		{ key: '', title: 'По секрету' }
	]);

	const selectSortItemHandler = (item: (typeof sortList.value)[0]) => {
		sort.value = item.title;
	};
</script>

<style scoped lang="scss">
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
