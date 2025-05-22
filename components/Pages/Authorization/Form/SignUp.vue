<template>
	<div
		class="form"
		:style="{ maxWidth: maxWidth }"
	>
		<TypographyKTypographyBody2
			color="var(--white)"
			font-type="bold"
			class="title --to-upper-case"
			>{{ $t('auth-registration') }}</TypographyKTypographyBody2
		>
		<div class="content">
			<UiInputPhone
				v-model="phone"
				height="70px"
				max-width="340px"
				placeholder=""
				class="phone"
				:label="$t('auth-phone-placeholder')"
				labelColor="var(--white)"
				:error="errorField.phone"
				@blur="clearError('phone')"
			></UiInputPhone>
			<UiInput
				v-model="inviteCode"
				height="70px"
				placeholder=""
				max-width="340px"
				labelColor="var(--white)"
				:label="$t('auth-ref-code-placeholder')"
				:error="errorField.inviteCode"
				@blur="clearError('inviteCode')"
			/>
			<UiCheckBox
				v-model="accept"
				class="check-box__rules"
				:error="errorField.accept"
				@blur="clearError('accept')"
			>
				<TypographyKTypographyBody4
					color="var(--white)"
					class="rules"
				>
					{{ $t('auth-confirm-tos') }}
					<a
						class="link"
						href="https://pinnxs-organization.gitbook.io/pinnx/diskleimer"
						target="_blank"
						><TypographyKTypographyBody4 color="var(--white)">{{
							$t('auth-confirm-tos-link')
						}}</TypographyKTypographyBody4></a
					>
				</TypographyKTypographyBody4>
			</UiCheckBox>
			<UiButton
				:color="ButtonType.primary"
				:size="ButtonSizeType.b_xxl"
				:disabled="!accept"
				class="btn"
				@click="signUpHandler"
			>
				<TypographyKTypographyBody1
					color="var(--white)"
					font-weight="bold"
				>
					{{ $t('auth-registration-btn-action') }}
				</TypographyKTypographyBody1>
				<UiIcon
					name="lock_v2"
					color="var(--white)"
					height="18"
					width="20"
				/>
			</UiButton>
			<UiButton
				:color="ButtonType.outline"
				:size="ButtonSizeType.b_xxl"
				class="btn__sign-in"
				@click="signInHandler"
			>
				<TypographyKTypographyBody1
					font-weight="bold"
					color="var(--white)"
					>{{ $t('auth-login-btn') }}</TypographyKTypographyBody1
				>
			</UiButton>
		</div>
		<UiModalDefault
			v-if="isOpenModalTgLink"
			v-model="isOpenModalTgLink"
			:width="'fit-content'"
			:height="'fit-content'"
			padding-card="24px 26px"
			@close="closeModalHandler"
		>
			<div class="modal-tg__wrapper">
				<TypographyKTypographyBody4
					color="var(--dark-gray)"
					font-type="medium"
				>
					{{ msgTgForContinue }}
				</TypographyKTypographyBody4>
				<a
					:href="linkTgForContinue"
					class="link"
					><UiIcon
						name="tg"
						folder="social"
						height="27"
						width="27"
					/><TypographyKTypographyBody4
						class="bot-name"
						color="var(--black)"
						font-type="semi-bold"
						>{{ botName }}</TypographyKTypographyBody4
					></a
				>
			</div>
			<template #btn-close>
				<UiIcon
					name="close_v2"
					color="var(--black)"
					width="14"
					height="14"
					class="btn"
					@click="closeModalHandler"
				/>
			</template>
		</UiModalDefault>
	</div>
</template>

