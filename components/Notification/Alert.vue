<template>
	<div
		v-if="list"
		class="alert"
	>
		<transition-group
			name="slide-left"
			tag="div"
			class="alert__transition"
		>
			<div
				class="item"
				v-for="item in list"
				:key="item.id"
				@mouseenter="mouseEnterHandler(item)"
				@mouseleave="mouseLeaveHandler(item)"
			>
				<UiIcon
					name="close_v2"
					height="12"
					width="12"
					class="item__close"
					@click="closeAlertHandler(item.id)"
				/>
				<UiIcon
					width="30"
					height="30"
					:name="item.type === AlertsTypes.SUCCESS ? 'success' : 'warning'"
					:color="item.type === AlertsTypes.SUCCESS ? 'var(--green)' : 'var(--warning-000)'"
				/>
				<TypographyKTypographyBody2
					tag-type="span"
					color="var(--black)"
					font-weight="regular"
				>
					{{ $t(item.message) }}
				</TypographyKTypographyBody2>
			</div>
		</transition-group>
	</div>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import type { TAlert } from '~/interfaces/notifications';
	import { useNotificationStore } from '~/store/notification.store';

	const emits = defineEmits(['mouseEnter', 'mouseLeave']);

	const props = withDefaults(
		defineProps<{
			list?: Array<TAlert>;
		}>(),
		{}
	);
	const notificationStore = useNotificationStore();

	const closeAlertHandler = (idAlert: number) => {
		notificationStore.deleteAlert(idAlert, 0);
	};

	const mouseEnterHandler = (alert: TAlert) => {
		emits('mouseEnter', alert);
	};

	const mouseLeaveHandler = (alert: TAlert) => {
		emits('mouseLeave', alert);
	};
</script>

<style scoped lang="scss">
	.alert {
		max-width: 450px;
		min-width: 200px;

		&__transition {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}

		.item {
			position: relative;
			width: fit-content;
			display: flex;
			align-items: center;
			gap: 10px;
			background-color: var(--white);
			padding: 15px 20px;
			border-radius: 12px;
			box-shadow: 0 0 5px var(--gray-2);

			&__close {
				position: absolute;
				cursor: pointer;
				top: 15px;
				right: 0px;
				transform: translate(-50%, -50%);
			}

			svg {
				min-width: 30px;
			}
		}

		@media (max-width: $md) {
			max-width: 350px;
		}
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
