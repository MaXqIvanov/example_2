<template>
	<div class="balance">
		<div class="balance__header">
			<TypographyKTypographyH2
				color="var(--white)"
				font-weight="bold"
				>{{ walletStore.walletDetail?.cur_balance }} USDT</TypographyKTypographyH2
			>
			<TypographyKTypographyBody3
				color="var(--white)"
				font-type="medium"
				>{{ $t('balances-page-title') }}</TypographyKTypographyBody3
			>
		</div>
		<div class="balance__actions">
			<PagesBalanceBtn
				:title="$t('balances-page-withdrawal')"
				icon-name="withdrawal"
			/>
			<PagesBalanceBtn
				:title="$t('balances-page-deposit')"
				icon-name="deposit"
				@click="openDepositModal"
			/>
		</div>
		<div class="balance__transaction">
			<TypographyKTypographyBody3
				class="title"
				color="var(--white)"
				>{{ $t('balances-page-transaction-title') }}</TypographyKTypographyBody3
			>
			<div class="transaction__actions">
				<PagesBalanceTabs
					@change="changeTransactionDeep"
					:defaultValue="defaultValueDeep"
				/>
			</div>
			<div class="transaction__history">
				<div
					class="history"
					v-for="(history, index) in historyList"
					v-if="historyList?.length && !isLoading"
				>
					<div
						class="date"
						v-if="historyList[index - 1]?.date_transform !== historyList?.[index]?.date_transform"
					>
						<TypographyKTypographyBody3
							color="var(--white)"
							font-type="medium"
						>
							{{ historyList[index]?.date_transform }}
						</TypographyKTypographyBody3>
					</div>
					<div
						class="card"
						:class="{
							card__line: historyList[index - 1]?.date_transform !== historyList?.[index]?.date_transform,
							card__midle: historyList[index - 1]?.date_transform === historyList?.[index + 1]?.date_transform,
							card__last:
								historyList[index]?.date_transform !== historyList?.[index + 1]?.date_transform &&
								historyList[index]?.date_transform === historyList?.[index - 1]?.date_transform,
							card__last_ordinary:
								historyList[index]?.date_transform !== historyList?.[index + 1]?.date_transform &&
								historyList[index]?.date_transform !== historyList?.[index - 1]?.date_transform
						}"
					>
						<UiIcon
							:name="history?.type === 1 ? 'replenishment' : history?.type === 2 ? 'percent-new' : 'referall-new'"
							folder="balance"
							color="var(--color-icon-white-gold)"
							class="icon__type"
							height="20"
							width="20"
						/>
						<div class="content">
							<div class="operation">
								<div class="operation__title">
									<TypographyKTypographyBody4
										color="var(--white)"
										font-type="bold"
									>
										{{ history?.description }}
									</TypographyKTypographyBody4>
								</div>
								<div class="count">
									<TypographyKTypographyBody4 color="var(--gray-8)">
										{{ history?.amountOperation || 1 }}
										{{
											getPluralizationText(history?.amountOperation || 1, {
												empty: $t('balance-page-operation-empty'),
												one: $t('balance-page-operation-one'),
												many: $t('balance-page-operation-many'),
												other: $t('balance-page-operation-other')
											})
										}}
									</TypographyKTypographyBody4>
								</div>
							</div>
							<div class="amount">
								<TypographyKTypographyBody4
									:color="
										history.sum === 0
											? 'var(--gray-5)'
											: `${history.sum}`?.includes('-')
												? 'var(--red-5)'
												: 'var(--primary-2)'
									"
									font-type="bold"
								>
									{{ getValueWithPlusOrMinus(history.sum) }} USDT
								</TypographyKTypographyBody4>
							</div>
						</div>
					</div>
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
					class="list-empty"
					v-else
				>
					<UiIcon
						name="list-empty-new"
						folder="navigation-element"
						height="47"
						width="47"
						color="var(--purple-2)"
					/>
					<TypographyKTypographyBody3
						color="var(--color_font_black_wite)"
						font-type="bold"
					>
						{{ $t('finances-page-empty') }}
					</TypographyKTypographyBody3>
				</div>
			</div>
		</div>
	</div>
	<PagesBalanceDepositModal
		v-model="isOpenDepositModal"
		v-if="isOpenDepositModal"
	/>
