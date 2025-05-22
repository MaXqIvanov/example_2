<template>
	<div
		class="ui-tooltip"
		:class="[`ui-tooltip_${position}`]"
	>
		<div
			@mouseenter="mouseEnterHandler"
			@mouseleave="mouseLeaveHandler"
			class="ui-tooltip__object"
			ref="bodyElement"
		>
			<slot />
		</div>
		<div
			class="help-field"
			v-if="(title || $slots.label) && isHover"
			:style="{ ...(customStyleHelpField && customStyleHelpField) }"
		>
			<TypographyKTypographyBody3 v-if="!$slots.label">
				{{ title }}
			</TypographyKTypographyBody3>
			<slot name="label" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			title?: string;
			position?: 'center' | 'right' | 'left' | 'right-middle';
			customStyleHelpField?: Record<string, string>;
		}>(),
		{
			position: 'center'
		}
	);

	const bodyElement = ref<HTMLElement | null>(null);

	const topHeight = computed(() => {
		if (bodyElement.value) {
			const element = bodyElement.value.children[0] as HTMLElement;
			return `${element.offsetHeight + 10}px`;
		}
		return '55px';
	});

	let isHover = ref(false);

	const mouseEnterHandler = () => {
		isHover.value = true;
	};

	const mouseLeaveHandler = () => {
		isHover.value = false;
	};
</script>

<style scoped lang="scss">
	.ui-tooltip {
		position: relative;
		.help-field {
			position: absolute;
			top: v-bind(topHeight);
			background-color: var(--white);
			padding: 14px;
			border-radius: 10px;
			box-shadow: 0 0 5px var(--gray-150);
			min-width: 218px;
			width: max-content;
			animation: tooltipAnimation 0.35s linear;
			z-index: 1000;

			span {
				@include body-3;
				color: var(--gray-465);
			}
		}

		&_center {
			.help-field {
				left: 50%;
				transform: translate(-50%, 0%);
			}
		}

		&_right {
			.help-field {
				right: 0;
				transform: translate(0%, 0%);
			}
		}

		&_right-middle {
			.help-field {
				right: 50px;
				top: 0px;
				transform: translate(0%, 0%);
			}
		}
	}
</style>
