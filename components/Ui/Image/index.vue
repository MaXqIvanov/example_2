<template>
	<img
		:src="srcDefault"
		:loading="lazy"
		:alt="alt"
		class="ui-image"
		:height="height"
		:width="width"
		@error.native="errorLoad"
		v-if="src && !isHaveErrorLoad"
	/>
	<UiIcon
		v-else
		:name="defaultNameIcon"
		:folder="defaultFolderIcon"
		color="var(--blue)"
		class="ui-image"
	/>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			src: string;
			lazy?: 'eager' | 'lazy';
			alt?: string;
			defaultNameIcon?: string;
			defaultFolderIcon?: string;
			height?: string;
			width?: string;
			bgSize?: string;
			brRadius?: string;
		}>(),
		{
			lazy: 'lazy',
			alt: '',
			defaultNameIcon: 'picture',
			bgSize: 'cover',
			defaultFolderIcon: ''
		}
	);

	const isHaveErrorLoad = ref(false);
	const config = useRuntimeConfig().public.staticUrl;
	const srcDefault = computed(() => (/base64|http/.test(props.src) ? props.src : config + props.src));

	const errorLoad = (error) => {
		isHaveErrorLoad.value = true;
	};
</script>

<style scoped lang="scss">
	.ui-image {
		height: v-bind(height);
		width: v-bind(width);
		border-radius: v-bind(brRadius);
	}
</style>
