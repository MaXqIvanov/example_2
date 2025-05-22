<template>
	<div class="sidebar">
		<div class="sidebar__header">
			<Logo
				class="logo"
				variant-logo="side-menu"
				heightLogo="35px"
				width-logo="110px"
			/>
			<UiIcon
				class="btn__close"
				name="close_v2"
				color="var(--color_icon_close)"
				@click="closeSideBar"
			/>
		</div>
		<div class="sidebar__info">
			<div class="balance__wrapper">
				<Balance variant="dark" />
			</div>
		</div>
		<div class="sidebar__navigation">
			<NuxtLink
				href="/keys"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-my-key') }}</TypographyKTypographyBody2
				>
				<TypographyKTypographyBody2
					color="var(--color_font_namber)"
					font-type="bold"
					>({{ profileStore.profileInfo?.token_count }})</TypographyKTypographyBody2
				>
			</NuxtLink>
			<NuxtLink
				href="/bots"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-bots') }}</TypographyKTypographyBody2
				>
				<TypographyKTypographyBody2
					color="var(--color_font_namber)"
					font-type="bold"
					>({{ profileStore.profileInfo?.bot_count }})</TypographyKTypographyBody2
				>
			</NuxtLink>
			<NuxtLink
				href="/finance"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-finances') }}</TypographyKTypographyBody2
				>
			</NuxtLink>
			<NuxtLink
				href="/balance"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-balance') }}</TypographyKTypographyBody2
				>
			</NuxtLink>
			<NuxtLink
				href="/trades/profit"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-profit') }}</TypographyKTypographyBody2
				>
			</NuxtLink>
			<NuxtLink
				href="/settings"
				@click="clickNavElementHandler"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-settings') }}</TypographyKTypographyBody2
				>
			</NuxtLink>
			<a
				href="https://pinnxs-organization.gitbook.io/pinnx"
				class="navigation__item"
				target="_blank"
			>
				<TypographyKTypographyBody2
					color="var(--color_font_black_wite)"
					font-type="semi-bold"
					>{{ $t('navigation-documentation') }}</TypographyKTypographyBody2
				>
			</a>
			<NuxtLink
				href=""
				@click="openStopAllBotsModal"
				class="navigation__item"
				:prefetch="false"
			>
				<TypographyKTypographyBody2
					color="var(--red)"
					font-type="semi-bold"
					>{{ $t('navigation-stop-all-bots') }}</TypographyKTypographyBody2
				>
			</NuxtLink>
		</div>
		<UiLocales localeColor="var(--color_font_black_wite)" />
		<div
			class="exit-account"
			@click="exitAccountHandler"
		>
			<UiIcon
				name="exit"
				height="20"
				width="20"
				color="var(--crimson)"
			/>
			<TypographyKTypographyBody3
				color="var(--color_font_black_wite)"
				font-type="semi-bold"
				>{{ $t('navigation-logout') }}</TypographyKTypographyBody3
			>
		</div>
		<div
			class="sidebar__footer"
			@click="openSupportChat"
		>
			<UiIcon
				color="var(--color_font_black_wite)"
				height="18"
				width="15"
				name="message"
			/>
			<TypographyKTypographyBody2
				color="var(--color_font_black_wite)"
				font-type="semi-bold"
				class="title"
				>{{ $t('navigation-support') }}</TypographyKTypographyBody2
			>
		</div>
	</div>
	<UiModalConfirm
		v-model="isOpenModalDeleteAllBots"
		v-if="isOpenModalDeleteAllBots"
		:title="$t('navigation-stop-all-bots-title')"
		:btnConfirmTitle="$t('modal-confirm-btn')"
		@save="confirmDeleteAllBotsHandler"
	/>
	<div
		class="sidebark-blackout"
		@click="closeSideBar"
	></div>
</template>

