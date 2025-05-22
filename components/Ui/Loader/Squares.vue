<template>
	<div class="loader">
		<div class="loader__square" />
		<div class="loader__square" />
		<div class="loader__square" />
	</div>
</template>

<script setup lang="ts">
	withDefaults(
		defineProps<{
			color?: string;
			width?: string;
			height?: string;
		}>(),
		{
			color: 'var(--blue-6)',
			width: '100px',
			height: '40px'
		}
	);
</script>

<style scoped lang="scss">
	.loader {
		display: flex;
		justify-content: space-between;
		width: v-bind(width);
		height: v-bind(height);

		&__square {
			width: 25%;
			height: 100%;
			display: flex;

			border-radius: 5px;
			background-color: v-bind(color);
		}

		&__square:nth-child(1) {
			animation: preloader 0.8s ease-in-out alternate infinite;
		}

		&__square:nth-child(2) {
			animation: preloader 0.8s ease-in-out alternate 0.2s infinite;
		}

		&__square:nth-child(3) {
			animation: preloader 0.8s ease-in-out alternate 0.4s infinite;
		}

		@keyframes preloader {
			100% {
				opacity: 0;
			}
		}
	}
</style>
