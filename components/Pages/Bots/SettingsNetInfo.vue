<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:isNeedOverlay="false"
		class="modal__mobile"
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
				<div class="wrapper">
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

					<TypographyKTypographyBody5
						color="var(--color_font_black_wite)"
						font-type="bold"
					>
						{{ bot?.last || '0' }}
					</TypographyKTypographyBody5>
				</div>
				<div class="max-position">
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
			<UiButton
				:size="ButtonSizeType.extra_small"
				:color="ButtonType.outline"
				border-color="var(--color_font_grey_grey_2)"
				background-color="var(--white)"
				class="btn__open-deal"
				:button-padding="'8px 12px'"
				@click="startDealForFirstStep()"
				v-if="steps.length && steps?.[0]?.status === 0"
			>
				<TypographyKTypographyBody6
					color="var(--color_font_grey_grey_2)"
					font-type="bold"
				>
					{{ $t('bots-modal-settings-open-position-btn') }}
				</TypographyKTypographyBody6>
			</UiButton>
		</div>
		<div
			class="body"
			ref="refBodyNet"
		>
			<div
				class="step"
				v-for="(step, index) in steps"
				v-if="steps.length"
				:key="step.guid"
			>
				<div
					class="btn__action"
					v-if="!editStep?.[step.guid]"
				>
					<UiButton
						:disabled="Object.keys(editStep).length"
						:custom-style="{ padding: '0px', height: 'fit-content', width: 'fit-content' }"
						@click="editStepHandler(step)"
					>
						<UiIcon
							class="btn__edit"
							name="edit_v2"
							color="var(--color_font_black_wite)"
							height="26"
							width="26"
						/>
					</UiButton>
				</div>
				<div
					class="btn__action"
					v-else-if="editStep?.[step.guid]"
				>
					<UiIcon
						name="close_v2"
						height="26"
						width="26"
						color="var(--color_font_black_wite)"
						class="cancel"
						@click="cancelEditHandler(editStep[step.guid])"
					/>
					<UiButtonIcon
						:background="'transparent'"
						padding="0px"
						:disabled="botStepsStore.loading.actionBotSteps"
						@click="applyEditHandler(index, editStep[step.guid])"
					>
						<UiIcon
							height="26"
							width="26"
							name="confirm"
							color="var(--primary-2)"
							class="confirm"
						/>
					</UiButtonIcon>
					<UiIcon
						name="delete"
						color="var(--color_font_black_wite)"
						height="26"
						width="26"
						class="btn__delete"
						@click="openDeleteStepModal(step, index)"
					/>
				</div>
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
				<div class="step__body">
					<div class="group">
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-buy') }}, {{ step.buy_percent }}%</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].buy_percent"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<TypographyKTypographyBody4
								color="var(--color_font_black_wite)"
								font-type="bold"
								v-else
							>
								{{ step?.buy_currency }}
							</TypographyKTypographyBody4>
						</div>
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-sell') }}, {{ step.sell_percent }}%</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].sell_percent"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<TypographyKTypographyBody4
								color="var(--color_font_black_wite)"
								font-type="bold"
								v-else
							>
								{{ step?.sell_currency }}
							</TypographyKTypographyBody4>
						</div>
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-volume') }}, USDT</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].quantity"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<div
								class="quantity"
								v-else
							>
								<TypographyKTypographyBody4
									color="var(--color_font_black_wite)"
									font-type="bold"
								>
									{{ step?.quantity }}
								</TypographyKTypographyBody4>

								<TypographyKTypographyBody6
									v-if="step.pnl"
									:color="step.pnl > 0 ? 'var(--primary)' : 'var(--crimson)'"
									font-type="bold"
									>{{ getValueWithPlusOrMinus(step.pnl) }}</TypographyKTypographyBody6
								>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="step"
				v-for="(step, index) in newSteps"
				v-if="newSteps.length"
				:key="step.guid"
			>
				<div
					class="btn__action"
					v-if="!editStep?.[step.guid]"
				>
					<UiButton
						:disabled="Object.keys(editStep).length"
						:custom-style="{ padding: '0px', height: 'fit-content', width: 'fit-content' }"
						@click="editStepHandler(step)"
					>
						<UiIcon
							class="btn__edit"
							name="edit_v2"
							color="var(--color_font_black_wite)"
							height="26"
							width="26"
						/>
					</UiButton>
				</div>
				<div
					class="btn__action"
					v-else-if="editStep?.[step.guid]"
				>
					<UiIcon
						name="close_v2"
						height="26"
						width="26"
						class="cancel"
						color="var(--color_font_black_wite)"
						@click="cancelEditHandler(editStep[step.guid])"
					/>
					<UiButtonIcon
						:background="'transparent'"
						padding="0px"
						:disabled="botStepsStore.loading.actionBotSteps"
						@click="applyEditHandler(index, editStep[step.guid])"
					>
						<UiIcon
							height="26"
							width="26"
							name="confirm"
							color="var(--primary-2)"
							class="confirm"
						/>
					</UiButtonIcon>
					<UiIcon
						name="delete"
						color="var(--color_font_black_wite)"
						height="26"
						width="26"
						class="btn__delete"
						@click="openDeleteStepModal(step, index)"
					/>
				</div>
				<div class="step__header">
					<TypographyKTypographyBody4
						color="var(--color_font_black_wite)"
						font-type="semi-bold"
						>{{ $t('bots-modal-settings-step') }} {{ step?.step || steps.length + 1 }}</TypographyKTypographyBody4
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
				<div class="step__body">
					<div class="group">
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-buy') }}, {{ step.buy_percent }}%</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].buy_percent"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<TypographyKTypographyBody4
								color="var(--color_font_black_wite)"
								font-type="bold"
								v-else
							>
								{{ step?.buy_currency }}
							</TypographyKTypographyBody4>
						</div>
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-sell') }}, {{ step.sell_percent }}%</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].sell_percent"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<TypographyKTypographyBody4
								color="var(--color_font_black_wite)"
								font-type="bold"
								v-else
							>
								{{ step?.sell_currency }}
							</TypographyKTypographyBody4>
						</div>
						<div class="column">
							<TypographyKTypographyBody6
								color="var(--color_font_pur_pur)"
								font-type="medium"
								>{{ $t('bots-modal-settings-field-volume') }}, USDT</TypographyKTypographyBody6
							>
							<div
								class="column__input"
								v-if="editStep?.[step.guid]"
							>
								<UiInput
									v-model="editStep[step.guid].quantity"
									placeholder=""
									max-width="120px"
									background-color-input="var(--violet-6)"
									:input-special-style="{ fontSize: '14px' }"
									:input-wrapper-special-style="{ padding: '9px' }"
									border-width-input="0px"
									height="34px"
									:number-only="true"
									:is-number-only-allow-dots="true"
								/>
							</div>
							<div
								class="quantity"
								v-else
							>
								<TypographyKTypographyBody4
									color="var(--color_font_black_wite)"
									font-type="bold"
								>
									{{ step?.quantity }}
								</TypographyKTypographyBody4>

								<TypographyKTypographyBody6
									v-if="step.pnl"
									:color="step.pnl > 0 ? 'var(--primary)' : 'var(--crimson)'"
									font-type="bold"
									>{{ getValueWithPlusOrMinus(step.pnl) }}</TypographyKTypographyBody6
								>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="list-empty"
				v-if="!isLoading && !steps.length && !newSteps.length"
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
					@click="addedStep"
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
		<template #custom-actions>
			<div class="actions">
				<UiButton
					:color="ButtonType.outline"
					:size="ButtonSizeType.small"
					@click="closeHandler"
				>
					<TypographyKTypographyBody4
						color="var(--color_boolean_black)"
						font-type="bold"
					>
						{{ $t('bots-modal-settings-cancel-btn') }}
					</TypographyKTypographyBody4>
				</UiButton>
				<UiButton
					:color="ButtonType.outline"
					:size="ButtonSizeType.small"
					:disabled="!isCanAddedStep"
					@click="addedStep"
				>
					<TypographyKTypographyBody4
						color="var(--color_boolean_black)"
						font-type="bold"
					>
						{{ $t('bots-modal-settings-btn-add') }}
					</TypographyKTypographyBody4>
				</UiButton>
			</div>
		</template>
	</UiModalMobile>
	<PagesBotsDeleteStepModal
		v-if="isOpenDeleteStepModal"
		v-model="isOpenDeleteStepModal"
		:step-info="currentDeleteStep"
		@delete="deleteStep"
	/>
