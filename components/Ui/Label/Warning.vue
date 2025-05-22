<template>
	<div class="label__warning">
		<UiIcon
			:name="defaultOptions.iconName"
			:folder="defaultOptions.iconFolder"
			:color="defaultOptions.iconColor"
			:height="14"
			:width="16.5"
		/>
		<slot />
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			type: 'warning' | 'error';
		}>(),
		{
			type: 'error'
		}
	);

	const defaultOptions = computed(() => {
		if (props.type === 'warning') {
			return {
				iconName: 'warning',
				iconFolder: 'message',
				iconColor: 'var(--crimson)',
				textColor: 'var(--crimson)',
				bgColor: 'var(--pink)'
			};
		}

		return {
			iconName: 'warning',
			iconFolder: 'message',
			iconColor: 'var(--crimson)',
			textColor: 'var(--crimson)',
			bgColor: 'var(--pink)'
		};
	});
</script>

<style scoped lang="scss">
	.label__warning {
		display: flex;
		gap: 9px;
		background-color: v-bind('defaultOptions.bgColor');
		padding: 19px 17px;
		border-radius: 15px;
		margin-top: 5px;
	}
</style>
