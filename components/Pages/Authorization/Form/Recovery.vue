<template>
	<div
		class="form"
		:style="{ maxWidth: maxWidth }"
	>
		<TypographyKTypographyBody2
			:color="colorText"
			font-type="bold"
			class="title"
			>{{ recoveryTitle }}</TypographyKTypographyBody2
		>
		<div class="wrapper">
			<UiInputPhone
				v-if="step === 1"
				v-model="phone"
				height="70px"
				max-width="340px"
				placeholder=""
				class="phone"
				:label-color="colorText"
				:label="$t('auth-recovery-authorization-passford-label-phone')"
				:error="errorField.phone"
				@blur="clearError('phone')"
			></UiInputPhone>
			<div
				class="form__wrapper"
				v-if="step === 2"
			>
				<UiInput
					v-model="code"
					height="70px"
					max-width="340px"
					placeholder=""
					class="code"
					:label-color="colorText"
					:label="$t('auth-recovery-password-code-title')"
					:error="errorField.code"
					@blur="clearError('code')"
				/>
				<div
					class="link-tg"
					v-if="msgStep2 || props.msgStep2Default"
				>
					<TypographyKTypographyBody4
						class="msg"
						color="var(--color_font_wite_wite)"
						>{{ msgStep2 || props.msgStep2Default }}
					</TypographyKTypographyBody4>
				</div>
				<UiInput
					v-model="password"
					height="70px"
					max-width="340px"
					placeholder=""
					class="password"
					type="password"
					:label-color="colorText"
					:label="$t('auth-recovery-password-new-password-title')"
					:clearable="true"
					:showIconClear="true"
					:error="errorField.password"
					@blur="clearError('password')"
				></UiInput>
				<UiInput
					v-model="passwordRepeat"
					height="70px"
					max-width="340px"
					placeholder=""
					class="password"
					type="password"
					:label-color="colorText"
					:label="$t('auth-recovery-password-repeat-password-title')"
					:clearable="true"
					:showIconClear="true"
					:error="errorField.passwordRepeat"
					@blur="clearError('passwordRepeat')"
				></UiInput>
			</div>
		</div>
		<div class="action-step-2__wrapper">
			<UiButton
				:color="ButtonType.primary"
				:size="ButtonSizeType.b_xxl"
				class="btn__get-code"
				v-if="step === 1"
				@click="submitHandlerStep1"
			>
				<TypographyKTypographyBody1
					color="var(--color_font_wite_wite)"
					font-weight="bold"
					>{{ $t('auth-recovery-get-code') }}</TypographyKTypographyBody1
				>
			</UiButton>
			<UiButton
				:color="ButtonType.primary"
				:size="ButtonSizeType.b_xxl"
				class="btn__get-code"
				v-if="step === 2"
				@click="submitHandlerStep2"
			>
				<TypographyKTypographyBody1
					color="var(--color_font_wite_wite)"
					font-weight="bold"
					>{{ $t('auth-recovery-change-password-btn') }}</TypographyKTypographyBody1
				>
			</UiButton>
			<UiButton
				:color="ButtonType.outline"
				:size="ButtonSizeType.b_xxl"
				class="btn__sign-in"
				v-if="type === 'auth'"
				@click="signInHandler"
			>
				<TypographyKTypographyBody1
					font-weight="bold"
					color="var(--color_font_wite_wite)"
					>{{ $t('auth-recovery-btn-return') }}</TypographyKTypographyBody1
				>
			</UiButton>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import { validator, VALIDATE_RULES } from '~/helpers/validate';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';
	import { useNotificationStore } from '~/store/notification.store';
	import { useProfileStore } from '~/store/profile.store';

	const emits = defineEmits(['confirm-changes']);
	const props = withDefaults(
		defineProps<{
			maxWidth?: string;
			type: 'default' | 'auth';
			msgStep2Default?: string;
		}>(),
		{
			maxWidth: '480px',
			type: 'auth',
			msgStep2Default: ''
		}
	);

	const user = useProfileStore();
	const notificationStore = useNotificationStore();
	const { t } = useI18n();
	const router = useRouter();
	const phone = ref('');
	const code = ref('');
	const step = ref(props.type === 'auth' ? 1 : 2);
	const msgStep2 = ref('');
	const password = ref('');
	const passwordRepeat = ref('');
	const errorField = ref({
		phone: { status: false, msg: '' },
		code: { status: false, msg: '' },
		password: { status: false, msg: '' },
		passwordRepeat: { status: false, msg: '' }
	});

	const clearError = (type: 'password' | 'passwordRepeat' | 'phone' | 'code') => {
		errorField.value = { ...errorField.value, [type]: false };
	};

	const recoveryTitle = computed(() =>
		props.type === 'auth'
			? t('auth-recovery-authorization-form-recovery-password')
			: t('auth-recovery-authorization-form-reset-password')
	);
	const colorText = computed(() =>
		props.type === 'auth' ? 'var(--color_font_wite_wite)' : 'var(--color_icon_black_wite)'
	);

	const validateHandler = () => {
		const arrayRules: Array<{
			field: string;
			value: { value1: string | number; value2: string | number };
			rules: VALIDATE_RULES[];
		}> = [{ field: 'phone', value: phone.value, rules: [VALIDATE_RULES.required] }];

		arrayRules.forEach((item) => {
			const validate = validator(item.value, item.rules);
			errorField.value = {
				...errorField.value,
				[item.field]: validate.find((error) => error?.status) || validate[0]
			};
		});
	};

	const validateHandlerStep2 = () => {
		const arrayRules: Array<{
			field: string;
			value: { value1: string | number; value2: string | number };
			rules: VALIDATE_RULES[];
		}> = [
			{ field: 'code', value: code.value, rules: [VALIDATE_RULES.required] },
			{
				field: 'password',
				value: { value1: password.value, value2: passwordRepeat.value },
				rules: [VALIDATE_RULES.required, VALIDATE_RULES.equal]
			},
			{
				field: 'passwordRepeat',
				value: { value1: passwordRepeat.value, value2: password.value },
				rules: [VALIDATE_RULES.required, VALIDATE_RULES.equal]
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

	const signInHandler = () => {
		router.push('/authorization/sign-in');
	};

	const submitHandlerStep1 = async () => {
		validateHandler();
		if (!Object.values(errorField.value).find((item) => item.status)) {
			let response;
			if (props.type === 'auth') {
				response = await user.userRecoveryStep1({ phone: phone.value.replace(/[^\d]/g, '') });
			} else {
				response = await user.userRecoveryRegisterStep1();
			}

			if (response.status === 'success') {
				msgStep2.value = response.data?.msg || '';
				step.value = 2;
			}
		} else {
			notificationStore.addNewAlert(t('general-error-validate-field'), 3500);
		}
	};

	const submitHandlerStep2 = async () => {
		validateHandlerStep2();
		if (!Object.values(errorField.value).find((item) => item.status)) {
			const response = await user.userRecoveryStep2({
				phone: props.type === 'auth' ? phone.value.replace(/[^\d]/g, '') : user.profileInfo?.phone,
				password: password.value,
				code: code.value
			});

			if (response.status === 'success') {
				if (props.type === 'auth') {
					router.push('/authorization/sign-in');
				} else {
					emits('confirm-changes', '');
				}
			}
		} else {
			notificationStore.addNewAlert(t('general-error-validate-field'), 3500);
		}
	};
</script>

<style scoped lang="scss">
	.action-step-2__wrapper {
		width: 100%;
		max-width: 340px;
	}
	.btn__sign-in {
		width: 100%;
		margin-top: 20px;
	}
	.form {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: fit-content;

		.wrapper {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			height: calc(100% - 120px);
			min-height: fit-content;
		}

		.form__wrapper {
			max-width: 340px;
			.link-tg {
				margin-bottom: 20px;
				background-color: var(--color-black-green);
				padding: 10px;
				border-radius: 8px;
			}
		}

		.btn__get-code {
			width: 100%;
			max-width: 340px;
		}

		.title {
			font-size: 20px;
			margin-bottom: 30px;
		}

		.additional-info {
			margin-top: 50px;

			.recovery {
				.ui-card {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 20px;
					background-color: var(--violet-gray);
					padding: 29px 35px;

					@media (max-width: $laptop) {
						padding: 15px 20px;
					}
				}

				&__title {
					display: inline-block;
					width: fit-content;

					a {
						display: inline-block;
					}
				}
			}
			.links {
				margin-top: 25px;
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				align-items: center;
				gap: 5px;

				.captcha {
					width: 100%;
					text-align: center;
					margin-bottom: -5px;
				}
			}

			@media (max-width: $laptop) {
				margin-top: 30px;
			}
		}
		.ui-input {
			margin-bottom: 21px;
		}
		.ui-checkbox {
			margin-top: 25px;
		}
		.ui-button {
		}
		.title-auth {
			margin-bottom: 50px;
			width: 100%;

			@media (max-width: $laptop) {
				margin-bottom: 30px;
			}
		}
	}
</style>
~/store/profile.store