</template>

<script setup lang="ts">
	import type { IBots } from '~/interfaces/bots';
	import type { IBotSteps } from '~/interfaces/botSteps';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useBotsStore } from '~/store/bots.store';
	import { useBotStepsStore } from '~/store/botSteps.store';
	import { getSplitPairToken } from '~/helpers/currency';
	import { getValueWithPlusOrMinus } from '~/helpers/transform';
	import { useNotificationStore } from '~/store/notification.store';

	const emits = defineEmits(['delete']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const editStep = ref({});
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
	const notificationStore = useNotificationStore();
	const pageReqInterval = ref<NodeJS.Timeout | null>(null);
	const steps = computed(() => botStepsStore.botStepsList || []);
	const newSteps = ref([]);
	const isCanAddedStep = ref(true);
	const refBodyNet = ref(null);
	const isOpenDeleteStepModal = ref(false);
	const currentDeleteStep = reactive<{ step: IBotSteps | null; index: number | null }>({ step: null, index: null });

	const getBotStepsHandler = async (isNeedLoad?: boolean) => {
		await botStepsStore.getBotSteps(props.bot?.guid, isNeedLoad);
	};

	const editStepHandler = (step: any) => {
		if (step?.custom_guid) {
			editStep.value = { [step.guid]: { ...step } };
			return;
		}
		editStep.value = { [step.guid]: { ...step } };
	};

	const coinName = computed(() => getSplitPairToken(props.bot.crypt_pair));

	const addedStep = async () => {
		isCanAddedStep.value = false;
		const custom_guid = new Date().getTime();
		const newStep = {
			bot_guid: props.bot.guid,
			custom_guid: custom_guid,
			guid: custom_guid,
			buy_percent: botStepsStore.botStepsList?.[botStepsStore.botStepsList?.length - 1]?.buy_percent || 0,
			buy_currency: 0,
			sell_percent: botStepsStore.botStepsList?.[botStepsStore.botStepsList?.length - 1]?.sell_percent || 0,
			sell_currency: 0,
			quantity: botStepsStore.botStepsList?.[botStepsStore.botStepsList?.length - 1]?.quantity || 0
		};
		// botStepsStore.botStepsList?.push(newStep);
		newSteps.value.push(newStep);
		editStepHandler(newStep);

		if (refBodyNet.value) {
			setTimeout(() => {
				refBodyNet.value.scrollBy({ top: 1000, behavior: 'smooth' });
			});
		}
	};

	const cancelEditHandler = (step: any) => {
		if (step?.custom_guid) {
			// botStepsStore.botStepsList = botStepsStore.botStepsList?.filter(
			// 	(botStep: IBotSteps) => botStep.guid !== step.guid
			// );
			newSteps.value = [];
			isCanAddedStep.value = true;
		}
		delete editStep.value[step.guid];
	};

	const applyEditHandler = async (index: number, step: IBotSteps) => {
		if (
			(step.step === 1 ||
				botStepsStore.botStepsList?.length === 1 ||
				(newSteps.value?.length === 1 && botStepsStore.botStepsList?.length === 0)) &&
			step.quantity < 10
		) {
			notificationStore.addNewAlert('Минимальное значение объёма для 1 шага должно быть не меньше 10', 3000);
			return;
		}
		if (step?.custom_guid) {
			const sendStep = { ...step };
			const response = await botStepsStore.addBotStep(sendStep);
			delete sendStep.guid;
			delete sendStep.custom_guid;
			delete editStep.value[step.guid];
			isCanAddedStep.value = true;
			newSteps.value = [];

			if (response.status === 'success') {
				getBotStepsHandler();
				getCurrentBotInfo(false);
			}
			return;
		}
		const response = await botStepsStore.updateBotStep(step);

		if (response.status === 'success') {
			delete editStep.value[step.guid];
			getBotStepsHandler();
			getCurrentBotInfo(false);
		}
	};

	const getCurrentBotInfo = async (isNeedLoad: boolean = true) => {
		await botsStore.getCurrentBotInfo(props.bot.guid, isNeedLoad);
	};

	const openDeleteStepModal = (step: IBotSteps, index: number) => {
		isOpenDeleteStepModal.value = true;
		currentDeleteStep.step = step;
		currentDeleteStep.index = index;
	};

	const deleteStep = async ({ step, index }: { step: IBotSteps; index: number }) => {
		if (step?.custom_guid) {
			// botStepsStore.botStepsList = botStepsStore.botStepsList?.filter(
			// 	(botStep: IBotSteps) => botStep.guid !== step.guid
			// );
			newSteps.value = [];
			delete editStep.value[step.guid];
			isCanAddedStep.value = true;
			isOpenDeleteStepModal.value = false;
			return;
		}
		const response = await botStepsStore.deleteBotStep(step.guid);

		if (response.status === 'success') {
			await getBotStepsHandler();
			getCurrentBotInfo(false);
			delete editStep.value[step.guid];
			isCanAddedStep.value = true;
			isOpenDeleteStepModal.value = false;
		}
	};

	const startDealForFirstStep = async () => {
		const response = await botsStore.startDealForFirstStep(props.bot.guid);

		if (response.status === 'success') {
			getBotStepsHandler();
		}
	};

	const closeHandler = () => {
		modelValue.value = false;
	};

	getBotStepsHandler();

	onMounted(() => {
		pageReqInterval.value = setInterval(() => {
			getBotStepsHandler(false);
		}, 10000);
	});

	onUnmounted(() => {
		botStepsStore.botStepsList = [];

		if (pageReqInterval.value) {
			clearInterval(pageReqInterval.value);
			pageReqInterval.value = null;
		}
	});
</script>

<style scoped lang="scss">
	.loading {
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
			border: 1px solid var(--purple);
		}
	}
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.header {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;

			&__info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				width: 100%;
				gap: 5px;

				.wrapper {
					display: flex;
					align-items: center;
					gap: 5px;
				}

				.max-position {
					display: flex;
					flex-wrap: wrap;
					gap: 5px;
					justify-content: flex-end;
				}

				.icon {
					margin-left: 5px;
				}
			}

			.btn__open-deal {
				position: absolute;
				bottom: -25px;
				right: 00px;
				width: 110px;
				max-width: 110px;
			}
		}

		.actions {
			display: flex;
			justify-content: space-between;
			height: 40px;
			gap: 10px;

			.ui-button {
				width: 100%;
			}
		}

		.body {
			margin: 45px 0px 20px 0px;
			padding-right: 5px;
			margin-right: -5px;
			height: calc(100% - 100px);
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 23px;

			.step {
				position: relative;
				display: flex;
				flex-direction: column;
				gap: 10px;
				border-bottom: 1px solid var(--violet-5);
				padding-bottom: 10px;

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

				.btn__action {
					display: flex;
					align-items: center;
					gap: 12px;
					position: absolute;
					top: -6px;
					right: 5px;

					.btn__delete {
						cursor: pointer;
						padding: 5px;
					}

					.btn__edit {
						cursor: pointer;
						padding: 5px;
						margin-right: 7px;
					}

					.cancel {
						padding: 7px;
						cursor: pointer;
					}

					.confirm {
						cursor: pointer;
					}
				}

				&__body {
					display: flex;
					flex-direction: column;
					gap: 18px;

					.quantity {
						display: flex;
						gap: 5px;
						align-items: center;
					}

					.group {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;
						grid-template-columns: 1fr 1fr 1fr;
						width: 100%;

						.column__input {
							width: 90%;
						}

						.column {
							display: flex;
							flex-direction: column;
							width: 33.3%;
							gap: 11px;

							.row {
								display: flex;
								align-items: center;
								gap: 11px;
							}
						}
					}
				}
			}
		}

		.header {
			padding-bottom: 20px;
			border-bottom: 1px solid var(--violet-5);
		}
	}
</style>
