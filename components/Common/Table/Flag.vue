<template>
	<div :class="['flag', `flag--${direction}`]">
		<UiCard>
			<TypographyKTypographyBody4
				color="var(--white)"
				font-type="bold"
				>{{ text }}
			</TypographyKTypographyBody4>
		</UiCard>
	</div>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			text: string;
			width?: string;
			height: string;
			flagColor?: string;
			direction?: 'left' | 'right';
			position: {
				top?: string | number;
				right?: string | number;
				bottom?: string | number;
				left?: string | number;
			};
		}>(),
		{
			width: 'max-content',
			height: '0px',
			direction: 'right',
			flagColor: 'var(--orange-3)'
		}
	);

	const top = computed(() => (props.position.top ? `${props.position.top}px` : 'unset'));
	const bottom = computed(() => (props.position.bottom ? `${props.position.bottom}px` : 'unset'));
	const left = computed(() => (props.position.left ? `${props.position.left}px` : 'unset'));
	const right = computed(() => (props.position.right ? `${props.position.right}px` : 'unset'));
</script>

<style scoped lang="scss">
	.flag {
		height: v-bind(height);
		position: absolute;

		overflow: hidden;
		z-index: 0;

		top: v-bind(top);
		left: v-bind(left);
		right: v-bind(right);
		bottom: v-bind(bottom);

		&--right {
			border-left: 3px solid v-bind(flagColor);
			border-top-left-radius: 5px;

			.ui-card {
				border-radius: 3px 3px 3px 0;
			}
		}

		&--left {
			border-right: 3px solid v-bind(flagColor);
			border-top-right-radius: 5px;

			.ui-card {
				border-radius: 3px 3px 0 3px;
			}
		}

		.ui-card {
			padding: 1.5px 7px;
			background-color: v-bind(flagColor);
			color: var(--white);
			width: v-bind(width);
			height: fit-content;
			text-align: center;
		}
	}
</style>
