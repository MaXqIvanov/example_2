<template>
	<UiModalMobile
		v-model="modelValue"
		class="modal__mobile"
		titleBtnSave=""
	>
		<div class="wrapper">
			<UiLabelWarning type="error">
				<TypographyKTypographyBody5 color="var(--crimson)">
					<!-- Отправляйте только <b>USDT</b> и только через сеть <b>Arbitrum</b>. Остальные активы будут безвозвратно
					утеряны. -->
					{{ $t('balances-page-transaction-modal-deposit-title', { token: 'USDT', network: 'Arbitrum' }) }}
				</TypographyKTypographyBody5>
			</UiLabelWarning>
			<div class="title">
				<UiIcon
					name="ARB"
					folder="crypto"
					height="24"
					width="24"
				/>
				<TypographyKTypographyBody2
					color="var(--dark-blue-2)"
					font-type="bold"
					>ARB</TypographyKTypographyBody2
				>
				<TypographyKTypographyBody4
					class="title__card"
					color="var(--violet-7)"
					font-type="semi-bold"
				>
					Arbitrum
				</TypographyKTypographyBody4>
			</div>
			<div class="qr-code">
				<LazyUiQrCode
					:data="qrData"
					:width="224"
					:height="224"
				/>
			</div>
			<div class="address">
				<TypographyKTypographyBody4
					color="var(--violet-7)"
					font-type="medium"
				>
					{{ qrData }}
				</TypographyKTypographyBody4>
			</div>
			<div class="actions">
				<div class="action__copy">
					<UiButton
						background-color="var(--violet-6)"
						:style="{ height: '57px', width: '100%', maxWidth: '224px' }"
						@click="copyHandler"
					>
						<template #default>
							<UiIcon
								name="copy"
								color="var(--black)"
								width="20"
								height="24"
							/>
						</template>
					</UiButton>
					<TypographyKTypographyBody4
						color="var(--color_font_black_wite)"
						font-type="medium"
					>
						{{ $t('balances-page-transaction-modal-deposit-btn-copy') }}
					</TypographyKTypographyBody4>
				</div>
			</div>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	import { useNotificationStore } from '~/store/notification.store';
	import { useWalletStore } from '~/store/wallet.store';

	const { t } = useI18n();
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });

	const walletStore = useWalletStore();
	const notificationStore = useNotificationStore();

	const qrData = computed(() => walletStore.walletAddressDetail?.shared_key || '');

	const copyHandler = () => {
		navigator.clipboard.writeText(qrData.value).then(() => {
			notificationStore.addNewAlert(t('balances-page-transaction-modal-deposit-btn-copy-success'), 3000, 'success');
		});
	};

	walletStore.getWalletAddress();
</script>

<style scoped lang="scss">
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.actions {
			width: 100%;
			margin-top: 36px;

			.action__copy {
				display: flex;
				flex-direction: column;
				gap: 7px;
				align-items: center;
			}
		}

		.address {
			max-width: 224px;
			margin-top: 14px;
			word-break: break-all;
			text-align: center;
		}

		.qr-code {
			margin-top: 30px;
		}

		.title {
			display: flex;
			align-items: center;
			margin-top: 57px;
			gap: 2px;

			&__card {
				padding: 6px 8px;
				background-color: var(--violet-6);
				border-radius: 6px;
				margin-left: 5px;
			}
		}
	}
</style>
