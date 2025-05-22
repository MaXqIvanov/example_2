<template>
	<label
		:style="{ maxWidth: maxWidth }"
		class="ui-group-check-box"
		><div
			v-if="label"
			class="label"
			:class="[labelClass ?? labelClass]"
		>
			{{ label }}
		</div>
		<div
			class="group-check-box"
			:style="{ height: height }"
		>
			<slot />
		</div>
	</label>
</template>

<script setup lang="ts">
	const props = defineProps<{
		maxWidth?: string;
		label?: string;
		labelClass?: string;
		height?: string;
	}>();
</script>

<style scoped lang="scss">
	.ui-group-check-box {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 100%;

		.group-check-box {
			display: flex;
			align-items: center;
			background: var(--lilac);
			padding: 14px 32px;
			border-radius: 12px;
			gap: 30px;
			width: 100%;
		}
	}
</style>
