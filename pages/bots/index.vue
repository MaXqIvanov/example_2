<template>
	<section class="bots">
		<div class="header">
			<div class="info">
				<UiIcon
					folder="navigation-element"
					name="nav-bots-new"
					color="var(--violet-2)"
					height="22"
					width="22"
				></UiIcon>
				<div class="title">
					<TypographyKTypographyBody3
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ $t('bots-title') }} -
					</TypographyKTypographyBody3>
					<TypographyKTypographyBody3
						color="var(--violet-3)"
						font-type="bold"
						>{{ countBots }}</TypographyKTypographyBody3
					>
				</div>
			</div>
			<div
				class="action"
				v-if="botsList?.length !== 0 || !!botsStore.searchPattern"
			>
				<UiButtonIcon
					:background="'transparent'"
					:customBadge="botsStore.searchPattern ? '' : undefined"
					padding="0px"
				>
					<UiIcon
						class="btn__search"
						name="search"
						height="17"
						width="17"
						color="var(--color_icon_blue_grey)"
						@click="openSearchModal"
					/>
				</UiButtonIcon>
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
						{{ $t('bots-btn-in-header') }}
					</TypographyKTypographyBody4>
				</UiButton>
			</div>
		</div>
		<div class="body">
			<UiListDefault
				:items="botsList"
				:title-empty="$t('bots-list-is-empty-title')"
				:is-need-signal-line="true"
				:isLoading="botsStore.loading.getBots"
				:searchPattern="!!botsStore.searchPattern"
				@openEditModal="openEditModal"
				@openAddedModal="openAddedModal"
				@openDeleteModal="openDeleteModal"
				@resetSearch="resetSearch"
			>
				<template #item="{ item }: { item: (typeof items.value)[0] }">
					<PagesBotsListItem
						:item="item"
						@click="openInfoModal(item)"
					/>
				</template>
				<template #custom-action="{ item }: { item: (typeof items.value)[0] }">
					<UiIcon
						class="stats"
						name="stats"
						color="var(--gray-7)"
						@click="openStatsModal(item)"
					/>
				</template>
			</UiListDefault>
		</div>
	</section>
	<PagesBotsSearchModal
		v-model="searchModalIsOpen"
		v-if="searchModalIsOpen"
		@search-handler="searchBotsHandler"
	/>
	<PagesBotsAddedModal
		v-model="addedModalIsOpen"
		v-if="addedModalIsOpen"
		@save="addedHandler"
	/>
	<PagesBotsEditModal
		v-if="editModalIsOpen"
		:item="currentBot"
		v-model="editModalIsOpen"
		@save="saveHandler"
		:isNeedFixedModalWithIfElseBlock="!infoModalIsOpen"
		:zIndex="zIndexForEditModal"
	/>
	<!-- 		:leftPositionDefault="leftPositionDefault" -->
	<PagesBotsDeleteModal
		v-if="deleteModalIsOpen"
		v-model="deleteModalIsOpen"
		@delete="deleteBotHandler"
	/>
	<PagesBotsInfoModal
		v-model="infoModalIsOpen"
		v-if="infoModalIsOpen"
		:item="currentBot"
		@openSettingsNetModal="openSettingsNetModal"
		@get-bots="getBotsHandler"
		@openEditModal="openEditModalAfterInfoModal"
	/>
	<PagesBotsSettingsNet
		v-model="settingsNetModalIsOpen"
		:bot="botsStore.currentBot || currentBot"
		:is-loading="botStepsStore.loading.getBotSteps"
		v-if="settingsNetModalIsOpen"
	/>
	<PagesBotsSettingsNetInfo
		v-model="settingsNetInfoModalIsOpen"
		:bot="botsStore.currentBot || currentBot"
		:is-loading="botStepsStore.loading.getBotSteps"
		v-if="settingsNetInfoModalIsOpen"
	/>
	<PagesBotsStatsModal
		:item="currentBot"
		v-model="statsModalIsOpen"
		v-if="statsModalIsOpen"
	/>
</template>

