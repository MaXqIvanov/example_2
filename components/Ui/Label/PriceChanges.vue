<template>
	<div class="price-changes">
		<div
			class="body"
			v-if="!$slots['title']"
			:style="{ backgroundColor: getParameters?.colorBg }"
		>
			<UiIcon
				:name="getParameters.iconName"
				height="8"
				width="9"
				:color="getParameters?.colorTitle"
				:rotation="getParameters?.rotation"
			></UiIcon>
			<TypographyKTypographyBody6
				:color="getParameters?.colorTitle"
				font-type="extra-bold"
				class="title"
				v-if="title"
				>{{ title }}<span v-if="isNeedPercent">%</span></TypographyKTypographyBody6
			>
		</div>
		<slot name="title" />
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title: string | number | null;
			isLoading?: boolean;
			isNeedPercent?: boolean;
			height?: string;
			arrowDirection?: 'up' | 'down' | 'neutral';
		}>(),
		{
			title: null,
			isLoading: false,
			height: '18.5px'
		}
	);

	const getParameters = computed(() => {
		const value = `${props.title}`;
		if (props.arrowDirection === 'down' || value?.includes('-')) {
			return {
				colorTitle: 'var(--crimson)',
				colorBg: 'var(--pink)',
				rotation: 180,
				iconName: 'arrow-with-small-tail'
			};
		} else if (props.arrowDirection === 'up' || (value !== '0' && value)) {
			return {
				colorTitle: 'var(--white)',
				colorBg: 'var(--primary-2)',
				rotation: 0,
				iconName: 'arrow-with-small-tail'
			};
		} else {
			return {
				colorTitle: 'var(--white)',
				colorBg: 'var(--gray-4)',
				rotation: 0,
				iconName: 'minus'
			};
		}
	});
</script>

<style scoped lang="scss">
	.price-changes {
		.body {
			display: flex;
			align-items: center;
			gap: 2.5px;
			padding: 4px 6px;
			border-radius: 5px;
			height: v-bind(height);

			.title {
				font-size: 9.2px;
			}
		}
	}
</style>
