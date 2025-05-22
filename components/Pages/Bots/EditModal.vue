<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		:titleBtnSave="$t('bots-modal-save-btn')"
		:isDontNeedCloseWhenSave="true"
		:isNeedFixedModalWithIfElseBlock="isNeedFixedModalWithIfElseBlock"
		:z-index="zIndex"
		@save="saveHandler"
	>
		<!-- 		:left-position-default="leftPositionDefault" -->
		<TypographyKTypographyBody4
			color="var(--color_font_black_wite)"
			font-type="bold"
			>{{ $t('bots-modal-edit-title') }}</TypographyKTypographyBody4
		>
		<div class="wrapper">
			<UiInput
				:label="$t('bots-modal-label-description')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				v-model="description"
				:border-width-input="errorField.description ? '1px' : '0px'"
				:error="errorField.description"
				@blur="clearError(`description`)"
			/>
			<UiSelect
				:model-value="keyValue"
				:label="$t('bots-modal-lable-choose-key')"
				max-width="none"
				the-object-to-be-displayed="description"
				:items="[]"
				:error="errorField.keyValue"
				@blur="clearError(`keyValue`)"
				@click="openChooseKeyListModal"
			/>
			<UiSelectMap
				:model-value="exchange"
				:label="$t('bots-modal-label-choose-exchange')"
				max-width="none"
				:visibleItems="dictionariesStore.exchangeList"
				:items="dictionariesStore.exchangeList"
				:error="errorField.exchange"
				@blur="clearError(`exchange`)"
				@click="openChooseExchangeModal"
			/>
			<UiSelectMap
				:model-value="coin"
				:label="$t('bots-modal-label-choose-coin')"
				max-width="none"
				:visibleItems="dictionariesStore.coinList"
				:items="dictionariesStore.coinList"
				:the-object-to-be-displayed="'value'"
				:error="errorField.coin"
				@blur="clearError(`coin`)"
				@click="openChooseCoinModal"
			/>
			<UiInput
				:label="$t('bots-modal-label-choose-upper-limit')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				:number-only="true"
				:is-number-only-allow-dots="true"
				v-model="price_limit_high"
				:border-width-input="errorField.price_limit_high ? '1px' : '0px'"
				:error="errorField.price_limit_high"
				@blur="clearError(`price_limit_high`)"
			/>
			<UiInput
				:label="$t('bots-modal-label-choose-lower-limit')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				:number-only="true"
				:is-number-only-allow-dots="true"
				v-model="price_limit_low"
				:border-width-input="errorField.price_limit_low ? '1px' : '0px'"
				:error="errorField.price_limit_low"
				@blur="clearError(`price_limit_low`)"
			/>
			<UiInput
				:label="$t('bots-modal-label-timeout')"
				max-width="none"
				background-color-input="var(--violet-6)"
				:input-special-style="{ fontSize: '15px' }"
				:number-only="true"
				v-model.number="timeout_between_buy_steps"
				:border-width-input="errorField.timeout_between_buy_steps ? '1px' : '0px'"
				:error="errorField.timeout_between_buy_steps"
				@blur="clearError(`timeout_between_buy_steps`)"
			/>
			<div class="switch-wrapper">
				<TypographyKTypographyBody4
					color="var(--color_font_black_wite)"
					font-type="medium"
					>{{ $t('bots-modal-label-state') }}</TypographyKTypographyBody4
				>
				<UiCheckBoxSwitch v-model="is_enable" />
			</div>
		</div>
	</UiModalMobile>
	<CommonModalsChooseExchange
		v-if="isChooseExchangeOpen"
		v-model="isChooseExchangeOpen"
		@chooseItem="chooseExchange"
	/>
	<CommonModalsChooseCoin
		v-if="isChooseCoinOpen"
		v-model="isChooseCoinOpen"
		@chooseItem="chooseCoin"
	/>
	<CommonModalsChooseKeyList
		v-if="isChooseKeyListOpen"
		v-model="isChooseKeyListOpen"
		@chooseItem="chooseKey"
	/>
</template>

