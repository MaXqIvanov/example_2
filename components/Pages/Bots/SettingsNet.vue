<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		class="modal__mobile"
		:isNeedOverlay="false"
		customPadding="20px 28px 20px 28px"
	>
		<!-- 		:leftPositionDefault="'calc(50% - 5px)'" -->
		<div class="header">
			<TypographyKTypographyBody4
				color="var(--color_font_black_wite)"
				font-type="bold"
				>{{ $t('bots-modal-settings-title') }}</TypographyKTypographyBody4
			>
			<div class="header__info">
				<UiImage
					:src="useRuntimeConfig().public.staticUrl + '/' + bot?.logo"
					:defaultNameIcon="'EMPTY'"
					:defaultFolderIcon="'crypto'"
					:alt="bot?.value"
					height="22px"
					width="22px"
					br-radius="50%"
				/>
				<TypographyKTypographyBody4
					color="var(--color_font_black_wite)"
					font-type="bold"
				>
					{{ bot.description }}({{ coinName.first }})
				</TypographyKTypographyBody4>
				<TypographyKTypographyBody4
					color="var(--color_font_black_wite)"
					font-type="extra-bold"
				>
					{{ bot?.last || '0' }}
				</TypographyKTypographyBody4>
			</div>
		</div>
		<div
			class="body"
			ref="refBodyNet"
		>
			<div class="body__info">
				<div class="body__title">
					<TypographyKTypographyBody5
						color="var(--color_font_currency)"
						font-type="bold"
						>{{ $t('bots-modal-settings-available-balance') }} USDT</TypographyKTypographyBody5
					>
					<TypographyKTypographyBody5
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ bot?.available_balance }}</TypographyKTypographyBody5
					>
				</div>
				<div class="body__title body__title_revert">
					<TypographyKTypographyBody5
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ $t('bots-modal-settings-max-position') }}</TypographyKTypographyBody5
					>
					<TypographyKTypographyBody5
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ bot?.max_usdt }}</TypographyKTypographyBody5
					>
				</div>
			</div>
			<div
				class="step"
				v-for="(step, index) in steps"
				v-if="steps.length"
				:key="step?.guid"
			>
				<div class="step__header">
					<TypographyKTypographyBody4
						color="var(--color_font_black_wite)"
						font-type="semi-bold"
						>{{ $t('bots-modal-settings-step') }} {{ step?.step || index + 1 }}</TypographyKTypographyBody4
					>
					<div class="status">
						<TypographyKTypographyBody6
							color="var(--color_font_pur_pur)"
							font-type="medium"
							>{{ $t('bots-modal-settings-status-title') }}</TypographyKTypographyBody6
						>
						<UiStatusCurrency
							:status="step?.status"
							:statusText="step.state_text"
							class="value"
						/>
					</div>
				</div>
				<div class="step__actions">
					<!-- <UiButtonIcon
						:disabled="!stepChanges?.[step.guid]"
						@click="updateStep(step, index)"
						padding="0px"
						background="transparent"
					>
						<UiIcon
							name="success"
							color="var(--primary)"
							height="16"
							width="16"
							class="btn__update"
						/>
					</UiButtonIcon> -->
					<UiIcon
						name="delete"
						color="var(--color_font_black_wite)"
						height="16"
						width="16"
						class="btn__delete"
						@click="openDeleteStepModal(step, index)"
					/>
				</div>
				<div class="step__body">
					<div class="input-block">
						<UiInput
							v-model="step.buy_percent"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.guid}_buy_percent`]"
							@blur="clearError(`${step.guid}_buy_percent`)"
							@input="stepChangesHandler(step)"
						>
							<template #right-icon>
								<UiIcon
									name="percent"
									color="var(--violet-7)"
									width="12"
									height="18"
								/>
							</template>
						</UiInput>
						<div class="info">
							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ $t('bots-modal-settings-field-buy') }}</TypographyKTypographyBody6
							>

							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ step?.buy_currency }}{{ baseCurrency }}</TypographyKTypographyBody6
							>
						</div>
					</div>
					<div class="input-block">
						<UiInput
							v-model.number="step.sell_percent"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.guid}_sell_percent`]"
							@blur="clearError(`${step.guid}_sell_percent`)"
							@input="stepChangesHandler(step)"
						>
							<template #right-icon>
								<UiIcon
									name="percent"
									color="var(--violet-7)"
									width="12"
									height="18"
								/>
							</template>
						</UiInput>
						<div class="info">
							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ $t('bots-modal-settings-field-sell') }}</TypographyKTypographyBody6
							>

							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ step.sell_currency }}{{ baseCurrency }}</TypographyKTypographyBody6
							>
						</div>
					</div>
					<div class="input-block">
						<UiInput
							v-model.number="step.quantity"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.guid}_quantity`]"
							@blur="clearError(`${step.guid}_quantity`)"
							@input="stepChangesHandler(step)"
						>
						</UiInput>
						<TypographyKTypographyBody6
							color="var(--gray-5)"
							font-type="semi-bold"
							>{{ $t('bots-modal-settings-field-volume') }} USDT</TypographyKTypographyBody6
						>
					</div>
				</div>
			</div>
			<div
				v-if="emptyStep.length"
				v-for="(step, index) in emptyStep"
				class="step"
			>
				<TypographyKTypographyBody4
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('bots-modal-settings-step') }} {{ steps.length + index + 1 }}</TypographyKTypographyBody4
				>
				<div class="step__actions">
					<UiIcon
						name="delete"
						color="var(--color_font_black_wite)"
						height="16"
						width="16"
						class="btn__delete"
						@click="deleteEmptyStep(step, index)"
					/>
				</div>
				<div class="step__body">
					<div class="input-block">
						<UiInput
							v-model="step.buy_percent"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.custom_guid}_buy_percent`]"
							@blur="clearError(`${step.custom_guid}_buy_percent`)"
							@input="stepChangesHandler(step)"
						>
							<template #right-icon>
								<UiIcon
									name="percent"
									color="var(--violet-7)"
									width="12"
									height="18"
								/>
							</template>
						</UiInput>
						<div class="info">
							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ $t('bots-modal-settings-field-buy') }}</TypographyKTypographyBody6
							>
						</div>
					</div>
					<div class="input-block">
						<UiInput
							v-model.number="step.sell_percent"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.custom_guid}_sell_percent`]"
							@blur="clearError(`${step.custom_guid}_sell_percent`)"
							@input="stepChangesHandler(step)"
						>
							<template #right-icon>
								<UiIcon
									name="percent"
									color="var(--violet-7)"
									width="12"
									height="18"
								/>
							</template>
						</UiInput>
						<div class="info">
							<TypographyKTypographyBody6
								color="var(--gray-5)"
								font-type="semi-bold"
								>{{ $t('bots-modal-settings-field-sell') }}</TypographyKTypographyBody6
							>
						</div>
					</div>
					<div class="input-block">
						<UiInput
							v-model.number="step.quantity"
							background-color-input="var(--violet-6)"
							max-width="none"
							:number-only="true"
							:is-number-only-allow-dots="true"
							:input-wrapper-special-style="{ padding: '14px' }"
							:error="errorField?.[`${step.custom_guid}_quantity`]"
							@blur="clearError(`${step.custom_guid}_quantity`)"
							@input="stepChangesHandler(step)"
						>
						</UiInput>
						<TypographyKTypographyBody6
							color="var(--gray-5)"
							font-type="semi-bold"
							>{{ $t('bots-modal-settings-field-volume') }} USDT</TypographyKTypographyBody6
						>
					</div>
				</div>
			</div>
			<div
				class="list-empty"
				v-if="!isLoading && !emptyStep.length && !steps.length"
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
					>{{ $t('bots-modal-settings-steps-empty') }}</TypographyKTypographyBody4
				>
				<UiButton
					:color="ButtonType.outline"
					class="button__added"
					:size="ButtonSizeType.small"
					@click="addedEmptyStep"
				>
					<TypographyKTypographyBody4
						color="var(--purple)"
						font-type="bold"
					>
						{{ $t('bots-modal-settings-btn-add') }}
					</TypographyKTypographyBody4>
				</UiButton>
			</div>
			<div
				class="loading"
				v-else-if="isLoading"
			>
				<UiLoader
					color="var(--primary)"
					:circle-width="2"
					:radius="20"
				/>
			</div>
		</div>
		<div class="actions">
			<UiButton
				:color="ButtonType.outline"
				:size="ButtonSizeType.small"
				@click="addedEmptyStep"
				><TypographyKTypographyBody4
					color="var(--color_boolean_black)"
					font-type="bold"
					>{{ $t('bots-modal-settings-btn-add') }}</TypographyKTypographyBody4
				></UiButton
			>
			<UiButton
				:color="ButtonType.outline"
				:size="ButtonSizeType.small"
				@click="saveHandler"
				:is-loading="botStepsStore.loading.actionBotSteps"
				colorSpinner="linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.5))"
			>
				<TypographyKTypographyBody4
					color="var(--color_boolean_black)"
					font-type="bold"
				>
					{{ $t('bots-modal-settings-btn-save') }}
				</TypographyKTypographyBody4>
			</UiButton>
		</div>
		<template #custom-actions />
	</UiModalMobile>
	<PagesBotsDeleteStepModal
		v-if="isOpenDeleteStepModal"
		v-model="isOpenDeleteStepModal"
		:step-info="currentDeleteStep"
		@delete="deleteStep"
	/>
</template>

<script setup lang="ts">
	import { VALIDATE_RULES, validator } from '~/helpers/validate';
	import type { IBots } from '~/interfaces/bots';
	import type { IBotSteps } from '~/interfaces/botSteps';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useBaseStore } from '~/store/base.store';
	import { useBotStepsStore } from '~/store/botSteps.store';
	import { useNotificationStore } from '~/store/notification.store';
	import { getSplitPairToken } from '~/helpers/currency';
	import { useBotsStore } from '~/store/bots.store';

	const emits = defineEmits(['delete']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			height: string;
			isLoading?: boolean;
			bot: IBots;
		}>(),
		{ height: 'calc(100% - 119px)' }
	);

	const botStepsStore = useBotStepsStore();
	const botsStore = useBotsStore();
	const baseStore = useBaseStore();
	const notificationStore = useNotificationStore();
	const baseCurrency = computed(() => baseStore.baseCurrency);
	const emptyStep = ref<IBotSteps[]>([]);
	const stepChanges = ref<Record<string, IBotSteps>>({});
	const refBodyNet = ref(null);
	const errorField = ref<Record<string, { status: boolean; msg: string }>>({});
	const isOpenDeleteStepModal = ref(false);
	const currentDeleteStep = reactive<{ step: IBotSteps | null; index: number | null }>({ step: null, index: null });
	const steps = computed(() => botStepsStore.botStepsList || []);

	const clearError = (type: string) => {
		errorField.value = { ...errorField.value, [type]: { status: false } };
	};

	const coinName = computed(() => getSplitPairToken(props.bot?.crypt_pair));

	const validateHandler = () => {
		const arrayRules: Array<{
			field: string;
			value: string | boolean;
			rules: VALIDATE_RULES[];
		}> = Object.entries(stepChanges.value).map((step) => {
			const result = [
				{
					field: `${step[0]}_buy_percent`,
					value: step[1].buy_percent,
					rules: [VALIDATE_RULES.required]
				},
				{
					field: `${step[0]}_sell_percent`,
					value: step[1].sell_percent,
					rules: [VALIDATE_RULES.required]
				}
			];

			if (step[1]?.step === 1 || (steps.value.length === 0 && emptyStep.value.length === 1)) {
				result.push({
					field: `${step[0]}_quantity`,
					value: { value1: step[1].quantity, value2: 10 },
					rules: [VALIDATE_RULES.min],
					isDontNeedCheckField: true
				});
			}

			return result;
		});

		emptyStep.value.map((step) => {
			const result = [
				{
					field: `${step.custom_guid}_buy_percent`,
					value: step.buy_percent,
					rules: [VALIDATE_RULES.required]
				},
				{
					field: `${step.custom_guid}_sell_percent`,
					value: step.sell_percent,
					rules: [VALIDATE_RULES.required]
				},
				{
					field: `${step.custom_guid}_quantity`,
					value: step.quantity,
					rules: [VALIDATE_RULES.required]
				}
			];

			if (steps.value.length === 0 && emptyStep.value.length === 1) {
				result[2].rules = [VALIDATE_RULES.min];
				result[2].value = { value1: step.quantity, value2: 10 };
				result[2].isDontNeedCheckField = true;
			}

			arrayRules.push(result);
		});

		errorField.value = {};
		arrayRules.forEach((item) => {
			item.forEach((element) => {
				errorField.value = {
					...errorField.value,
					[element.field]: {
						...validator(element.value, element.rules, element.field, ' ', element?.isDontNeedCheckField)[0],
						customError: element?.isDontNeedCheckField
							? 'Минимальное значение объёма для 1 шага должно быть не меньше 10'
							: ''
					}
				};
			});
		});
	};

	const stepChangesHandler = (step: IBotSteps) => {
		if (step.guid || step?.custom_guid) {
			stepChanges.value = { ...stepChanges.value, [step.guid || step?.custom_guid]: step };
		}
	};

	const addedEmptyStep = () => {
		if (emptyStep.value.length) {
			emptyStep.value.push({
				custom_guid: new Date().getTime(),
				bot_guid: props.bot?.guid,
				buy_percent: emptyStep.value[emptyStep.value.length - 1]?.buy_percent || '',
				sell_percent: emptyStep.value[emptyStep.value.length - 1]?.sell_percent || '',
				quantity: emptyStep.value[emptyStep.value.length - 1]?.quantity || ''
			});
			stepChangesHandler(emptyStep.value[emptyStep.value.length - 1]);
		} else if (steps.value.length) {
			emptyStep.value.push({
				custom_guid: new Date().getTime(),
				bot_guid: props.bot?.guid,
				buy_percent: steps.value[steps.value.length - 1]?.buy_percent,
				sell_percent: steps.value[steps.value.length - 1]?.sell_percent,
				quantity: steps.value[steps.value.length - 1]?.quantity
			});
			stepChangesHandler(emptyStep.value[emptyStep.value.length - 1]);
		} else {
			emptyStep.value.push({
				custom_guid: new Date().getTime(),
				bot_guid: props.bot?.guid,
				buy_percent: '',
				sell_percent: '',
				quantity: ''
			});
		}

		if (refBodyNet.value) {
			setTimeout(() => {
				refBodyNet.value.scrollBy({ top: 1000, behavior: 'smooth' });
			});
		}
	};

	const openDeleteStepModal = (step: IBotSteps, index: number) => {
		isOpenDeleteStepModal.value = true;
		currentDeleteStep.step = step;
		currentDeleteStep.index = index;
	};

	const deleteEmptyStep = (step: IBotSteps, index: number) => {
		emptyStep.value.splice(index, 1);
		delete stepChanges.value[step.custom_guid];
	};

	const addedStep = async (step: IBotSteps) => {
		const response = await botStepsStore.addBotStep({ ...step });

		if (response.status === 'success') {
		}
	};

	const addedStepList = async (steps: IBotSteps[]) => {
		const response = await botStepsStore.addBotStepList(steps);

		if (response.status === 'success') {
		}
	};

	const getBotStepsHandler = async () => {
		await botStepsStore.getBotSteps(props.bot?.guid);
	};

	const updateStep = async (step: IBotSteps) => {
		const response = await botStepsStore.updateBotStep(step);
	};

	const deleteStep = async ({ step, index }: { step: IBotSteps; index: number }) => {
		const response = await botStepsStore.deleteBotStep(step.guid);

		if (response.status === 'success') {
			botStepsStore.botStepsList = botStepsStore.botStepsList?.filter(
				(cur_step: IBotSteps) => cur_step.guid !== step.guid
			);
			delete stepChanges.value[step.guid];
			isOpenDeleteStepModal.value = false;

			getCurrentBotInfo(false);
		}
	};

	const saveHandler = async () => {
		validateHandler();
		const error = Object.values(errorField.value).find((item) => item?.status);

		if (error?.status) {
			notificationStore.addNewAlert(error?.customError || 'Не все поля заполнены');
			return;
		}
		const funcList: CallableFunction[] = [];
		let addStepList: IBotSteps[] | [] = [];

		Object.entries(stepChanges.value).forEach(async (element) => {
			if (element[1]?.guid) {
				funcList.push(async () => {
					await updateStep(element[1]);
				});
			} else {
				addStepList.push(element[1]);
			}
		});

		if (addStepList.length > 0) {
			addStepList = addStepList.sort((step1, step2) => step1?.custom_guid - step2?.custom_guid);
			funcList.push(async () => await addedStepList(addStepList));
		}

		asyncAwaitWay(async () => {
			await getBotStepsHandler();
			getCurrentBotInfo(false);
			stepChanges.value = {};
			emptyStep.value = [];
		}, funcList);
	};

	async function asyncAwaitWay(callback: CallableFunction, funcList: CallableFunction[]) {
		const series = async () => {
			let results;
			for (let i = 0; i < funcList.length; i++) {
				results = await funcList[i]();
			}
			return results;
		};
		const result = await series();
		callback(result);
	}

	const getCurrentBotInfo = async (isNeedLoad: boolean = true) => {
		await botsStore.getCurrentBotInfo(props.bot.guid, isNeedLoad);
	};

	getBotStepsHandler();

	onUnmounted(() => {
		botStepsStore.botStepsList = [];
	});
</script>

<style scoped lang="scss">
	.loading {
		position: absolute;
		bottom: 55px;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		justify-content: center;
		align-content: center;
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
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.header {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;

			&__info {
				display: flex;
				align-items: center;
				gap: 5px;

				.icon {
					margin-left: 5px;
				}
			}
		}

		.actions {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			gap: 10px;

			.ui-button {
				width: 100%;
			}
		}

		.body {
			margin: 16px 0px 20px 0px;
			padding-right: 5px;
			margin-right: -5px;
			height: calc(100% - 100px);
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 23px;

			&__info {
				display: flex;
				gap: 10px;
				justify-content: space-between;
			}

			&__title {
				display: flex;
				flex-direction: column;
				gap: 6px;

				&_revert {
					text-align: right;
				}
			}

			.step {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 10px;

				&__header {
					display: flex;
					align-items: center;
					gap: 15px;

					.status {
						display: flex;
						align-items: center;
						gap: 10px;
					}
				}

				&__body {
					display: grid;
					grid-template-columns: 29% 29% calc(42% - 16px);
					gap: 8px;

					.input-block {
						width: 100%;
						display: flex;
						flex-direction: column;
						gap: 5px;

						.info {
							display: flex;
							justify-content: space-between;
							gap: 3px;
							margin: 0px 4px;
						}
					}
				}

				.step__actions {
					display: flex;
					gap: 10px;
					position: absolute;
					cursor: pointer;
					top: 0px;
					right: 0px;
				}
			}
		}

		.header {
			padding-bottom: 20px;
			border-bottom: 1px solid var(--violet-5);
		}
	}
</style>
