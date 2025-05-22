<template>
	<div :class="['label', position && `label_${position}`]">
		<slot />
		<slot name="label-1" />
		<slot name="label-2" />
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			position?: 'vertical' | 'horizontal';
			gap?: string;
		}>(),
		{
			position: 'vertical',
			gap: '6px'
		}
	);
</script>

<style scoped lang="scss">
	.label {
		display: flex;
		gap: v-bind(gap);
		width: fit-content;

		&_vertical {
			flex-direction: column;
		}
		&_horizontal {
		}
	}
</style>