<script setup lang="ts">
	import { useBotsStore } from '~/store/bots.store';
	import { useProfileStore } from '~/store/profile.store';

	const emits = defineEmits(['closeSideBar', 'openSupportChat']);
	const props = withDefaults(
		defineProps<{
			listItems: Array<{
				id: number | string;
				link?: string;
				title: string;
				icon?: { name: string; color: string };
				subLink?: Array<{ id: number; title: string; link: string; dotColor?: string }>;
			}>;
		}>(),
		{}
	);

	const profileStore = useProfileStore();
	const botsStore = useBotsStore();
	const router = useRouter();
	const isOpenModalDeleteAllBots = ref(false);

	const clickNavElementHandler = () => {
		emits('closeSideBar', '');
	};

	const closeSideBar = () => {
		emits('closeSideBar', '');
	};

	const openSupportChat = () => {
		emits('openSupportChat', '');
	};

	const openStopAllBotsModal = () => {
		isOpenModalDeleteAllBots.value = !isOpenModalDeleteAllBots.value;
	};

	const confirmDeleteAllBotsHandler = async () => {
		isOpenModalDeleteAllBots.value = false;
		await botsStore.stopAllBotsHandler();
		botsStore.getBots();
	};

	const exitAccountHandler = () => {
		profileStore.logoutHandler();
	};
	const preloadImportantPages = async function () {
		import(`~/pages/bots/index.vue`);
		router.resolve('/bots');
		import(`~/pages/keys/index.vue`);
		router.resolve('/keys');
		import(`~/pages/trades/profit/index.vue`);
		router.resolve('/trades/profit');
	};

	onMounted(() => {
		setTimeout(() => {
			preloadImportantPages();
		}, 500);
	});
</script>

<style scoped lang="scss">
	$max-width: 350px;

	.locales {
		margin-bottom: 5px;
	}

	.sidebark-blackout {
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 100%;
		z-index: 100;
		background-color: var(--blackout);
		opacity: 1;
	}
	.sidebar {
		position: fixed;
		left: 0px;
		height: 100%;
		background-color: var(--color_bottomsheet);
		width: 100%;
		max-width: $max-width;
		padding: 28px;
		z-index: 1000;
		display: grid;
		grid-template-rows: min-content min-content 1fr min-content min-content;
		overflow: hidden;
		animation: openSideBar 0.25s linear;
		border-radius: 0px 5px 5px 0px;

		.exit-account {
			display: flex;
			align-items: center;
			width: fit-content;
			gap: 5px;
			cursor: pointer;
			margin-top: 15px;
			margin-left: -3px;
		}

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.btn__close {
				cursor: pointer;
			}
		}

		&__info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 24px;
			margin-bottom: 30px;
			border-top: 1px solid var(--gray);
			border-bottom: 1px solid var(--gray);
			padding: 20px 5px;

			.link__finance {
				cursor: pointer;
				border-bottom: 1px solid rgba(107, 100, 240, 0.3);
				padding-bottom: 5px;
			}

			.balance__wrapper {
				display: flex;
				align-items: center;
			}
		}

		&__footer {
			display: flex;
			margin-top: 20px;
			margin-bottom: 10px;
			gap: 9px;
			align-items: center;
			cursor: pointer;
			border-top: 1px solid var(--gray-5);
			padding-top: 30px;

			.title {
				min-width: fit-content;
			}

			svg {
				min-width: fit-content;
			}
		}

		&__navigation {
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			overflow-x: hidden;
			gap: 27px;
			padding-bottom: 15px;

			.navigation__item {
				display: flex;
				gap: 10px;
				cursor: pointer;
				width: fit-content;
				min-width: max-content;
				transition: all linear 0.125s;
				&:hover {
					color: var(--primary-2);
				}
			}
		}
	}

	@keyframes openSideBar {
		0% {
			width: 0px;
			max-width: 0px;
			padding: 28px 0px;
		}

		100% {
			width: 100%;
			max-width: $max-width;
		}
	}
</style>
