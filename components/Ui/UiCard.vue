<template>
	<component
		:is="tagType"
		:to="href ? href : null"
		:target="href && isExternalLink ? '_blank' : null"
		class="ui-card"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
	import { NuxtLink } from '#components';

	const props = withDefaults(
		defineProps<{
			tagType?: 'div' | 'li' | typeof NuxtLink | 'button';
			href?: string;
			isExternalLink?: boolean;
			padding?: string | null;
			borderRadius?: string;
			backgroundColor?: string;
			boxShadow?: string;
		}>(),
		{
			tagType: 'div',
			isExternalLink: false,
			padding: '28px',
			borderRadius: '15px',
			backgroundColor: 'var(--white)',
			boxShadow: 'box-shadow: 0 3px 5px var(--box-shadow-default)'
		}
	);
</script>
<style scoped lang="scss">
	.ui-card {
		padding: v-bind(padding);
		border-radius: v-bind(borderRadius);
		background-color: v-bind(backgroundColor);
		box-shadow: v-bind(boxShadow);
	}
</style>