<script setup lang="ts">
	import { VALIDATE_RULES, validator } from '~/helpers/validate';
	import type { IBots } from '~/interfaces/bots';
	import type { ICoin, IExchange } from '~/interfaces/dictionaries';
	import type { IKeys } from '~/interfaces/keys';
	import { useBotsStore } from '~/store/bots.store';
	import { useDictionariesStore } from '~/store/dictionaries.store';
	import { useKeysStore } from '~/store/keys.store';

	const emits = defineEmits(['save']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			item: IBots;
			isNeedFixedModalWithIfElseBlock?: boolean;
			zIndex?: number;
			leftPositionDefault?: string;
		}>(),
		{}
	);
	const dictionariesStore = useDictionariesStore();
	const keysStore = useKeysStore();
	const botsStore = useBotsStore();

	const description = ref('');
	const exchange = ref<IExchange | null>(null);
	const coin = ref<ICoin | null>(null);
	const price_limit_low = ref('');
	const price_limit_high = ref('');
	const isChooseExchangeOpen = ref(false);
	const isChooseCoinOpen = ref(false);
	const isChooseKeyListOpen = ref(false);
	const is_enable = ref(false);
	const timeout_between_buy_steps = ref<string | null>(null);
	const key = ref<IKeys | null>(null);
	const keyValue = computed(() => {
		if (key.value?.guid) {
			return key.value;
		}
		return keysStore.keyList?.find((value) => value.guid === key.value);
	});
	const errorField = ref({
		coin: { status: false, msg: '' },
		exchange: { status: false, msg: '' },
		keyValue: { status: false, msg: '' },
		description: { status: false, msg: '' },
		price_limit_low: { status: false, msg: '' },
		price_limit_high: { status: false, msg: '' },
		timeout_between_buy_steps: { status: false, msg: '' }
	});

	const getKeysHandler = async () => {
		await keysStore.getKeys({ cachedTime: 5 });
	};

	const getBotHandler = async () => {
		const response = await botsStore.getCurrentBotInfoForEdit(props.item.guid);

		if (response.status === 'success') {
			description.value = response.data?.description || '';
			key.value = response.data?.token_guid;
			exchange.value = response.data?.stock_id || null;
			coin.value = response.data?.coin_id || null;
			price_limit_high.value = `${response.data?.price_limit_high || ''}`;
			price_limit_low.value = `${response.data?.price_limit_low || ''}`;
			is_enable.value = response.data?.is_enable || false;
			timeout_between_buy_steps.value = `${response.data?.timeout_between_buy_steps || ''}`;
		}
	};

	const openChooseExchangeModal = () => {
		isChooseExchangeOpen.value = true;
	};
	const openChooseCoinModal = () => {
		isChooseCoinOpen.value = true;
	};
	const openChooseKeyListModal = () => {
		isChooseKeyListOpen.value = true;
	};

	const clearError = (type: string) => {
		errorField.value = { ...errorField.value, [type]: { status: false } };
	};

	const validateHandler = () => {
		const arrayRules: Array<{
			field: string;
			value: string | boolean;
			rules: VALIDATE_RULES[];
		}> = [
			{ field: 'coin', value: coin.value, rules: [VALIDATE_RULES.required] },
			{ field: 'exchange', value: exchange.value, rules: [VALIDATE_RULES.required] },
			{ field: 'keyValue', value: keyValue.value, rules: [VALIDATE_RULES.required] },
			{ field: 'description', value: description.value, rules: [VALIDATE_RULES.required] }
			// { field: 'price_limit_low', value: price_limit_low.value, rules: [VALIDATE_RULES.required] },
			// { field: 'price_limit_high', value: price_limit_high.value, rules: [VALIDATE_RULES.required] },
			// { field: 'timeout_between_buy_steps', value: timeout_between_buy_steps.value, rules: [VALIDATE_RULES.required] }
		];
		arrayRules.forEach((item) => {
			errorField.value = { ...errorField.value, [item.field]: validator(item.value, item.rules)[0] };
		});
	};

	const saveHandler = () => {
		validateHandler();
		if (!Object.values(errorField.value).find((item) => item.status)) {
			emits('save', {
				token_guid: key.value?.guid || key.value,
				description: description.value,
				stock_id: exchange.value,
				coin_id: coin.value,
				is_enable: is_enable.value,
				...(price_limit_low.value && { price_limit_low: price_limit_low.value }),
				...(price_limit_high.value && { price_limit_high: price_limit_high.value }),
				...(timeout_between_buy_steps.value && { timeout_between_buy_steps: timeout_between_buy_steps.value })
			});
			modelValue.value = false;
		}
	};

	const chooseExchange = (item: IExchange) => {
		exchange.value = item;
	};

	const chooseCoin = (item: ICoin) => {
		coin.value = item;
	};

	const chooseKey = (item: IKeys) => {
		key.value = item;
	};

	getBotHandler();
	getKeysHandler();
</script>

<style scoped lang="scss">
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.input__secret {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin-bottom: -10px;
		}

		.wrapper {
			display: flex;
			flex-direction: column;
			overflow: auto;
			gap: 17px;
			margin-top: 20px;
			padding-right: 10px;
			margin-right: -10px;

			.switch-wrapper {
				margin-top: 0px;
				display: flex;
				align-items: center;
				gap: 14px;
			}
		}
	}
</style>
