<template>
	<div class="not-found">
		<UiIcon
			v-if="icon?.name"
			:folder="icon?.folder"
			:name="icon?.name"
			class="ui-icon"
			:style="{ ...customStyleForIcon }"
		/>
		<div class="not-found__text">
			<TypographyKTypographyH2
				v-if="title"
				tag-type="p"
				color="var(--black)"
				font-weight="bold"
				class="title"
			>
				{{ title }}
			</TypographyKTypographyH2>
			<TypographyKTypographyH4
				v-if="subtitle"
				tag-type="p"
				font-weight="regular"
				class="subtitle"
			>
				{{ subtitle }}
			</TypographyKTypographyH4>
			<UiButton
				v-if="isNeedBtn"
				class="ui-button"
				label="Сбросить"
				:color="ButtonType.primary"
				:size="ButtonSizeType.b_xl"
				@click="actionHandler"
				:customStyle="{ minWidth: '190px', height: '50px' }"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ButtonSizeType, ButtonType } from '~/interfaces/ui';

	const emit = defineEmits(['click']);

	const props = withDefaults(
		defineProps<{
			icon?: { name: string; folder?: string };
			title?: string;
			subtitle?: string;
			isNeedBtn?: boolean;
			customStyleForIcon?: Record<string, string>;
		}>(),
		{}
	);

	const actionHandler = () => {
		emit('click', '');
	};
</script>

<style scoped lang="scss">
	.not-found {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: fit-content;
		padding: 0px 50px;
		width: 100%;
		height: 100%;
		gap: $g-5;

		.ui-icon {
			height: 100%;
			width: 90%;
		}

		&__text {
			width: fit-content;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.title {
			width: 100%;
			text-align: center;
		}

		.subtitle {
			width: 80%;
			margin-top: 5px;
			text-align: center;
		}

		.ui-button {
			margin-top: 30px;
			width: fit-content;
		}
	}
</style>
