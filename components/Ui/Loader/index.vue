<template>
	<div
		class="circle"
		:style="{
			height: `${2 * props.radius}px`,
			width: `${2 * props.radius}px`,
			border: `${props.circleWidth}px solid ${props.color}`
		}"
	/>
</template>

<script lang="ts" setup>
	type Props = {
		radius: number;
		color: string;
		circleWidth: number;
	};
	const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
	.circle {
		border-radius: 50%;
		background: transparent;
		border-right-color: transparent !important;
		animation: rotate 0.8s linear infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
