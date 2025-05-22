<template>
	<NuxtLayout>
		<div
			class="loading"
			v-if="baseStore.isLoading || mountLoad"
		>
			<div class="loading__lane"></div>
		</div>
		<NotificationAlert
			:list="notificationStore.alerts"
			class="alert"
			@mouse-enter="mouseEnterAlert"
			@mouse-leave="mouseLeaveAlert"
		/>
		<NuxtPage />
		<VitePwaManifest v-if="isPwaEnabled" />
	</NuxtLayout>
</template>

<script setup lang="ts">
	import { TIMEDEAD_DEFAULT_FOR_ALERT } from './const/notification';
	import type { TAlert } from './interfaces/notifications';
	import { useBaseStore } from './store/base.store';
	import { useNotificationStore } from './store/notification.store';
	import 'virtual:svg-icons-register';
	import { useProfileStore } from './store/profile.store';

	const baseStore = useBaseStore();
	const profile = useProfileStore();
	const notificationStore = useNotificationStore();
	baseStore.initializationApp();
	profile.checkToken();
	const mountLoad = ref(true);
	const config = useRuntimeConfig();

	const mouseEnterAlert = (alert: TAlert) => {
		notificationStore.cancelAutomaticAlertRemoval(alert.id);
	};

	const mouseLeaveAlert = (alert: TAlert) => {
		notificationStore.deleteAlert(alert.id, TIMEDEAD_DEFAULT_FOR_ALERT);
	};

	const isPwaEnabled = computed(() => {
		return config.public.isPwaEnabled === 'true';
	});

	onMounted(() => {
		mountLoad.value = false;
		notificationStore.alerts.forEach((item) => {
			notificationStore.deleteAlert(item.id, 2000);
		});
	});
</script>

<style scoped lang="scss">
	.loading {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		z-index: 9999999;

		.loading__lane {
			position: absolute;
			width: 0;
			height: 4px;
			background: #2491e7;
			border-radius: 16px;
			animation: loading 2s ease-in-out infinite;

			&_lighter {
				background: #5bb7fd;
			}
		}
	}

	.alert {
		position: fixed;
		bottom: 10px;
		right: 10px;
		z-index: 100000;
	}

	@keyframes loading {
		0% {
			width: 3%;
			left: 0;
		}
		50% {
			width: 6%;
		}
		100% {
			width: 2%;
			left: 100vw;
		}
	}
</style>
