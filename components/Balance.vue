<template>
	<div class="balance_wrapper">
		<UiIcon
			name="USDT"
			folder="crypto"
			color="var(--primary-2)"
			height="20"
			width="20"
		></UiIcon>
		<TypographyKTypographyBody4
			:color="color"
			class="balance"
			font-type="bold"
			>{{ getBalance }}</TypographyKTypographyBody4
		>
	</div>
</template>

<script setup lang="ts">
	import { useProfileStore } from '~/store/profile.store';

	const props = withDefaults(
		defineProps<{
			variant: 'white' | 'dark';
		}>(),
		{
			variant: 'white'
		}
	);

	const profileStore = useProfileStore();
	const getBalance = computed(() => profileStore.profileInfo?.sum_usdt);

	const color = computed(() => {
		if (props.variant === 'white') {
			return 'var(--white)';
		} else {
			return 'var(--color_font_black_wite)';
		}
	});
</script>

<style scoped lang="scss">
	.balance_wrapper {
		display: flex;
		justify-content: center;
		align-items: center;

		.balance-changes {
			margin-left: 10px;
		}

		.balance {
			margin-left: 7px;
		}
	}
</style>
