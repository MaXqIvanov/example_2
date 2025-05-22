<template>
	<div class="tabs__balance">
		<UiTabsTab
			:isActiveTab="selectTab === 'last'"
			@click="selectTabHandler('last')"
		>
			<TypographyKTypographyBody5 font-type="bold">
				{{ $t('balances-page-transaction-latest') }}
			</TypographyKTypographyBody5>
		</UiTabsTab>
		<UiTabsTab
			:isActiveTab="selectTab === 'all'"
			@click="selectTabHandler('all')"
		>
			<TypographyKTypographyBody5 font-type="bold">
				{{ $t('balances-page-transaction-all') }}
			</TypographyKTypographyBody5>
		</UiTabsTab>
		<!-- <div
			class="last"
			:class="{ tab__active: selectTab === 'last' }"
			@click="selectTabHandler('last')"
		>
			<TypographyKTypographyBody3 font-type="medium">
				{{ $t('balances-page-transaction-latest') }}
			</TypographyKTypographyBody3>
		</div>
		<div
			class="all"
			:class="{ tab__active: selectTab === 'all' }"
			@click="selectTabHandler('all')"
		>
			<TypographyKTypographyBody3 font-type="medium">
				{{ $t('balances-page-transaction-all') }}
			</TypographyKTypographyBody3>
		</div> -->
	</div>
</template>

<script setup lang="ts">
	const emits = defineEmits(['change']);
	const props = withDefaults(
		defineProps<{
			defaultValue: string;
		}>(),
		{
			defaultValue: 'last'
		}
	);
	const selectTab = ref(props.defaultValue);

	const selectTabHandler = (value: string) => {
		selectTab.value = value;
		emits('change', value);
	};

	onMounted(() => {
		selectTab.value = props.defaultValue;
	});
</script>

<style scoped lang="scss">
	.tabs__balance {
		display: grid;
		width: 100%;
		gap: 30px;
		margin-top: 40px;
		grid-template-columns: 1fr 1fr;
		border-bottom: 1px solid var(--violet-5);
		padding-bottom: 16px;

		@media (max-width: $md) {
			gap: 10px;
		}
	}
</style>
