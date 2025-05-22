<template>
	<form
		class="form"
		:style="{ maxWidth: maxWidth }"
		@submit.prevent
	>
		<UiInputPhone
			v-model="login"
			height="70px"
			max-width="340px"
			placeholder=""
			class="login"
			:label="$t('auth-form-label-phone')"
			labelColor="var(--color_font_wite_wite)"
			:error="errorField.login"
			:autocomplete="'username'"
			id="auth-username"
			name="username"
			@blur="clearError('login')"
		></UiInputPhone>
		<UiInput
			v-model="password"
			height="70px"
			max-width="340px"
			:label="$t('auth-form-label-password')"
			label-color="var(--color_font_wite_wite)"
			placeholder=""
			class="password"
			type="password"
			:autocomplete="'current-password'"
			:clearable="true"
			:showIconClear="true"
			:error="errorField.password"
			id="auth-password"
			name="password"
			@blur="clearError('password')"
		></UiInput>
		<div class="password-recovery">
			<TypographyKTypographyBody5
				color="var(--color_font_grey-grey_1)"
				font-type="medium"
				>{{ $t('auth-recovery-password-question') }}</TypographyKTypographyBody5
			>
			<NuxtLink
				to="/authorization/recovery"
				:prefetch="false"
			>
				<TypographyKTypographyBody5
					color="var(--color_font_wite_wite)"
					font-type="semi-bold"
				>
					{{ $t('auth-recovery-password-question-link') }}
				</TypographyKTypographyBody5>
			</NuxtLink>
		</div>
		<div id="telegram-login-GlobalITTestBot__place">
			<Script> function onTelegramAuth(user) { setTimeout(()=> {window.telegramAuthHandler(user) }); } </Script>
			<Script
				async
				src="https://telegram.org/js/telegram-widget.js?22"
				:data-telegram-login="useRuntimeConfig().public.dataTelegramLogin"
				data-size="large"
				data-onauth="onTelegramAuth(user)"
				data-request-access="write"
			>
			</Script>
		</div>
		<UiButton
			:color="ButtonType.primary"
			:size="ButtonSizeType.b_xxl"
			class="btn__login"
			@click="loginHandler"
		>
			<TypographyKTypographyBody1
				font-weight="bold"
				color="var(--color_font_wite_wite)"
				>{{ $t('auth-login-btn') }}</TypographyKTypographyBody1
			>
		</UiButton>
		<UiButton
			:color="ButtonType.outline"
			:size="ButtonSizeType.b_xxl"
			class="btn__sign-up"
			@click="signUpHandler"
		>
			<TypographyKTypographyBody1
				font-weight="bold"
				color="var(--color_font_wite_wite)"
				>{{ $t('auth-registration-btn') }}</TypographyKTypographyBody1
			>
			<UiIcon
				name="lock_v2"
				color="var(--color_font_wite_wite)"
				height="18"
				width="20"
			/>
		</UiButton>
	</form>
</template>

<script setup lang="ts">
	import { validator, VALIDATE_RULES } from '~/helpers/validate';
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

	const router = useRouter();
	const userStore = useProfileStore();
	const notificationStore = useNotificationStore();
	const { t } = useI18n();
	const login = ref('');
	const password = ref('');
	const errorField = ref({
		login: { status: false, msg: '' },
		password: { status: false, msg: '' }
	});

	const clearError = (type: 'login' | 'password' | 'checkBoxConfirm') => {
		errorField.value = { ...errorField.value, [type]: false };
	};

	function onAuth(user) {
		if (user?.id) {
			userStore.authUserTG(user);
		}
	}

	const validateHandler = () => {
		const arrayRules: Array<{
			field: string;
			value: string | boolean;
			rules: VALIDATE_RULES[];
		}> = [
			{ field: 'login', value: login.value, rules: [VALIDATE_RULES.required] },
			{ field: 'password', value: password.value, rules: [VALIDATE_RULES.required] }
		];
		arrayRules.forEach((item) => {
			errorField.value = { ...errorField.value, [item.field]: validator(item.value, item.rules)[0] };
		});
	};

	const signUpHandler = () => {
		router.push('/authorization/sign-up');
	};

	const loginHandler = () => {
		validateHandler();
		if (!Object.values(errorField.value).find((item) => item.status)) {
			userStore.authUser({ login: login.value.replace(/[^\d]/g, ''), password: password.value });
		} else {
			notificationStore.addNewAlert(t('general-error-validate-field'), 3500);
		}
	};

	onMounted(() => {
		window.telegramAuthHandler = onAuth;
	});
</script>
<style lang="scss">
	#telegram-login-GlobalITTestBot__place {
		margin-top: 30px;
		height: 45px;
	}
	#telegram-login-GlobalITTestBot {
		max-height: 45px;
	}
</style>
<style scoped lang="scss">
	.form {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;

		.footer-title {
			margin-top: 44px;
			text-align: center;
		}

		.icon__lock {
			margin-left: 5px;
		}

		.btn__registration {
			margin-top: 18px;
			width: 100%;
		}

		.btn__login {
			margin-top: 23px;
			width: 100%;
		}

		.btn__sign-up {
			margin-top: 18px;
			width: 100%;
		}

		.password-recovery {
			display: inline-block;
			width: 100%;
			margin-top: 10px;

			div {
				display: inline-block;
			}

			a {
				margin-left: 5px;
				display: inline-block;
				border-bottom: 1px solid var(--white);
			}
		}

		.login {
			margin-top: 37px;
		}

		.password {
			margin-top: 20px;
		}

		.title {
			margin-top: 8vh;
		}

		.subtitle {
			max-width: 308px;
			margin-top: 30px;
			text-align: center;
		}
	}
</style>
~/store/profile.store
