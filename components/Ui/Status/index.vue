<template>
	<component
		:is="type === 'button' ? 'button' : 'div'"
		:type="type === 'button' ? 'button' : null"
		:class="['status', `status--${size}`]"
		@click="type === 'button' ? emit('click', status) : null"
	>
		<TypographyKTypographyBody4
			tag-type="span"
			font-type="bold"
			:color="statusTextColor"
		>
			{{ statusName }}
		</TypographyKTypographyBody4>
	</component>
</template>

<script setup lang="ts">
	import { STATUS_DEFAULT_BACKGROUND_COLOR, STATUS_DEFAULT_TEXT_COLOR, STATUS_DEFAULT_TITLE } from '~/const/ui';
	import type { TVacancyStatusList } from '~/interfaces/vacancies';
	import type { TResponseStatusList } from '~/interfaces/responses';

	type Props = {
		statusList: TVacancyStatusList | TResponseStatusList;
		status: string;
		type?: 'chips' | 'button';
		size?: 'S' | 'M';
		pinColor?: string | null;
	};

	const props = withDefaults(defineProps<Props>(), {
		type: 'chips',
		size: 'M'
	});

	const emit = defineEmits(['click']);

	const statusName = computed(() => props.statusList[props.status]?.name ?? STATUS_DEFAULT_TITLE);

	const statusBackgroundColor = computed(
		() => props.statusList[props.status]?.uiOptions.backgroundColor ?? STATUS_DEFAULT_BACKGROUND_COLOR
	);

	const statusTextColor = computed(
		() => props.statusList[props.status]?.uiOptions.textColor ?? STATUS_DEFAULT_TEXT_COLOR
	);
</script>

<style scoped lang="scss">
	.status {
		display: flex;
		width: max-content;
		min-width: max-content;
		justify-content: center;
		align-items: center;

		gap: 5px;

		border-radius: 800px;

		background-color: v-bind(statusBackgroundColor);
		color: v-bind(statusTextColor);

		&--S {
			padding: 1px 10px;
		}

		&--M {
			padding: 5px 10px;
		}
	}
</style>
