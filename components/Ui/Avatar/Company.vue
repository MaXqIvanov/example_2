<template>
	<div :class="['avatar']">
		<UiImage
			v-if="img"
			:src="img"
			:width="AVATAR_SIZES[size].backgroundWidth"
			:height="AVATAR_SIZES[size].backgroundHeight"
			alt=""
			class="avatar__company-img"
			:lazy="'lazy'"
		/>
		<UiIcon
			v-else
			name="picture"
			color="var(--blue)"
			class="avatar__default-img"
		/>
	</div>
</template>

<script setup lang="ts">
	const AVATAR_SIZES = {
		XS: { backgroundWidth: '227px', backgroundHeight: '190px', icon: '46px', status: '15px' },
		S: { backgroundWidth: '227px', backgroundHeight: '190px', icon: '46px', status: '15px' },
		M: { backgroundWidth: '227px', backgroundHeight: '190px', icon: '46px', status: '15px' },
		L: { backgroundWidth: '227px', backgroundHeight: '190px', icon: '46px', status: '15px' },
		XL: { backgroundWidth: '227px', backgroundHeight: '190px', icon: '46px', status: '15px' }
	};

	type Props = {
		img?: string | null;
		size: keyof typeof AVATAR_SIZES;
	};
	withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
	.avatar {
		display: flex;
		width: v-bind('AVATAR_SIZES[size].backgroundWidth');
		height: v-bind('AVATAR_SIZES[size].backgroundHeight');
		min-width: v-bind('AVATAR_SIZES[size].backgroundWidth');
		min-height: v-bind('AVATAR_SIZES[size].backgroundHeight');
		justify-content: center;
		align-items: center;

		border-radius: 20px;

		background-color: var(--blue-light-4);

		&__company-img {
			border-radius: 20px;
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		&__default-img {
			width: v-bind('AVATAR_SIZES[size].icon');
			height: v-bind('AVATAR_SIZES[size].icon');
		}
	}
</style>
