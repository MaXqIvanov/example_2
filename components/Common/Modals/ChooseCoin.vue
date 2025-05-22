<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:z-index="10000"
	>
		<div class="header">
			<TypographyKTypographyBody4
				color="var(--color_font_black_wite)"
				font-type="bold"
				>{{ $t('bots-modal-choose-coin') }}</TypographyKTypographyBody4
			>
			<UiInput
				v-model="search"
				height="40px"
				:input-wrapper-special-style="{ paddingRight: '10px' }"
				:input-special-style="{ fontSize: '14px' }"
				:keys-submit="[13]"
				@key-submit-actions="searchHandler"
			>
				<template #right-icon>
					<UiIcon
						name="search"
						@click="searchHandler"
					/>
				</template>
			</UiInput>
		</div>
		<div class="choose-exchange__body">
			<div
				class="wrapper"
				v-if="coinListSearch.size !== 0"
			>
				<div
					class="item"
					v-for="[key, value] in coinListSearch"
					:key="value.value"
					@click="chooseItem(key)"
				>
					<UiImage
						:src="useRuntimeConfig().public.staticUrl + '/' + value?.logo"
						:defaultNameIcon="'EMPTY'"
						:defaultFolderIcon="'crypto'"
						:alt="value?.value"
						height="22px"
						width="22px"
						br-radius="50%"
					/>{{ value.value }}
				</div>
			</div>
			<div
				class="wrapper"
				v-else
			>
				<div
					class="item"
					v-for="[key, value] in coinList"
					:key="value.value"
					@click="chooseItem(key)"
				>
					<UiImage
						:src="useRuntimeConfig().public.staticUrl + '/' + value?.logo"
						:defaultNameIcon="'EMPTY'"
						:defaultFolderIcon="'crypto'"
						:alt="value?.value"
						height="22px"
						width="22px"
						br-radius="50%"
					/>
					{{ value.value }}
				</div>
			</div>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import type { ICoin } from '~/interfaces/dictionaries';
	import { useDictionariesStore } from '~/store/dictionaries.store';
	import { useNotificationStore } from '~/store/notification.store';
	import { getSplitPairToken } from '~/helpers/currency';

	const emits = defineEmits(['chooseItem']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			height: string;
		}>(),
		{ height: 'calc(100% - 119px)' }
	);

	const dictionaries = useDictionariesStore();
	const notitficationStore = useNotificationStore();
	const isWasOpen = ref(false);
	const coinList = computed(() => {
		if (!isWasOpen.value) {
			setTimeout(() => {
				isWasOpen.value = true;
			}, 100);
			const arrayTmp = Array.from(dictionaries.coinList || []).slice(0, 30);
			const myMap = new Map(arrayTmp);
			return myMap;
		}
		return dictionaries.coinList || [];
	});
	const search = ref('');
	const coinListSearch = ref<Map<string, ICoin>>(new Map([]));

	const chooseItem = (item: ICoin) => {
		emits('chooseItem', item);
		modelValue.value = false;
	};

	const searchHandler = () => {
		if (search.value === '') {
			coinListSearch.value = new Map([]);
			return;
		}

		coinListSearch.value = new Map(
			[...coinList.value].filter(([k, v]) => {
				return v?.value?.toLowerCase()?.includes(search.value.toLocaleLowerCase());
			})
		);
		if (coinListSearch.value.size === 0) {
			notitficationStore.addNewAlert('Поиск не дал результатов');
		}
	};
</script>

<style scoped lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.choose-exchange__body {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
		border: 1px solid var(--purple-3);
		border-radius: 15px;
		height: calc(100% - 60px);
		padding: 10px;

		.wrapper {
			display: flex;
			flex-direction: column;
			gap: 20px;
			overflow-y: auto;
			padding: 10px 22px 10px 22px;

			.item {
				display: flex;
				align-items: center;
				gap: 5px;
				cursor: pointer;
				transition: background-color linear 0.02s;
				color: var(--color_font_black_wite);
				&:hover {
					background-color: var(--color_field_bottomsheet);
					padding: 10px 12px;
					margin: -10px -12px;
					border-radius: 12px;
					color: black;
				}
			}
		}
	}
</style>
