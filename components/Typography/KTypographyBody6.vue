<template>
	<component
		:is="tagType"
		:class="['k-typography-body-6', `k-typography-body-6_${fontType}`]"
	>
		<slot />
	</component>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			tagType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
			fontType?: 'extra-bold' | 'bold' | 'semi-bold' | 'medium' | 'regular';
			color?: string;
		}>(),
		{
			tagType: 'div',
			fontType: 'regular',
			color: 'var(--gray-2)'
		}
	);
</script>

<style scoped lang="scss">
	.k-typography-body-6 {
		@include body-6;

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
