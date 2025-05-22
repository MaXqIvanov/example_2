<template>
	<div class="logo">
		<UiIcon
			:name="settings.name"
			:additional-color="settings.colorText"
			folder="logo"
			:height="heightLogo"
			:width="widthLogo"
		/>
	</div>
</template>

<script setup lang="ts">
	import { useBaseStore } from '~/store/base.store';

	const props = withDefaults(
		defineProps<{
			variantLogo?: 'header' | 'side-menu' | 'auth';
			heightLogo?: string;
			widthLogo?: string;
			heightTitle?: string;
			widthTitle?: string;
		}>(),
		{
			variantLogo: 'header',
			heightLogo: '28px',
			widthLogo: '28px',
			heightTitle: '18px',
			widthTitle: '130px'
		}
	);

	const baseStore = useBaseStore();

	const settings = computed(() => {
		if (props.variantLogo === 'header') {
			if (baseStore.isDarkMode) return { name: 'logo-small-horizontal-dark', colorText: 'var(--purple-4)' };
			return { name: 'logo-small-horizontal', colorText: 'var(--purple-4)' };
		} else if (props.variantLogo === 'side-menu') {
			if (baseStore.isDarkMode) return { name: 'logo-small-horizontal-dark', colorText: 'var(--purple-4)' };
			return { name: 'logo-small-horizontal', colorText: 'var(--black)' };
		} else {
			if (baseStore.isDarkMode) return { name: 'logo-medium-vertical-dark', colorText: 'var(--purple-4)' };
			return { name: 'logo-medium-vertical', colorText: 'var(--purple-4)' };
		}
	});
</script>

<style scoped lang="scss">
	.logo {
		display: flex;
		align-items: center;
		width: 100%;
	}
</style>
