<template>
	<div class="btn__balance">
		<div class="icon">
			<UiIcon
				:name="iconName"
				:folder="folder"
			/>
		</div>
		<TypographyKTypographyBody3
			class="title"
			color="var(--white)"
			font-type="medium"
			>{{ title }}</TypographyKTypographyBody3
		>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title: string;
			iconName: string;
			folder?: string;
		}>(),
		{
			folder: 'balance'
		}
	);
</script>

<style scoped lang="scss">
	.btn__balance {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		border-radius: 15px;
		padding: 20px;
		cursor: pointer;

		&::after {
			content: '';
			position: absolute;
			background-color: #bab6c3;
			mix-blend-mode: soft-light;
			width: 100%;
			height: 100%;
			border-radius: 15px;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 58%;
		}
	}
</style>
