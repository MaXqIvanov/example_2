<template>
	<section class="finance">
		<div class="header">
			<div class="info">
				<UiIcon
					folder="navigation-element"
					name="nav-bots-new"
					color="var(--violet-2)"
					height="22"
					width="22"
				></UiIcon>
				<div class="title">
					<TypographyKTypographyBody3
						color="var(--color_font_black_wite)"
						font-type="bold"
						>{{ $t('finances-page-title') }}
					</TypographyKTypographyBody3>
				</div>
			</div>
		</div>
		<div class="body">
			<div
				class="finance__list"
				v-if="financeStore.financeList?.length"
			>
				<PagesFinanceListItem
					v-for="finance in financeStore.financeList"
					:item="finance"
					:key="finance.dt_update"
				/>
			</div>
			<div
				class="finance__empty"
				v-else
			>
				<UiIcon
					name="list-empty-new"
					folder="navigation-element"
					height="47"
					width="47"
					color="var(--purple-2)"
				/>
				<TypographyKTypographyBody4
					class="title"
					color="var(--color_font_black_wite)"
					font-type="bold"
					>{{ $t('finances-page-empty') }}</TypographyKTypographyBody4
				>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
	import { useFinanceStore } from '~/store/finance.store';

	const financeStore = useFinanceStore();

	const getFinanceHandler = async () => {
		await financeStore.getFinance();
	};

	getFinanceHandler();
</script>

<style scoped lang="scss">
	.finance {
		display: flex;
		flex-direction: column;
		max-height: calc(100vh - 100px);

		.body {
			display: flex;
			flex-direction: column;
			height: calc(100% - 100px);
			padding-right: 10px;
			margin-right: -10px;
			overflow-y: auto;
			gap: 5px;

			.finance__list {
				display: flex;
				flex-direction: column;
				gap: 10px;

				.item {
					border-bottom: 1px solid var(--gray-5);
					padding-bottom: 5px;
				}
			}

			.finance__empty {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 130px;

				.title {
					margin-top: 16px;
				}
				.button__added {
					margin-top: 23px;
					border: 1px solid var(--purple);
				}
			}
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid var(--violet-5);
			padding-bottom: 14px;
			margin-bottom: 15px;
			min-height: 47px;

			.info {
				display: flex;
				align-items: center;
				gap: 9px;

				.title {
					display: flex;
					gap: 4px;
				}
			}
		}
	}
</style>
