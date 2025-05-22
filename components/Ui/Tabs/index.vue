<template>
	<div class="ui-tabs">
		<div
			v-if="!$slots['custom-tabs']"
			class="tabs"
		>
			<div
				v-for="item in items"
				:key="item.id"
				class="tab"
				:class="{ tab__active: activeItem?.id === item.id }"
				@click="clickHanlder(item)"
			>
				<TypographyKTypographyBody2 font-type="bold">
					{{ item.title }}
				</TypographyKTypographyBody2>
			</div>
		</div>
		<div v-else>
			<slot name="custom-tabs"></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface IItems {
		id: number;
		title: string;
		routeName?: string;
	}

	const emits = defineEmits(['change']);
	const props = withDefaults(
		defineProps<{
			items?: Array<IItems>;
			activeItem?: IItems;
		}>(),
		{}
	);

	const clickHanlder = (item: IItems) => {
		emits('change', item);
	};
</script>

<style scoped lang="scss">
	.ui-tabs {
		.tabs {
			display: flex;

			.tab {
				padding: 10px 25px;
				background-color: var(--blue-light-9);
				cursor: pointer;

				.k-typography-body-2 {
					color: var(--dark-gray);
				}

				&__active {
					background-color: var(--blue-light-13);

					.k-typography-body-2 {
						color: var(--blue-2);
					}
				}

				&:first-child {
					border-top-left-radius: 5px;
					border-bottom-left-radius: 5px;
				}
				&:last-child {
					border-top-right-radius: 5px;
					border-bottom-right-radius: 5px;
				}
			}
		}
	}
</style>
