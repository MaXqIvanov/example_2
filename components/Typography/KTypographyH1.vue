<template>
	<component
		:is="tagType"
		:class="['k-typography-h1', `k-typography-h1_${fontType}`]"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			fontType?: 'extra-bold' | 'bold' | 'semi-bold' | 'medium' | 'regular';
			tagType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
			color?: string;
		}>(),
		{
			tagType: 'h1',
			fontType: 'regular',
			color: 'var(--gray-2)'
		}
	);
</script>

<style scoped lang="scss">
	.k-typography-h1 {
		@include title-1;
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
