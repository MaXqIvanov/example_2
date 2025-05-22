<template>
	<div :class="['avatar', { avatar__status: status }]">
		<UiImage
			v-if="img"
			:src="img"
			:width="AVATAR_SIZES[size].background"
			:height="AVATAR_SIZES[size].background"
			alt=""
			class="avatar__user-img"
		/>
		<UiIcon
			v-else
			name="user"
			color="var(--blue)"
			:width="AVATAR_SIZES[size].icon"
			:height="AVATAR_SIZES[size].icon"
		/>
	</div>
</template>

<script setup lang="ts">
	const AVATAR_SIZES = {
		XS: { background: '32px', icon: '19.2px', status: '3px' },
		S: { background: '40px', icon: '24px', status: '4px' },
		M: { background: '46.42px', icon: '27.88px', status: '5px' },
		L: { background: '80px', icon: '48px', status: '12px' },
		XL: { background: '158.99px', icon: '95.34px', status: '15px' },
		'70x70': { background: '70px', icon: '40px', status: '6px' }
	};

	const AVATAR_STATUS_COLORS = {
		online: 'var(--green)',
		offline: 'var(--orange)'
	};

	type Props = {
		img?: string | null;
		size: keyof typeof AVATAR_SIZES;
		status?: keyof typeof AVATAR_STATUS_COLORS;
	};
	withDefaults(defineProps<Props>(), {});
</script>

<style scoped lang="scss">
	.avatar {
		display: flex;
		width: v-bind('AVATAR_SIZES[size].background');
		height: v-bind('AVATAR_SIZES[size].background');
		min-width: v-bind('AVATAR_SIZES[size].background');
		min-height: v-bind('AVATAR_SIZES[size].background');
		justify-content: center;
		align-items: center;

		border-radius: 50%;

		background-color: var(--blue-light-4);

		&__user-img {
			border-radius: 50%;
			height: 100%;
			width: 100%;
			object-fit: cover;
		}

		&__status {
			position: relative;

			&::after {
				content: '';

				position: absolute;
				top: 9%;
				right: 10%;

				width: v-bind('AVATAR_SIZES[size].status');
				height: v-bind('AVATAR_SIZES[size].status');

				border-radius: 50%;

				background-color: v-bind('AVATAR_STATUS_COLORS[status]');
			}
		}
	}
</style>
