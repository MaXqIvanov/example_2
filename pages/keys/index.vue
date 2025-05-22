<template>
	<section class="keys">
		<div class="header">
			<div class="info">
				<UiIcon
					folder="navigation-element"
					name="nav-keys-new"
					color="var(--violet-2)"
					height="18"
					width="18"
				></UiIcon>
				<div class="title">
					<TypographyKTypographyBody3
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ $t('keys-title') }}
					</TypographyKTypographyBody3>
					<TypographyKTypographyBody3
						color="var(--color_font_namber)"
						font-type="bold"
					>
						- {{ countKeys }}</TypographyKTypographyBody3
					>
				</div>
			</div>
			<div class="action">
				<!-- <UiIcon
					class="btn__search"
					name="search"
					height="17"
					width="17"
					@click="openSearchModal"
				/> -->
				<UiButton
					:color="ButtonType.outline"
					class="button__added"
					:size="ButtonSizeType.small"
					@click="openAddedModal"
				>
					<TypographyKTypographyBody4
						color="var(--color_button_font_burgundy)"
						font-type="bold"
					>
						{{ $t('keys-btn-in-header') }}
					</TypographyKTypographyBody4>
				</UiButton>
			</div>
		</div>
		<div class="body">
			<UiListDefault
				:items="keyList"
				:title-empty="$t('keys-empty-screen-title')"
				@openEditModal="openEditModal"
				@openAddedModal="openAddedModal"
				@openDeleteModal="openDeleteModal"
			>
				<template #item="{ item }: { item: IKeys }">
					<PagesKeysListItem :item="item" />
				</template>
			</UiListDefault>
		</div>
	</section>
	<PagesKeysSearchModal
		v-model="searchModalIsOpen"
		v-if="searchModalIsOpen"
	/>
	<PagesKeysAddedModal
		v-model="addedModalIsOpen"
		v-if="addedModalIsOpen"
		@add="addedKeyHandler"
	/>
	<PagesKeysEditModal
		v-if="editModalIsOpen"
		v-model="editModalIsOpen"
		:item="currentKey!"
		@edit="aditKeyHandler"
	/>
	<PagesKeysDeleteModal
		v-if="deleteModalIsOpen"
		v-model="deleteModalIsOpen"
		@delete="deleteKeyHandler"
	/>
</template>

<script setup lang="ts">
	import type { IKeys, IKeysAction } from '~/interfaces/keys';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useKeysStore } from '~/store/keys.store';

	const keysStore = useKeysStore();
	const currentKey = ref<IKeys | null>(null);
	const searchModalIsOpen = ref(false);
	const addedModalIsOpen = ref(false);
	const editModalIsOpen = ref(false);
	const deleteModalIsOpen = ref(false);
	const countKeys = computed(() => keyList?.value?.length || 0);
	const keyList = computed<IKeys[]>(() => keysStore.keyList || []);

	const getKeysHandler = async () => {
		await keysStore.getKeys();
	};

	const deleteKeyHandler = async () => {
		if (!currentKey.value) return;
		const response = await keysStore.deleteKey(currentKey.value.guid);

		if (response?.status === 'success') {
			getKeysHandler();
			currentKey.value = null;
			deleteModalIsOpen.value = false;
		}
	};

	const addedKeyHandler = async (payload: IKeysAction) => {
		const response = await keysStore.addKey({
			...payload
		});

		if (response?.status === 'success') {
			getKeysHandler();
			currentKey.value = null;
			addedModalIsOpen.value = false;
		}
	};

	const aditKeyHandler = async (payload: IKeysAction) => {
		const response = await keysStore.updateKey({
			...payload
		});

		if (response?.status === 'success') {
			getKeysHandler();
			currentKey.value = null;
			editModalIsOpen.value = false;
		}
	};

	const openSearchModal = () => {
		searchModalIsOpen.value = true;
	};

	const openAddedModal = () => {
		addedModalIsOpen.value = true;
	};

	const openDeleteModal = (key: IKeys) => {
		deleteModalIsOpen.value = true;
		currentKey.value = key;
	};

	const openEditModal = (key: IKeys) => {
		editModalIsOpen.value = true;
		currentKey.value = key;
	};

	getKeysHandler();
</script>

<style scoped lang="scss">
	.keys {
		display: flex;
		flex-direction: column;
		height: 100%;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid var(--violet-5);
			padding-bottom: 14px;
			margin-bottom: 15px;
			min-height: 47px;

			.action {
				display: flex;
				align-items: center;
				gap: 22px;
				.btn__search {
					cursor: pointer;
				}
				.button__added {
					border: 1px solid var(--color_button_font_burgundy);
				}
			}

			.info {
				display: flex;
				align-items: center;
				gap: 9px;

				.title {
					display: flex;
					gap: 4px;
				}
			}
		}
	}
</style>
