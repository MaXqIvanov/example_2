<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedBtnSave="false"
		class="modal__mobile"
		@save="changeStateBot"
	>
		<template
			#custom-actions
			v-if="botsStore.loading.currentBot"
		></template>
		<div
			class="loading"
			v-if="botsStore.loading.currentBot"
		>
			<UiLoader
				color="var(--primary)"
				:circle-width="2"
				:radius="20"
			/>
		</div>
		<div
			class="wrapper"
			v-else
		>
			<div class="header">
				<TypographyKTypographyBody5
					color="var(--color_font_grey_grey_2)"
					font-type="medium"
					>{{ item?.description }}</TypographyKTypographyBody5
				>
				<div class="content">
					<div class="pair">
						<UiImage
							:src="useRuntimeConfig().public.staticUrl + '/' + item?.logo"
							:defaultNameIcon="'EMPTY'"
							:defaultFolderIcon="'crypto'"
							:alt="item?.value"
							height="22px"
							width="22px"
							br-radius="50%"
						/>
						<TypographyKTypographyBody4
							color="var(--color_font_black_wite)"
							font-type="bold"
							>{{ item?.crypt_pair }}</TypographyKTypographyBody4
						>
						<TypographyKTypographyBody5
							color="var(--color_font_black_wite)"
							font-type="bold"
						>
							{{ currentBot?.last || '0' }}
						</TypographyKTypographyBody5>
					</div>
					<div class="value">
						<TypographyKTypographyBody4
							color="var(--color_font_currency)"
							font-type="bold"
						>
							{{ coinName?.second }}
						</TypographyKTypographyBody4>
						<div class="amout">
							<TypographyKTypographyBody4
								color="var(--color_font_black_wite)"
								class="balance"
								font-type="bold"
								>{{ currentBot?.sum_in_position }}</TypographyKTypographyBody4
							>
							<UiLabelPriceChanges :title="currentBot?.amount_pnl_usdt" />
						</div>
					</div>
				</div>
				<div class="actions">
					<div class="wrapper">
						<UiButton
							:color="getBtnSettings.color"
							:size="ButtonSizeType.small"
							button-padding="10px 13px"
							:custom-style="{ minWidth: '100px' }"
							:is-loading="botsStore.loading.changeStatus"
							colorSpinner="linear-gradient(90deg, rgba(0, -1, 0, 0.05), rgba(0, 0, 0, 0.15))"
							@click="changeStateBot"
						>
							<UiIcon
								:name="getBtnSettings.icon"
								:color="getBtnSettings.color"
								height="10"
								width="10"
								class="btn__pause"
							/>
							<TypographyKTypographyBody6
								:color="getBtnSettings.color"
								font-type="bold"
								>{{ $t(getBtnSettings.title) }}</TypographyKTypographyBody6
							>
						</UiButton>
					</div>
					<UiButton
						:color="ButtonType.outline"
						:size="ButtonSizeType.small"
						button-padding="10px 19px"
						:border-color="'var(--color_button_stroke_grey)'"
						@click="openSettingsNetModal"
					>
						<TypographyKTypographyBody6
							color="var(--color_button_stroke_grey)"
							font-type="bold"
							>{{ $t('bots-modal-info-btn-network') }}</TypographyKTypographyBody6
						>
					</UiButton>
				</div>
				<div class="switch-wrapper">
					<div class="switch">
						<TypographyKTypographyBody4
							color="var(--color_icon_black_wite)"
							font-type="medium"
							class="switch__title"
							v-html="$t('bots-modal-info-allow-sell-title')"
						></TypographyKTypographyBody4>
						<UiCheckBoxSwitch
							v-model="stopSell"
							:isDisabled="botsStore.loading.stopSell"
							@change="allowSellHandler"
						/>
					</div>
					<div
						class="switch"
						v-for="ext in extensionsInfo"
						:key="ext.FieldName"
						v-show="ext.IsActive"
					>
						<div class="switch__row-wrapper">
							<div class="switch__row">
								<TypographyKTypographyBody4
									color="var(--color_icon_black_wite)"
									font-type="medium"
									class="switch__title"
									v-html="ext.Title"
								></TypographyKTypographyBody4>
								<UiButtonIcon
									background="transparent"
									padding="5px 10px"
									class="button"
									@click="openModalInfo(ext.FieldName)"
								>
									<UiIcon
										name="question_circle"
										width="20"
										height="20"
										color="var(--color_icon_black_wite)"
									/>
								</UiButtonIcon>
							</div>
							<UiCheckBoxSwitch
								v-model="extensionBot[ext.FieldName]"
								:isDisabled="getExtensionLoading(ext.FieldName)"
								@change="changeExtension($event, ext.FieldName)"
							/>
						</div>
						<div class="switch__inputs_wrapper">
							<div
								class="switch__inputs"
								v-for="field in ext.Fields"
								v-if="extensionBot[ext.FieldName]"
							>
								<div
									class="field-edit"
									v-if="field.action === 'edit'"
								>
									<UiInput
										:label="field.title"
										v-model="extensionsField[field.field_name]"
										:number-only="field.type === 'numeric' ? true : false"
										:is-number-only-allow-dots="true"
										label-class="label_p-0"
										:id="`input_${field.field_name}`"
										:inputWrapperSpecialStyle="{ height: '32px', paddingLeft: '10px' }"
										:inputSpecialStyle="{ fontSize: '15px' }"
									/>
									<UiButton
										:color="ButtonType.primary"
										:size="ButtonSizeType.small"
										button-padding="11px 0px"
										:custom-style="{ minWidth: '100px' }"
										colorSpinner="linear-gradient(90deg, rgba(0, -1, 0, 0.05), rgba(0, 0, 0, 0.15))"
										@click="updateFieldCurrentBot(field)"
									>
										<TypographyKTypographyBody6
											:color="'var(--white)'"
											font-type="bold"
											>{{ $t('modal-confirm-btn') }}</TypographyKTypographyBody6
										>
									</UiButton>
								</div>

								<div
									class="item"
									v-else
								>
									<TypographyKTypographyBody4
										color="var(--color_icon_black_wite)"
										font-type="medium"
										class="title"
										>{{ field.title }}</TypographyKTypographyBody4
									>
									<TypographyKTypographyBody4
										color="var(--color_font_currency)"
										font-type="bold"
										class="value"
										>{{ currentBot[field.field_name] || '-' }}</TypographyKTypographyBody4
									>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="body">
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-position') }}, USDT</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						color="var(--color_font_currency)"
						font-type="bold"
						class="value"
						>{{ currentBot?.sum_in_position }} / {{ currentBot?.max_usdt }}</TypographyKTypographyBody4
					>
				</div>
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-realize-pnl') }}, USDT</TypographyKTypographyBody4
					>
					<div class="wrapper">
						<UiLabelPriceChanges
							:arrow-direction="
								`${currentBot?.sum_pofit_usdt}` == '0'
									? 'neutral'
									: `${currentBot?.sum_pofit_usdt}`?.includes('-')
										? 'down'
										: 'up'
							"
							:title="''"
						/>
						<TypographyKTypographyBody4
							color="var(--color_font_currency)"
							font-type="bold"
							class="value"
							>{{ currentBot?.sum_pofit_usdt }}</TypographyKTypographyBody4
						>
					</div>
				</div>
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-not-realize-pnl') }}, USDT</TypographyKTypographyBody4
					>
					<div class="wrapper">
						<UiLabelPriceChanges
							:arrow-direction="
								`${currentBot?.cur_pnl}` == '0' ? 'neutral' : `${currentBot?.cur_pnl}`?.includes('-') ? 'down' : 'up'
							"
							title=""
						/>
						<TypographyKTypographyBody4
							color="var(--color_font_currency)"
							font-type="bold"
							class="value"
						>
							{{ currentBot?.cur_pnl || 0 }}</TypographyKTypographyBody4
						>
					</div>
				</div>
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-count-deal') }}</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						color="var(--color_font_currency)"
						font-type="bold"
						class="value"
						>{{ currentBot?.finished_deals_count }}</TypographyKTypographyBody4
					>
				</div>
			</div>
			<div class="footer">
				<div class="item">
					<TypographyKTypographyBody5
						color="var(--color_font_grey_grey_2)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-avarage-price') }}</TypographyKTypographyBody5
					>
					<div class="value">
						<TypographyKTypographyBody3
							color="var(--color_icon_black_wite)"
							font-type="bold"
							class="amount"
							>{{ currentBot?.avg_price }}</TypographyKTypographyBody3
						>
					</div>
				</div>
				<div class="item">
					<TypographyKTypographyBody5
						color="var(--color_font_grey_grey_2)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-all-coins') }}</TypographyKTypographyBody5
					>
					<div class="value">
						<TypographyKTypographyBody3
							color="var(--color_icon_black_wite)"
							font-type="bold"
							class="amount"
							>{{ currentBot?.coins }}</TypographyKTypographyBody3
						>
					</div>
				</div>
			</div>
			<div class="footer-2">
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-upper-limit') }}</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						color="var(--color_font_currency)"
						font-type="bold"
						class="value"
						>{{ currentBot?.price_limit_high }}</TypographyKTypographyBody4
					>
				</div>
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--color_icon_black_wite)"
						font-type="medium"
						class="title"
						>{{ $t('bots-modal-info-under-limit') }}</TypographyKTypographyBody4
					>
					<TypographyKTypographyBody4
						color="var(--color_font_currency)"
						font-type="bold"
						class="value"
						>{{ currentBot?.price_limit_low }}</TypographyKTypographyBody4
					>
				</div>
				<div class="item">
					<TypographyKTypographyBody4
						color="var(--black)"
						font-type="medium"
						class="title"
					></TypographyKTypographyBody4>
					<UiButton
						:color="ButtonType.primary"
						:size="ButtonSizeType.extra_small"
						button-padding="11px 0px"
						:custom-style="{ minWidth: '100px' }"
						colorSpinner="linear-gradient(90deg, rgba(0, -1, 0, 0.05), rgba(0, 0, 0, 0.15))"
						@click="editBtnHandler"
					>
						<TypographyKTypographyBody6
							:color="'var(--white)'"
							font-type="bold"
							>{{ $t('bots-modal-info-change-btn') }}</TypographyKTypographyBody6
						>
					</UiButton>
				</div>
				<UiButton
					:color="ButtonType.delete"
					:size="ButtonSizeType.small"
					@click="openModalStopAndSellAllPosition"
				>
					<TypographyKTypographyBody5
						color="var(--white)"
						font-type="bold"
						>{{ $t('bots-btn-stop-and-sell-all-position') }}</TypographyKTypographyBody5
					>
				</UiButton>
			</div>
		</div>
		<UiModalConfirm
			v-model="isOpenModalStopAndSellAllPosition"
			v-if="isOpenModalStopAndSellAllPosition"
			:title="$t('bots-btn-stop-and-sell-all-for-bot-title')"
			:btnConfirmTitle="$t('modal-confirm-btn')"
			:is-loading="botsStore.loading.stopAndSellAllForBot"
			:maxWidth="'400px'"
			@save="confirmStopAndSellAllPosition"
		/>
		<PagesBotsInfoModalBase
			:fieldName="openFieldName"
			v-model:isOpen="isNeedOpenModalInfoBase"
			v-if="isNeedOpenModalInfoBase"
		/>
		<PagesBotsInfoModalHedging
			v-model:is-open="isNeedOpenModalInfoHedging"
			v-if="isNeedOpenModalInfoHedging"
		/>
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import { getSplitPairToken } from '~/helpers/currency';
	import type { IBots } from '~/interfaces/bots';
	import type { IFields } from '~/interfaces/profile';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useBotsStore } from '~/store/bots.store';
	import { useNotificationStore } from '~/store/notification.store';
	import { useProfileStore } from '~/store/profile.store';
	const emits = defineEmits(['get-bots', 'openSettingsNetModal', 'openEditModal']);
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });
	const props = withDefaults(
		defineProps<{
			item: IBots;
		}>(),
		{}
	);

	const botsStore = useBotsStore();
	const userProfile = useProfileStore();
	const notificationStore = useNotificationStore();
	const pageReqInterval = ref<NodeJS.Timeout | null>(null);
	const isNeedOpenModalInfoHedging = ref(false);
	const isOpenModalStopAndSellAllPosition = ref(false);
	const openFieldName = ref('');
	const isNeedOpenModalInfoBase = ref(false);
	const stopSell = ref(false);
	const extensionBot = ref<Record<string, boolean>>({});
	const isNeedLoadAllBots = ref(false);
	const extensionsInfo = computed(() => userProfile.profileInfo?.extensions);
	const extensionsField = ref({});

	const currentBot = computed(() => {
		return botsStore.currentBot;
	});
	const coinName = computed(() => {
		return getSplitPairToken(botsStore.currentBot?.crypt_pair || '');
	});

	const getBtnSettings = computed(() => {
		if (!currentBot.value?.is_enable) {
			return { title: 'bots-modal-info-btn-start', color: ButtonType.primary, icon: 'start' };
		} else return { title: 'bots-modal-info-btn-stop', color: ButtonType.delete, icon: 'pause_v2' };
	});

	const getCurrentBotInfo = async (isNeedLoad: boolean = true) => {
		await botsStore.getCurrentBotInfo(props.item.guid, isNeedLoad);
	};

	const openModalStopAndSellAllPosition = () => {
		isOpenModalStopAndSellAllPosition.value = !isOpenModalStopAndSellAllPosition.value;
	};

	const confirmStopAndSellAllPosition = async () => {
		const response = await botsStore.stopAndSellAllForBot(botsStore.currentBot?.guid || props.item.guid);
		isOpenModalStopAndSellAllPosition.value = false;
	};

	const getExtensionLoading = (field: string) => {
		return botsStore.loading?.[field];
	};

	const updateFieldCurrentBot = async (field: IFields) => {
		const getValue = document.querySelector(`#input_${field.field_name} input`).value;
		if (!getValue) return;

		const submitValue = field.type === 'numeric' ? Number(getValue) : getValue;
		await botsStore.updateBot({ guid: currentBot.value?.guid, [field.field_name]: submitValue });
		getCurrentBotInfo(false);
	};

	const changeStateBot = async () => {
		isNeedLoadAllBots.value = true;
		const response = await botsStore.changeStateBot(botsStore.currentBot?.guid || props.item.guid);

		if (response.status === 'success' && response.data?.data) {
			botsStore.currentBot = response.data.data;
		}
	};

	const allowSellHandler = async (value: boolean) => {
		isNeedLoadAllBots.value = true;
		const response = await botsStore.stopSellBotHandler(botsStore.currentBot?.guid || props.item.guid, stopSell.value);

		if (response.status === 'success') {
			botsStore.currentBot = response.data;
		} else {
			stopSell.value = !stopSell.value;
		}
	};

	const openModalInfo = (fieldName: string) => {
		if (fieldName === 'use_hedging') {
			openModalInfoHedging();
			return;
		}
		openFieldName.value = fieldName;
		isNeedOpenModalInfoBase.value = true;
	};

	const changeExtension = async (event: { target: { checked: boolean } }, fieldName: string) => {
		const checked = event.target.checked;
		const response = await botsStore.changeExtensionHandler(
			botsStore.currentBot?.guid || props.item.guid,
			fieldName,
			checked
		);

		if (response.status === 'success') {
		} else {
			extensionBot.value = { ...extensionBot.value, [fieldName]: !extensionBot.value?.[fieldName] };
		}
	};

	const openModalInfoHedging = () => {
		isNeedOpenModalInfoHedging.value = !isNeedOpenModalInfoHedging.value;
	};

	const openSettingsNetModal = () => {
		emits('openSettingsNetModal', currentBot.value);
	};

	const editBtnHandler = () => {
		emits('openEditModal', botsStore.currentBot);
	};

	getCurrentBotInfo().then(() => {
		stopSell.value =
			botsStore.currentBot?.allow_sell !== undefined ? botsStore.currentBot?.allow_sell : props.item.allow_sell;

		extensionsInfo.value?.forEach((ext) => {
			ext.Fields?.forEach((field) => {
				extensionsField.value[field.field_name] = botsStore.currentBot?.[field.field_name];
			});
			extensionBot.value = {
				...extensionBot.value,
				[ext.FieldName]: botsStore.currentBot?.[ext.FieldName] || false
			};
		});
	});

	onMounted(() => {
		pageReqInterval.value = setInterval(() => {
			getCurrentBotInfo(false);
		}, 10000);
	});

	onUnmounted(() => {
		botsStore.currentBot = null;
		if (isNeedLoadAllBots.value) emits('get-bots', '');

		if (pageReqInterval.value) {
			clearInterval(pageReqInterval.value);
			pageReqInterval.value = null;
		}
	});
