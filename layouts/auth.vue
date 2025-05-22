<template>
	<div class="container">
		<SvgBgAuth />
		<UiLocales />
		<div class="form">
			<Logo
				class="logo"
				variant-logo="auth"
				heightLogo="97px"
				width-logo="104px"
			/>
			<div class="form__wrapper">
				<slot />
				<div class="footer-title">
					<TypographyKTypographyBody5
						color="var(--color_font_grey-grey_1)"
						font-type="medium"
					>
						{{ $t('auth-sign-in-description') }}
					</TypographyKTypographyBody5>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useProfileStore } from '~/store/profile.store';

	const profileStore = useProfileStore();

	onMounted(() => {
		if (profileStore.isGet401Error) {
			profileStore.logoutHandler();
		}
	});
</script>

<style lang="scss">
	.link-tg {
		width: 100%;
		.msg {
			display: inline-block;
		}
		.link {
			display: inline-block;
			margin-top: 2px;
			svg {
				margin: 0px 5px;
			}
			div {
				border-bottom: 1px solid var(--white);
			}
		}
	}
</style>
<style scoped lang="scss">
	.container {
		position: relative;
		display: flex;
		justify-content: flex-end;
		height: 100%;
		min-height: 100vh;
		padding: 0px;

		.locales {
			position: absolute;
			top: 10px;
			right: 20px;
			z-index: 10;
		}

		.form {
			width: 100%;
			height: 100%;
			padding: 31px;
			min-height: $full-screen-min-height-auth;
			border-radius: $br-7;
			display: grid;
			grid-template-rows: min-content 1fr;
			grid-template-columns: 1fr;
			flex-direction: column;
			justify-content: space-between;
			align-content: space-between;
			justify-content: center;
			align-items: center;
			z-index: 1;

			.footer-title {
				margin-top: 44px;
				text-align: center;
				max-width: 332px;
			}

			&__wrapper {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100%;
			}

			.logo {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 2vh;
				margin-bottom: 4vh;
				width: 100%;
			}
		}
	}
</style>
