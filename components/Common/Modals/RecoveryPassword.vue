<template>
	<UiModalMobile
		v-model="modelValue"
		:isNeedFixedModalWithIfElseBlock="false"
		:z-index="10000"
	>
		<div class="recovery-password__body">
			<PagesAuthorizationFormRecovery
				type="default"
				:msgStep2Default="msgStep2"
				@confirm-changes="confirmHandler"
			/>
		</div>
		<template #custom-actions />
	</UiModalMobile>
</template>

<script setup lang="ts">
	const modelValue = defineModel('modelValue', { required: true, type: Boolean });

	const props = withDefaults(
		defineProps<{
			msgStep2?: string;
		}>(),
		{}
	);

	const confirmHandler = () => {
		modelValue.value = false;
	};
</script>

<style scoped lang="scss">
	.recovery-password__body {
		display: flex;
		justify-content: center;
		height: 100%;
		min-height: fit-content;
	}
</style>
