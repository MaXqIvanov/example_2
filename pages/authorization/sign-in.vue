<template>
	<div class="sign-in">
		<PagesAuthorizationFormAuth />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		layout: 'auth',
		keepalive: true
	});
</script>
<style scoped lang="scss">
	.sign-in {
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	//
</style>
