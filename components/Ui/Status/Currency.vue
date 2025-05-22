<template>
	<div
		class="status"
		:style="{ border: `1px solid ${getTitle?.color}` }"
	>
		<TypographyKTypographyBody6
			:color="getTitle?.color"
			font-type="bold"
		>
			{{ $t(getTitle?.title || '') }}
		</TypographyKTypographyBody6>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			status: number | undefined;
			statusText?: string;
		}>(),
		{}
	);

	const getTitle = computed(() => {
		if (props.statusText) {
			return {
				'0': { title: props.statusText, color: 'var(--yellow)' },
				'1': { title: props.statusText, color: 'var(--primary)' }
			}[props.status || 0];
		}
		return {
			'0': { title: 'bots-currency-status-waiting', color: 'var(--yellow)' },
			'1': { title: 'bots-currency-status-in-position', color: 'var(--primary)' }
		}[props.status || 0];
	});
</script>

<style scoped lang="scss">
	.status {
		padding: 2px 6px;
		border-radius: 5px;
	}
</style>