<script setup lang="ts">
	import { VALIDATE_RULES, validator } from '~/helpers/validate';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useNotificationStore } from '~/store/notification.store';
	import { useProfileStore } from '~/store/profile.store';

	const props = withDefaults(
		defineProps<{
			maxWidth?: string;
		}>(),
		{
			maxWidth: '341px'
		}
	);

	const notificationStore = useNotificationStore();
	const profileStore = useProfileStore();
	const router = useRouter();
	const { t } = useI18n();

	const errorField = ref({
		phone: { status: false, msg: '' },
		inviteCode: { status: false, msg: '' },
		password: { status: false, msg: '' },
		passwordRepeat: { status: false, msg: '' },
		accept: { status: false, msg: '' }
	});

	const phone = ref('');
	const inviteCode = ref('');
	const linkTgForContinue = ref('');
	const isOpenModalTgLink = ref(false);
	const accept = ref(false);
	const botName = ref('');
	const msgTgForContinue = ref(t('auth-registration-msg-tg-for-continue'));
	const password = ref('');
	const passwordRepeat = ref('');

	const clearError = (type: 'phone' | 'password' | 'inviteCode' | 'passwordRepeat' | 'accept') => {
		errorField.value = { ...errorField.value, [type]: false };
	};

	const validateHandler = () => {
		const arrayRules: Array<{
			field: string;
			value: string | boolean;
			rules: VALIDATE_RULES[];
		}> = [
			{ field: 'phone', value: phone.value, rules: [VALIDATE_RULES.required] },
			{ field: 'inviteCode', value: inviteCode.value, rules: [VALIDATE_RULES.required] },
			{
				field: 'password',
				value: { value1: password.value, value2: passwordRepeat.value },
				rules: [VALIDATE_RULES.required, VALIDATE_RULES.equal]
			},
			{
				field: 'passwordRepeat',
				value: { value1: passwordRepeat.value, value2: password.value },
				rules: [VALIDATE_RULES.required, VALIDATE_RULES.equal]
			},
			{
				field: 'accept',
				value: accept.value,
				rules: [VALIDATE_RULES.required]
			}
		];
		arrayRules.forEach((item) => {
			const validate = validator(item.value, item.rules);
			errorField.value = {
				...errorField.value,
				[item.field]: validate.find((error) => error?.status) || validate[0]
			};
		});
	};

	const signUpHandler = async () => {
		validateHandler();
		if (!Object.values(errorField.value).find((item) => item.status)) {
			const response = await profileStore.registerUser({
				phone: phone.value,
				inviteCode: inviteCode.value,
				accept: accept.value
			});

			if (response.status === 'success') {
				isOpenModalTgLink.value = true;
				linkTgForContinue.value = response.data?.data.url || '';
				msgTgForContinue.value = t(response.data?.data.comment || '') || msgTgForContinue.value;
				botName.value = response.data?.data?.botName || '';
			}
		} else {
			notificationStore.addNewAlert(t('general-error-validate-field'), 3500);
		}
	};

	const closeModalHandler = () => {
		isOpenModalTgLink.value = false;
		router.push('/authorization/sign-in');
	};

	const signInHandler = () => {
		router.push('/authorization/sign-in');
	};

	onMounted(() => {
		if (router.currentRoute.value?.query?.code) {
			inviteCode.value = router.currentRoute.value?.query?.code as string;
		}
	});
</script>

<style scoped lang="scss">
	.modal-tg__wrapper {
		display: flex;
		flex-direction: column;
		max-width: 324px;
		padding: 20px 4px 20px 4px;

		.link {
			margin-top: 13px;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 9px;

			.bot-name {
				border-bottom: 1px solid black;
			}
		}
	}
	.btn__sign-in {
		width: 100%;
	}
	.form {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;

		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			gap: 20px;
			width: 100%;

			.check-box__rules {
				width: 100%;
				margin-left: 5px;
			}

			.rules {
				display: inline-flex;
				gap: 5px;

				.link {
					border-bottom: 1px solid white;
				}
			}

			.btn {
				width: 100%;
				margin-top: 40px;
			}

			.password-label {
				display: flex;
				flex-direction: column;
				width: 100%;
				gap: 14px;
			}
		}

		.title {
			font-size: 20px;
			margin-bottom: 30px;
		}
	}
</style>
