<template>
	<div class="recovery">
		<PagesAuthorizationFormRecovery />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'auth',
		keepalive: true
	});
</script>

<style scoped lang="scss">
	.recovery {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 100%;
	}
</style>
