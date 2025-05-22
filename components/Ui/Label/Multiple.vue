<template>
	<div class="label-multiple">
		<TypographyKTypographyBody2
			color="var(--black)"
			font-type="bold"
			>{{ title }}</TypographyKTypographyBody2
		>
		<div class="body">
			<div v-for="item in body">
				<TypographyKTypographyBody3 color="var(--dark-gray)">{{ item.title }}</TypographyKTypographyBody3>
				<TypographyKTypographyBody1
					font-weight="bold"
					color="var(--black)"
					>{{ item.value }}</TypographyKTypographyBody1
				>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title: string;
			body: { title: string; value: string }[];
			lineColor?: string;
		}>(),
		{}
	);
</script>

<style scoped lang="scss">
	.label-multiple {
		display: flex;
		flex-direction: column;
		border-left: 3px solid v-bind(lineColor);
		padding: 1px 10px 7px 36px;
		gap: 20px;

		.body {
			display: flex;
			gap: 30px;
		}
	}
</style>