</template>

<script setup lang="ts">
	import { getPluralizationText } from '~/helpers/i18n';
	import { getValueWithPlusOrMinus } from '~/helpers/transform';
	import { useWalletStore } from '~/store/wallet.store';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';

	definePageMeta({
		customColorBg: 'transparent'
	});

	const walletStore = useWalletStore();
	const router = useRouter();

	const isLoading = computed(() => walletStore.loading.walletDetail);
	const historyList = computed(() => walletStore.walletDetail?.history);

	const defaultValueDeep = computed(() => router.currentRoute.value.query?.deep);
	const changeTransactionDeep = (deep: 'all' | 'last') => {
		router.replace({ query: { deep: deep } });
		getWalletDetailsHandler(deep);
	};

	const getWalletDetailsHandler = (deep: 'all' | 'last') => {
		if (deep === 'all') {
			walletStore.getWalletDetails(1000);
			return;
		}
		walletStore.getWalletDetails();
	};

	const isOpenDepositModal = ref(false);
	const openDepositModal = () => {
		isOpenDepositModal.value = !isOpenDepositModal.value;
	};

	getWalletDetailsHandler(defaultValueDeep.value);

	onUnmounted(() => {
		walletStore.$reset();
	});
</script>

<style scoped lang="scss">
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.list-empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}
	.balance {
		flex-direction: column;
		display: flex;
		align-items: center;

		&__transaction {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 20px;
			width: 100%;

			.icon__type {
				//mix-blend-mode: soft-light;
			}

			.transaction__history {
				display: flex;
				flex-direction: column;
				width: 100%;

				.history {
					.card {
						position: relative;
						display: flex;
						align-items: center;
						gap: 8px;
						padding: 11px 12px;

						.content {
							position: relative;
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding-bottom: 8px;

							.operation {
								display: flex;
								gap: 6px;
								flex-direction: column;
							}
						}

						&::after {
							content: '';
							position: absolute;
							background-color: #bab6c3f0;
							mix-blend-mode: soft-light;
							width: 100%;
							height: 100%;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							opacity: 58%;
						}

						&__line {
							padding-bottom: 0px;
							.content {
								&::after {
									position: absolute;
									content: '';
									height: 2px;
									width: 100%;
									bottom: 0px;
									border-radius: 800px;
									background-color: #ded9e7;
									mix-blend-mode: soft-light;
								}
							}

							&::after {
								border-radius: 15px 15px 0px 0px;
							}
						}

						&__last {
							padding-top: 8px;
							padding-bottom: 4px;
							.content {
								&::after {
									position: absolute;
									content: '';
									height: 0px;
									width: 100%;
									bottom: 0px;
									border-radius: 800px;
									background-color: #bab6c3f0;
								}
							}

							&::after {
								border-radius: 0px 0px 15px 15px;
							}
						}

						&__last_ordinary {
							padding-top: 11px;
							padding-bottom: 8px;
							.content {
								&::after {
									position: absolute;
									content: '';
									height: 0px;
									width: 100%;
									bottom: 0px;
									border-radius: 800px;
									background-color: #bab6c3f0;
								}
							}

							&::after {
								border-radius: 15px 15px 15px 15px;
							}
						}

						&__midle {
							padding-top: 8px;
							padding-bottom: 0px;
							.content {
								&::after {
									position: absolute;
									content: '';
									height: 2px;
									width: 100%;
									bottom: 0px;
									border-radius: 800px;
									background-color: #bab6c3f0;
									mix-blend-mode: soft-light;
								}
							}

							&::after {
								border-radius: 0px 0px 0px 0px;
							}
						}
					}

					.date {
						padding-left: 17px;
						margin-top: 16px;
						margin-bottom: 7px;
					}
				}
			}

			.transaction__actions {
				width: 100%;
				margin-bottom: 20px;
			}

			.title {
				margin-bottom: 13px;
			}
		}

		&__actions {
			display: grid;
			width: 100%;
			gap: 20px;
			margin-top: 40px;
			grid-template-columns: 1fr 1fr;
		}

		&__header {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 16px;
			margin-top: 40px;
		}
	}
</style>
