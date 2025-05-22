<template>
	<component
		:is="tagType"
		class="k-typography-h4"
		:class="[`k-typography-h4_${fontWeight}`]"
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
			tagType: 'h4',
			fontWeight: 'bold',
			color: 'var(--black)'
		}
	);
</script>

<style scoped lang="scss">
	.k-typography-h4 {
		@include title-4;
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
