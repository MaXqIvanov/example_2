<template>
	<div class="header">
		<div class="section-left">
			<Logo
				class="logo"
				variant-logo="header"
				heightLogo="35px"
				width-logo="110px"
			/>
		</div>
		<div class="section-right">
			<NuxtLink
				href="/trades/profit"
				:prefetch="false"
			>
				<Balance />
			</NuxtLink>
			<UiButtonMenu
				class="btn__menu"
				@click="openSideBar"
			/>
		</div>
	</div>
	<SideBar
		v-if="isSideBarOpen"
		@closeSideBar="closeSideBar"
		@openSupportChat="openSupportChat"
	/>
</template>

<script setup lang="ts">
	const emits = defineEmits(['openSupportChat']);
	const isSideBarOpen = ref(false);

	const openSideBar = () => {
		isSideBarOpen.value = true;
	};

	const closeSideBar = () => {
		isSideBarOpen.value = false;
	};

	const openSupportChat = () => {
		emits('openSupportChat', '');
	};
</script>

<style scoped lang="scss">
	.header {
		display: flex;
		align-items: center;
		gap: 20px;
		justify-content: space-between;
		background-color: transparent;
		padding: 20px 30px 20px 25px;
		width: 100%;

		.balance_wrapper {
			cursor: pointer;
		}

		.section-right {
			display: flex;
			align-items: center;

			.btn__menu {
				margin-left: 25px;
			}
		}

		@media (max-width: $extra-sm) {
			padding: 20px 15px;
		}
	}
</style>
