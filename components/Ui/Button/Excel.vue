<template>
	<UiCard
		@click="downloadHandler"
		padding="13px 24px"
		box-shadow="0px 1px 10px 0px var(--box-shadow-2)"
	>
		<UiIcon
			name="excel"
			color="var(--green)"
		/>
		<UiButton
			color="underline"
			:button-padding="'0px'"
			border-color="var(--blue-light-7)"
			:size="ButtonSizeType.extra_small"
		>
			<template #after>
				<TypographyKTypographyBody3
					:style="{ minWidth: 'max-content' }"
					color="var(--violet)"
					font-type="bold"
					>Скачать отчет в .xls
				</TypographyKTypographyBody3>
				<UiIcon
					name="arrow"
					width="8"
					height="8"
					rotation="-90"
					color="var(--dark-2)"
				/>
			</template>
		</UiButton>
	</UiCard>
</template>

<script setup lang="ts">
	import { ButtonSizeType } from '~/interfaces/ui';

	const emit = defineEmits(['click']);

	const downloadHandler = () => {
		emit('click', '');
	};
</script>

<style scoped lang="scss">
	.ui-card {
		display: flex;
		align-items: center;
		gap: 17px;
		width: fit-content;
		cursor: pointer;
	}
</style>