<script setup lang="ts">
	import type { IBots } from '~/interfaces/bots';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useBotsStore } from '~/store/bots.store';
	import { useBotStepsStore } from '~/store/botSteps.store';
	import { useDictionariesStore } from '~/store/dictionaries.store';

	const botsStore = useBotsStore();
	const botStepsStore = useBotStepsStore();
	const dictionariesStore = useDictionariesStore();
	const pageReqInterval = ref<NodeJS.Timeout | null>(null);
	const currentBot = ref<IBots | null>(null);
	const searchModalIsOpen = ref(false);
	const addedModalIsOpen = ref(false);
	const editModalIsOpen = ref(false);
	const deleteModalIsOpen = ref(false);
	const infoModalIsOpen = ref(false);
	const settingsNetModalIsOpen = ref(false);
	const settingsNetInfoModalIsOpen = ref(false);
	const statsModalIsOpen = ref(false);
	const countBots = computed(() => botsList.value?.length);
	const botsList = computed(() => botsStore.botList || []);
	const zIndexForEditModal = ref<number | null>(100);
	const leftPositionDefault = ref('calc(50% - 0px)');
	const searchBotValue = ref('');

	const searchBotsHandler = (search: string) => {
		searchBotValue.value = search;
		getBotsHandler();
	};

	const getBotsHandler = async (isNeedLoad = true) => {
		if (searchBotValue.value) {
			await botsStore.getBotsBySearch(searchBotValue.value);
			return;
		}
		botsStore.searchPattern = '';
		await botsStore.getBots(isNeedLoad);
	};

	const resetSearch = async () => {
		searchBotValue.value = '';
		await botsStore.getBotsBySearch('');
	};

	const openSearchModal = () => {
		searchModalIsOpen.value = true;
	};

	const openAddedModal = () => {
		addedModalIsOpen.value = true;
	};

	const openEditModalAfterInfoModal = (item: IBots) => {
		zIndexForEditModal.value = 1000;
		infoModalIsOpen.value = true;
		editModalIsOpen.value = true;
		leftPositionDefault.value = 'calc(50% - 5px)';
		currentBot.value = item;
	};

	const openEditModal = (item: IBots) => {
		leftPositionDefault.value = 'calc(50% - 0px)';
		editModalIsOpen.value = true;
		currentBot.value = item;
	};

	const openDeleteModal = (item: IBots) => {
		deleteModalIsOpen.value = true;
		currentBot.value = item;
	};

	const openInfoModal = (item: any) => {
		infoModalIsOpen.value = true;
		currentBot.value = item;
	};

	const openStatsModal = (item: any) => {
		statsModalIsOpen.value = true;
		currentBot.value = item;
	};

	const openSettingsNetModal = (item: IBots) => {
		currentBot.value = item;
		if (item?.is_enable) {
			settingsNetInfoModalIsOpen.value = true;
			return;
		}
		settingsNetModalIsOpen.value = true;
	};

	const addedHandler = async (values: any) => {
		const response = await botsStore.addBot(values);

		if (response?.status === 'success') {
			getBotsHandler();
			currentBot.value = response.data;
			infoModalIsOpen.value = true;
			addedModalIsOpen.value = false;
		}
	};

	const saveHandler = async (values: any) => {
		const response = await botsStore.updateBot({ ...values, guid: currentBot.value.guid });

		if (response?.status === 'success') {
			getBotsHandler();
			if (!infoModalIsOpen.value) {
				currentBot.value = null;
			} else {
				botsStore.currentBot = response.data;
			}
			editModalIsOpen.value = false;
		}
	};

	const deleteBotHandler = async () => {
		if (!currentBot.value) return;
		const response = await botsStore.deleteBot(currentBot.value?.guid);

		if (response?.status === 'success') {
			getBotsHandler();
			currentBot.value = null;
			deleteModalIsOpen.value = false;
		}
	};

	getBotsHandler();
	dictionariesStore.getCoins();
	dictionariesStore.getExchanges();

	onMounted(() => {
		pageReqInterval.value = setInterval(() => {
			if (searchBotValue.value && botsList.value.length === 0) {
				return;
			}
			getBotsHandler(false);
		}, 20000);
	});

	onUnmounted(() => {
		if (pageReqInterval.value) {
			clearInterval(pageReqInterval.value);
			pageReqInterval.value = null;
		}
	});
</script>
<style lang="scss">
	.bots {
		.list {
			cursor: pointer;
		}
	}
</style>
<style scoped lang="scss">
	.bots {
		display: flex;
		flex-direction: column;
		height: 100%;
		.body {
			height: 100%;

			.icon {
				cursor: pointer;
				height: 27px;
				width: 27px;
				padding: 6px;
			}

			.grid {
				cursor: pointer;
			}
		}

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
