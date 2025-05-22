<template>
	<div
		class="id"
		@click="onClick"
	>
		<TypographyKTypographyBody3
			tag-type="span"
			:color="color"
		>
			ID
		</TypographyKTypographyBody3>
		<TypographyKTypographyBody3
			tag-type="span"
			:color="color"
			class="id__value"
		>
			{{ value }}
		</TypographyKTypographyBody3>
	</div>
</template>

<script setup lang="ts">
	import { AlertsTypes } from '~/const/notification';
	import { useNotificationStore } from '~/store/notification.store';

	type Props = {
		value: string;
		color?: string;
		maxWidth?: string;
	};

	const props = withDefaults(defineProps<Props>(), {
		color: 'var(--dark-gray)',
		maxWidth: '60px'
	});

	const notification = useNotificationStore();

	const onClick = () => {
		navigator.clipboard.writeText(`${props.value}`);
		notification.addNewAlert('ID скопирован в буфер обмена', 2000, AlertsTypes.SUCCESS);
	};
</script>

<style scoped lang="scss">
	.id {
		display: flex;
		max-width: v-bind(maxWidth);
		white-space: nowrap;

		gap: 2px;

		cursor: pointer;

		&__value {
			overflow: hidden;
			direction: rtl;
			text-overflow: ellipsis;
			white-space: nowrap;
			max-width: 80%;
		}
	}
</style>
