<template>
	<component
		:is="tagType"
		:class="['typography-subtitle', `typography-subtitle_${fontType}`]"
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
			color: 'var(--black)'
		}
	);
</script>

<style scoped lang="scss">
	.typography-subtitle {
		color: v-bind(color);

		&_regular {
			@include subtitle;
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
