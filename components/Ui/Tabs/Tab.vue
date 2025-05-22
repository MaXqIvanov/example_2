<template>
	<div
		class="ui-tab"
		:class="{ 'ui-tab_active': isActiveTab }"
	>
		<slot />
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			isActiveTab: boolean;
		}>(),
		{
			isActiveTab: false
		}
	);
</script>

<style scoped lang="scss">
	.ui-tab {
		padding: 11px;
		color: var(--gray-8);
		text-align: center;
		border-radius: 15px;
		border: 1px solid var(--gray-8);
		cursor: pointer;

		&_active {
			background-color: var(--gray-8);
			color: var(--black);
		}
	}
</style>
