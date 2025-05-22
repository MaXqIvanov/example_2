<template>
	<section class="settings">
		<div class="header">
			<div class="info">
				<UiIcon
					folder="navigation-element"
					name="settings-new"
					color="var(--violet-2)"
					height="22"
					width="22"
				></UiIcon>
				<div class="title">
					<TypographyKTypographyBody3
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ $t('settings-page-title') }}
					</TypographyKTypographyBody3>
				</div>
			</div>
		</div>
		<div class="body">
			<div class="ref-code item">
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('settings-page-ref-code') }}</TypographyKTypographyBody2
				>
				<div class="ref-code__wrapper">
					<TypographyKTypographyBody1
						class="code"
						color="var(--color_boolean_pur)"
						font-weight="semi-bold"
						>{{ user.profileInfo?.RefCode }}</TypographyKTypographyBody1
					>
					<UiIcon
						height="16"
						width="16"
						name="copy"
						color="var(--color_font_black_wite)"
						@click="copyHandler"
						class="btn"
					/>
				</div>
			</div>
			<div class="subscribe item">
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('settings-page-subscribe') }}</TypographyKTypographyBody2
				>
				<div class="subscribe__wrapper">
					<TypographyKTypographyBody5
						class="code btn"
						:color="'var(--gray-6)'"
						font-type="semi-bold"
						@click="subscribeInfoHandler"
						>{{ subscribeTitle }}</TypographyKTypographyBody5
					>
					<UiIcon
						name="arrow"
						height="10"
						width="10"
						color="var(--color_font_black_wite)"
						rotation="-90"
						class="btn"
						@click="subscribeInfoHandler"
					/>
				</div>
			</div>
			<div class="reset-password item">
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('settings-page-change-password') }}</TypographyKTypographyBody2
				>
				<UiIcon
					name="arrow"
					height="10"
					width="10"
					color="var(--color_font_black_wite)"
					rotation="-90"
					class="btn"
					@click="resetPasswordHandler"
				/>
			</div>
		</div>
		<CommonModalsRecoveryPassword
			v-model="isRecoverModalOpen"
			v-if="isRecoverModalOpen"
			:msgStep2="msgStep2"
		/>
		<PagesSettingsSubscribeModalInfo
			v-if="isSubscribeInfoActive"
			v-model="isSubscribeInfoActive"
		/>
	</section>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import { useNotificationStore } from '~/store/notification.store';
	import { useProfileStore } from '~/store/profile.store';
	import { useSubscribeStore } from '~/store/subscribe';

	const { t } = useI18n();
	const isRecoverModalOpen = ref(false);
	const user = useProfileStore();
	const notificationStore = useNotificationStore();
	const subscribeStore = useSubscribeStore();
	const msgStep2 = ref('');
	const isSubscribeInfoActive = ref(false);

	const link = computed(() => {
		if (!window?.location?.origin) return '';
		return `${window?.location?.origin}/authorization/sign-up?code=${user.profileInfo?.RefCode || ''}`;
	});

	const copyHandler = () => {
		navigator.clipboard.writeText(`${link.value}`);
		notificationStore.addNewAlert(t('settings-page-copy-code-success'), 2000, AlertsTypes.SUCCESS);
	};

	const subscribeTitle = computed(() => {
		if (subscribeStore?.subscribeDetail?.cur.DtFinish) {
			const dateSplit = subscribeStore?.subscribeDetail?.cur.DtFinish.split('-');
			const day = dateSplit[2];
			const month = dateSplit[1];
			const year = dateSplit[0];
			return t(`settings-page-subscribe-active-before`, { date: `${day}.${month}.${year}` });
		} else {
			return `-`;
		}
	});

	const subscribeInfoHandler = () => {
		isSubscribeInfoActive.value = true;
	};

	const resetPasswordHandler = async () => {
		isRecoverModalOpen.value = true;
		const response = await user.userRecoveryRegisterStep1();

		if (response.status === 'success') {
			msgStep2.value = response.data?.msg || '';
		}
	};

	subscribeStore.getSubscribeDetails();
</script>

<style scoped lang="scss">
	.settings {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 100px);

		.body {
			display: flex;
			flex-direction: column;
			height: calc(100% - 100px);
			padding-right: 10px;
			margin-right: -10px;
			height: 100%;
			overflow-y: auto;
			gap: 0px;
			padding: 5px 0px;

			.item {
				height: 40px;
				border-bottom: 1px solid var(--blue-12);
			}

			.subscribe {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-direction: row;

				&__wrapper {
					display: flex;
					gap: 5px;
					align-items: center;
				}
			}

			.ref-code {
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-direction: row;
				gap: 5px;

				.code {
					font-size: 20px;
				}
				&__wrapper {
					display: flex;
					word-break: break-word;
					align-items: center;
					justify-content: space-between;
					gap: 5px;
					background-color: transparent;
					padding: 0px;
					border-radius: 5px;
					line-height: 19px;
				}
			}

			.reset-password {
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				align-items: center;
				gap: 5px;

				.btn__reset-password {
					max-width: fit-content;
					padding: 12px 8px;
				}
			}
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid var(--violet-5);
			padding-top: 11px;
			padding-bottom: 21px;
			margin-bottom: 5px;
			min-height: 47px;

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
