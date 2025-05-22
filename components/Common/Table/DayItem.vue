<template>
	<component
		:is="tag"
		:class="['work-day', { 'work-day--has-hover': hasHoverEffect }]"
	>
		<TypographyKTypographyBody4
			tag-type="span"
			font-type="bold"
			color="var(--violet)"
			class="work-day__date"
		>
			{{ date }}
		</TypographyKTypographyBody4>
		<div
			v-if="progress !== null"
			class="progress-bar"
		>
			<span class="progress-bar__progress"></span>
		</div>
		<slot name="flag" />
	</component>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			tag?: 'li' | 'div';
			day: string;
			progress?: number | string | null;
			hasHoverEffect?: boolean;
			widthItem?: string;
			heightItem?: string;
		}>(),
		{
			tag: 'div',
			progress: null,
			hasHoverEffect: false,
			widthItem: '50px',
			heightItem: '35px'
		}
	);

	const progressValue = computed(() => `${props.progress}%`);
	const progressBarColor = computed(() =>
		props.progress && +props.progress < 100 ? 'var(--orange)' : 'var(--green-7)'
	);

	const date = new Date(props.day).getDate();
</script>

<style scoped lang="scss">
	.work-day {
		width: max-content;
		position: relative;

		display: flex;
		flex-direction: column;

		gap: 10px;

		&--has-hover:hover {
			.work-day__date {
				background-color: var(--blue-4);
			}
		}

		&__date {
			width: v-bind(widthItem);
			height: v-bind(heightItem);

			display: block;

			align-content: center;
			text-align: center;

			border-radius: 7px;

			background-color: var(--blue-5);
		}
	}

	.progress-bar {
		width: 100%;
		height: 2px;

		display: flex;

		border-radius: 2px;
		background-color: var(--gray-3);

		&__progress {
			width: v-bind(progressValue);
			height: 100%;

			display: flex;

			border-radius: 2px;

			background-color: v-bind(progressBarColor);
		}
	}
</style>
