<template>
	<div class="notification">
		<UiPopover
			position="bottom-end"
			:has-close-button="false"
			:padding="`40px 20px ${notifications.length ? '80px' : '40px'} 40px`"
		>
			<template #body>
				<div class="wrapper">
					<transition-group
						name="slide-left"
						tag="div"
						v-if="notifications.length"
					>
						<div
							class="item"
							v-for="notification in notifications"
							:key="notification.id"
						>
							<UiIcon
								:name="notification?.type === NotificationTypes.URGENT ? 'fire' : 'notification'"
								:color="notification?.type === NotificationTypes.URGENT ? 'var(--orange)' : 'var(--violet)'"
								width="18"
								height="18"
							/>
							<div class="content">
								<div class="content__title">
									<!-- <TypographyKTypographyBody3
										v-if="notification.type === NotificationTypes.URGENT"
										color="var(--orange)"
										font-type="bold"
										>НАПОМИНАНИЕ!
									</TypographyKTypographyBody3> -->
									<TypographyKTypographyBody3
										font-type="bold"
										color="var(--black)"
										v-html="notification.message"
									>
									</TypographyKTypographyBody3>
								</div>
								<TypographyKTypographyBody4
									font-type="bold"
									color="var(--dark-gray)"
									>{{ getDateInLocaleString(notification?.created || '') }}
								</TypographyKTypographyBody4>
							</div>
							<UiButtonIcon
								background="transparent"
								:is-loading="notificationStore.loading?.deleteNotification?.[notification.id]"
							>
								<UiIcon
									name="cross"
									class="close"
									width="16"
									height="16"
									@click="deleteNotificationHandler(notification)"
								/>
							</UiButtonIcon>
						</div>
					</transition-group>
					<div
						v-else
						class="item__empty"
					>
						<TypographyKTypographyBody3 font-type="bold">Список уведомлений пуст</TypographyKTypographyBody3>
					</div>
				</div>
				<UiButton
					v-if="notifications.length"
					label="прочитать все"
					:color="ButtonType.primary"
					:size="ButtonSizeType.small"
					:is-loading="notificationStore.loading.deleteAllNotificationBtn"
					@click="deleteAllNotificationHandler"
				/>
			</template>
			<template #button="props">
				<UiButtonIcon
					:background="props.buttonColor"
					:badge="notifications.length"
				>
					<UiIcon
						name="notification"
						:color="props.iconColor"
					/>
				</UiButtonIcon>
			</template>
		</UiPopover>
	</div>
</template>

<script setup lang="ts">
	import { useNotificationStore } from '~/store/notification.store';
	import { NotificationTypes } from '~/const/notification';
	import { getDateInLocaleString } from '~/helpers/date';
	import type { TNotification } from '~/interfaces/notifications';
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';

	const notificationStore = useNotificationStore();
	const notifications = computed(() => notificationStore.notifications);
	const interval = ref<null | NodeJS.Timeout>(null);

	const deleteNotificationHandler = (notification: TNotification) => {
		notificationStore.deleteNotification(notification.id);
	};

	const deleteAllNotificationHandler = () => {
		notificationStore.deleteAllNotification();
	};

	const getNotificationInterval = (time: number = 30000, isNeedReload: boolean = true) => {
		if (interval.value) clearInterval(interval.value);
		else if (isNeedReload) {
			interval.value = setInterval(async () => {
				await notificationStore.getNotifications();
				if (notificationStore.countGetErrorNotification >= 2) {
					setTimeout(() => {
						getNotificationInterval(60000, true);
					}, 3000);
				}
			}, time);
		}
	};

	// notificationStore.getNotifications();
	// onMounted(() => {
	// 	getNotificationInterval();
	// });

	// onUnmounted(() => {
	// 	if (interval.value) clearInterval(interval.value);
	// });
</script>
<style>
	.notification {
		a {
			color: var(--violet);
			border-bottom: 1px solid var(--violet-light);
			cursor: pointer;
		}
	}
</style>
<style scoped lang="scss">
	.notification {
		.ui-button {
			margin-top: 20px;
			margin-bottom: 20px;
			float: right;
		}
		.wrapper {
			max-height: 492px;
			overflow-y: auto;
			overflow-x: hidden;
			padding-right: 20px;
			width: 100%;

			.btn-icon {
				height: fit-content;
				padding: 0px;
				margin: auto;
			}

			.item {
				display: grid;
				grid-template-columns: min-content 1fr min-content;
				gap: 13px;
				width: 434px;
				border-bottom: 1px solid var(--blue-light-2);
				padding: 16px 0 13px 0;

				.content {
					display: flex;
					flex-direction: column;
					gap: 5px;

					&__title {
						display: inline-block;

						div {
							display: inline;
							margin-right: 5px;
						}
					}
				}

				.close {
					height: 100%;
					cursor: pointer;
				}

				&__empty {
				}

				&:last-child {
					border-bottom: 0;
				}
			}
		}

		.btn {
			background-color: var(--lilac);
			display: flex;
			justify-content: center;
			align-items: center;
			height: 48px;
			width: 48px;
			border-radius: 14px;
			cursor: pointer;
			opacity: 0.9;

			&:hover {
				opacity: 1;
			}
		}
	}

	*::-webkit-scrollbar {
		width: 5px; /* в основном для вертикальных полос прокрутки */
		height: 5px; /* в основном для горизонтальных полос прокрутки */
		left: -100px;
	}

	*::-webkit-scrollbar-thumb {
		/* плашка-бегунок */
		background-color: var(--orange);
		border-radius: 4px;
		border: 1px solid var(--orange);
	}

	*::-webkit-scrollbar-track {
		/* фон */
		background: var(--blue-6);
	}

	.slide-left-enter-active,
	.slide-left-leave-active,
	.slide-right-enter-active,
	.slide-right-leave-active {
		transition: all 0.2s;
	}

	.slide-left-enter-from {
		opacity: 0;
		transform: translate(50px, 0);
	}

	.slide-left-leave-to {
		opacity: 0;
		transform: translate(50px, 0);
	}

	.slide-right-enter-from {
		opacity: 0;
		transform: translate(-50px, 0);
	}

	.slide-right-leave-to {
		opacity: 0;
		transform: translate(50px, 0);
	}
</style>
