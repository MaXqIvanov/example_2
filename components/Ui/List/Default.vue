<template>
	<div
		class="list"
		v-for="item in items"
		:key="item?.id || item?.guid"
	>
		<div class="info">
			<slot
				name="item"
				:item="item"
			/>
		</div>
		<div class="actions">
			<slot
				name="custom-action"
				:item="item"
			/>
			<UiIcon
				name="edit_v2"
				width="14"
				height="14"
				color="var(--color_icon_black_pur)"
				@click="openEditModal(item)"
			/>
			<UiIcon
				name="delete"
				width="14"
				height="14"
				color="var(--color_icon_black_pur)"
				@click="openDeleteModal(item)"
			/>
		</div>
		<div
			v-if="isNeedSignalLine"
			class="signal"
			:style="{ width: settingsSignalLine(item).width, borderBottom: settingsSignalLine(item).borderBottom }"
		></div>
	</div>
	<div
		class="list-empty"
		v-if="items?.length === 0 && !isLoading && !searchPattern"
	>
		<UiIcon
			name="list-empty-new"
			folder="navigation-element"
			height="47"
			width="47"
			color="var(--purple-2)"
		/>
		<TypographyKTypographyBody4
			class="title"
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ titleEmpty }}</TypographyKTypographyBody4
		>
		<UiButton
			:color="ButtonType.outline"
			class="button__added"
			:size="ButtonSizeType.small"
			@click="openAddedModal"
		>
			<TypographyKTypographyBody4
				color="var(--color_button_font_black)"
				font-type="bold"
			>
				{{ $t('bots-list-default-btn-added') }}
			</TypographyKTypographyBody4>
		</UiButton>
	</div>
	<div
		class="loading"
		v-else-if="isLoading"
	>
		<UiLoader
			:radius="20"
			color="var(--primary)"
			:circle-width="2"
		/>
	</div>
	<div
		class="search__empty"
		v-else-if="searchPattern && items.length === 0"
	>
		<TypographyKTypographyBody3
			color="var(--color_font_black_wite)"
			font-type="bold"
		>
			{{ $t('bots-list-default-search-empty') }}
		</TypographyKTypographyBody3>
		<UiButton
			:color="ButtonType.outline"
			class="button__added"
			:size="ButtonSizeType.small"
			@click="resetSearch"
		>
			<TypographyKTypographyBody4
				color="var(--color_button_font_black)"
				font-type="bold"
			>
				{{ $t('bots-list-default-search-drop') }}
			</TypographyKTypographyBody4>
		</UiButton>
	</div>
</template>

<script setup lang="ts">
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';

	const emits = defineEmits(['openEditModal', 'openAddedModal', 'openDeleteModal', 'resetSearch']);
	const props = withDefaults(
		defineProps<{
			items: any[];
			isLoading: boolean;
			titleEmpty: string;
			isNeedSignalLine: boolean;
			searchPattern?: boolean;
		}>(),
		{
			isLoading: false,
			isNeedSignalLine: false,
			titleEmpty: 'Список пуст'
		}
	);

	const settingsSignalLine = (item: any) => {
		let percent = Math.abs(item.procent);

		if (percent > 100) percent = 100;

		if (item.procent >= 0) {
			return { width: `${percent}%`, borderBottom: '2px solid var(--primary)' };
		}
		return { width: `${percent}%`, borderBottom: '2px solid var(--crimson)' };
	};

	const openEditModal = (item: any) => {
		emits('openEditModal', item);
	};

	const openDeleteModal = (item: any) => {
		emits('openDeleteModal', item);
	};

	const openAddedModal = () => {
		emits('openAddedModal', '');
	};

	const resetSearch = () => {
		emits('resetSearch', '');
	};
</script>

<style scoped lang="scss">
	.search__empty {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 20px;
		height: 100%;
	}
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.list-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 160px;

		.title {
			margin-top: 16px;
		}
		.button__added {
			margin-top: 23px;
			border: 1px solid var(--color_button_font_black);
		}
	}
	.list {
		position: relative;
		display: flex;
		justify-content: space-between;
		gap: 20px;
		border-bottom: 1px solid var(--gray-5);
		margin-bottom: 15px;

		.signal {
			position: absolute;
			bottom: -1px;
			left: 0px;
		}

		.info {
			width: 100%;
		}

		.actions {
			position: absolute;
			top: 0px;
			right: 0px;
			height: fit-content;
			margin-top: 0px;
			display: flex;
			gap: 5px;
			width: max-content;

			.icon {
				cursor: pointer;
				height: 27px;
				width: 27px;
				padding: 6px;
			}
		}

		&:last-child {
			margin-bottom: 0px;
		}
	}
</style>
