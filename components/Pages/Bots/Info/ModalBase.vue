<template>
	<UiModalDefault
		v-model="isOpen"
		padding-card="27px"
		height="fit-content"
		width="100%"
		max-width="500px"
		:title="$t(modalInfo?.Title || '')"
		:z-index="100000"
	>
		<TypographyKTypographyBody3>
			{{ $t(modalInfo?.Description || '') }}
		</TypographyKTypographyBody3>

		<template #btn-close>
			<UiIcon
				name="close_v2"
				height="15"
				width="15"
				@click="closeHandler"
			></UiIcon>
		</template>
	</UiModalDefault>
</template>

<script setup lang="ts">
	import { useProfileStore } from '~/store/profile.store';

	const isOpen = defineModel('isOpen', { type: Boolean, required: true });
	const props = withDefaults(defineProps<{ fieldName: String }>(), {});

	const profileStore = useProfileStore();
	const modalInfo = computed(() =>
		profileStore.profileInfo?.extensions.find((ext) => ext.FieldName === props.fieldName)
	);

	const closeHandler = () => {
		isOpen.value = false;
	};
</script>

<style scoped lang="scss"></style>
