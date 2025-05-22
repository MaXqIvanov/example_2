<template>
	<svg
		aria-hidden="true"
		:width="width"
		:height="height"
		:style="{ minWidth: width }"
		:class="['icon', { 'icon--rotate': rotation }, { [`icon--mirror-${mirror}`]: mirror }]"
	>
		<use
			:href="isNeedChange ? changeIconIfEmpty : symbolId"
			ref="iconRef"
		/>
	</svg>
</template>

<script setup lang="ts">
	import { DefaultIconParams } from '~/const/ui';

	const props = withDefaults(
		defineProps<{
			name: string;
			folder?: string;
			color?: string;
			width?: string | number;
			height?: string | number;
			rotation?: string | number;
			mirror?: 'x' | 'y';
			additionalColor?: string;
			changeIconIfEmpty?: string;
		}>(),
		{
			color: DefaultIconParams.COLOR,
			additionalColor: DefaultIconParams.COLOR,
			width: DefaultIconParams.WIDTH,
			height: DefaultIconParams.HEIGHT,
			rotation: 0,
			folder: ''
		}
	);

	const isNeedChange = ref(false);
	const symbolId = computed(() => (props.folder ? `#${props.folder}/${props.name}` : `#${props.name}`));

	const rotationAngle = computed(() => `${props.rotation}deg`);

	onMounted(() => {
		if (!props.changeIconIfEmpty) return;
		let id = symbolId.value.slice(1, symbolId.value.length);
		const tag = document.getElementById(id);

		if (!tag) {
			isNeedChange.value = true;
		}
	});
</script>

<style scoped lang="scss">
	.icon {
		color: v-bind(color);
		transition: all linear 0.3s;

		&--rotate {
			transform: rotate(v-bind(rotationAngle));
		}

		&--mirror-x {
			transform: scaleX(-1);
		}

		&--mirror-y {
			transform: scaleY(-1);
		}

		--additional-color: v-bind(additionalColor);
		--main-color: v-bind(color);
	}
</style>
