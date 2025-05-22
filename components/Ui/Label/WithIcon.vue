<template>
	<div class="label-with-icon">
		<TypographyKTypographyBody4 color="var(--dark-gray)">{{ title }}</TypographyKTypographyBody4>
		<div class="body">
			<TypographyKTypographyH2 color="var(--orange)">{{ body }}</TypographyKTypographyH2>
			<slot name="icon" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title: string;
			body: string;
			background?: string;
		}>(),
		{}
	);
</script>

<style scoped lang="scss">
	.label-with-icon {
		display: flex;
		flex-direction: column;
		gap: 11px;
		background-color: v-bind(background);
		padding: 15px 33px;
		border-radius: 10px;

		.body {
			display: flex;
			gap: 30px;
		}
	}
</style>
