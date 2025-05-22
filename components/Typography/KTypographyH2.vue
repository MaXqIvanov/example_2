<template>
	<component
		:is="tagType"
		:class="['k-typography-h2', `k-typography-h2_${fontWeight}`]"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			tagType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
			fontWeight?: 'extra-bold' | 'bold' | 'semi-bold' | 'medium' | 'regular';
			color?: string;
		}>(),
		{
			tagType: 'h2',
			fontWeight: 'bold',
			color: 'var(--black)'
		}
	);
</script>

<style scoped lang="scss">
	.k-typography-h2 {
		@include title-2;
		color: v-bind(color);

		&_regular {
			font-weight: 400;
		}
		&_medium {
			font-weight: 500;
		}
		&_semi-bold {
			font-weight: 600;
		}
		&_bold {
			font-weight: 700;
		}
		&_extra-bold {
			font-weight: 800;
		}
	}
</style>