</script>

<style scoped lang="scss">
	.switch-wrapper {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		.switch {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			gap: 0px 12px;

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.wrapper {
					display: flex;
					align-items: center;
					gap: 5px;
				}
			}

			.switch__inputs_wrapper {
				display: flex;
				flex-direction: column;
				gap: 10px;
				width: 100%;
			}
			&__inputs {
				width: 100%;

				.field-edit {
					width: 100%;
					display: flex;
					align-items: flex-end;
					justify-content: space-between;
					gap: 15px;
				}

				.ui-input {
					margin-top: 10px;
				}
			}

			&__row-wrapper {
				display: flex;
				justify-content: space-between;
				width: 100%;
				align-items: center;
			}

			&__row {
				position: relative;
				display: flex;
				align-items: center;
				padding-right: 20px;
			}

			.slider {
				min-width: 40px;
			}
		}
	}
	.modal__mobile {
		display: flex;
		flex-direction: column;

		.loading {
			display: flex;
			justify-content: center;
			align-items: center;
			min-height: 454px;
			max-height: 90vh;
		}

		.actions {
			display: flex;
			justify-content: space-between;
			.wrapper {
				display: flex;
				gap: 11px;
				.btn__pause {
					margin-right: -4px;
				}
			}
		}
		.footer-2 {
			display: flex;
			gap: 15px;
			flex-direction: column;
			margin-top: 20px;
			padding: 20px 0px 5px 0px;
			border-top: 1px solid var(--violet-5);

			.item {
				display: flex;
				justify-content: space-between;
			}
		}

		.footer {
			display: flex;
			flex-wrap: wrap;
			gap: 27px;
			padding: 23px 0px 0px 0px;

			.item {
				display: flex;
				flex-direction: column;
				gap: 11px;

				.value {
					display: flex;
					align-items: center;
					gap: 11px;
				}
			}
		}

		.body {
			display: flex;
			gap: 15px;
			flex-direction: column;
			padding: 20px 0px;
			border-bottom: 1px solid var(--violet-5);

			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.wrapper {
					display: flex;
					align-items: center;
					gap: 5px;
				}
			}
		}

		.header {
			display: flex;
			flex-direction: column;
			gap: 13px;
			border-bottom: 1px solid var(--violet-5);
			padding-bottom: 16px;

			.content {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;

				.pair {
					margin-top: 0px;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 5px;
				}

				.value {
					display: flex;
					align-items: center;
					gap: 6px;

					.amout {
						display: flex;
						align-items: center;
						gap: 6px;
					}
				}
			}
		}
	}
</style>
