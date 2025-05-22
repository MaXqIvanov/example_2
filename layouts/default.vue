<template>
	<div class="container">
		<SvgBgAuth />
		<Header @openSupportChat="openSupportChat" />
		<div
			class="wrapper"
			:style="{ backgroundColor: $router.currentRoute.value.meta.customColorBg || 'var(--bg-color-overlay)' }"
		>
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useProfileStore } from '~/store/profile.store';
	import { useChatSupportStore } from '~/store/chatSupport.store';

	const chatSupportStore = useChatSupportStore();
	const profile = useProfileStore();
	const pageReqInterval = ref<NodeJS.Timeout | null>(null);

	const openSupportChat = () => {
		if (chatSupportStore.isShowWidget) {
			chatSupportStore.hiddenWidgetChat();
			return;
		}
		chatSupportStore.showWidgetChat();
	};

	profile.getProfile();

	onMounted(() => {
		if (useRuntimeConfig().public.rocketChatLink != 'false') {
			chatSupportStore.getRocketChat();
		}

		pageReqInterval.value = setInterval(() => {
			profile.getProfile();
		}, 20000);
	});

	onUnmounted(() => {
		if (pageReqInterval.value) {
			clearInterval(pageReqInterval.value);
			pageReqInterval.value = null;
		}
	});
</script>
<style lang="scss">
	.rocketchat-widget {
		display: none;
	}
</style>
<style scoped lang="scss">
	.container {
		min-height: 100vh;
		display: grid;
		justify-items: center;
		grid-template-columns: 1fr;
		grid-template-rows: 61px 1fr;
		column-gap: 30px;
		padding: 0px 5px 5px 5px;

		.wrapper {
			background-color: var(--reg-color_overlay);
			border-radius: 20px;
			padding: 12px 24px;
			max-width: 800px;
			width: 100%;
		}

		.header {
			grid-row: 1/1;
			min-height: 48px;
		}

		.sidebar {
			min-height: calc($full-screen-min-height-default - 15px);
			grid-row: 1/3;
			background: var(--white);
			border-radius: 20px;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			padding: 25px;

			.ui-button {
				padding: 0;
				width: 100%;
			}
		}
	}
</style>
